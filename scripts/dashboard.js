document.addEventListener('DOMContentLoaded', function () {
  const addNoteCard = document.querySelector('.add-note-card');
  const notesGrid = document.querySelector('.notes-grid');

  // Create the inline form HTML
  const formHTML = `
    <form class="inline-upload-form" style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem; padding: 1rem; border: 1px solid #ddd; border-radius: 0.5rem; background-color: #f9f9f9;">
      <input type="text" name="title" placeholder="Note Title" required style="padding: 0.5rem;"/>
      <select name="subject" required style="padding: 0.5rem;">
        <option value="">Select Subject</option>
        <option value="Database Management">Database Management</option>
        <option value="Operating Systems">Operating Systems</option>
        <option value="Data Structures">Data Structures</option>
      </select>
      <input type="text" name="tags" placeholder="Tags (comma separated)" style="padding: 0.5rem;"/>
      <input type="file" name="file" accept=".pdf,.doc,.docx,.ppt,.pptx" required style="padding: 0.5rem;"/>
      <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
        <button type="button" class="cancel-btn" style="padding: 0.5rem;">Cancel</button>
        <button type="submit" style="padding: 0.5rem; background-color:#008c2c; color:white; border:none;">Upload</button>
      </div>
      <div class="form-preview" style="margin-top:0.5rem;"></div>
    </form>
  `;

  // Expand form when Add Note Card is clicked
  addNoteCard.addEventListener('click', () => {
    // Prevent adding multiple forms
    if (addNoteCard.querySelector('form')) return;

    addNoteCard.insertAdjacentHTML('beforeend', formHTML);

    const form = addNoteCard.querySelector('form');
    const preview = form.querySelector('.form-preview');
    const cancelBtn = form.querySelector('.cancel-btn');

    // Cancel button removes the form
    cancelBtn.addEventListener('click', () => {
      form.remove();
    });

    // Handle form submission
    form.addEventListener('submit', e => {
      e.preventDefault();

      const title = form.title.value.trim();
      const subject = form.subject.value;
      const tags = form.tags.value
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');
      const file = form.file.files[0];

      if (!title || !subject || !file) {
        preview.style.color = 'red';
        preview.textContent = 'Please fill all fields and select a file!';
        return;
      }

      // Determine icon based on file type
      let fileIcon = 'fas fa-file';
      const fileExt = file.name.split('.').pop().toLowerCase();
      if (fileExt === 'pdf') fileIcon = 'fas fa-file-pdf';
      else if (fileExt === 'ppt' || fileExt === 'pptx') fileIcon = 'fas fa-file-powerpoint';
      else if (fileExt === 'doc' || fileExt === 'docx') fileIcon = 'fas fa-file-word';

      const today = new Date();
      const uploadedDate = `${today.getDate()} ${today.toLocaleString('default', { month: 'short' })} ${today.getFullYear()}`;

      // Create new note card
      const newNoteCard = document.createElement('div');
      newNoteCard.classList.add('note-card');
      newNoteCard.innerHTML = `
        <div class="note-header">
          <i class="${fileIcon} note-icon"></i>
          <div class="note-actions">
            <button class="icon-btn"><i class="fas fa-download"></i></button>
            <button class="icon-btn"><i class="fas fa-share-alt"></i></button>
            <button class="icon-btn"><i class="fas fa-ellipsis-v"></i></button>
          </div>
        </div>
        <div class="note-body">
          <h3>${title}</h3>
          <p class="note-meta">${subject} • ${(file.size / (1024*1024)).toFixed(1)} MB</p>
          <p class="note-description">Uploaded file: ${file.name}</p>
        </div>
        <div class="note-footer">
          <span class="note-date">Uploaded: ${uploadedDate}</span>
          <div class="note-tags">
            ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
        </div>
      `;

      // Insert new note before Add Note Card
      notesGrid.insertBefore(newNoteCard, addNoteCard);

      // Remove the form after submission
      form.remove();
    });
  });
});
