// JotPad (JavaScript)

document.addEventListener('DOMContentLoaded', function () {
  const noteArea = document.getElementById('noteArea')
  noteArea.innerHTML = localStorage.getItem('noteContent') || ''

   const branchSelect = document.getElementById('branchSelect');
  const semesterSelect = document.getElementById('semesterSelect');
  const uploaderInput = document.getElementById('uploaderInput');

  // Dynamic dropdown options
  const branches = ['Computer Science', 'Mechanical', 'Electrical', 'Civil'];
  const semesters = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

  function populateDropdown(selectElem, options) {
    selectElem.innerHTML = '<option value="">Select</option>';
    options.forEach(opt => {
      const option = document.createElement('option');
      option.value = opt;
      option.textContent = opt;
      selectElem.appendChild(option);
    });
  }

  populateDropdown(branchSelect, branches);
  populateDropdown(semesterSelect, semesters);

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

    ctx.strokeStyle = theme === 'dark' ? '#ffffff' : '#000000'
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

// Toggle Icon Buttons
  const bookmarkToggleBtn = document.getElementById('bookmarkToggleBtn');
  const highlightToggleBtn = document.getElementById('highlightToggleBtn');
  const highlightPalette = document.getElementById('highlightPalette');
  let bookmarkedNotes = JSON.parse(localStorage.getItem('bookmarkedNotes')) || [];

  // Bookmark toggle
  bookmarkToggleBtn.addEventListener('click', () => {
    const noteContent = noteArea.innerText.trim();
    if (!noteContent) return alert('Cannot bookmark empty note!');
    const branch = branchSelect.value || 'Unknown';
    const semester = semesterSelect.value || 'Unknown';
    const uploader = uploaderInput.value.trim() || 'Anonymous';
    const existingIndex = bookmarkedNotes.findIndex(n =>
      n.description === noteContent &&
      n.branch === branch &&
      n.semester === semester &&
      n.uploader === uploader
    );
    const icon = bookmarkToggleBtn.querySelector('i');
    if(existingIndex!==-1){
      bookmarkedNotes.splice(existingIndex,1);
      localStorage.setItem('bookmarkedNotes', JSON.stringify(bookmarkedNotes));
      alert('Note removed from bookmarks.');
      bookmarkToggleBtn.classList.remove('active');
      icon.classList.remove('fa-solid');
      icon.classList.add('fa-regular');
    } else {
      const noteId = 'jotpad_'+Date.now();
      const bookmarkedNote = {
        _id: noteId,
        title: noteContent.substring(0,30) || 'Untitled Note',
        branch, semester, description: noteContent, uploader,
        uploadDate: new Date().toISOString(),
        filePath:''
      };
      bookmarkedNotes.push(bookmarkedNote);
      localStorage.setItem('bookmarkedNotes', JSON.stringify(bookmarkedNotes));
      alert('Note bookmarked! Open Browse Notes page to see it.');
      bookmarkToggleBtn.classList.add('active');
      icon.classList.remove('fa-regular');
      icon.classList.add('fa-solid');
    }
  });

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

// Download PDF
async function downloadPDF() {
  const { jsPDF } = window.jspdf
  const content = document.getElementById('noteArea').innerHTML
  const doc = new jsPDF()
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(14)

  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = content

  let textContent = ''
  const walker = document.createTreeWalker(
    tempDiv,
    NodeFilter.SHOW_TEXT,
    null,
    false
  )
  let node
  while ((node = walker.nextNode())) {
    textContent += node.nodeValue + '\n'
  }

  const images = tempDiv.getElementsByTagName('img')
  let yPosition = 20
  const textLines = doc.splitTextToSize(textContent, 180)
  doc.text(textLines, 10, yPosition)
  yPosition += textLines.length * 7

  for (let i = 0; i < images.length; i++) {
    if (yPosition > 250) {
      doc.addPage()
      yPosition = 20
    }

    try {
      const imgData = await getImageData(images[i].src)
      const imgProps = doc.getImageProperties(imgData)
      const width = 180
      const height = (imgProps.height * width) / imgProps.width
      doc.addImage(imgData, 'PNG', 10, yPosition, width, height)
      yPosition += height + 10
    } catch (error) {
      console.error('Error adding image to PDF:', error)
    }
  }

  doc.save('My_Notes.pdf')
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
  // Listen for changes in localStorage from other pages/tab
}
// After defining bookmarkToggleBtn, noteArea, branchSelect, semesterSelect, uploaderInput
window.addEventListener('storage', (event) => {
  if (event.key === 'bookmarkedNotes') {
    bookmarkedNotes = JSON.parse(event.newValue) || [];

    const noteContent = noteArea.innerText.trim();
    const branch = branchSelect.value || 'Unknown';
    const semester = semesterSelect.value || 'Unknown';
    const uploader = uploaderInput.value.trim() || 'Anonymous';

    const existingIndex = bookmarkedNotes.findIndex(n =>
      n.description === noteContent &&
      n.branch === branch &&
      n.semester === semester &&
      n.uploader === uploader
    );

    const icon = bookmarkToggleBtn.querySelector('i');
    if (existingIndex !== -1) {
      bookmarkToggleBtn.classList.add('active');
      icon.classList.remove('fa-regular');
      icon.classList.add('fa-solid');
    } else {
      bookmarkToggleBtn.classList.remove('active');
      icon.classList.remove('fa-solid');
      icon.classList.add('fa-regular');
    }
  }
});

