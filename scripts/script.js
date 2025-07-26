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
    console.log("hii")
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
        const branchNames = allData.branches.filter(b => b.name && b.name.trim() !== "").map(b => b.name);
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