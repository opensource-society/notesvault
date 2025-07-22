document.addEventListener("DOMContentLoaded", function () {
  // Mock data — Replace with actual API call or localStorage
  const studentData = {
    name: "John Doe",
    email: "johndoe@example.com",
    college: "ABC Institute of Technology",
    branch: "Computer Science",
    year: "3rd Year",
    notes: {
      lectures: ["DBMS - Normalization.pdf", "Operating Systems - Deadlock.ppt"],
      pyqs: ["CS201 - Midterm 2022.pdf", "CS303 - Final 2021.docx"]
    }
  };

  // Populate student details
  const profileSection = document.querySelector(".profile");
  profileSection.innerHTML = `
    <h2>👤 Student Details</h2>
    <p><strong>Name:</strong> ${studentData.name}</p>
    <p><strong>Email:</strong> ${studentData.email}</p>
    <p><strong>College:</strong> ${studentData.college}</p>
    <p><strong>Branch:</strong> ${studentData.branch}</p>
    <p><strong>Year:</strong> ${studentData.year}</p>
  `;

  // Populate saved notes
  const notesSection = document.querySelector(".notes-section");
  notesSection.innerHTML = `
    <h2>💾 Saved Notes</h2>
    <div class="note-card">
      <h3>Lecture Notes</h3>
      <ul>${studentData.notes.lectures.map(note => `<li>${note}</li>`).join("")}</ul>
      <button>➕ Add More</button>
    </div>
    <div class="note-card">
      <h3>Previous Year Questions (PYQs)</h3>
      <ul>${studentData.notes.pyqs.map(note => `<li>${note}</li>`).join("")}</ul>
      <button>➕ Add More</button>
    </div>
  `;
});
