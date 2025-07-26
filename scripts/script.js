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
  const hamburger = document.querySelector('.hamburger-menu'); // Corrected selector for hamburger

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

  // This block was a duplicate DOMContentLoaded listener, merged into the main one.
  // The query search logic will now run as part of the initial DOMContentLoaded.
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
          // Ensure 'notes-container' exists on the page where this search is intended to run
          const notesContainer = document.getElementById("notes-container");
          if (notesContainer) {
              notesContainer.appendChild(msg);
          } else {
              console.warn("Element with ID 'notes-container' not found. Cannot display search message.");
          }
      }
  }

  // The runQuerySearch function was defined but not called.
  // Its logic is now integrated directly into the main DOMContentLoaded for immediate execution.
  // If you need to call this function on other events, you can keep it as a separate function.
  // For now, I've assumed it was meant to run on page load if a query parameter exists.


  // --- Counting Animation Logic (Integrated from countAnimation.js) ---
  const statNumbers = document.querySelectorAll('.hero-stats .stat-number, .community-stats .stat-number');

  const observerOptions = {
      root: null,
      threshold: 0.5, // Trigger when 50% of the element is visible
  };

  const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              const targetElement = entry.target;
              const targetText = targetElement.getAttribute('data-target');

              // Refined check: Animate only if the target is a pure number (possibly with a '+')
              // and not a string like "24/7"
              // This regex ensures it's only digits, optionally followed by a '+'
              const isNumericTarget = /^\d+\+?$/.test(targetText);

              // Ensure the animation only runs once per element
              if (isNumericTarget && !targetElement.classList.contains('animated-count')) {
                  targetElement.classList.add('animated-count'); // Mark as animated

                  const targetNumber = parseInt(targetText); // Parse the number
                  const duration = 2000; // Animation duration in milliseconds
                  let start = 0; // Starting number for the animation
                  const increment = targetNumber / (duration / 10); // Calculate increment for smooth animation

                  const animate = () => {
                      if (start < targetNumber) {
                          start += increment;
                          targetElement.textContent = Math.floor(start) + '+'; // Add '+' sign
                          requestAnimationFrame(animate);
                      } else {
                          targetElement.textContent = targetNumber + '+'; // Ensure final number is exact
                      }
                  };
                  animate();
                  // Unobserve the element once its animation has started
                  observer.unobserve(targetElement);
              } else if (!isNumericTarget) { // If it's a string like "24/7" or any other non-numeric string
                  targetElement.textContent = targetText; // Set the text directly
                  // Unobserve immediately for static text to avoid re-processing
                  observer.unobserve(targetElement);
              }
          }
      });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  statNumbers.forEach(number => {
      const initialText = number.getAttribute('data-target');
      // Use the same refined check for initial display
      const isNumericTarget = /^\d+\+?$/.test(initialText);

      if (isNumericTarget) {
          number.textContent = '0+'; // For numeric targets, start at 0
      } else {
          // For non-numeric targets like "24/7", set the initial text directly
          number.textContent = initialText;
      }
      observer.observe(number);
  });
});
