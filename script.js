document.addEventListener("DOMContentLoaded", function () {

    // --- Data Storage ---
    let allData = {};

    // --- Element References ---
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
        let semesterNames = [];
        searchSemesterContainer.innerHTML = '';
        searchSubjectContainer.innerHTML = '';
        const branchData = allData.branches.find(b => b.name === selectedBranch);
        if (branchData && branchData.semesters) {
            semesterNames = branchData.semesters.map(sem => sem.semester);
        }
        const semesterSelect = createDropdown(searchSemesterContainer, "selectSemester", "Select Semester", semesterNames);
        semesterSelect.addEventListener("change", updateSubjects);
    }

    function updateSubjects() {
        const selectedBranch = document.getElementById("selectBranch").value;
        const selectedSemester = document.getElementById("selectSemester").value;
        let subjectNames = [];
        searchSubjectContainer.innerHTML = '';
        const branchData = allData.branches.find(b => b.name === selectedBranch);
        if (branchData && branchData.semesters) {
            const semesterData = branchData.semesters.find(sem => sem.semester == selectedSemester);
            if (semesterData && semesterData.subjects) {
                subjectNames = semesterData.subjects.map(sub => Object.values(sub)[0]);
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

    // --- Typewriter Effect ---
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

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            setTimeout(typeWriterEffect, 1000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            currentWordIndex = (currentWordIndex + 1) % words.length;
            setTimeout(typeWriterEffect, 500);
        } else {
            setTimeout(typeWriterEffect, isDeleting ? 75 : 150);
        }
    }

    typeWriterEffect(); // start the typing

    // ✅ DARK MODE TOGGLE BUTTON (Correct Place)
    const toggleBtn = document.getElementById("toggleBtn");
    if (toggleBtn) {
        toggleBtn.addEventListener("click", function () {
            document.body.classList.toggle("dark-mode");
        });
    }

});

