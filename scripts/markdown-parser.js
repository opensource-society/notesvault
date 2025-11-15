


function parseMarkdown(markdown) {
  let html = markdown;

  const patterns = {
    h3: /^### (.*$)/gim,
    h2: /^## (.*$)/gim,
    h1: /^# (.*$)/gim,
    boldStar: /\*\*(.*?)\*\*/g,
    boldUnderscore: /__(.*?)__/g,
    italicStar: /\*(.*?)\*/g,
    italicUnderscore: /_(.*?)_/g,
    strikethrough: /~~(.*?)~~/g,
    codeBlock: /```(\w+)?\n([\s\S]*?)```/g,
    inlineCode: /`([^`]+)`/g,
    link: /\[([^\]]+)\]\(([^)]+)\)/g,
    image: /!\[([^\]]*)\]\(([^)]+)\)/g,
    blockquote: /^> (.*)$/gim,
    checklistChecked: /^- \[x\] (.*)$/gim,
    checklistUnchecked: /^- \[ \] (.*)$/gim,
    unorderedList: /^- (.*)$/gim,
    orderedList: /^\d+\. (.*)$/gim
  };


  html = html.replace(patterns.h3, '<h3>$1</h3>');
  html = html.replace(patterns.h2, '<h2>$1</h2>');
  html = html.replace(patterns.h1, '<h1>$1</h1>');

  html = html.replace(patterns.boldStar, '<strong>$1</strong>');
  html = html.replace(patterns.boldUnderscore, '<strong>$1</strong>');

  html = html.replace(patterns.italicStar, '<em>$1</em>');
  html = html.replace(patterns.italicUnderscore, '<em>$1</em>');

  html = html.replace(patterns.strikethrough, '<del>$1</del>');

  html = html.replace(patterns.codeBlock, function(match, lang, code) {
    const language = lang || 'plaintext';
    return `<pre><code class="language-${language}">${escapeHtml(code)}</code></pre>`;
  });

  html = html.replace(patterns.inlineCode, '<code>$1</code>');

  html = html.replace(patterns.link, '<a href="$2" target="_blank">$1</a>');

  html = html.replace(patterns.image, '<img src="$2" alt="$1" />');

  html = html.replace(patterns.blockquote, '<blockquote>$1</blockquote>');

  html = html.replace(patterns.checklistUnchecked, '<li class="task-item"><input type="checkbox" disabled> $1</li>');
  html = html.replace(patterns.checklistChecked, '<li class="task-item"><input type="checkbox" checked disabled> $1</li>');

  html = html.replace(patterns.unorderedList, '<li>$1</li>');

  html = html.replace(patterns.orderedList, '<li>$1</li>');

  html = html.replace(/(<li class="task-item">.*?<\/li>\n?)+/g, '<ul class="task-list">$&</ul>');
  html = html.replace(/(<li>(?!.*task-item).*?<\/li>\n?)+/g, '<ul>$&</ul>');

  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n/g, '<br>');

  if (!html.match(/^<[h|p|ul|ol|blockquote|pre]/)) {
    html = '<p>' + html + '</p>';
  }
  
  return html;
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

function highlightCode(code, language) {

  const keywords = {
    javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'async', 'await'],
    python: ['def', 'class', 'import', 'from', 'return', 'if', 'else', 'elif', 'for', 'while', 'with', 'as', 'try', 'except'],
    java: ['public', 'private', 'protected', 'class', 'interface', 'extends', 'implements', 'return', 'if', 'else', 'for', 'while'],
    html: ['<!DOCTYPE', 'html', 'head', 'body', 'div', 'span', 'a', 'img', 'script', 'style', 'link']
  };
  
  if (keywords[language]) {
    keywords[language].forEach(keyword => {
      const regex = new RegExp('\\b' + keyword + '\\b', 'g');
      code = code.replace(regex, `<span class="keyword">${keyword}</span>`);
    });
  }

  code = code.replace(/(["'`])(?:(?=(\\?))\2.)*?\1/g, '<span class="string">$&</span>');

  code = code.replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>');
  code = code.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="comment">$1</span>');
  
  return code;
}
