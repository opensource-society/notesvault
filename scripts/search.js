document.addEventListener("DOMContentLoaded", () => {
  const branchFilter = document.getElementById("branch-filter");
  const semesterFilter = document.getElementById("semester-filter");
  const subjectFilter = document.getElementById("subject-filter");
  const keywordSearch = document.getElementById("keyword-search");
  const noteCards = document.querySelectorAll(".note-card");
   const noResultsMsg = document.getElementById("no-results");

  function applyFilters() {
    const selectedBranch = branchFilter.value.toLowerCase();
    const selectedSemester = semesterFilter.value.trim();
    const selectedSubject = subjectFilter.value.toLowerCase();
    const keyword = keywordSearch.value.toLowerCase().trim();

    let hasMatch = false;

    noteCards.forEach(card => {
      const branch = card.querySelector("p:nth-of-type(1)").textContent.split(":")[1]?.toLowerCase().trim() || "";
      const semester = card.querySelector("p:nth-of-type(2)").textContent.split(":")[1]?.trim() || "";
      const subject = card.querySelector("p:nth-of-type(3)").textContent.split(":")[1]?.toLowerCase().trim() || "";
      const title = card.querySelector("h3").textContent.toLowerCase();

      const matchesBranch = !selectedBranch || branch.includes(selectedBranch);
      const matchesSemester = !selectedSemester || semester === selectedSemester;
      const matchesSubject = !selectedSubject || subject.includes(selectedSubject);
      const matchesKeyword = !keyword || title.includes(keyword) || subject.includes(keyword);

      if (matchesBranch && matchesSemester && matchesSubject && matchesKeyword) {
        card.style.display = "flex";
        hasMatch = true;
      } else {
        card.style.display = "none";
      }
    });

    noResultsMsg.style.display = hasMatch ? "none" : "block";
  }


  branchFilter.addEventListener("change", applyFilters);
  semesterFilter.addEventListener("change", applyFilters);
  subjectFilter.addEventListener("change", applyFilters);
  keywordSearch.addEventListener("input", applyFilters);
});
