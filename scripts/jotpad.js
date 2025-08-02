
      document.addEventListener('DOMContentLoaded', function () {
        const noteArea = document.getElementById('noteArea')
        noteArea.innerHTML = localStorage.getItem('noteContent') || ''

        // Initialize canvas
        const canvas = document.getElementById('drawingCanvas')
        const ctx = canvas.getContext('2d')
        let isDrawing = false
        let lastX = 0
        let lastY = 0

        // Set canvas size to match note area
        function resizeCanvas() {
          const noteBox = document.querySelector('.note-box')
          canvas.width = noteBox.offsetWidth
          canvas.height = noteBox.offsetHeight

          // Redraw existing content if needed
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

        // Drawing functions
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
          // Save canvas state
          localStorage.setItem('canvasData', canvas.toDataURL())
        }

        // Mode switching
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

        // Set initial mode
        activateTextMode()

        // Canvas event listeners
        canvas.addEventListener('mousedown', startDrawing)
        canvas.addEventListener('mousemove', draw)
        canvas.addEventListener('mouseup', stopDrawing)
        canvas.addEventListener('mouseout', stopDrawing)

        // Touch support
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

        // Clear drawing button
        clearDrawingBtn.addEventListener('click', () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          localStorage.removeItem('canvasData')
        })

        // Save drawing button
        saveDrawingBtn.addEventListener('click', () => {
          const imageData = canvas.toDataURL('image/png')
          const img = document.createElement('img')
          img.src = imageData
          img.style.maxWidth = '100%'

          activateTextMode()
          noteArea.focus()

          // Insert at cursor position
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

        // Note content handling
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

      // PDF Download
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

        doc.save('MyNotes.pdf')
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