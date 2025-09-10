// Sign Up (JavaScript)

document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const signupForm = document.getElementById('signupForm');
  const nameInput = document.getElementById('name');
  const email = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const passwordToggle = document.querySelector('.password-toggle');
  const passwordIcon = passwordToggle.querySelector('i');
  const signupBtn = document.getElementById('signupBtn');
  const spinner = document.getElementById('spinner');
  const btnText = document.getElementById('btnText');
  const terms = document.getElementById('terms');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');
  const confirmError = document.getElementById('confirmError');
  const termsError = document.getElementById('termsError');

  const MIN_PASSWORD_LENGTH = 6;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Theme Setup Logic
  const getStoredTheme = () => {
    return localStorage.getItem("theme") || "light";
  };
  const setTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
  };
  setTheme(getStoredTheme());

  // Toggle Password Visibility
  passwordToggle.addEventListener('click', function () {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    passwordIcon.className = isPassword ? 'far fa-eye-slash' : 'far fa-eye';
    passwordToggle.setAttribute(
      'aria-label',
      isPassword ? 'Hide password' : 'Show password'
    );
  });

  // Floating Labels
  document.querySelectorAll('.floating-input input').forEach((input) => {
    input.addEventListener('focus', () => {
      input.parentNode.classList.add('focused');
    });
    input.addEventListener('blur', () => {
      if (!input.value) {
        input.parentNode.classList.remove('focused');
      }
    });
  });

  // Show Error Messages Inline
  function clearErrors() {
    [nameError, emailError, passwordError, confirmError, termsError].forEach(
      (e) => {
        e.textContent = '';
        e.style.display = 'none';
      }
    );
  }

  function validateForm(name, emailVal, password, confirmPassword) {
    clearErrors();
    let valid = true;

    if (!name) {
      nameError.textContent = 'Please enter your name.';
      nameError.style.display = 'block';
      valid = false;
    }

    if (!EMAIL_REGEX.test(emailVal)) {
      emailError.textContent = 'Please enter a valid email address.';
      emailError.style.display = 'block';
      valid = false;
    }

    // Password validation
    const PASSWORD_REGEX =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

    if (!PASSWORD_REGEX.test(password)) {
      passwordError.textContent =
        'Password must contain at least 1 capital letter, 1 small letter, 1 number, 1 special symbol, and be at least 6 characters long.';
      passwordError.style.display = 'block';
      valid = false;
    }

    if (password !== confirmPassword) {
      confirmError.textContent = 'Passwords do not match.';
      confirmError.style.display = 'block';
      valid = false;
    }

    if (!terms.checked) {
      termsError.textContent = 'Please agree to the Terms of Service.';
      termsError.style.display = 'block';
      valid = false;
    }

    return valid;
  }

  // Form Submission
  signupForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = nameInput.value.trim();
    const emailVal = email.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!validateForm(name, emailVal, password, confirmPassword)) return;

    spinner.classList.remove('hidden');
    btnText.textContent = 'Signing up...';
    signupBtn.disabled = true;

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API

      alert('Account Created Successfully! Redirecting to login...');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1500);
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed. Please try again.');
    } finally {
      spinner.classList.add('hidden');
      btnText.textContent = 'Sign Up';
      signupBtn.disabled = false;
    }
  });
});