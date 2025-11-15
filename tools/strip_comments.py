#!/usr/bin/env python3
"""
Strip comments from HTML, JS, CSS, and PY files across the repo.
This script makes a backup copy of each file under `archive/comments-backup/<timestamp>/...` before modifying.

Rules (conservative):
- HTML: remove all <!-- ... --> blocks.
- JS/CSS: remove /* ... */ block comments and leading-line // comments (lines where the first non-space characters are //). Inline // comments after code are preserved.
- PY: remove lines whose first non-space character is #. Inline comments after code are preserved.

Run this from the repo root.
"""
import os
import re
import shutil
import sys
from datetime import datetime

ROOT = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
ARCHIVE_DIR = os.path.join(ROOT, 'archive', 'comments-backup', datetime.utcnow().strftime('%Y%m%dT%H%M%SZ'))

EXTS = ['.html', '.js', '.css', '.py']

HTML_COMMENT_RE = re.compile(r'<!--([\s\S]*?)-->', re.MULTILINE)
BLOCK_COMMENT_RE = re.compile(r'/\*([\s\S]*?)\*/', re.MULTILINE)
LEADING_SLASHSLASH_RE = re.compile(r'^\s*//.*$', re.MULTILINE)
LEADING_HASH_RE = re.compile(r'^\s*#.*$', re.MULTILINE)

CHANGED = []

os.makedirs(ARCHIVE_DIR, exist_ok=True)
print('Backup directory:', ARCHIVE_DIR)

for dirpath, dirnames, filenames in os.walk(ROOT):
    if '/archive/' in dirpath.replace('\\','/') or '/.git/' in dirpath.replace('\\','/'):
        continue
    for fn in filenames:
        name, ext = os.path.splitext(fn)
        if ext.lower() not in EXTS:
            continue
        path = os.path.join(dirpath, fn)
        rel = os.path.relpath(path, ROOT)
        try:
            with open(path, 'r', encoding='utf-8') as f:
                text = f.read()
        except Exception as e:
            print('skip (read error):', rel, e)
            continue
        original = text
        new = text
        if ext.lower() == '.html':
            new = HTML_COMMENT_RE.sub('', new)
        elif ext.lower() in ('.js', '.css'):
            new = BLOCK_COMMENT_RE.sub('', new)
            new = LEADING_SLASHSLASH_RE.sub('', new)
        elif ext.lower() == '.py':
            lines = new.splitlines()
            out_lines = []
            for i, line in enumerate(lines):
                stripped = line.lstrip()
                if i == 0 and stripped.startswith('#!'):
                    out_lines.append(line)
                    continue
                if stripped.startswith('#'):
                    continue
                out_lines.append(line)
            new = '\n'.join(out_lines) + ('' if new.endswith('\n') else '')
        if new != original:
            dest = os.path.join(ARCHIVE_DIR, rel)
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            shutil.copy2(path, dest)
            try:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new)
                CHANGED.append(rel)
                print('modified:', rel)
            except Exception as e:
                print('failed to write:', rel, e)

print('\nDone. Files modified:', len(CHANGED))
for c in CHANGED:
    print(' -', c)

if not CHANGED:
    print('No changes were necessary.')