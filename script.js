document.addEventListener("DOMContentLoaded", function () {

    // setup search parameters
    const search_branch = document.getElementById("search-parameters-branch");
    const search_semester = document.getElementById("search-parameters-semester");
    const search_subject = document.getElementById("search-parameters-subject");

    // to be filled with data after fetch!
    Branches = [];

    // fetch parameters.json file
    fetch("data/search_parameters/parameters.json")
        .then(res => res.json())
        .then(data => {
            
            // store all data inside branchList
            const branchList = data.branches;
            branchList.forEach(branch => {
                
                // store branch name in Branches array
                if(branch.name){
                    Branches.push(branch.name);
                }
            });

            // create select element for branch and append it
            const chooseBranch = document.createElement("select");
            chooseBranch.name = "selectBranch";
            chooseBranch.id = "selectBranch";
            chooseBranch.className = "search-parameters-select";
            search_branch.appendChild(chooseBranch);

            // create default option in select and append it
            const chooseBranchDefault = document.createElement("option");
            chooseBranchDefault.disabled = true;
            chooseBranchDefault.selected = true;
            chooseBranchDefault.innerHTML = "Select Branch";
            chooseBranchDefault.className = "search-parameters-option";
            const searchBranch = document.getElementById("selectBranch");
            searchBranch.appendChild(chooseBranchDefault);

            // fill options from Branches array
            Branches.forEach(branch => {
                const branchOption = document.createElement("option");
                branchOption.value = branch;
                branchOption.innerHTML = branch;
                branchOption.className = "search-parameters-option";
                searchBranch.appendChild(branchOption);
            });
            

            const branchOptions = document.getElementById("selectBranch");
            Semesters = [];
            semesterList = [];

            // Add semesters if change detected in branches!
            branchOptions.addEventListener("change", () => {
                branchList.forEach(branch => {
                    if(branch.name == branchOptions.value) {
                        if(branch.semesters) {
                            semesterList = branch.semesters;
                            Semesters = [];
                            semesterList.forEach(semester =>{
                                Semesters.push(semester.semester);
                            });
                            console.log(Semesters);
                        }
                    }
                });

                search_semester.innerHTML = '';

                // add option to select semester in page and append it
                const chooseSemester = document.createElement("select");
                chooseSemester.name = "selectSemester";
                chooseSemester.id = "selectSemester";
                chooseSemester.className = "search-parameters-select";
                search_semester.appendChild(chooseSemester);

                // default semester option
                const chooseSemesterDefault = document.createElement("option");
                chooseSemesterDefault.disabled = true;
                chooseSemesterDefault.selected = true;
                chooseSemesterDefault.innerHTML = "Select Semester";
                chooseSemesterDefault.className = "search-parameters-option";
                const searchSemester = document.getElementById("selectSemester");
                searchSemester.appendChild(chooseSemesterDefault);

                // add all semesters
                semesterList.forEach(semester => {
                    const semesterOption = document.createElement("option");
                    semesterOption.value = semester.semester;
                    semesterOption.innerHTML = semester.semester;
                    semesterOption.className = "search-parameters-option";
                    searchSemester.appendChild(semesterOption);
                });

                // add subjects if semester is selected
                searchSemester.addEventListener("change", addSubjects());
            });
            Subjects = [];
            subjectList = [];

            // add subjects option
            function addSubjects() {
                search_subject.innerHTML = "";
                const selectSemester = document.getElementById("selectSemester");
                selectSemester.addEventListener("change", () => {
                    semesterList.forEach(semester => {
                        if(semester){
                            if(semester.semester == selectSemester.value){
                                subjectList = semester.subjects;
                                Subjects = [];
                                subjectList.forEach(subject => {
                                    Subjects.push(Object.values(subject));
                                });
                            }
                        }
                    });

                    // add option to select subject and append it
                    const chooseSubject = document.createElement("select");
                    chooseSubject.name = "selectSubject";
                    chooseSubject.id = "selectSubject";
                    chooseSubject.className = "search-parameters-select";
                    search_subject.appendChild(chooseSubject);

                    // add default subject
                    const chooseSubjectDefault = document.createElement("option");
                    chooseSubjectDefault.disabled = true;
                    chooseSubjectDefault.selected = true;
                    chooseSubjectDefault.innerHTML = "Select Subject";
                    chooseSubjectDefault.className = "search-parameters-option";
                    const searchSubject = document.getElementById("selectSubject");
                    searchSubject.appendChild(chooseSubjectDefault);

                    // add options for all subjects.
                    Subjects.forEach(subject => {
                        console.log(subject);
                        const subjectOption = document.createElement("option");
                        subjectOption.value = subject;
                        subjectOption.innerHTML = subject;
                        subjectOption.className = "search-parameters-option";
                        searchSubject.appendChild(subjectOption);
                    });
                });
            }
            
        });
});

// typewriter effect in homepage!
const words = ["Branch", "Semester", "Subject"];
  let currentWord = 0;
  let i = 0;
  let isDeleting = false;
  let speed = 100;

  function typeWriter() {
    const element = document.getElementById("typeWriterText");
    const word = words[currentWord];

    if (isDeleting) {
      element.innerHTML = word.substring(0, i - 1);
      i--;
    } else {
      element.innerHTML = word.substring(0, i + 1);
      i++;
    }

    if (!isDeleting && i === word.length) {
      isDeleting = true;
      speed = 50;
      setTimeout(typeWriter, 1000); // Wait before deleting
      return;
    }

    if (isDeleting && i === 0) {
      isDeleting = false;
      currentWord = (currentWord + 1) % words.length; // Next word
      speed = 100;
    }

    setTimeout(typeWriter, speed);
  }

  window.onload = typeWriter;


  // Mobile menu toggle functionality
function toggleMobileMenu() {
    const nav = document.getElementById('header-navigation');
    const hamburger = document.getElementById('hamburgerMenu');
    
    nav.classList.toggle('show');
    hamburger.classList.toggle('active');
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const nav = document.getElementById('header-navigation');
    const hamburger = document.getElementById('hamburgerMenu');
    
    if (!nav.contains(event.target) && !hamburger.contains(event.target)) {
        nav.classList.remove('show');
        hamburger.classList.remove('active');
    }
});

// Close mobile menu when clicking on navigation links
document.querySelectorAll('#header-navigation p').forEach(link => {
    link.addEventListener('click', function() {
        const nav = document.getElementById('header-navigation');
        const hamburger = document.getElementById('hamburgerMenu');
        
        nav.classList.remove('show');
        hamburger.classList.remove('active');
    });
});

// Typewriter effect for the dynamic text
const texts = ['Subject', 'Semester', 'Branch', 'Year'];
let textIndex = 0;
let charIndex = 0;
// let isDeleting = false;

function typeWriter() {
    const currentText = texts[textIndex];
    const typewriterElement = document.getElementById('typeWriterText');
    
    if (isDeleting) {
        typewriterElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriterElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let typeSpeed = isDeleting ? 50 : 100;
    
    if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typeSpeed = 500;
    }
    
    setTimeout(typeWriter, typeSpeed);
}

// Start typewriter effect when page loads
document.addEventListener('DOMContentLoaded', function() {
    typeWriter();
});

// Handle window resize to ensure proper layout
window.addEventListener('resize', function() {
    const nav = document.getElementById('header-navigation');
    const hamburger = document.getElementById('hamburgerMenu');
    
    if (window.innerWidth > 600) {
        nav.classList.remove('show');
        hamburger.classList.remove('active');
    }
});

// Add smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});