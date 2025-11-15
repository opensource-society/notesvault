

document.addEventListener('DOMContentLoaded', function () {
  let branchData
  const branchSelect = document.getElementById('branch')
  const semesterSelect = document.getElementById('semester')
  const subjectSelect = document.getElementById('subject')

  const customBranchContainer = document.getElementById('customBranchContainer')
  const customSemesterContainer = document.getElementById(
    'customSemesterContainer'
  )
  const customSubjectContainer = document.getElementById(
    'customSubjectContainer'
  )

  function initializeForm() {
    semesterSelect.disabled = true
    subjectSelect.disabled = true
    customBranchContainer.style.display = 'none'
    customSemesterContainer.style.display = 'none'
    customSubjectContainer.style.display = 'none'
  }

  function loadBranchData() {
    fetch('../data/parameters.json')
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok')
        return response.json()
      })
      .then((data) => {
        branchData = data
        populateBranches(data.branches)
      })
      .catch((error) => {
        console.error('Error loading branch data:', error)
        showMessage(
          'Failed to load branch data. Please try again later.',
          'error'
        )
      })
  }

  function populateBranches(branches) {
    branchSelect.innerHTML =
      '<option value="">Select Branch</option><option value="custom">Add Custom Branch...</option>'

    branches.forEach((branch) => {
      const option = document.createElement('option')
      option.value = typeof branch === 'object' ? branch.name : branch
      option.textContent = typeof branch === 'object' ? branch.name : branch
      branchSelect.appendChild(option)
    })
  }

  function handleBranchChange() {
    const selectedBranch = this.value
    semesterSelect.innerHTML =
      '<option value="">Select Semester</option><option value="custom">Add Custom Semester...</option>'
    subjectSelect.innerHTML =
      '<option value="">Select Subject</option><option value="custom">Add Custom Subject...</option>'

    if (selectedBranch === 'custom') {
      customBranchContainer.style.display = 'flex'
      semesterSelect.disabled = true
      subjectSelect.disabled = true
      return
    }

    customBranchContainer.style.display = 'none'
    semesterSelect.disabled = false
    subjectSelect.disabled = true

    const branch = branchData.branches.find((b) =>
      typeof b === 'object' ? b.name === selectedBranch : b === selectedBranch
    )

    if (branch && typeof branch === 'object' && branch.semesters) {

      const fragment = document.createDocumentFragment()
      branch.semesters.forEach((sem) => {
        const option = document.createElement('option')
        option.value = sem.semester
        option.textContent = `Semester ${sem.semester}`
        fragment.appendChild(option)
      })
      semesterSelect.appendChild(fragment)
    }
  }

  function handleSemesterChange() {
    const selectedSemester = this.value
    subjectSelect.innerHTML =
      '<option value="">Select Subject</option><option value="custom">Add Custom Subject...</option>'

    if (selectedSemester === 'custom') {
      customSemesterContainer.style.display = 'flex'
      subjectSelect.disabled = true
      return
    }

    customSemesterContainer.style.display = 'none'
    subjectSelect.disabled = false

    const branch = branchSelect.value
    const semester = parseInt(selectedSemester)
    const branchObj = branchData.branches.find((b) =>
      typeof b === 'object' ? b.name === branch : b === branch
    )

    if (branchObj && typeof branchObj === 'object') {
      const semesterObj = branchObj.semesters.find(
        (s) => s.semester === semester
      )
      if (semesterObj && semesterObj.subjects) {

        const fragment = document.createDocumentFragment()
        semesterObj.subjects.forEach((sub) => {
          const code = Object.keys(sub)[0]
          const name = sub[code]
          const option = document.createElement('option')
          option.value = code
          option.textContent = `${code} - ${name}`
          fragment.appendChild(option)
        })
        subjectSelect.appendChild(fragment)
      }
    }
  }

  function handleSubjectChange() {
    if (this.value === 'custom') {
      customSubjectContainer.style.display = 'flex'
      return
    }
    customSubjectContainer.style.display = 'none'
  }

  function confirmCustomBranch() {
    const customBranch = document.getElementById('customBranch').value.trim()
    if (!customBranch) {
      showMessage('Please enter a branch name', 'error')
      return
    }

    const option = document.createElement('option')
    option.value = customBranch
    option.textContent = customBranch
    branchSelect.insertBefore(option, branchSelect.lastChild)
    branchSelect.value = customBranch
    customBranchContainer.style.display = 'none'
    semesterSelect.disabled = false
    document.getElementById('customBranch').value = ''
  }

  function confirmCustomSemester() {
    const customSemester = document
      .getElementById('customSemester')
      .value.trim()
    if (!customSemester) {
      showMessage('Please enter a semester number', 'error')
      return
    }

    const option = document.createElement('option')
    option.value = customSemester
    option.textContent = `Semester ${customSemester}`
    semesterSelect.insertBefore(option, semesterSelect.lastChild)
    semesterSelect.value = customSemester
    customSemesterContainer.style.display = 'none'
    subjectSelect.disabled = false
    document.getElementById('customSemester').value = ''
  }

  function confirmCustomSubject() {
    const code = document.getElementById('customSubjectCode').value.trim()
    const name = document.getElementById('customSubjectName').value.trim()

    if (!code || !name) {
      showMessage('Please enter both subject code and name', 'error')
      return
    }

    const option = document.createElement('option')
    option.value = code
    option.textContent = `${code} - ${name}`
    subjectSelect.insertBefore(option, subjectSelect.lastChild)
    subjectSelect.value = code
    customSubjectContainer.style.display = 'none'
    document.getElementById('customSubjectCode').value = ''
    document.getElementById('customSubjectName').value = ''
  }

  function setupFileDropZone() {
    const dropZone = document.getElementById('drop-zone')
    const fileInput = document.getElementById('file')
    const preview = document.getElementById('preview')

    dropZone.addEventListener('click', () => fileInput.click())

  if (fileInput) fileInput.addEventListener('change', handleFileSelect)
    ;['dragenter', 'dragover'].forEach((eventName) => {
      dropZone.addEventListener(eventName, highlightDropZone)
    })
    ;['dragleave', 'drop'].forEach((eventName) => {
      dropZone.addEventListener(eventName, unhighlightDropZone)
    })

    dropZone.addEventListener('drop', handleDrop)
  }

  function highlightDropZone(e) {
    e.preventDefault()
    e.stopPropagation()
    document.getElementById('drop-zone').classList.add('active')
  }

  function unhighlightDropZone(e) {
    e.preventDefault()
    e.stopPropagation()
    document.getElementById('drop-zone').classList.remove('active')
  }

  function handleDrop(e) {
    const dt = e.dataTransfer
    const files = dt.files

    const fileInput = document.getElementById('file')
    if (!fileInput) return
    try {
      fileInput.files = files
      handleFileSelect({ target: fileInput })
    } catch (err) {

      handleFileSelect({ target: { files } })
    }
  }

  function handleFileSelect(e) {
    const files = e.target.files
    const preview = document.getElementById('preview')

    if (!files.length) return

    preview.innerHTML = ''
    const file = files[0]

    if (!file.type.match('application/pdf')) {
      showMessage('Please upload a PDF file', 'error')
      return
    }

    const fileInfo = document.createElement('div')
    fileInfo.textContent = `Selected: ${file.name} (${formatFileSize(
      file.size
    )})`
    preview.appendChild(fileInfo)
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  function showMessage(text, type) {
    const message = document.getElementById('message')
    message.textContent = text
    message.className = `status-message status-${type}`

    setTimeout(() => {
      message.textContent = ''
      message.className = 'status-message'
    }, 5000)
  }

  function handleFormSubmit(e) {
    e.preventDefault()

    const title = document.getElementById('title').value.trim()
    const file = document.getElementById('file').files[0]

    if (!title || !file) {
      showMessage('Please fill all required fields', 'error')
      return
    }

    // Build FormData and POST to server
    const form = new FormData()
    form.append('title', title)
    form.append('branch', document.getElementById('branch').value)
    form.append('semester', document.getElementById('semester').value)
    form.append('subject', document.getElementById('subject').value)
    form.append('tags', document.getElementById('tags').value)
    form.append('file', file)

    showMessage('Uploading...', 'info')

    // Use XMLHttpRequest to show progress
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/upload')
    xhr.withCredentials = true

    xhr.upload.addEventListener('progress', (ev) => {
      if (ev.lengthComputable) {
        const percent = Math.round((ev.loaded / ev.total) * 100)
        showMessage(`Uploading... ${percent}%`, 'info')
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText)
          showMessage('Upload successful', 'success')
        } catch (e) {
          showMessage('Upload completed (server returned non-JSON)', 'success')
        }
        document.getElementById('uploadForm').reset()
        document.getElementById('preview').innerHTML = ''
        initializeForm()
      } else {
        let msg = 'Upload failed'
        try {
          const data = JSON.parse(xhr.responseText)
          msg = data.error || data.message || msg
        } catch (e) {}
        showMessage(msg, 'error')
      }
    })

    xhr.addEventListener('error', () => {
      showMessage('Upload failed due to network error', 'error')
    })

    xhr.send(form)
  }

  function init() {
    initializeForm()
    loadBranchData()

    branchSelect.addEventListener('change', handleBranchChange)
    semesterSelect.addEventListener('change', handleSemesterChange)
    subjectSelect.addEventListener('change', handleSubjectChange)

    document
      .getElementById('confirmBranch')
      .addEventListener('click', confirmCustomBranch)
    document
      .getElementById('confirmSemester')
      .addEventListener('click', confirmCustomSemester)
    document
      .getElementById('confirmSubject')
      .addEventListener('click', confirmCustomSubject)

    document
      .getElementById('uploadForm')
      .addEventListener('submit', handleFormSubmit)

    setupFileDropZone()
  }

  init()
})
