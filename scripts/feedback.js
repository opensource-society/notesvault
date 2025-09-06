// Feedback & Reviews Section Script

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('feedback-form');
  const input = document.getElementById('feedback-input');
  const nameInput = document.getElementById('feedback-name');
  const emailInput = document.getElementById('feedback-email');
  const success = document.getElementById('feedback-success');

  // Show success message
  function showSuccess() {
    success.style.display = 'inline-block';
    setTimeout(() => {
      success.style.display = 'none';
    }, 2500);
  }

  // Handle form submit
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const feedback = input.value.trim();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    if (!feedback || !name || !email) return;
    let feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    feedbacks.push({ name, email, feedback });
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    input.value = '';
    nameInput.value = '';
    emailInput.value = '';
    showSuccess();
  });
});
