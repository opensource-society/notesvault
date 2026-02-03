// Simple Markdown Parser
// This is a lightweight markdown parser that supports basic markdown syntax

function parseMarkdown(markdown) {
  let html = markdown;

  // Pre-compile regex patterns for better performance
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
  
  // Convert markdown to HTML in optimized order
  
  // Headers (must be done before other processing)
  html = html.replace(patterns.h3, '<h3>$1</h3>');
  html = html.replace(patterns.h2, '<h2>$1</h2>');
  html = html.replace(patterns.h1, '<h1>$1</h1>');
  
  // Bold
  html = html.replace(patterns.boldStar, '<strong>$1</strong>');
  html = html.replace(patterns.boldUnderscore, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(patterns.italicStar, '<em>$1</em>');
  html = html.replace(patterns.italicUnderscore, '<em>$1</em>');
  
  // Strikethrough
  html = html.replace(patterns.strikethrough, '<del>$1</del>');
  
  // Code blocks (must be before inline code)
  html = html.replace(patterns.codeBlock, function(match, lang, code) {
    const language = lang || 'plaintext';
    return `<pre><code class="language-${language}">${escapeHtml(code)}</code></pre>`;
  });
  
  // Inline code
  html = html.replace(patterns.inlineCode, '<code>$1</code>');
  
  // Links
  html = html.replace(patterns.link, '<a href="$2" target="_blank">$1</a>');
  
  // Images
  html = html.replace(patterns.image, '<img src="$2" alt="$1" />');
  
  // Blockquotes
  html = html.replace(patterns.blockquote, '<blockquote>$1</blockquote>');
  
  // Checklist items (must be before regular lists)
  html = html.replace(patterns.checklistUnchecked, '<li class="task-item"><input type="checkbox" disabled> $1</li>');
  html = html.replace(patterns.checklistChecked, '<li class="task-item"><input type="checkbox" checked disabled> $1</li>');
  
  // Unordered lists
  html = html.replace(patterns.unorderedList, '<li>$1</li>');
  
  // Ordered lists
  html = html.replace(patterns.orderedList, '<li>$1</li>');
  
  // Wrap consecutive list items in ul tags
  html = html.replace(/(<li class="task-item">.*?<\/li>\n?)+/g, '<ul class="task-list">$&</ul>');
  html = html.replace(/(<li>(?!.*task-item).*?<\/li>\n?)+/g, '<ul>$&</ul>');
  
  // Line breaks
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n/g, '<br>');
  
  // Wrap in paragraph if not already wrapped
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
  // Simple syntax highlighting for common languages
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
  
  // Highlight strings
  code = code.replace(/(["'`])(?:(?=(\\?))\2.)*?\1/g, '<span class="string">$&</span>');
  
  // Highlight comments
  code = code.replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>');
  code = code.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="comment">$1</span>');
  
  return code;
}
