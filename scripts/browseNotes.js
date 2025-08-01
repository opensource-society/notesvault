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


  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase().trim();
    const filtered = allNotes.filter(note =>
      note.title.toLowerCase().includes(q) ||
      note.branch.toLowerCase().includes(q) ||
      note.semester.toLowerCase().includes(q)
    );
    displayNotes(filtered);
  });


  function openNoteDetailModal(note) {
    modalNoteTitle.textContent = note.title;
    modalNoteBranch.textContent = note.branch;
    modalNoteSemester.textContent = note.semester;
    modalNoteDescription.textContent = note.description;
    modalNoteUploader.textContent = note.uploader;
    modalNoteUploadDate.textContent = new Date(note.uploadDate).toLocaleDateString();
    modalDownloadButton.href = note.filePath;
    modalDownloadButton.setAttribute('download', `${note.title.replace(/\s/g, '_')}.pdf`);
    noteDetailModal.style.display = 'flex';
  }
  function closeNoteDetailModal() { noteDetailModal.style.display = 'none'; }
  closeModalButton.onclick = closeNoteDetailModal;
  window.onclick = (event) => { if (event.target === noteDetailModal) closeNoteDetailModal(); };

  fetchNotes();
});