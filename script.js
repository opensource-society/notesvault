document.addEventListener("DOMContentLoaded", function () {

    // --- Data Storage ---
    let allData = {};

    // --- Element References ---
    const searchBranchContainer = document.getElementById("search-parameters-branch");
    const searchSemesterContainer = document.getElementById("search-parameters-semester");
    const searchSubjectContainer = document.getElementById("search-parameters-subject");

    // Helper function to create dropdowns
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

    // Update Semesters
    function updateSemesters() {
        const selectedBranch = document.getElementById("selectBranch").value;
        const branchData = allData.branches.find(b => b.name === selectedBranch);

        const semesters = branchData ? branchData.semesters.map(s => s.semester) : [];
        const semesterSelect = createDropdown(searchSemesterContainer, "selectSemester", "Select Semester", semesters);

        semesterSelect.addEventListener("change", updateSubjects);
        searchSubjectContainer.innerHTML = '';
    }

    // Update Subjects
    function updateSubjects() {
        const selectedBranch = document.getElementById("selectBranch").value;
        const selectedSemester = document.getElementById("selectSemester").value;

        const branchData = allData.branches.find(b => b.name === selectedBranch);
        const semesterData = branchData.semesters.find(s => s.semester == selectedSemester);

        const subjects = semesterData ? semesterData.subjects.map(sub => Object.values(sub)[0]) : [];
        createDropdown(searchSubjectContainer, "selectSubject", "Select Subject", subjects);
    }

    // Fetch parameters.json
    fetch("data/search_parameters/parameters.json")
        .then(res => res.json())
        .then(data => {
            allData = data;
            const branches = data.branches.map(b => b.name);
            const branchSelect = createDropdown(searchBranchContainer, "selectBranch", "Select Branch", branches);
            branchSelect.addEventListener("change", updateSemesters);
        })
        .catch(err => console.error("Error loading parameters.json", err));

    // --- Typewriter Effect ---
    const words = ["Branch", "Semester", "Subject", "Year"];
    let wordIndex = 0, charIndex = 0, deleting = false;

    function typeWriterEffect() {
        const el = document.getElementById('typeWriterText');
        if (!el) return;

        const currentWord = words[wordIndex];
        el.textContent = deleting ? currentWord.substring(0, charIndex--) : currentWord.substring(0, charIndex++);

        let speed = deleting ? 75 : 150;

        if (!deleting && charIndex === currentWord.length) {
            speed = 2000; deleting = true;
        } else if (deleting && charIndex === 0) {
            deleting = false; wordIndex = (wordIndex + 1) % words.length; speed = 500;
        }

        setTimeout(typeWriterEffect, speed);
    }
    typeWriterEffect();

    // --- Hamburger Menu ---
    const nav = document.getElementById('header-navigation');
    const hamburger = document.getElementById('hamburgerMenu');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            nav.classList.toggle('show');
            hamburger.classList.toggle('active');
        });

        document.addEventListener('click', function (e) {
            if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
                nav.classList.remove('show');
                hamburger.classList.remove('active');
            }
        });
    }

    // --- Theme Toggle ---
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        const toggleBtn = document.getElementById("theme-toggle");
        if (toggleBtn) toggleBtn.textContent = theme === "dark" ? "☀️" : "🌙";
    }

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme("dark");
    }

    const toggleBtn = document.getElementById("theme-toggle");
    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            const current = document.documentElement.getAttribute("data-theme");
            setTheme(current === "dark" ? "light" : "dark");
        });
    }

    // --- Upload Redirect ---
    document.querySelectorAll(".upload-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            window.location.href = "upload.html";
        });
    });

    // --- Notes Filter ---
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
            populateSubjects("");
            displayNotes(notesData);
        });

    function populateSubjects(branch) {
        subjectFilter.innerHTML = '<option value="">All Subjects</option>';
        const subjects = branch ? subjectMap[branch] : [].concat(...Object.values(subjectMap));
        [...new Set(subjects)].forEach(sub => {
            const opt = document.createElement("option");
            opt.value = sub;
            opt.textContent = sub;
            subjectFilter.appendChild(opt);
        });
    }

    function displayNotes(notes) {
        notesContainer.innerHTML = notes.length === 0 ? "<p>No notes found.</p>" : "";
        notes.forEach(note => {
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

    [branchFilter, semesterFilter, subjectFilter].forEach(filter => {
        filter.addEventListener("change", () => {
            const branchVal = branchFilter.value;
            if (filter === branchFilter) populateSubjects(branchVal);

            const filtered = notesData.filter(note =>
                (!branchVal || note.branch === branchVal) &&
                (!semesterFilter.value || note.semester === semesterFilter.value) &&
                (!subjectFilter.value || note.subject === subjectFilter.value)
            );
            displayNotes(filtered);
        });
    });

});
