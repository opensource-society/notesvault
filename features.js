// Add simple hover animation or analytics tracking if needed
document.querySelectorAll(".feature-card").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.border = "1px solid #00eaff";
  });
  card.addEventListener("mouseleave", () => {
    card.style.border = "1px solid rgba(255,255,255,0.05)";
  });
});
