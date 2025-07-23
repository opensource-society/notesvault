// scripts/upload.js
document.getElementById('uploadForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const subject = document.getElementById('subject').value;
  const file = document.getElementById('file').files[0];

  if (file) {
    document.getElementById('uploadStatus').textContent =
      `Uploading "${title}" for subject "${subject}"... (Simulated) 📄`;
  } else {
    document.getElementById('uploadStatus').textContent = "No file selected.";
  }
});
