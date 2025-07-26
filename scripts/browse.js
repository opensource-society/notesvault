document.addEventListener('DOMContentLoaded', () => {
    const notesGrid = document.getElementById('notesGrid');
    const noteDetailModal = document.getElementById('noteDetailModal');
    
    if (!notesGrid || !noteDetailModal) return; // Only run on browse page

    const closeModalButton = noteDetailModal.querySelector('.close-button');

    async function fetchNotes() {
        // In a real app, fetch from: const response = await fetch('/api/notes');
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
        return getDummyNotes();
    }

    function renderNotes(notes) {
        notesGrid.innerHTML = ''; // Clear loader
        if (notes.length === 0) {
            notesGrid.innerHTML = `<p class="no-notes-message">No notes found.</p>`;
            return;
        }
        notes.forEach(note => {
            const noteCard = createNoteCard(note);
            notesGrid.appendChild(noteCard);
        });
    }

    function createNoteCard(note) {
        const card = document.createElement('div');
        card.className = 'note-card';
        card.innerHTML = `
            <h3>${note.title}</h3>
            <div class="note-card-meta"><span><strong>Branch:</strong> ${note.branch}</span></div>
            <p class="note-card-uploader">Uploaded by: ${note.uploader}</p>
            <div class="actions">
                <button class="view-button"><i class="fas fa-eye"></i> View Details</button>
            </div>`;
        card.querySelector('.view-button').addEventListener('click', () => openNoteDetailModal(note));
        return card;
    }

    function openNoteDetailModal(note) {
        document.getElementById('modalNoteTitle').textContent = note.title;
        document.getElementById('modalNoteBranch').textContent = note.branch;
        document.getElementById('modalNoteSemester').textContent = note.semester;
        document.getElementById('modalNoteDescription').textContent = note.description;
        document.getElementById('modalNoteUploader').textContent = note.uploader;
        document.getElementById('modalNoteUploadDate').textContent = new Date(note.uploadDate).toLocaleDateString();
        document.getElementById('modalDownloadButton').href = note.filePath;
        noteDetailModal.style.display = 'flex';
    }

    function closeNoteDetailModal() {
        noteDetailModal.style.display = 'none';
    }

    closeModalButton.addEventListener('click', closeNoteDetailModal);
    window.addEventListener('click', (event) => {
        if (event.target === noteDetailModal) closeNoteDetailModal();
    });

    // Initial Load
    fetchNotes().then(renderNotes).catch(console.error);
});

function getDummyNotes() {
    return [
        { _id: 'note1', title: 'Data Structures & Algorithms', branch: 'Computer Science', semester: '3rd', description: 'Comprehensive notes on fundamental data structures and algorithms.', uploader: 'Alice Smith', uploadDate: '2023-03-15', filePath: '#'},
        { _id: 'note2', title: 'Digital Electronics', branch: 'Electronics', semester: '4th', description: 'Detailed notes covering logic gates, circuits, and Boolean algebra.', uploader: 'Bob Johnson', uploadDate: '2023-04-20', filePath: '#'},
        { _id: 'note3', title: 'Thermodynamics', branch: 'Mechanical', semester: '5th', description: 'Concepts of thermodynamics, laws, cycles, and their applications.', uploader: 'Charlie Brown', uploadDate: '2023-05-10', filePath: '#'},
    ];
}
