document.addEventListener('DOMContentLoaded', function () {
  let branchData
  const branchSelect = document.getElementById('branch')
  const semesterSelect = document.getElementById('semester')
  const subjectSelect = document.getElementById('subject')

  // Custom Input Containers
  const customBranchContainer = document.getElementById('customBranchContainer')
  const customSemesterContainer = document.getElementById(
    'customSemesterContainer'
  )
  const customSubjectContainer = document.getElementById(
    'customSubjectContainer'
  )

  // Initialize Form State
  function initializeForm() {
    semesterSelect.disabled = true
    subjectSelect.disabled = true
    customBranchContainer.style.display = 'none'
    customSemesterContainer.style.display = 'none'
    customSubjectContainer.style.display = 'none'
  }

  // Fetch Branch Data
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

  // Populate Branches Dropdown
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

  // Handle Branch Selection Change
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

    if (branch && typeof branch === 'object') {
      branch.semesters.forEach((sem) => {
        const option = document.createElement('option')
        option.value = sem.semester
        option.textContent = `Semester ${sem.semester}`
        semesterSelect.appendChild(option)
      })
    }
  }

  // Handle Semester Selection Change
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
      if (semesterObj) {
        semesterObj.subjects.forEach((sub) => {
          const code = Object.keys(sub)[0]
          const name = sub[code]
          const option = document.createElement('option')
          option.value = code
          option.textContent = `${code} - ${name}`
          subjectSelect.appendChild(option)
        })
      }
    }
  }

  // Handle Subject Selection Change
  function handleSubjectChange() {
    if (this.value === 'custom') {
      customSubjectContainer.style.display = 'flex'
      return
    }
    customSubjectContainer.style.display = 'none'
  }

  // Confirm Custom Branch
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

  // Confirm Custom Semester
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

  // Confirm Custom Subject
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

  // File Drop Zone Functionality
  function setupFileDropZone() {
    const dropZone = document.getElementById('drop-zone')
    const fileInput = document.getElementById('file')
    const preview = document.getElementById('preview')

    dropZone.addEventListener('click', () => fileInput.click())

    fileInput.addEventListener('change', handleFileSelect)
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
    fileInput.files = files
    handleFileSelect({ target: fileInput })
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

  // Show Status Message
  function showMessage(text, type) {
    const message = document.getElementById('message')
    message.textContent = text
    message.className = `status-message status-${type}`

    // Auto-Hide Message After 5 Seconds
    setTimeout(() => {
      message.textContent = ''
      message.className = 'status-message'
    }, 5000)
  }

  // Form Submission
  function handleFormSubmit(e) {
    e.preventDefault()

    // Validate Form
    const title = document.getElementById('title').value.trim()
    const file = document.getElementById('file').files[0]

    if (!title || !file) {
      showMessage('Please fill all required fields', 'error')
      return
    }

    // Simulate Successful Upload
    showMessage(
      'Notes Uploaded Successfully (For Demo Purposes Only - Not Stored)',
      'success'
    )

    // Reset Form
    this.reset()
    document.getElementById('preview').innerHTML = ''
    initializeForm()
  }

  // Initialize Application
  function init() {
    initializeForm()
    loadBranchData()

    // Event Listeners
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
