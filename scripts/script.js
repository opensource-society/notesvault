document.addEventListener("DOMContentLoaded", function () {
  // --- Data Storage ---
  // This will hold the entire data structure from parameters.json
  let allData = {};

  // --- Element References ---
  const searchBranchContainer = document.getElementById("search-parameters-branch");
  const searchSemesterContainer = document.getElementById("search-parameters-semester");
  const searchSubjectContainer = document.getElementById("search-parameters-subject");

  // --- Helper Function to create dropdowns (to avoid repeating code) ---
  function createDropdown(container, id, defaultText, options) {
    // Clear the container first
    container.innerHTML = '';

    // Create the <select> element
    const select = document.createElement("select");
    select.id = id;
    select.className = "search-parameters-select";

    // Create the disabled default option
    const defaultOption = document.createElement("option");
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.innerHTML = defaultText;
    select.appendChild(defaultOption);

    // Create options from the provided array
    options.forEach(opt => {
      const option = document.createElement("option");
      option.value = opt;
      option.innerHTML = opt;
      select.appendChild(option);
    });

    // Add the new dropdown to the page
    container.appendChild(select);
    return select; // Return the created select element
  }

  // --- Functions to Update Dropdowns ---

  // Function to update the Semester dropdown based on the selected Branch
  function updateSemesters() {
    const selectedBranch = document.getElementById("selectBranch").value;
    let semesterNames = [];

    // Clear the subsequent dropdowns
    searchSemesterContainer.innerHTML = '';
    searchSubjectContainer.innerHTML = '';

    // Find the selected branch in our data and get its semesters
    const branchData = allData.branches.find(b => b.name === selectedBranch);
    if (branchData && branchData.semesters) {
      semesterNames = branchData.semesters.map(sem => sem.semester);
    }

    // Create the new semester dropdown
    const semesterSelect = createDropdown(searchSemesterContainer, "selectSemester", "Select Semester", semesterNames);

    // IMPORTANT: Add an event listener to the NEW semester dropdown
    semesterSelect.addEventListener("change", updateSubjects);
  }

  // Function to update the Subject dropdown based on the selected Semester
  function updateSubjects() {
    const selectedBranch = document.getElementById("selectBranch").value;
    const selectedSemester = document.getElementById("selectSemester").value;
    let subjectNames = [];

    // Clear the subject dropdown
    searchSubjectContainer.innerHTML = '';

    // Find the selected branch and semester to get the subjects
    const branchData = allData.branches.find(b => b.name === selectedBranch);
    if (branchData && branchData.semesters) {
      const semesterData = branchData.semesters.find(sem => sem.semester == selectedSemester);
      if (semesterData && semesterData.subjects) {
        // Extracts the name of the subject
        subjectNames = semesterData.subjects.map(sub => Object.values(sub)[0]);
      }
    }

    // Create the new subject dropdown
    createDropdown(searchSubjectContainer, "selectSubject", "Select Subject", subjectNames);
  }

  // --- Main Logic: Fetch data and initialize the first dropdown ---
  fetch("data/search_parameters/parameters.json")
      .then(res => res.json())
      .then(data => {
        allData = data; // Store all data globally within this script's scope
        const branchNames = allData.branches.map(b => b.name);
        const branchSelect = createDropdown(searchBranchContainer, "selectBranch", "Select Branch", branchNames);

        // Add the event listener to the main branch dropdown
        branchSelect.addEventListener("change", updateSemesters);
      })
      .catch(error => console.error("Error fetching parameters:", error));


  // --- Typewriter Effect ---
  // This is the single, corrected typewriter function
  const words = ["Branch", "Semester", "Subject", "Year"];
  let currentWordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeWriterEffect() {
    const currentWord = words[currentWordIndex];
    const typewriterElement = document.getElementById('typeWriterText');

    if (!typewriterElement) return; // Stop if the element doesn't exist

    if (isDeleting) {
      typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }


    let typeSpeed = isDeleting ? 75 : 150; // Slower, more natural speeds

    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 2000; // Pause after typing a word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      currentWordIndex = (currentWordIndex + 1) % words.length;
      typeSpeed = 500; // Pause before starting a new word
    }

    setTimeout(typeWriterEffect, typeSpeed);
  }

  // Start the typewriter
  typeWriterEffect();

  // --- Mobile Menu Toggle Functionality ---
  const nav = document.getElementById('header-navigation');
  const hamburger = document.getElementById('hamburgerMenu');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      nav.classList.toggle('show');
      hamburger.classList.toggle('active');
    });
  }

  document.addEventListener('click', function (event) {
    if (nav && hamburger && !nav.contains(event.target) && !hamburger.contains(event.target)) {
      nav.classList.remove('show');
      hamburger.classList.remove('active');
    }
  });

  // --- Theme Toggle ---
  function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }

  const themeToggleButton = document.getElementById('themeToggle');
  if (themeToggleButton) {
    themeToggleButton.addEventListener('click', toggleTheme);
  }

  // Initialize theme on page load
  (function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', savedTheme || (prefersDark ? 'dark' : 'light'));
  })();

  document.querySelectorAll(".upload-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      window.location.href = "upload.html";
    });
  });



  // Update the DOMContentLoaded event listener to include theme initialization



  const branchFilter = document.getElementById("branch-filter");
  const semesterFilter = document.getElementById("semester-filter");
  const subjectFilter = document.getElementById("subject-filter");
  const notesContainer = document.getElementById("notes-container");

  const subjectMap = {
    "CSE": ["Maths", "DBMS", "OS", "DSA"],
    "CSE AIML": ["AI", "ML", "Python"],
    "CSE IOT": ["IoT Fundamentals", "Sensors", "Microcontrollers"],
    "CSE DS": ["Data Science Basics", "Statistics", "Python for DS"]
  };

  let notesData = [];

  fetch("data/notes.json")
    .then(res => res.json())
    .then(data => {
      notesData = data;
      updateSubjects("");
      displayNotes(notesData);
      runQuerySearch();
    });

  function updateSubjects(branch) {
    subjectFilter.innerHTML = '<option value="">All Subjects</option>';
    const subjects = subjectMap[branch] || [].concat(...Object.values(subjectMap));
    [...new Set(subjects)].forEach(sub => {
      const opt = document.createElement("option");
      opt.value = sub;
      opt.textContent = sub;
      subjectFilter.appendChild(opt);
    });
  }

fetch("data/notes.json")
  .then(res => res.json())
  .then(data => {
    notesData = data;
  updateFilterSubjects("");
    displayNotes(notesData);
    runQuerySearch();
  });

function updateFilterSubjects(branch) {
  subjectFilter.innerHTML = '<option value="">All Subjects</option>';
  const subjects = subjectMap[branch] || [].concat(...Object.values(subjectMap));
  // [...new Set(subjects)].forEach(sub => {
  //   const opt = document.createElement("option");
  //   opt.value = sub;
  //   opt.textContent = sub;
  //   subjectFilter.appendChild(opt);
  // });
  [...new Set(subjects)]
  .sort((a, b) => a.localeCompare(b)) // Sort alphabetically
  .forEach(sub => {
    const opt = document.createElement("option");
    opt.value = sub;
    opt.textContent = sub;
    subjectFilter.appendChild(opt);
});

}


// function displayNotes(notes) {
//   notesContainer.innerHTML = notes.length === 0 ? "<p>No notes found.</p>" : "";
//   notes.forEach(note => {
//     const card = document.createElement("div");
//     card.className = "note-card";
//     card.innerHTML = `
//       <h3>${note.title}</h3>
//       <p><strong>Branch:</strong> ${note.branch}</p>
//       <p><strong>Semester:</strong> ${note.semester}</p>
//       <p><strong>Subject:</strong> ${note.subject}</p>
//       <a href="${note.link}" target="_blank" download>Download</a>
//     `;
//     notesContainer.appendChild(card);
//   });
// }
function displayNotes(notes) {
  notesContainer.innerHTML = notes.length === 0 ? "<p>No notes found.</p>" : "";

  notes
    .sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()))
    .forEach(note => {
      const card = document.createElement("div");
      card.className = "note-card";
      card.innerHTML = `
        <h3>${note.title}</h3>
        <p><strong>Branch:</strong> ${note.branch}</p>
        <p><strong>Semester:</strong> ${note.semester}</p>
        <p><strong>Subject:</strong> ${note.subject}</p>
        <a href="${note.link}" target="_blank" download>Download</a>
      `;
      notesContainer.appendChild(card);
    });
}


  function displayNotes(notes) {
    notesContainer.innerHTML = notes.length === 0 ? "<p>No notes found.</p>" : "";

    const bookmarked = JSON.parse(localStorage.getItem("bookmarkedNotes") || "[]");

    notes.forEach(note => {
      const card = document.createElement("div");
      card.className = "note-card";

      const isBookmarked = bookmarked.includes(note.title); // assuming title is unique

      card.innerHTML = `
      <div>
  <h3>${note.title}</h3>
  <p><strong>Branch:</strong> ${note.branch}</p>
  <p><strong>Semester:</strong> ${note.semester}</p>
  <p><strong>Subject:</strong> ${note.subject}</p>
    <div class="rating" data-id="${note.title}">
      ${[1, 2, 3, 4, 5].map(i => `<span class="star" data-value="${i}">&#9733;</span>`).join('')}
    </div>
  </div>
  <div class="mark">
  <a href="${note.link}" target="_blank" download>Download</a>
  <button class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" data-id="${note.title}">
  ${isBookmarked ? "★ Bookmarked" : "☆ Bookmark"}
  </button>
  </div>
`;


      notesContainer.appendChild(card);
    });

    // Add event listeners to bookmark buttons
    document.querySelectorAll(".bookmark-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        let bookmarks = JSON.parse(localStorage.getItem("bookmarkedNotes") || "[]");

        if (bookmarks.includes(id)) {
          bookmarks = bookmarks.filter(b => b !== id);
          btn.textContent = "☆ Bookmark";
          btn.classList.remove("bookmarked");
        } else {
          bookmarks.push(id);
          btn.textContent = "★ Bookmarked";
          btn.classList.add("bookmarked");
        }

        localStorage.setItem("bookmarkedNotes", JSON.stringify(bookmarks));
      });
    });
    // Add event listeners to star ratings
    document.querySelectorAll(".rating").forEach(rating => {
      const noteId = rating.dataset.id;
      const saved = localStorage.getItem(`rating_${noteId}`);

      if (saved) highlightStars(rating, saved);

      rating.querySelectorAll(".star").forEach(star => {
        star.addEventListener("click", () => {
          const value = star.dataset.value;
          localStorage.setItem(`rating_${noteId}`, value);
          highlightStars(rating, value);
        });
      });
    });

    function highlightStars(container, rating) {
      const stars = container.querySelectorAll(".star");
      stars.forEach(star => {
        star.classList.toggle("filled", star.dataset.value <= rating);
      });
    }

  }



  [branchFilter, semesterFilter, subjectFilter].forEach(filter => {
    filter.addEventListener("change", () => {
      const branchVal = branchFilter.value;
      if (filter === branchFilter) updateSubjects(branchVal);
      const filtered = notesData.filter(note =>
        (branchVal === "" || note.branch === branchVal) &&
        (semesterFilter.value === "" || note.semester === semesterFilter.value) &&
        (subjectFilter.value === "" || note.subject === subjectFilter.value)
      );
      displayNotes(filtered);
    });



[branchFilter, semesterFilter, subjectFilter].forEach(filter => {
  filter.addEventListener("change", () => {
    const branchVal = branchFilter.value;
    if (filter === branchFilter) updateFilterSubjects(branchVal);
    const filtered = notesData.filter(note =>
      (branchVal === "" || note.branch === branchVal) &&
      (semesterFilter.value === "" || note.semester === semesterFilter.value) &&
      (subjectFilter.value === "" || note.subject === subjectFilter.value)
    );
    displayNotes(filtered);

  });

document.addEventListener('DOMContentLoaded', function() {
  var easyUploadCard = document.querySelector('.easy-upload-card');
  if (easyUploadCard) {
    easyUploadCard.style.cursor = 'pointer';
    easyUploadCard.addEventListener('click', function() {
      window.location.href = '/upload.html';
    });
  }
});

});

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("query")?.trim().toLowerCase();

  if (query) {
    const notes = document.querySelectorAll(".note-card");
    let matchFound = false;

    notes.forEach((note) => {
      const content = note.textContent.toLowerCase();
      const show = content.includes(query);
      note.style.display = show ? "block" : "none";
      if (show) matchFound = true;
    });

    if (!matchFound) {
      const msg = document.createElement("p");
      msg.textContent = `No notes found for "${query}"`;
      msg.style.color = "red";
      msg.style.fontWeight = "bold";
      msg.style.marginTop = "20px";
      document.getElementById("notes-container").appendChild(msg);
    }
  }
});

function runQuerySearch() {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("query")?.trim().toLowerCase();

  if (query) {
    const notes = document.querySelectorAll(".note-card");
    let matchFound = false;

    notes.forEach((note) => {
      const content = note.textContent.toLowerCase();
      const show = content.includes(query);
      note.style.display = show ? "block" : "none";
      if (show) matchFound = true;
    });

    if (!matchFound) {
      const msg = document.createElement("p");
      msg.textContent = `No notes found for "${query}"`;
      msg.style.color = "red";
      msg.style.fontWeight = "bold";
      msg.style.marginTop = "20px";
      document.getElementById("notes-container").appendChild(msg);
    }
  }
}

