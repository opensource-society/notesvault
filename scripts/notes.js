document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const notesGrid = document.getElementById('notesGrid')
  const loadingMessage = document.getElementById('loadingMessage')
  const noNotesMessage = document.getElementById('noNotesMessage')
  const searchInput = document.getElementById('searchInput')
  const branchFilter = document.getElementById('branchFilter')
  const semesterFilter = document.getElementById('semesterFilter')
  const resetFiltersBtn = document.getElementById('resetFilters')
  const noteDetailModal = document.getElementById('noteDetailModal')
  const closeModalButton = noteDetailModal.querySelector('.close-button')

  // Modal Elements
  const modalElements = {
    title: document.getElementById('modalNoteTitle'),
    branch: document.getElementById('modalNoteBranch'),
    semester: document.getElementById('modalNoteSemester'),
    description: document.getElementById('modalNoteDescription'),
    uploader: document.getElementById('modalNoteUploader'),
    uploadDate: document.getElementById('modalNoteUploadDate'),
    downloadButton: document.getElementById('modalDownloadButton'),
  }

  let allNotes = []

  // Initialize Page
  async function init() {
    await fetchNotes()
    setupEventListeners()
  }

  // Fetch Notes From JSON File
  async function fetchNotes() {
    loadingMessage.style.display = 'block'
    noNotesMessage.style.display = 'none'
    notesGrid.innerHTML = ''

    try {
      const response = await fetch('../data/notes.json')
      if (!response.ok) throw new Error('Network response was not ok')

      allNotes = await response.json()
      populateFilters(allNotes)
      displayNotes(allNotes)
    } catch (error) {
      console.error('Error fetching notes:', error)
      showErrorMessage('Failed to load notes. Please try again later.')
    } finally {
      loadingMessage.style.display = 'none'
    }
  }

  // Filter Dropdown
  function populateFilters(notes) {
    const branches = [...new Set(notes.map(note => note.branch))].sort();
    const semesters = [...new Set(notes.map(note => note.semester))];

    branchFilter.innerHTML = '<option value="">All Branches</option>' +
      branches.map(branch => `<option value="${branch}">${branch}</option>`).join('');

    // Sort semesters numerically, handling strings like "Semester 1"
    semesters.sort((a, b) => {
      const numA = parseInt(String(a).match(/\d+/)?.[0] || 0, 10);
      const numB = parseInt(String(b).match(/\d+/)?.[0] || 0, 10);
      return numA - numB;
    });

    semesterFilter.innerHTML = '<option value="">All Semesters</option>' +
      semesters.map(semester => `<option value="${semester}">${semester}</option>`).join('');
  }

  // Display Notes
  function displayNotes(notes) {
    notesGrid.innerHTML = ''

    if (notes.length === 0) {
      noNotesMessage.style.display = 'block'
      return
    }

    noNotesMessage.style.display = 'none'

    const fragment = document.createDocumentFragment();
    notes.forEach((note) => {
      const noteCard = createNoteCard(note)
      fragment.appendChild(noteCard)
    })
    notesGrid.appendChild(fragment);
  }

  // Create Note Card Element
  function createNoteCard(note) {
    const noteCard = document.createElement('div')
    noteCard.classList.add('note-card')
    noteCard.setAttribute('data-note-id', note._id)

    const viewButton = document.createElement('button');
    viewButton.className = 'view-button';
    viewButton.innerHTML = '<i class="fas fa-eye"></i> &nbsp; View';
    viewButton.addEventListener('click', () => openNoteDetailModal(note));

    const downloadLink = document.createElement('a');
    downloadLink.className = 'download-button';
    downloadLink.href = note.filePath || '#';
    downloadLink.download = getDownloadFilename(note);
    downloadLink.innerHTML = '<i class="fas fa-download"></i> &nbsp; Download';

    const actions = document.createElement('div');
    actions.className = 'actions';
    actions.append(viewButton, downloadLink);

    noteCard.innerHTML = `
      <h3>${note.title}</h3>
      <p><strong>Branch:</strong> ${note.branch}</p>
      <p><strong>Semester:</strong> ${note.semester}</p>
      <p><strong>Uploaded By:</strong> ${note.uploader}</p>
    `;
    noteCard.appendChild(actions);

    return noteCard
  }

  // Generate Download Filename
  function getDownloadFilename(note) {
    return `${note.title.replace(/\s/g, '_')}.pdf`
  }

  // Open Note Modal
  function openNoteDetailModal(note) {
    modalElements.title.textContent = note.title
    modalElements.branch.textContent = note.branch
    modalElements.semester.textContent = note.semester
    modalElements.description.textContent = note.description || 'No description available'
    modalElements.uploader.textContent = note.uploader
    modalElements.uploadDate.textContent = note.uploadDate ?
      new Date(note.uploadDate).toLocaleDateString() :
      'Unknown date'

    if (note.filePath) {
      modalElements.downloadButton.href = note.filePath
      modalElements.downloadButton.setAttribute('download', getDownloadFilename(note))
      modalElements.downloadButton.style.display = 'inline-flex'
    } else {
      modalElements.downloadButton.style.display = 'none'
    }

    noteDetailModal.style.display = 'flex'
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscKey)
  }

  // Close Note Modal
  function closeNoteDetailModal() {
    noteDetailModal.style.display = 'none'
    document.body.style.overflow = 'auto'
    window.removeEventListener('keydown', handleEscKey)
  }

  const handleEscKey = (e) => {
    if (e.key === 'Escape') {
      closeNoteDetailModal();
    }
  };

  // Error Message
  function showErrorMessage(message) {
    const errorElement = document.createElement('p')
    errorElement.className = 'error-message'
    errorElement.textContent = message
    notesGrid.appendChild(errorElement)
  }

  // Filter Notes Based On All Active Filters
  function filterNotes() {
    const searchQuery = searchInput.value.toLowerCase().trim()
    const selectedBranch = branchFilter.value
    const selectedSemester = semesterFilter.value

    const filteredNotes = allNotes.filter((note) => {
      const matchesSearch =
        searchQuery === '' ||
        note.title.toLowerCase().includes(searchQuery) ||
        (note.uploader && note.uploader.toLowerCase().includes(searchQuery))
      const matchesBranch = selectedBranch === '' || note.branch === selectedBranch
      const matchesSemester = selectedSemester === '' || note.semester === selectedSemester
      return matchesSearch && matchesBranch && matchesSemester
    })

    displayNotes(filteredNotes)
  }

  // Reset All Filters
  function resetAllFilters() {
    searchInput.value = ''
    branchFilter.value = ''
    semesterFilter.value = ''
    filterNotes()
  }

  // Event Listeners
  function setupEventListeners() {
    searchInput.addEventListener('input', filterNotes)
    branchFilter.addEventListener('change', filterNotes)
    semesterFilter.addEventListener('change', filterNotes)
    resetFiltersBtn.addEventListener('click', resetAllFilters)
    closeModalButton.addEventListener('click', closeNoteDetailModal)
    window.addEventListener('click', (e) => {
      if (e.target === noteDetailModal) closeNoteDetailModal()
    })
  }

  // Initialize
  init()
})