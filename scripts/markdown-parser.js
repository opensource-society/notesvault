// Simple Markdown Parser
// This is a lightweight markdown parser that supports basic markdown syntax

function parseMarkdown(markdown) {
  let html = markdown;

  // Escape HTML characters first
  const escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
  };
  
  // Convert markdown to HTML
  
  // Headers (must be done before other processing)
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');
  
  // Strikethrough
  html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');
  
  // Code blocks (must be before inline code)
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, function(match, lang, code) {
    const language = lang || 'plaintext';
    return `<pre><code class="language-${language}">${escapeHtml(code)}</code></pre>`;
  });
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
  
  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
  
  // Blockquotes
  html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');
  
  // Unordered lists
  html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  
  // Ordered lists
  html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
  
  // Checklist items
  html = html.replace(/^\- \[ \] (.*$)/gim, '<li class="task-item"><input type="checkbox" disabled> $1</li>');
  html = html.replace(/^\- \[x\] (.*$)/gim, '<li class="task-item"><input type="checkbox" checked disabled> $1</li>');
  
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
