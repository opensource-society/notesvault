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
    noteArea.contentEditable = 'true'
    canvas.style.pointerEvents = 'none'
    saveDrawingBtn.style.display = 'none'
    clearDrawingBtn.style.display = 'none'
    document.getElementById('drawingTools').style.display = 'none'
    noteArea.focus()
  
  }

  function activateDrawMode() {
    textModeBtn.classList.remove('active')
    drawModeBtn.classList.add('active')
    noteArea.contentEditable = 'false'
    canvas.style.pointerEvents = 'auto'
    saveDrawingBtn.style.display = 'inline-block'
    clearDrawingBtn.style.display = 'inline-block'
    document.getElementById('drawingTools').style.display = 'flex'
   
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


    // === Background Color Change Feature ===
  const bgColorPicker = document.getElementById('bgColorPicker');

  // Restore saved color if available
  const savedBgColor = localStorage.getItem('noteBgColor');
  if (savedBgColor) {
    noteArea.style.backgroundColor = savedBgColor;
  }

  // Listen for color changes
  bgColorPicker.addEventListener('input', (e) => {
    const color = e.target.value;
    noteArea.style.backgroundColor = color;
    localStorage.setItem('noteBgColor', color);
  });
// Bold and Italic functionality
const boldBtn = document.getElementById('boldBtn');
const italicBtn = document.getElementById('italicBtn');

function applyStyle(styleType) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  if (range.collapsed) return; // No text selected

  const span = document.createElement('span');

  // Preserve existing styles if the selected text is already in a span
  if (selection.anchorNode.parentElement.tagName === 'SPAN') {
    span.style.cssText = selection.anchorNode.parentElement.style.cssText;
  }

  if (styleType === 'bold') {
    span.style.fontWeight = (span.style.fontWeight === 'bold') ? 'normal' : 'bold';
  }
  if (styleType === 'italic') {
    span.style.fontStyle = (span.style.fontStyle === 'italic') ? 'normal' : 'italic';
  }

  span.textContent = range.toString();
  range.deleteContents();
  range.insertNode(span);

  // Move caret after styled text
  const newRange = document.createRange();
  newRange.setStartAfter(span);
  newRange.collapse(true);
  selection.removeAllRanges();
  selection.addRange(newRange);

  // Save content
  localStorage.setItem('noteContent', noteArea.innerHTML);
}

// Event Listeners
boldBtn.addEventListener('click', () => applyStyle('bold'));
italicBtn.addEventListener('click', () => applyStyle('italic'));

const underlineBtn = document.getElementById('underlineBtn');
const fontColorPicker = document.getElementById('fontColorPicker');



function applyAdditionalStyle(styleType, value = null) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  const range = selection.getRangeAt(0);
  if (range.collapsed) return;

  const text = range.toString();
  if (!text) return;

  // Split span at caret to preserve existing styles
  function splitAtSelection() {
    const container = range.startContainer;
    if (container.nodeType === 3) { // text node
      const parentSpan = container.parentNode.tagName === 'SPAN' ? container.parentNode : null;
      if (!parentSpan) return;
      const offset = range.startOffset;
      const textContent = container.textContent;

      const before = document.createTextNode(textContent.slice(0, offset));
      const after = document.createTextNode(textContent.slice(offset));

      parentSpan.parentNode.insertBefore(before, parentSpan);
      parentSpan.parentNode.insertBefore(after, parentSpan.nextSibling);
      parentSpan.remove();

      // Update range
      const newRange = document.createRange();
      newRange.setStart(before.nextSibling, 0);
      newRange.setEnd(after, 0);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
  }

  splitAtSelection();

  // Wrap selected text in a span
  const span = document.createElement('span');
  span.style.cssText = selection.anchorNode.parentElement?.style.cssText || '';

  if (styleType === 'underline') {
    span.style.textDecoration = (span.style.textDecoration === 'underline') ? 'none' : 'underline';
  } else if (styleType === 'color') {
    span.style.color = value;
  }

  span.textContent = text;
  range.deleteContents();
  range.insertNode(span);

  // Move caret after span
  const newRange = document.createRange();
  newRange.setStartAfter(span);
  newRange.collapse(true);
  selection.removeAllRanges();
  selection.addRange(newRange);

  localStorage.setItem('noteContent', noteArea.innerHTML);
}

// Event listeners
underlineBtn.addEventListener('click', () => applyAdditionalStyle('underline'));
fontColorPicker.addEventListener('input', (e) => applyAdditionalStyle('color', e.target.value));




const increaseFontBtn = document.getElementById('increaseFontBtn');
const decreaseFontBtn = document.getElementById('decreaseFontBtn');

function changeFontSize(increment) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  const range = selection.getRangeAt(0);
  if (range.collapsed) return;

  // Split existing span at caret
  splitSpanAtCaret();

  const span = document.createElement('span');
  const parentSpan = selection.anchorNode.parentElement.closest('span');
  if (parentSpan) {
    span.style.cssText = parentSpan.style.cssText;
    // Get current font size in px
    const currentSize = parseInt(window.getComputedStyle(parentSpan).fontSize);
    span.style.fontSize = `${currentSize + increment}px`;
  } else {
    span.style.fontSize = `${14 + increment}px`; // default 14px
  }

  span.textContent = range.toString();
  range.deleteContents();
  range.insertNode(span);

  // Move caret after inserted span
  const newRange = document.createRange();
  newRange.setStartAfter(span);
  newRange.collapse(true);
  selection.removeAllRanges();
  selection.addRange(newRange);

  localStorage.setItem('noteContent', noteArea.innerHTML);
}

// Event listeners
increaseFontBtn.addEventListener('click', () => changeFontSize(2));
decreaseFontBtn.addEventListener('click', () => changeFontSize(-2));

const addLinkBtn = document.getElementById('addLinkBtn');

addLinkBtn.addEventListener('click', () => {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const text = selection.toString();
  if (!text) {
    alert("Please select text to add a link.");
    return;
  }

  const url = prompt("Enter the URL for the link:", "https://");
  if (!url) return;

  // Split span at caret
  splitSpanAtCaret();

  const range = selection.getRangeAt(0);
  const a = document.createElement('a');
  a.href = url;
  a.textContent = text;
  a.target = "_blank"; // open in new tab
  a.style.textDecoration = "underline"; // optional
  a.style.color = "#1a0dab"; // typical link color

  range.deleteContents();
  range.insertNode(a);

  // Move caret after link
  const newRange = document.createRange();
  newRange.setStartAfter(a);
  newRange.collapse(true);
  selection.removeAllRanges();
  selection.addRange(newRange);

  localStorage.setItem('noteContent', noteArea.innerHTML);
});


})

const highlightToggleBtn = document.getElementById('highlightToggleBtn');
const highlightPalette = document.getElementById('highlightPalette');

// Highlight Colors Circular Palette
const highlightColors = ['yellow', 'lightgreen', 'lightblue', 'pink', 'orange'];
let selectedColor = highlightColors[0];
let highlightEnabled = false;

// --- Helper Functions ---
function insertNodeAtRange(node, range) {
  const container = range.startContainer;
  if (container.nodeType === 3) {
    container.parentNode.insertBefore(node, container.nextSibling);
  } else {
    range.insertNode(node);
  }
}

function setCaretAfterNode(node) {
  const selection = window.getSelection();
  const range = document.createRange();
  range.setStartAfter(node);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}

function splitSpanAtCaret() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  const container = range.startContainer;
  const offset = range.startOffset;

  let parentSpan = container.nodeType === 3 ? container.parentNode : container.closest('span');
  if (!parentSpan || parentSpan.tagName !== 'SPAN') return;

  const text = container.textContent;

  // Caret at start → move before span
  if (offset === 0) {
    const newRange = document.createRange();
    newRange.setStartBefore(parentSpan);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);
    return;
  }

  // Caret at end → move after span
  if (offset >= text.length) {
    const newRange = document.createRange();
    newRange.setStartAfter(parentSpan);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);
    return;
  }

  // Mid-span → split into two spans
  const spanStyle = parentSpan.style.cssText;

  const beforeSpan = document.createElement('span');
  beforeSpan.style.cssText = spanStyle;
  beforeSpan.textContent = text.slice(0, offset);

  const afterSpan = document.createElement('span');
  afterSpan.style.cssText = spanStyle;
  afterSpan.textContent = text.slice(offset);

  parentSpan.parentNode.insertBefore(beforeSpan, parentSpan);
  parentSpan.parentNode.insertBefore(afterSpan, parentSpan.nextSibling);
  parentSpan.remove();

  setCaretAfterNode(beforeSpan.nextSibling); // move caret to after split
}

// --- Create color swatches ---
highlightColors.forEach((color, i) => {
  const swatch = document.createElement('div');
  swatch.className = 'color-swatch';
  swatch.style.backgroundColor = color;
  if (i === 0) swatch.classList.add('active-selected');
  highlightPalette.appendChild(swatch);

  swatch.addEventListener('click', () => {
    selectedColor = color;
    highlightPalette.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active-selected'));
    swatch.classList.add('active-selected');
  });
});

// --- Toggle button click ---
highlightToggleBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  highlightEnabled = !highlightEnabled;
  highlightToggleBtn.classList.toggle('active', highlightEnabled);

  const swatches = highlightPalette.querySelectorAll('.color-swatch');

  if (highlightEnabled) {
    highlightPalette.classList.add('active');
    highlightPalette.style.display = 'flex';
    const btnRect = highlightToggleBtn.getBoundingClientRect();
    const centerX = btnRect.left + btnRect.width / 2 + window.scrollX;
    const centerY = btnRect.top + btnRect.height / 2 + window.scrollY;
    highlightPalette.style.left = `${centerX - 60}px`;
    highlightPalette.style.top = `${centerY - 60}px`;

    const radius = 50;
    const arcStart = Math.PI;
    const arcEnd = 2 * Math.PI;
    const angleStep = (arcEnd - arcStart) / (swatches.length - 1);
    swatches.forEach((swatch, i) => {
      const angle = arcStart + i * angleStep;
      const x = 60 + radius * Math.cos(angle) - 14;
      const y = 60 + radius * Math.sin(angle) - 14;
      swatch.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        swatch.style.left = `${x}px`;
        swatch.style.top = `${y}px`;
        swatch.style.transform = 'scale(1)';
      }, i * 50);
    });
  } else {
    swatches.forEach((swatch, i) => {
      swatch.style.transition = 'all 0.2s ease';
      setTimeout(() => {
        swatch.style.left = '60px';
        swatch.style.top = '60px';
        swatch.style.transform = 'scale(0)';
      }, i * 30);
    });

    setTimeout(() => {
      highlightPalette.style.display = 'none';
      highlightPalette.classList.remove('active');
    }, swatches.length * 30 + 150);
  }
});

// --- Apply highlight to selection ---
function applyHighlight(color) {
  const selection = window.getSelection();
  if (selection.isCollapsed) return;

  const range = selection.getRangeAt(0);
  const span = document.createElement('span');
  const isDarkMode = document.body.classList.contains('dark-mode');
  span.style.color = isDarkMode ? 'white' : 'black';
  span.style.backgroundColor = color;
  span.textContent = range.toString();
  range.deleteContents();
  range.insertNode(span);

  setCaretAfterNode(span);
  saveNoteContent();
}

// --- Mouseup listener ---
noteArea.addEventListener('mouseup', () => {
  if (!highlightEnabled) return;
  const selection = window.getSelection();
  if (!selection.isCollapsed) applyHighlight(selectedColor);
});

// --- Handle typing and input ---
noteArea.addEventListener('beforeinput', (e) => {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  // Remove placeholder if present
  if (noteArea.classList.contains('empty')) {
    noteArea.innerHTML = '';
    noteArea.classList.remove('empty');
  }

  const range = selection.getRangeAt(0);

  // Handle Enter
  if (e.inputType === "insertParagraph") {
    e.preventDefault();
    const br = document.createElement('br');
    insertNodeAtRange(br, range);
    setCaretAfterNode(br);
    saveNoteContent();
    return;
  }

  // Only handle text insertion
  if (e.inputType !== "insertText") return;
  e.preventDefault();
  const text = e.data;

  splitSpanAtCaret();

  const rangeAfterSplit = selection.getRangeAt(0);
  if (highlightEnabled) {
    const span = document.createElement('span');
    span.style.backgroundColor = selectedColor;
    const isDarkMode = document.body.classList.contains('dark-mode');
    span.style.color = isDarkMode ? 'white' : 'black';
    span.textContent = text;
    insertNodeAtRange(span, rangeAfterSplit);
    setCaretAfterNode(span);
  } else {
    const textNode = document.createTextNode(text);
    insertNodeAtRange(textNode, rangeAfterSplit);
    setCaretAfterNode(textNode);
  }

  saveNoteContent();
});

async function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const noteArea = document.getElementById("noteArea");
  const drawingCanvas = document.getElementById("drawingCanvas");

  // Render the full note area to a canvas
  const noteCanvas = await html2canvas(noteArea, {
    backgroundColor: "#ffffff",
    scale: 2,
    useCORS: true
  });

  // Combine note content and drawing canvas into one big canvas
  const combinedCanvas = document.createElement("canvas");
  combinedCanvas.width = noteCanvas.width;
  combinedCanvas.height = Math.max(noteCanvas.height, drawingCanvas.height);
  const ctx = combinedCanvas.getContext("2d");

  ctx.drawImage(noteCanvas, 0, 0);
  ctx.drawImage(drawingCanvas, 0, 0, combinedCanvas.width, combinedCanvas.height);

  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imgData = combinedCanvas.toDataURL("image/png");

  // Calculate height in mm of the full canvas
  const imgProps = pdf.getImageProperties(imgData);
  const pageHeight = (imgProps.height * pdfWidth) / imgProps.width;

  let remainingHeight = pageHeight;
  let position = 0;

  while (remainingHeight > 0) {
    const h = Math.min(remainingHeight, pdfHeight);
    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      pdfWidth,
      h,
      undefined,
      'FAST'
    );
    remainingHeight -= pdfHeight;

    if (remainingHeight > 0) {
      pdf.addPage();
    }
  }

  pdf.save("My_Notes.pdf");
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


// --- Image Upload ---
const imageUploadInput = document.getElementById("imageUpload");

function insertNodeAtCursor(node) {
  const sel = window.getSelection();
  if (!sel.rangeCount) {
    // fallback → append at end of note area
    noteArea.appendChild(node);
    return;
  }
  const range = sel.getRangeAt(0);
  range.deleteContents();
  range.insertNode(node);
  range.setStartAfter(node);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}

imageUploadInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file || !file.type.startsWith("image/")) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      if (noteArea.isContentEditable) {
        
        img.style.maxWidth = "200px";
        img.style.margin = "10px auto";
        img.style.display = "block";
        img.style.borderRadius = "8px";
        img.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.15)";
        insertNodeAtCursor(img);
        localStorage.setItem("noteContent", noteArea.innerHTML);
      } else {
        
        ctx.drawImage(img, 50, 50, 200, 200);
        localStorage.setItem("canvasData", canvas.toDataURL());
      }
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

