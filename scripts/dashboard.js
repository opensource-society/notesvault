// Student Dashboard (JavaScript)

document.addEventListener('DOMContentLoaded', function () {
  // Check if user is authenticated
  function checkAuthentication() {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (isLoggedIn !== 'true') {
      // Redirect to login if not authenticated
      localStorage.setItem('redirectAfterLogin', 'dashboard.html')
      window.location.href = 'login.html'
      return false
    }
    return true
  }

  // Initialize dashboard if authenticated
  if (!checkAuthentication()) return

  // DOM Elements
  const uploadNoteBtn = document.getElementById('upload-note-btn')
  const addNoteBtn = document.querySelector('.add-note-btn')
  const uploadModal = document.getElementById('upload-modal')
  const closeModalBtns = document.querySelectorAll('.close-modal')
  const uploadForm = document.getElementById('upload-form')

  // Handle Upload Note Button Click
  function handleUploadClick() {
    // Check authentication before proceeding
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (isLoggedIn !== 'true') {
      localStorage.setItem('redirectAfterLogin', 'upload.html')
      window.location.href = 'login.html'
      return
    }
    
    // Redirect to upload page
    window.location.href = 'upload.html'
  }

  // Handle Add New Note Click (via modal)
  function handleAddNoteClick() {
    if (uploadModal) {
      uploadModal.style.display = 'flex'
    }
  }

  // Handle Close Modal
  function handleCloseModal() {
    if (uploadModal) {
      uploadModal.style.display = 'none'
      uploadForm?.reset()
    }
  }

  // Handle Upload Form Submission
  function handleUploadFormSubmit(e) {
    e.preventDefault()
    
    const title = document.getElementById('note-title')?.value.trim()
    const subject = document.getElementById('note-subject')?.value
    const file = document.getElementById('note-file')?.files[0]
    const tags = document.getElementById('note-tags')?.value.trim()

    // Basic validation
    if (!title || !subject || !file) {
      alert('Please fill in all required fields')
      return
    }

    // Simulate upload success
    alert(`Note "${title}" uploaded successfully! (Demo mode)`)
    handleCloseModal()
  }

  // Event Listeners
  uploadNoteBtn?.addEventListener('click', handleUploadClick)
  addNoteBtn?.addEventListener('click', handleAddNoteClick)
  uploadForm?.addEventListener('submit', handleUploadFormSubmit)
  
  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', handleCloseModal)
  })

  // Close modal when clicking outside
  uploadModal?.addEventListener('click', function(e) {
    if (e.target === uploadModal) {
      handleCloseModal()
    }
  })

  // Display user info if available
  const userEmail = localStorage.getItem('userEmail')
  if (userEmail) {
    // Update profile with actual user data if needed
    console.log('User logged in:', userEmail)
  }
})