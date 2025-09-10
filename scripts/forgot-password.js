document.addEventListener('DOMContentLoaded', function () {
  // DOM Elements
  const form = document.getElementById('forgotPasswordForm');
  const emailInput = document.getElementById('reset-email');
  const messageBox = document.getElementById('messageBox');
  const resetBtn = document.getElementById('resetBtn');
  const spinner = document.getElementById('spinner');
  const btnText = document.getElementById('btnText');

  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const sunIcon = document.querySelector(".theme-icon.sun");
  const moonIcon = document.querySelector(".theme-icon.moon");

  // Email Regex
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Initialize Floating Label
  function initFloatingLabel() {
    if (emailInput.value) {
      emailInput.parentNode.classList.add('focused');
    }

    emailInput.addEventListener('focus', () => {
      emailInput.parentNode.classList.add('focused');
    });

    emailInput.addEventListener('blur', () => {
      if (!emailInput.value) {
        emailInput.parentNode.classList.remove('focused');
      }
    });
  }

  // Show Message
  function showMessage(message, type = 'success') {
    messageBox.textContent = message;
    messageBox.className = `message-box ${type} show`;

    setTimeout(() => {
      messageBox.classList.remove('show');
    }, 3000);
  }

  // Set Loading State
  function setLoadingState(isLoading) {
    if (isLoading) {
      spinner.classList.remove('hidden');
      btnText.textContent = 'Sending...';
      resetBtn.disabled = true;
    } else {
      spinner.classList.add('hidden');
      btnText.textContent = 'Send Reset Link';
      resetBtn.disabled = false;
    }
  }

  // Validate Email
  function validateEmail(email) {
    if (!email) {
      showMessage('Please enter your email', 'error');
      return false;
    }
    if (!EMAIL_REGEX.test(email)) {
      showMessage('Please enter a valid email address', 'error');
      return false;
    }
    return true;
  }

  // Handle Form Submission
  async function handleSubmit(e) {
    e.preventDefault();
    const email = emailInput.value.trim();

    if (!validateEmail(email)) return;

    setLoadingState(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      showMessage('Reset link sent successfully!', 'success');
      emailInput.value = '';
      emailInput.parentNode.classList.remove('focused');

    } catch (error) {
      console.error(error);
      showMessage('Failed to send reset link. Please try again.', 'error');
    } finally {
      setLoadingState(false);
    }
  }

  // Dark Mode Toggle
  themeToggle.addEventListener('click', function () {
    const isDark = body.getAttribute('data-theme') === 'dark';

    if (isDark) {
      body.setAttribute('data-theme', 'light');
      sunIcon.style.opacity = "1";
      moonIcon.style.opacity = "0";
    } else {
      body.setAttribute('data-theme', 'dark');
      sunIcon.style.opacity = "0";
      moonIcon.style.opacity = "1";
    }
  });

  // Initialize
  initFloatingLabel();
  form.addEventListener('submit', handleSubmit);
});
