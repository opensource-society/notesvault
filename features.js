
// Add simple hover animation or analytics tracking if needed
document.querySelectorAll(".feature-card").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.border = "1px solid #00eaff";
  });
  card.addEventListener("mouseleave", () => {
    card.style.border = "1px solid rgba(255,255,255,0.05)";
  });
});

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
