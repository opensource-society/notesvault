document.addEventListener("DOMContentLoaded", function () {
  let allData = {};

  const searchBranchContainer = document.getElementById("search-parameters-branch");
  const searchSemesterContainer = document.getElementById("search-parameters-semester");
  const searchSubjectContainer = document.getElementById("search-parameters-subject");

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
    searchSemesterContainer.innerHTML = '';
    searchSubjectContainer.innerHTML = '';
    const branchData = allData.branches.find(b => b.name === selectedBranch);
    const semesterNames = branchData?.semesters?.map(sem => sem.semester) || [];
    const semesterSelect = createDropdown(searchSemesterContainer, "selectSemester", "Select Semester", semesterNames);
    semesterSelect.addEventListener("change", updateSubjects);
  }

  function updateSubjects() {
    const selectedBranch = document.getElementById("selectBranch").value;
    const selectedSemester = document.getElementById("selectSemester").value;
    searchSubjectContainer.innerHTML = '';
    const branchData = allData.branches.find(b => b.name === selectedBranch);
    const semesterData = branchData?.semesters?.find(sem => sem.semester == selectedSemester);
    const subjectNames = semesterData?.subjects?.map(sub => Object.values(sub)[0]) || [];
    createDropdown(searchSubjectContainer, "selectSubject", "Select Subject", subjectNames);
  }

  fetch("data/search_parameters/parameters.json")
    .then(res => res.json())
    .then(data => {
      allData = data;
      const branchNames = allData.branches.filter(b => b.name && b.name.trim() !== "").map(b => b.name);
      const branchSelect = createDropdown(searchBranchContainer, "selectBranch", "Select Branch", branchNames);
      branchSelect.addEventListener("change", updateSemesters);
    })
    .catch(error => console.error("Error fetching parameters:", error));

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
  if (themeToggleButton) {
    themeToggleButton.addEventListener('click', toggleTheme);
  }

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

  runQuerySearch();
});

  // Toggle Theme
  document.getElementById("year").textContent = new Date().getFullYear();

      const themeToggle = document.getElementById('theme-toggle');
      const sunIcon = themeToggle.querySelector('.sun-icon');
      const moonIcon = themeToggle.querySelector('.moon-icon');

      const currentTheme = localStorage.getItem('theme') || 
                         (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', currentTheme);

      if (currentTheme === 'dark') {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      }

      themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);

        sunIcon.style.display = next === 'dark' ? 'none' : 'block';
        moonIcon.style.display = next === 'dark' ? 'block' : 'none';
      });


