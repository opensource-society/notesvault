
document.addEventListener("DOMContentLoaded", () => {
  fetch('../components/header.html')
    .then(res => res.text())
    .then(data => {
      document.getElementById("header-holder").innerHTML = data;

      // ✅ Hamburger menu toggle
      const hamburger = document.querySelector(".hamburger");
      const nav = document.querySelector("#header-navigation");

      if (hamburger && nav) {
        hamburger.addEventListener("click", () => {
          nav.classList.toggle("active");
        });
      }

      // ✅ Theme toggle logic
      const toggleBtn = document.getElementById("theme-toggle");
      const body = document.body;

      if (toggleBtn) {
        // Load saved theme
        if (localStorage.getItem("theme") === "dark") {
          body.classList.add("dark-theme");
          toggleBtn.textContent = "☀️";
        }

        // Toggle theme on click
        toggleBtn.addEventListener("click", () => {
          body.classList.toggle("dark-theme");

          if (body.classList.contains("dark-theme")) {
            localStorage.setItem("theme", "dark");
            toggleBtn.textContent = "☀️";
          } else {
            localStorage.setItem("theme", "light");
            toggleBtn.textContent = "🌙";
          }
        });
      } else {
        console.warn("No #theme-toggle button found.");
      }

    })
    .catch(err => console.error("Header load failed:", err));
});



