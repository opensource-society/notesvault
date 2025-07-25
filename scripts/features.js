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
