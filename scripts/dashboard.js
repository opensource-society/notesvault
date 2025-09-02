// Student Dashboard (JavaScript)
function redirectToUploadNotes() {
    // Redirect to uploadnotes page in the same folder
    window.location.href = 'upload.html';
}

// Add event listener to the button
document.getElementById('upload-note-btn').addEventListener('click', redirectToUploadNotes);