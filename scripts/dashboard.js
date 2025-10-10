// dashboard.js
document.addEventListener('DOMContentLoaded', function () {
  // Elements
  const uploadBtn = document.getElementById('upload-note-btn'); // dashboard button
  const modal = document.getElementById('upload-modal');
  const closeModalBtns = document.querySelectorAll('.close-modal');
  const fileInput = document.getElementById('note-file');
  const uploadForm = document.getElementById('upload-form');
  const preview = document.createElement('div'); // preview inside modal

  // Add preview container to modal body
  const modalBody = modal.querySelector('.modal-body');
  modalBody.appendChild(preview);
  preview.id = 'upload-preview';
  preview.style.marginTop = '0.5rem';

  // Dashboard button triggers file input
  uploadBtn.addEventListener('click', () => {
    // Open modal
    modal.style.display = 'block';
    // Trigger file input click
    fileInput.click();
  });

  // Close modal on clicking 'x' or Cancel buttons
  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.style.display = 'none';
      uploadForm.reset();
      preview.textContent = '';
    });
  });

  // Close modal if clicking outside modal content
  window.addEventListener('click', e => {
    if (e.target === modal) {
      modal.style.display = 'none';
      uploadForm.reset();
      preview.textContent = '';
    }
  });

  // Show selected file name inside modal
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      preview.style.color = 'green';
      preview.textContent = `Selected file: ${fileInput.files[0].name}`;
    } else {
      preview.textContent = '';
    }
  });

  // Handle form submission inside modal
  uploadForm.addEventListener('submit', e => {
    e.preventDefault();
    const title = document.getElementById('note-title').value.trim();
    const subject = document.getElementById('note-subject').value;
    const file = fileInput.files[0];

    if (!title || !subject || !file) {
      preview.style.color = 'red';
      preview.textContent = 'Please fill all fields and select a file!';
      return;
    }

    // Simulate upload success
    preview.style.color = 'green';
    preview.textContent = `Notes "${title}" uploaded successfully!`;

    // Reset form after 2 seconds and close modal
    setTimeout(() => {
      uploadForm.reset();
      preview.textContent = '';
      modal.style.display = 'none';
    }, 2000);
  });
});
