document.addEventListener('DOMContentLoaded', () => {
  const trashNotes = JSON.parse(localStorage.getItem('trashNotes') || '[]');
  const trashContainer = document.getElementById('trash-notes-container');

  console.log("📝 Raw trashedNotes from localStorage:", localStorage.getItem('trashNotes'));
  console.log("✅ Parsed trashedNotes:", trashNotes);

  // If no trashed notes
  if (!trashNotes || trashNotes.length === 0) {
    trashContainer.innerHTML = '<p style="text-align:center; color: black;">No notes in bin</p>';
    return;
  }

  // Render each trashed note
  trashNotes.forEach(note => {
    const noteCard = document.createElement('div');
    noteCard.classList.add('note-card');
    noteCard.innerHTML = `
      <h3 style="color:black" >${note.title || 'Untitled'}</h3>
      <p>${note.content || ''}</p>
      <div class="note-actions">
        <button class="restore-btn">Restore</button>
        <button class="delete-btn">Delete Permanently</button>
      </div>
    `;

    // Restore handler
    noteCard.querySelector('.restore-btn').addEventListener('click', () => {
      restoreNoteFromTrash(note._id);
    });

    // Permanent delete handler
    noteCard.querySelector('.delete-btn').addEventListener('click', () => {
      permanentlyDeleteNote(note._id);
    });

    trashContainer.appendChild(noteCard);
  });
});

// Restore note from trash to main notes
function restoreNoteFromTrash(noteId) {
  const notes = JSON.parse(localStorage.getItem('notes') || '[]');
  let trashNotes = JSON.parse(localStorage.getItem('trashNotes') || '[]');

  const noteToRestore = trashNotes.find(n => String(n._id) === String(noteId));
  if (noteToRestore) {
    const updatedTrash = trashNotes.filter(n => String(n._id) !== String(noteId));
    notes.push(noteToRestore);

    localStorage.setItem('notes', JSON.stringify(notes));
    localStorage.setItem('trashNotes', JSON.stringify(updatedTrash));
    location.reload();
  }
}

// Permanently delete a note from trash
function permanentlyDeleteNote(noteId) {
  let trashNotes = JSON.parse(localStorage.getItem('trashNotes') || '[]');
  const updatedTrash = trashNotes.filter(n => String(n._id) !== String(noteId));

  localStorage.setItem('trashNotes', JSON.stringify(updatedTrash));
  location.reload();
}
