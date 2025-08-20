// JotPad (JavaScript)

document.addEventListener('DOMContentLoaded', function () {
  const noteArea = document.getElementById('noteArea')
  noteArea.innerHTML = localStorage.getItem('noteContent') || ''

  // Initialize Canvas
  const canvas = document.getElementById('drawingCanvas')
  const ctx = canvas.getContext('2d')
  let isDrawing = false
  let lastX = 0
  let lastY = 0

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

    // Use selectedColor from highlight palette if chosen, otherwise fallback
    if (highlightEnabled) {
    ctx.strokeStyle = selectedColor;
  } else {
    // Default based on theme
    ctx.strokeStyle =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "#ffffff"
        : "#000000";
  }

    ctx.lineWidth = 2
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
    noteArea.contentEditable = 'true'
    canvas.style.pointerEvents = 'none'
    saveDrawingBtn.style.display = 'none'
    clearDrawingBtn.style.display = 'none'
    noteArea.focus()
  }

  function activateDrawMode() {
    textModeBtn.classList.remove('active')
    drawModeBtn.classList.add('active')
    noteArea.contentEditable = 'false'
    canvas.style.pointerEvents = 'auto'
    saveDrawingBtn.style.display = 'inline-block'
    clearDrawingBtn.style.display = 'inline-block'
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
    const img = document.createElement('img')
    img.src = imageData
    img.style.maxWidth = '100%'

    activateTextMode()
    noteArea.focus()

    // Insert At Cursor Position
    const selection = window.getSelection()
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      range.insertNode(img)
    } else {
      noteArea.appendChild(img)
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    localStorage.removeItem('canvasData')
    saveNoteContent()
  })

  // Handle Note Content
  function togglePlaceholder() {
    if (noteArea.innerText.trim() === '') {
      noteArea.classList.add('empty')
    } else {
      noteArea.classList.remove('empty')
    }
    saveNoteContent()
  }

  function saveNoteContent() {
    localStorage.setItem('noteContent', noteArea.innerHTML)
  }

  noteArea.addEventListener('input', togglePlaceholder)
  noteArea.addEventListener('blur', togglePlaceholder)
  noteArea.addEventListener('focus', function () {
    if (noteArea.innerText.trim() === '') {
      noteArea.classList.add('empty')
    }
  })

  togglePlaceholder()
})
const highlightToggleBtn = document.getElementById('highlightToggleBtn');
const highlightPalette = document.getElementById('highlightPalette');
// Highlight Colors Circular Palette
const highlightColors = ['yellow', 'lightgreen', 'lightblue', 'pink', 'orange'];
let selectedColor = highlightColors[0];
let highlightEnabled = false;

// Create color swatches
highlightColors.forEach((color, i) => {
  const swatch = document.createElement('div');
  swatch.className = 'color-swatch';
  swatch.style.backgroundColor = color;
  if (i === 0) swatch.classList.add('active-selected');
  highlightPalette.appendChild(swatch);

  // Swatch click: select color
  swatch.addEventListener('click', () => {
    selectedColor = color;
    highlightPalette.querySelectorAll('.color-swatch')
      .forEach(s => s.classList.remove('active-selected'));
    swatch.classList.add('active-selected');
  });
});

// Highlight toggle button click
highlightToggleBtn.addEventListener('click', (e) => {
   e.stopPropagation(); 
  const swatches = highlightPalette.querySelectorAll('.color-swatch');
  const btnRect = highlightToggleBtn.getBoundingClientRect();

  highlightEnabled = !highlightEnabled;
  highlightToggleBtn.classList.toggle('active', highlightEnabled);
  const selection = window.getSelection();
  
  if (!highlightEnabled && !selection.isCollapsed) {
   applyHighlight();
  }
  if (highlightEnabled) {
    // Open palette
    highlightPalette.classList.add('active');
    highlightPalette.style.display = 'flex';
    
    const centerX = btnRect.left + btnRect.width / 2 + window.scrollX;
    const centerY = btnRect.top + btnRect.height / 2 + window.scrollY;
    highlightPalette.style.left = `${centerX - 60}px`;
    highlightPalette.style.top = `${centerY - 60}px`;

    // Semicircle layout
    const radius = 50;
    const arcStart = Math.PI;
    const arcEnd = 2 * Math.PI;
    const angleStep = (arcEnd - arcStart) / (swatches.length - 1);

    swatches.forEach((swatch, i) => {
      const angle = arcStart + i * angleStep;
      const x = 60 + radius * Math.cos(angle) - 14;
      const y = 60 + radius * Math.sin(angle) - 14;
      setTimeout(() => {
        swatch.style.left = `${x}px`;
        swatch.style.top = `${y}px`;
        swatch.style.transform = 'scale(1)';
      }, i * 50);
    });

  } else {
    // Close palette
    highlightPalette.classList.remove('active');
    highlightEnabled = false;

    swatches.forEach((swatch, i) => {
      const angle = 0; 
      setTimeout(() => {
        swatch.style.left = '60px';
        swatch.style.top = '60px';
        swatch.style.transform = 'scale(0)'; 
      }, i * 50);
    });

    setTimeout(() => {
       highlightPalette.classList.remove('active');
      highlightPalette.style.display = 'none';
      highlightPalette.style.pointerEvents = 'none';
    }, swatches.length * 50 + 200);
  }
});

function applyHighlight(color) {
  const selection = window.getSelection();
  if (selection.isCollapsed) return;

  const range = selection.getRangeAt(0);
  const fragment = document.createDocumentFragment();

  // Get all nodes in the selection
  const contents = range.cloneContents();
  const nodes = Array.from(contents.childNodes);

  nodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      // Plain text -> highlight
      if (highlightEnabled) {
        const span = document.createElement('span');
        span.style.backgroundColor = color;
        span.textContent = node.textContent;
        fragment.appendChild(span);
      } else {
        fragment.appendChild(document.createTextNode(node.textContent));
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === 'SPAN' && node.style.backgroundColor) {
        // Already highlighted -> remove highlight
        fragment.appendChild(document.createTextNode(node.textContent));
      } else {
        // Keep other elements as-is
        fragment.appendChild(node.cloneNode(true));
      }
    }
  });

  range.deleteContents();
  range.insertNode(fragment);
  selection.removeAllRanges();
  saveNoteContent();
}
// Mouseup listener
noteArea.addEventListener('mouseup', () => {
  const selection = window.getSelection();
  if (selection.isCollapsed) return;

  applyHighlight(selectedColor);
});

async function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p", "mm", "a4");

  const noteArea = document.getElementById("noteArea");
  const drawingCanvas = document.getElementById("drawingCanvas");

  const noteCanvas = await html2canvas(noteArea, {
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
    const canvas = document.getElementById('drawingCanvas')
    const ctx = canvas.getContext('2d')

    noteArea.innerHTML = ''
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    localStorage.removeItem('noteContent')
    localStorage.removeItem('canvasData')

    noteArea.classList.add('empty')
  }
}
