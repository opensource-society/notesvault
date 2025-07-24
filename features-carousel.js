// Features Carousel JS for NotesVault
// Simple horizontal carousel for .features-carousel-section

document.addEventListener('DOMContentLoaded', function () {
  const track = document.querySelector('.carousel-track');
  const cards = Array.from(document.querySelectorAll('.feature-card.pro-card'));
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  let currentIndex = 0;
  const visibleCards = window.innerWidth < 600 ? 1 : window.innerWidth < 900 ? 2 : 3;

  function updateCarousel() {
    const cardWidth = cards[0].offsetWidth + 32; // 32px gap
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
  }

  function showPrev() {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  }

  function showNext() {
    if (currentIndex < cards.length - visibleCards) {
      currentIndex++;
      updateCarousel();
    }
  }

  prevBtn.addEventListener('click', showPrev);
  nextBtn.addEventListener('click', showNext);

  window.addEventListener('resize', () => {
    updateCarousel();
  });

  updateCarousel();
});
