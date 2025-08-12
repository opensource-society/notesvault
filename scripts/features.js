document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".feature-card");

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.classList.add("active-feature");
    });
    
    card.addEventListener("mouseleave", () => {
      card.classList.remove("active-feature");
    });
  });
});
const toggleButton = document.getElementById('mode-toggle');

toggleButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');

  if(document.body.classList.contains('dark-mode')) {
    toggleButton.textContent = 'Switch to Light Mode';
  } else {
    toggleButton.textContent = 'Switch to Dark Mode';
  }
});
