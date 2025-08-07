document.addEventListener('DOMContentLoaded', () => {
  const notesGrid = document.getElementById('notesGrid');
  const loadingMessage = document.getElementById('loadingMessage');
  const noNotesMessage = document.getElementById('noNotesMessage');
  const noteDetailModal = document.getElementById('noteDetailModal');
  const closeModalButton = noteDetailModal.querySelector('.close-button');
  const modalNoteTitle = document.getElementById('modalNoteTitle');
  const modalNoteBranch = document.getElementById('modalNoteBranch');
  const modalNoteSemester = document.getElementById('modalNoteSemester');
  const modalNoteDescription = document.getElementById('modalNoteDescription');
  const modalNoteUploader = document.getElementById('modalNoteUploader');
  const modalNoteUploadDate = document.getElementById('modalNoteUploadDate');
  const modalDownloadButton = document.getElementById('modalDownloadButton');
  const searchInput = document.getElementById('searchInput');
  const branchFilter = document.getElementById('branchFilter');
  const semesterFilter = document.getElementById('semesterFilter');
  const sortFilter = document.getElementById('sortFilter');


  const dummyNotes = [
    {
      _id: 'note1',
      title: 'Data Structures & Algorithms Basics',
      branch: 'Computer Science',
      semester: '3rd',
      description: 'Comprehensive notes on fundamental data structures (arrays, linked lists, trees, graphs) and common algorithms (sorting, searching).',
      uploader: 'Alice Smith',
      uploadDate: '2023-03-15',
      filePath: 'http://example.com/notes/dsa_basics.pdf'
    },
    {
      _id: 'note2',
      title: 'Digital Electronics Principles',
      branch: 'Electronics Engineering',
      semester: '4th',
      description: 'Detailed notes covering logic gates, Boolean algebra, combinational and sequential circuits.',
      uploader: 'Bob Johnson',
      uploadDate: '2023-04-20',
      filePath: 'http://example.com/notes/digital_electronics.pdf'
    },
    {
      _id: 'note3',
      title: 'Thermodynamics for Mechanical Engineers',
      branch: 'Mechanical Engineering',
      semester: '5th',
      description: 'Concepts of thermodynamics, laws, cycles, and their applications in various systems.',
      uploader: 'Charlie Brown',
      uploadDate: '2023-05-10',
      filePath: 'http://example.com/notes/thermodynamics.pdf'
    },
    {
      _id: 'note4',
      title: 'Object-Oriented Programming with Java',
      branch: 'Information Technology',
      semester: '3rd',
      description: 'Introduction to OOP principles using Java: classes, objects, inheritance, polymorphism, abstraction, and encapsulation.',
      uploader: 'Alice Smith',
      uploadDate: '2023-06-01',
      filePath: 'http://example.com/notes/oop_java.pdf'
    },
    {
      _id: 'note5',
      title: 'Calculus I - Differentiation',
      branch: 'Mathematics',
      semester: '1st',
      description: 'Basic concepts of differentiation, limits, continuity, and applications.',
      uploader: 'David Lee',
      uploadDate: '2023-07-10',
      filePath: 'http://example.com/notes/calculus1.pdf'
    }
  ];
  let allNotes = [...dummyNotes];

 
  function createNoteCard(note) {
    const card = document.createElement('div');
    card.className = 'note-card';
    card.setAttribute('tabindex', '0');
    card.innerHTML = `
      <h3>${note.title}</h3>
      <p><strong>Branch:</strong> ${note.branch}</p>
      <p><strong>Semester:</strong> ${note.semester}</p>
      <p><strong>Uploaded By:</strong> ${note.uploader}</p>
      <div class="actions">
        <button class="view-button" aria-label="View note details"><i class="fas fa-eye"></i> View</button>
        <a class="download-button" href="${note.filePath}" download="${note.title.replace(/\s/g,'_')}.pdf">
          <i class="fas fa-download"></i> Download
        </a>
      </div>
    `;
    card.querySelector('.view-button').onclick = () => openNoteDetailModal(note);

    card.onkeypress = e => { if (e.key === "Enter") openNoteDetailModal(note);};
    return card;
  }

  function displayNotes(noteArr, initial = false) {
    notesGrid.innerHTML = '';
    if (!noteArr || noteArr.length === 0) {
      noNotesMessage.style.display = 'block';
      return;
    }
    noNotesMessage.style.display = 'none';
    let toDisplay = initial ? noteArr.slice(0, 3) : noteArr;
    toDisplay.forEach(note => notesGrid.appendChild(createNoteCard(note)));
  }

  async function fetchNotes() {
    loadingMessage.style.display = 'block';
    notesGrid.innerHTML = '';
    try {
      await new Promise(res => setTimeout(res, 500));
      displayNotes(allNotes, true);
    } catch {
      notesGrid.innerHTML = `<p class="error-message">Failed to load notes. Please try again later.</p>`;
    } finally {
      loadingMessage.style.display = 'none';
    }
  }

  // Function to populate filter options (example)
  function populateFilters() {
    const branches = [...new Set(allNotes.map(note => note.branch))];
    branches.forEach(branch => {
      const option = document.createElement('option');
      option.value = branch;
      option.textContent = branch;
      branchFilter.appendChild(option);
    });

    const semesters = [...new Set(allNotes.map(note => note.semester))];
      semesters.forEach(semester => {
        const option = document.createElement('option');
        option.value = semester;
        option.textContent = semester;
        semesterFilter.appendChild(option);
      });
  }

  function sortNotes(notes) {
    const sortValue = sortFilter.value;
    if (sortValue === 'oldest') {
      notes.sort((a, b) => new Date(a.uploadDate) - new Date(b.uploadDate));
    } else {
      notes.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate)); // Newest first
    }
  }

  // Event listeners for filters
  branchFilter.addEventListener('change', applyFilters);
  semesterFilter.addEventListener('change', applyFilters);
  sortFilter.addEventListener('change', applyFilters);

  function applyFilters() {
    const branchValue = branchFilter.value.toLowerCase();
    const semesterValue = semesterFilter.value.toLowerCase();

    const filteredNotes = allNotes.filter(note => {
      const branchMatch = branchValue === '' || note.branch.toLowerCase().includes(branchValue);
      const semesterMatch = semesterValue === '' || note.semester.toLowerCase().includes(semesterValue);
      return branchMatch && semesterMatch;
    });

    sortNotes(filteredNotes);
    displayNotes(filteredNotes);
  }

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase().trim();
    const filtered = allNotes.filter(note =>
      note.title.toLowerCase().includes(q) ||
      note.branch.toLowerCase().includes(q) ||
      note.semester.toLowerCase().includes(q)
    );
    displayNotes(filtered);
  });

  // Initial population of filters and notes
  populateFilters();
  fetchNotes();
});


