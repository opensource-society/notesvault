document.addEventListener('DOMContentLoaded', function () {
  // DOM Elements
  const form = document.getElementById('forgotPasswordForm');
  const emailInput = document.getElementById('reset-email');
  const messageBox = document.getElementById('messageBox');
  const resetBtn = document.getElementById('resetBtn');
  const spinner = document.getElementById('spinner');
  const btnText = document.getElementById('btnText');


  // Email Regex
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

   // Theme
  const getStoredTheme = () => {
    return localStorage.getItem("theme") || "light";
  };
  const setTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
  };
  setTheme(getStoredTheme());

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

    // try {
    //   // Simulate API call
    //   await new Promise(resolve => setTimeout(resolve, 1000));

    //   showMessage('Reset link sent successfully!', 'success');
    //   emailInput.value = '';
    //   emailInput.parentNode.classList.remove('focused');

    // } catch (error) {
    //   console.error(error);
    //   showMessage('Failed to send reset link. Please try again.', 'error');
    // } finally {
    //   setLoadingState(true);
    // }

      // ... inside your handleSubmit(e) function ...

setLoadingState(true);

try {
    // Use FormData to send the email as a POST request
    const formData = new FormData();
    formData.append('email', email);

    // Make the real API call to your PHP script
    const response = await fetch('../php/send_reset_link.php', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();

    if (result.success) {
        showMessage(result.message, 'success');
        emailInput.value = '';
        emailInput.parentNode.classList.remove('focused');
    } else {
        showMessage(result.message, 'error');
    }
} catch (error) {
    console.error('Error:', error);
    showMessage('Failed to send reset link. Please try again.', 'error');
} finally {
    setLoadingState(false);
}

// ... rest of the code ...
    
  }

  // Initialize
  initFloatingLabel();
  form.addEventListener('submit', handleSubmit);
});
