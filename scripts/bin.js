document.addEventListener('DOMContentLoaded', () => {
  const trashNotes = JSON.parse(localStorage.getItem('trashNotes') || '[]');
  console.log("Loaded trash notes:", trashNotes);
  const container = document.getElementById('binNotesContainer');

  if (!trashNotes.length) {
    container.innerHTML = "<p>No notes in the bin.</p>";
    return;
  }

  trashNotes.forEach(note => {
    const noteCard = document.createElement('div');
    noteCard.className = 'note-card';
    noteCard.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.description}</p>
      <p><strong>Subject:</strong> ${note.subject}</p>
      <p><strong>Type:</strong> ${note.type}</p>
      <p><strong>Date:</strong> ${note.date}</p>
      <p><strong>Year:</strong> ${note.year}</p>
    `;
    container.appendChild(noteCard);
  });
});
