// Dashboard (JavaScript)

document.addEventListener('DOMContentLoaded', function () {
  // Check if user is logged in
  const token = localStorage.getItem('token')
  const username = localStorage.getItem('username')
  const userId = localStorage.getItem('userId')

  if (!token || !username || !userId) {
    window.location.href = 'login.html'
    return
  }

  // DOM Elements
  const profileName = document.querySelector('.profile-info h2')
  const profileEmail = document.querySelector('.profile-info .email')
  const notesGrid = document.querySelector('.notes-grid')
  const uploadBtn = document.getElementById('upload-note-btn')
  const uploadModal = document.getElementById('upload-modal')
  const closeModalBtn = uploadModal.querySelector('.close-modal')
  const uploadForm = document.getElementById('upload-form')
  const editModal = document.getElementById('edit-modal')
  const editForm = document.getElementById('edit-form')
  const logoutBtn = document.querySelector('.logout-btn') // Assuming there's a logout button

  // Initialize
  initDashboard()

  function initDashboard() {
    // Update profile
    profileName.textContent = username
    profileEmail.textContent = 'user@example.com' // Placeholder, as backend doesn't have email in response

    // Load notes
    loadNotes()

    // Load categories for upload form
    loadCategories()

    // Setup event listeners
    setupEventListeners()
  }

  function setupEventListeners() {
    uploadBtn.addEventListener('click', () => {
      uploadModal.style.display = 'flex'
    })

    closeModalBtn.addEventListener('click', () => {
      uploadModal.style.display = 'none'
    })

    uploadForm.addEventListener('submit', handleUpload)

    // Edit modal
    const editCloseBtn = editModal.querySelector('.close-modal')
    editCloseBtn.addEventListener('click', () => {
      editModal.style.display = 'none'
    })

    editForm.addEventListener('submit', handleEdit)

    // Close modal on outside click
    window.addEventListener('click', (e) => {
      if (e.target === uploadModal) {
        uploadModal.style.display = 'none'
      }
      if (e.target === editModal) {
        editModal.style.display = 'none'
      }
    })

    // Logout
    if (logoutBtn) {
      logoutBtn.addEventListener('click', handleLogout)
    }
  }

  async function loadNotes() {
    try {
      const response = await fetch('../../backend/api/notes/read.php', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (response.ok) {
        displayNotes(data.data)
        updateStats(data.data)
      } else {
        console.error('Failed to load notes:', data.error)
      }
    } catch (error) {
      console.error('Error loading notes:', error)
    }
  }

  function displayNotes(notes) {
    // Remove existing notes except the add button
    const addNoteCard = notesGrid.querySelector('.add-note-card')
    notesGrid.innerHTML = ''
    notesGrid.appendChild(addNoteCard)

    notes.forEach(note => {
      const noteCard = createNoteCard(note)
      notesGrid.insertBefore(noteCard, addNoteCard)
    })
  }

  function createNoteCard(note) {
    const noteCard = document.createElement('div')
    noteCard.classList.add('note-card')
    noteCard.innerHTML = `
      <div class="note-header">
        <i class="fas fa-file-alt note-icon"></i>
        <div class="note-actions">
          <button class="icon-btn edit-btn" data-id="${note.id}"><i class="fas fa-edit"></i></button>
          <button class="icon-btn delete-btn" data-id="${note.id}"><i class="fas fa-trash"></i></button>
        </div>
      </div>
      <div class="note-body">
        <h3>${note.title}</h3>
        <p class="note-description">${note.content.substring(0, 100)}...</p>
      </div>
      <div class="note-footer">
        <span class="note-date">Created: ${new Date(note.created_at).toLocaleDateString()}</span>
        <div class="note-tags">
          <span class="tag">${note.category_name || 'Uncategorized'}</span>
        </div>
      </div>
    `

    // Add event listeners
    noteCard.querySelector('.edit-btn').addEventListener('click', () => editNote(note))
    noteCard.querySelector('.delete-btn').addEventListener('click', () => deleteNote(note.id))

    return noteCard
  }

  function updateStats(notes) {
    const notesCount = notes.length
    const subjectsCount = new Set(notes.map(n => n.category_id)).size

    document.querySelector('.stat-value').textContent = notesCount // Notes
    document.querySelectorAll('.stat-value')[1].textContent = '0' // PYQs placeholder
    document.querySelectorAll('.stat-value')[2].textContent = subjectsCount // Subjects
    document.querySelectorAll('.stat-value')[3].textContent = '0%' // Completion placeholder
  }

  async function loadCategories() {
    try {
      const response = await fetch('../../backend/api/categories/read.php', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (response.ok) {
        populateCategorySelect(data.data)
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  function populateCategorySelect(categories) {
    const selects = ['note-subject', 'edit-note-subject']
    selects.forEach(selectId => {
      const select = document.getElementById(selectId)
      if (select) {
        select.innerHTML = '<option value="">Select subject</option>'
        categories.forEach(cat => {
          const option = document.createElement('option')
          option.value = cat.id
          option.textContent = cat.name
          select.appendChild(option)
        })
      }
    })
  }

  async function handleUpload(e) {
    e.preventDefault()

    const formData = new FormData(uploadForm)
    const title = formData.get('title')
    const content = formData.get('content') // Assuming textarea for content
    const categoryId = formData.get('subject')

    if (!title || !content) {
      alert('Title and content are required')
      return
    }

    try {
      const response = await fetch('../../backend/api/notes/create.php', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          content,
          category_id: categoryId || null,
          is_private: false
        })
      })

      const data = await response.json()

      if (response.ok) {
        uploadModal.style.display = 'none'
        uploadForm.reset()
        loadNotes() // Reload notes
      } else {
        alert(data.error || 'Failed to create note')
      }
    } catch (error) {
      console.error('Error creating note:', error)
      alert('Error creating note')
    }
  }

  function editNote(note) {
    // Open edit modal and populate fields
    editModal.style.display = 'flex'
    document.getElementById('edit-note-id').value = note.id
    document.getElementById('edit-note-title').value = note.title
    document.getElementById('edit-note-content').value = note.content
    document.getElementById('edit-note-subject').value = note.category_id || ''
  }

  async function handleEdit(e) {
    e.preventDefault()

    const id = document.getElementById('edit-note-id').value
    const title = document.getElementById('edit-note-title').value.trim()
    const content = document.getElementById('edit-note-content').value.trim()
    const categoryId = document.getElementById('edit-note-subject').value

    if (!title || !content) {
      alert('Title and content are required')
      return
    }

    try {
      const response = await fetch('../../backend/api/notes/update.php', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id,
          title,
          content,
          category_id: categoryId || null,
          is_private: false
        })
      })

      const data = await response.json()

      if (response.ok) {
        editModal.style.display = 'none'
        editForm.reset()
        loadNotes() // Reload notes
      } else {
        alert(data.error || 'Failed to update note')
      }
    } catch (error) {
      console.error('Error updating note:', error)
      alert('Error updating note')
    }
  }

  async function deleteNote(noteId) {
    if (!confirm('Are you sure you want to delete this note?')) return

    try {
      const response = await fetch('../../backend/api/notes/delete.php', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: noteId })
      })

      if (response.ok) {
        loadNotes() // Reload notes
      } else {
        alert('Failed to delete note')
      }
    } catch (error) {
      console.error('Error deleting note:', error)
      alert('Error deleting note')
    }
  }

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('userId')
    window.location.href = 'login.html'
  }
})
