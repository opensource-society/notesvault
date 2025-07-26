
  document.addEventListener("DOMContentLoaded", function () {
let notesData = [];

      const easyUploadCard = document.querySelector('.easy-upload-card');
      if (easyUploadCard) {
        easyUploadCard.style.cursor = 'pointer';
        easyUploadCard.addEventListener('click', function () {
          window.location.href = '/upload.html';
        });
      }
    // --- Data Storage ---
    let allData = {};

    // --- Element References ---
    const searchBranchContainer = document.getElementById("search-parameters-branch");
    const searchSemesterContainer = document.getElementById("search-parameters-semester");
    const searchSubjectContainer = document.getElementById("search-parameters-subject");

    // --- Create Dropdown Helper ---
    function createDropdown(container, id, defaultText, options) {
      container.innerHTML = '';
      const select = document.createElement("select");
      select.id = id;
      select.className = "search-parameters-select";
      const defaultOption = document.createElement("option");
      defaultOption.disabled = true;
      defaultOption.selected = true;
      defaultOption.innerHTML = defaultText;
      select.appendChild(defaultOption);
      options.forEach(opt => {
        const option = document.createElement("option");
        option.value = opt;
        option.innerHTML = opt;
        select.appendChild(option);
      });
      container.appendChild(select);
      return select;
    }

    function updateSemesters() {
      const selectedBranch = document.getElementById("selectBranch").value;
      let semesterNames = [];
      searchSemesterContainer.innerHTML = '';
      searchSubjectContainer.innerHTML = '';
      const branchData = allData.branches.find(b => b.name === selectedBranch);
      if (branchData && branchData.semesters) {
        semesterNames = branchData.semesters.map(sem => sem.semester);
      }
      const semesterSelect = createDropdown(searchSemesterContainer, "selectSemester", "Select Semester", semesterNames);
      semesterSelect.addEventListener("change", updateSubjectsDropdown);
    }

    function updateSubjectsDropdown() {
      const selectedBranch = document.getElementById("selectBranch").value;
      const selectedSemester = document.getElementById("selectSemester").value;
      let subjectNames = [];
      searchSubjectContainer.innerHTML = '';
      const branchData = allData.branches.find(b => b.name === selectedBranch);
      if (branchData && branchData.semesters) {
        const semesterData = branchData.semesters.find(sem => sem.semester == selectedSemester);
        if (semesterData && semesterData.subjects) {
          subjectNames = semesterData.subjects.map(sub => Object.values(sub)[0]).sort((a, b) => a.localeCompare(b));
        }
      }
      createDropdown(searchSubjectContainer, "selectSubject", "Select Subject", subjectNames);
    }

    fetch("data/search_parameters/parameters.json")
      .then(res => res.json())
      .then(data => {
        allData = data;
        const branchNames = allData.branches.map(b => b.name);
        const branchSelect = createDropdown(searchBranchContainer, "selectBranch", "Select Branch", branchNames);
        branchSelect.addEventListener("change", updateSemesters);
      })
      .catch(error => console.error("Error fetching parameters:", error));

    // --- Typewriter ---
    const words = ["Branch", "Semester", "Subject", "Year"];
    let currentWordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeWriterEffect() {
      const currentWord = words[currentWordIndex];
      const typewriterElement = document.getElementById('typeWriterText');
      if (!typewriterElement) return;
      if (isDeleting) {
        typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }
      let typeSpeed = isDeleting ? 75 : 150;
      if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        currentWordIndex = (currentWordIndex + 1) % words.length;
        typeSpeed = 500;
      }
      setTimeout(typeWriterEffect, typeSpeed);
    }
    typeWriterEffect();

    // --- Theme & Mobile Menu ---
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

    function toggleTheme() {
      const html = document.documentElement;
      const currentTheme = html.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    }
    const themeToggleButton = document.getElementById('themeToggle');
    if (themeToggleButton) themeToggleButton.addEventListener('click', toggleTheme);
    (function initTheme() {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', savedTheme || (prefersDark ? 'dark' : 'light'));
    })();

    document.querySelectorAll(".upload-btn").forEach(btn => btn.addEventListener("click", () => window.location.href = "upload.html"));

    const branchFilter = document.getElementById("branch-filter");
    const semesterFilter = document.getElementById("semester-filter");
    const subjectFilter = document.getElementById("subject-filter");
    const notesContainer = document.getElementById("notes-container");
    const loader = document.getElementById("loader");

    const subjectMap = {
      "CSE": ["Maths", "DBMS", "OS", "DSA"],
      "CSE AIML": ["AI", "ML", "Python"],
      "CSE IOT": ["IoT Fundamentals", "Sensors", "Microcontrollers"],
      "CSE DS": ["Data Science Basics", "Statistics", "Python for DS"]
    };

    function updateFilterSubjects(branch) {
      subjectFilter.innerHTML = '<option value="">All Subjects</option>';
      const subjects = subjectMap[branch] || [].concat(...Object.values(subjectMap));
      [...new Set(subjects)].sort((a, b) => a.localeCompare(b)).forEach(sub => {
        const opt = document.createElement("option");
        opt.value = sub;
        opt.textContent = sub;
        subjectFilter.appendChild(opt);
      });
    }

    function displayNotes(notes) {
      notesContainer.innerHTML = notes.length === 0 ? "<p>No notes found.</p>" : "";
      const bookmarked = JSON.parse(localStorage.getItem("bookmarkedNotes") || "[]");
      notes.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()))
        .forEach(note => {
          const card = document.createElement("div");
          card.className = "note-card";
          const isBookmarked = bookmarked.includes(note.title);
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
            </div>`;
          notesContainer.appendChild(card);
        });
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

let spinnerTimeout = setTimeout(() => {
  loader.classList.add("show");  // SHOW spinner
}, 300);

fetch("data/notes.json")
  .then(res => res.json())
  .then(data => {
    notesData = data;
    updateFilterSubjects("");
    displayNotes(notesData);
    runQuerySearch();
  })
  .catch(err => console.error("Error loading notes:", err))
  .finally(() => {
    clearTimeout(spinnerTimeout);
   loader.classList.remove("show"); // HIDE spinner
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
    });

   
      // let notesData = [];

      // const easyUploadCard = document.querySelector('.easy-upload-card');
      // if (easyUploadCard) {
      //   easyUploadCard.style.cursor = 'pointer';
      //   easyUploadCard.addEventListener('click', function () {
      //     window.location.href = '/upload.html';
      //   });
      // }
    

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
          notesContainer.appendChild(msg);
        }
      }
    }

  });

  

