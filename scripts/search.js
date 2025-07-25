// search.js

let allNotes = [];

// Load JSON from data folder
fetch('../data/notes.json')
  .then(res => res.json())
  .then(data => {
    allNotes = data;
    populateFilters();
    displayNotes(data);
  })
  .catch(err => console.error('Error loading notes.json:', err));
function showNoteModal(note) {
  // Remove any existing modal
  const existingModal = document.getElementById('noteDetailModal');
  if (existingModal) {
    existingModal.remove();
  }

  // Create modal container
  const modalDiv = document.createElement('div');
  modalDiv.id = 'noteDetailModal';
  modalDiv.className = 'modal';

  // Fill modal HTML
  modalDiv.innerHTML = `
    <div class="modal-content">
      <span class="close-button">&times;</span>
      <h2 id="modalNoteTitle">${note.title}</h2>
      <p><strong>Branch:</strong> <span id="modalNoteBranch">${note.branch}</span></p>
      <p><strong>Semester:</strong> <span id="modalNoteSemester">${note.semester}</span></p>
      <p><strong>Description:</strong> <span id="modalNoteDescription">${note.description}</span></p>
      <p><strong>Uploaded By:</strong> <span id="modalNoteUploader">${note.uploader}</span></p>
      <p><strong>Upload Date:</strong> <span id="modalNoteUploadDate">${note.uploadDate}</span></p>
      <a id="modalDownloadButton" class="download-button" href="${note.downloadLink}" download>
        <i class="fas fa-download"></i> Download Note
      </a>
    </div>
  `;

  // Append to body
  document.body.appendChild(modalDiv);

  // Add close event
  modalDiv.querySelector('.close-button').addEventListener('click', () => {
    modalDiv.remove();
  });
}

// Function to display filtered/searched notes
function displayNotes(notes) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  if (notes.length === 0) {
    resultsDiv.innerHTML = '<p>No notes found.</p>';
    return;
  }

  notes.forEach(note => {
    const noteDiv = document.createElement('div');
    noteDiv.classList.add('note');

    noteDiv.innerHTML = `
      <h3>${note.title}</h3>
      <p><strong>Branch:</strong> ${note.branch}</p>
      <p><strong>Semester:</strong> ${note.semester}</p>
      <p><strong>Subject:</strong> ${note.subject}</p>
      <button class="view-details">View Full Details</button>
    `;

    noteDiv.querySelector('.view-details').addEventListener('click', () => {
      showNoteModal(note);
    });

    resultsDiv.appendChild(noteDiv);


  // Handle modal opening
  noteDiv.querySelector('.view-details').addEventListener('click', () => {
    document.getElementById('modalNoteTitle').textContent = note.title;
    document.getElementById('modalNoteBranch').textContent = note.branch;
    document.getElementById('modalNoteSemester').textContent = note.semester;
    document.getElementById('modalNoteDescription').textContent = note.subject;
    document.getElementById('modalNoteUploader').textContent = note.uploader || "Unknown";
    document.getElementById('modalNoteUploadDate').textContent = note.date || "N/A";
    document.getElementById('modalDownloadButton').href = note.link;

    document.getElementById('noteDetailModal').style.display = 'block';
  });
});

// Modal close button
document.querySelector('.close-button').addEventListener('click', () => {
  document.getElementById('noteDetailModal').style.display = 'none';
});

}

// Populate filters dynamically from data
function populateFilters() {
  const branchSet = new Set();
  const semesterSet = new Set();
  const subjectSet = new Set();

  allNotes.forEach(note => {
    branchSet.add(note.branch);
    semesterSet.add(note.semester);
    subjectSet.add(note.subject);
  });

  populateSelect('branchFilter', branchSet);
  populateSelect('semesterFilter', semesterSet);
  populateSelect('subjectFilter', subjectSet);
}

// Helper to populate select options
function populateSelect(id, itemsSet) {
  const select = document.getElementById(id);
  itemsSet.forEach(item => {
    const option = document.createElement('option');
    option.value = item;
    option.textContent = item;
    select.appendChild(option);
  });
}

// Filter notes based on dropdowns
function filterNotes() {
  const branch = document.getElementById('branchFilter').value;
  const semester = document.getElementById('semesterFilter').value;
  const subject = document.getElementById('subjectFilter').value;

  let filtered = allNotes;

  if (branch) {
    filtered = filtered.filter(note => note.branch === branch);
  }
  if (semester) {
    filtered = filtered.filter(note => note.semester === semester);
  }
  if (subject) {
    filtered = filtered.filter(note => note.subject === subject);
  }

  displayNotes(filtered);
}

// Search notes by keyword in title or subject
function searchNotes() {
  const keyword = document.getElementById('searchInput').value.toLowerCase();
  const results = allNotes.filter(note =>
    note.title.toLowerCase().includes(keyword) ||
    note.subject.toLowerCase().includes(keyword)
  );
  displayNotes(results);
}
