// JotPad (JavaScript)

document.addEventListener('DOMContentLoaded', function () {
  const noteArea = document.getElementById('noteArea')
  const markdownPreview = document.getElementById('markdownPreview')
  const markdownToolbar = document.getElementById('markdownToolbar')
  
  // Initialize markdown content from localStorage
  noteArea.value = localStorage.getItem('noteContent') || ''
  
  // Update markdown preview
  function updateMarkdownPreview() {
    const markdownText = noteArea.value
    if (markdownText.trim() === '') {
      markdownPreview.innerHTML = '<p class="preview-placeholder">Preview will appear here...</p>'
    } else {
      markdownPreview.innerHTML = parseMarkdown(markdownText)
    }
    saveNoteContent()
  }
  
  // Initial preview render
  updateMarkdownPreview()

  // Initialize Canvas
  const canvas = document.getElementById('drawingCanvas')
  const ctx = canvas.getContext('2d')
  let isDrawing = false
  let lastX = 0
  let lastY = 0

  // Drawing tool variables
  let currentTool = 'pen'
  let brushSize = 2

  // Canvas Size
  function resizeCanvas() {
    const noteBox = document.querySelector('.note-box')
    canvas.width = noteBox.offsetWidth
    canvas.height = noteBox.offsetHeight

    // Redraw Existing Content
    const canvasData = localStorage.getItem('canvasData')
    if (canvasData) {
      const img = new Image()
      img.onload = function () {
        ctx.drawImage(img, 0, 0)
      }
      img.src = canvasData
    }
  }

  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)

  // Drawing Functions
  function startDrawing(e) {
    isDrawing = true
    const rect = canvas.getBoundingClientRect()
    lastX = e.clientX - rect.left
    lastY = e.clientY - rect.top
  }

  function draw(e) {
    if (!isDrawing) return

    const rect = canvas.getBoundingClientRect()
    const currentX = e.clientX - rect.left
    const currentY = e.clientY - rect.top

    const theme = document.documentElement.getAttribute('data-theme')

    // Set drawing properties based on current tool
    if (currentTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineWidth = brushSize * 3 // Make eraser bigger
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = theme === 'dark' ? '#ffffff' : '#000000'
      ctx.lineWidth = brushSize
    }

    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'

    ctx.beginPath()
    ctx.moveTo(lastX, lastY)
    ctx.lineTo(currentX, currentY)
    ctx.stroke()

    lastX = currentX
    lastY = currentY
  }

  function stopDrawing() {
    isDrawing = false
    // Save Canvas
    localStorage.setItem('canvasData', canvas.toDataURL())
  }

  // Switch Mode (Text <--> Draw)
  const textModeBtn = document.getElementById('textModeBtn')
  const drawModeBtn = document.getElementById('drawModeBtn')
  const saveDrawingBtn = document.getElementById('saveDrawingBtn')
  const clearDrawingBtn = document.getElementById('clearDrawingBtn')

  function activateTextMode() {
    textModeBtn.classList.add('active')
    drawModeBtn.classList.remove('active')
    noteArea.style.display = 'block'
    markdownPreview.style.display = 'block'
    noteArea.disabled = false
    canvas.style.pointerEvents = 'none'
    saveDrawingBtn.style.display = 'none'
    clearDrawingBtn.style.display = 'none'
    document.getElementById('drawingTools').style.display = 'none'
    markdownToolbar.style.display = 'flex'
    noteArea.focus()
  }

  function activateDrawMode() {
    textModeBtn.classList.remove('active')
    drawModeBtn.classList.add('active')
    noteArea.style.display = 'none'
    markdownPreview.style.display = 'none'
    noteArea.disabled = true
    canvas.style.pointerEvents = 'auto'
    saveDrawingBtn.style.display = 'inline-block'
    clearDrawingBtn.style.display = 'inline-block'
    document.getElementById('drawingTools').style.display = 'flex'
    markdownToolbar.style.display = 'none'
  }

  textModeBtn.addEventListener('click', activateTextMode)
  drawModeBtn.addEventListener('click', activateDrawMode)

  // Set Initial Mode
  activateTextMode()

  // Canvas Event Listeners
  canvas.addEventListener('mousedown', startDrawing)
  canvas.addEventListener('mousemove', draw)
  canvas.addEventListener('mouseup', stopDrawing)
  canvas.addEventListener('mouseout', stopDrawing)

  // Touch Functionality (Draw Mode)
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault()
    const touch = e.touches[0]
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY,
    })
    canvas.dispatchEvent(mouseEvent)
  })

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault()
    const touch = e.touches[0]
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY,
    })
    canvas.dispatchEvent(mouseEvent)
  })

  canvas.addEventListener('touchend', (e) => {
    e.preventDefault()
    const mouseEvent = new MouseEvent('mouseup', {})
    canvas.dispatchEvent(mouseEvent)
  })

  // Clear Drawing Button
  clearDrawingBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    localStorage.removeItem('canvasData')
  })

  // Save Drawing Button
  saveDrawingBtn.addEventListener('click', () => {
    const imageData = canvas.toDataURL('image/png')
    
    activateTextMode()
    noteArea.focus()

    // Insert markdown image syntax at cursor
    const cursorPos = noteArea.selectionStart
    const textBefore = noteArea.value.substring(0, cursorPos)
    const textAfter = noteArea.value.substring(cursorPos)
    noteArea.value = textBefore + `\n![Drawing](${imageData})\n` + textAfter
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    localStorage.removeItem('canvasData')
    updateMarkdownPreview()
  })

  // Drawing Tools Functions
  function setTool(tool) {
    currentTool = tool
    
    // Update button states
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'))
    document.getElementById(tool + 'Tool').classList.add('active')
    
    // Set cursor style based on tool
    if (tool === 'eraser') {
      canvas.style.cursor = 'crosshair'
    } else {
      canvas.style.cursor = 'default'
    }
  }

  function setBrushSize(size) {
    brushSize = parseInt(size)
  }

  // Drawing Tools Event Listeners
  document.getElementById('penTool').addEventListener('click', () => setTool('pen'))
  document.getElementById('eraserTool').addEventListener('click', () => setTool('eraser'))
  document.getElementById('brushSize').addEventListener('input', (e) => setBrushSize(e.target.value))

  // Markdown Toolbar Functions
  function insertMarkdown(format) {
    const start = noteArea.selectionStart
    const end = noteArea.selectionEnd
    const selectedText = noteArea.value.substring(start, end)
    const beforeText = noteArea.value.substring(0, start)
    const afterText = noteArea.value.substring(end)
    
    let newText = ''
    let cursorOffset = 0
    
    switch(format) {
      case 'bold':
        newText = selectedText ? `**${selectedText}**` : '**bold text**'
        cursorOffset = selectedText ? newText.length : 2
        break
      case 'italic':
        newText = selectedText ? `*${selectedText}*` : '*italic text*'
        cursorOffset = selectedText ? newText.length : 1
        break
      case 'strikethrough':
        newText = selectedText ? `~~${selectedText}~~` : '~~strikethrough text~~'
        cursorOffset = selectedText ? newText.length : 2
        break
      case 'h1':
        newText = `# ${selectedText || 'Heading 1'}`
        cursorOffset = newText.length
        break
      case 'h2':
        newText = `## ${selectedText || 'Heading 2'}`
        cursorOffset = newText.length
        break
      case 'h3':
        newText = `### ${selectedText || 'Heading 3'}`
        cursorOffset = newText.length
        break
      case 'ul':
        newText = selectedText ? `- ${selectedText}` : '- List item'
        cursorOffset = newText.length
        break
      case 'ol':
        newText = selectedText ? `1. ${selectedText}` : '1. List item'
        cursorOffset = newText.length
        break
      case 'checklist':
        newText = selectedText ? `- [ ] ${selectedText}` : '- [ ] Task item'
        cursorOffset = newText.length
        break
      case 'link':
        newText = selectedText ? `[${selectedText}](url)` : '[Link text](url)'
        cursorOffset = selectedText ? newText.length - 4 : 1
        break
      case 'code':
        newText = selectedText ? `\`${selectedText}\`` : '`inline code`'
        cursorOffset = selectedText ? newText.length : 1
        break
      case 'codeblock':
        newText = selectedText ? `\`\`\`\n${selectedText}\n\`\`\`` : '```javascript\n// your code here\n```'
        cursorOffset = selectedText ? newText.length : 3
        break
      case 'quote':
        newText = selectedText ? `> ${selectedText}` : '> Blockquote'
        cursorOffset = newText.length
        break
    }
    
    noteArea.value = beforeText + newText + afterText
    noteArea.focus()
    noteArea.setSelectionRange(start + cursorOffset, start + cursorOffset)
    updateMarkdownPreview()
  }
  
  // Markdown Toolbar Event Listeners
  document.querySelectorAll('.toolbar-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const format = btn.dataset.format
      insertMarkdown(format)
    })
  })
  
  // Keyboard shortcuts for markdown
  noteArea.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch(e.key.toLowerCase()) {
        case 'b':
          e.preventDefault()
          insertMarkdown('bold')
          break
        case 'i':
          e.preventDefault()
          insertMarkdown('italic')
          break
      }
    }
  })

  // Handle Note Content
  function saveNoteContent() {
    localStorage.setItem('noteContent', noteArea.value)
  }

  noteArea.addEventListener('input', updateMarkdownPreview)
  noteArea.addEventListener('blur', saveNoteContent)
})


async function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p", "mm", "a4");

  const markdownPreview = document.getElementById("markdownPreview");
  const drawingCanvas = document.getElementById("drawingCanvas");

  const noteCanvas = await html2canvas(markdownPreview, {
    backgroundColor: "#ffffff",
    scale: 2
  });

  const combinedCanvas = document.createElement("canvas");
  combinedCanvas.width = noteCanvas.width;
  combinedCanvas.height = noteCanvas.height;
  const ctx = combinedCanvas.getContext("2d");

  ctx.drawImage(noteCanvas, 0, 0);

  ctx.drawImage(
    drawingCanvas,
    0,
    0,
    combinedCanvas.width,
    combinedCanvas.height
  );

  const imgData = combinedCanvas.toDataURL("image/png");
  const imgProps = doc.getImageProperties(imgData);
  const pdfWidth = doc.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  doc.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  doc.save("My_Notes.pdf");
}


function getImageData(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

function deleteAll() {
  if (confirm('Are you sure you want to delete all notes?')) {
    const noteArea = document.getElementById('noteArea')
    const markdownPreview = document.getElementById('markdownPreview')
    const canvas = document.getElementById('drawingCanvas')
    const ctx = canvas.getContext('2d')

    noteArea.value = ''
    markdownPreview.innerHTML = '<p class="preview-placeholder">Preview will appear here...</p>'
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    localStorage.removeItem('noteContent')
    localStorage.removeItem('canvasData')
  }
}