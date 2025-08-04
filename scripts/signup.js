document.addEventListener('DOMContentLoaded', function () {
  // DOM Elements
  const signupForm = document.getElementById('signupForm')
  const messageBox = document.getElementById('messageBox')
  const passwordInput = document.getElementById('password')
  const confirmPasswordInput = document.getElementById('confirm-password')
  const passwordToggle = document.querySelector('.password-toggle')
  const passwordIcon = passwordToggle.querySelector('i')
  const signupBtn = document.getElementById('signupBtn')
  const spinner = document.getElementById('spinner')
  const btnText = document.getElementById('btnText')

  // Constants
  const MIN_PASSWORD_LENGTH = 6
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  // Toggle Password Visibility
  passwordToggle.addEventListener('click', function () {
    const isPassword = passwordInput.type === 'password'
    passwordInput.type = isPassword ? 'text' : 'password'
    passwordIcon.className = isPassword ? 'far fa-eye-slash' : 'far fa-eye'
    passwordToggle.setAttribute(
      'aria-label',
      isPassword ? 'Hide password' : 'Show password'
    )
  })

  // Floating Label Effect
  document.querySelectorAll('.floating-input input').forEach((input) => {
    input.addEventListener('focus', () => {
      input.parentNode.classList.add('focused')
    })

    input.addEventListener('blur', () => {
      if (!input.value) {
        input.parentNode.classList.remove('focused')
      }
    })
  })

  // Password Strength Validation
  passwordInput.addEventListener('input', function () {
    validatePasswordStrength()
  })

  function validatePasswordStrength() {
    // Add Password Strength Validation Logic While Implemneting User Authentication
  }

  // Show Message
  function showMessage(text, type) {
    messageBox.textContent = text
    messageBox.className = `message-box ${type} show`

    setTimeout(() => {
      messageBox.classList.remove('show')
    }, 3000)
  }

  // Set Loading State
  function setLoadingState(isLoading) {
    if (isLoading) {
      spinner.classList.remove('hidden')
      btnText.textContent = 'Signing up...'
      signupBtn.disabled = true
    } else {
      spinner.classList.add('hidden')
      btnText.textContent = 'Sign up'
      signupBtn.disabled = false
    }
  }

  // Form Validation
  function validateForm(name, email, password, confirmPassword) {
    if (!name || !email || !password || !confirmPassword) {
      showMessage('Please Fill In All Fields', 'error')
      return false
    }

    if (!EMAIL_REGEX.test(email)) {
      showMessage('Please Enter a Valid Email Address', 'error')
      return false
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      showMessage(
        `Password Must Be At Least ${MIN_PASSWORD_LENGTH} Characters`,
        'error'
      )
      return false
    }

    if (password !== confirmPassword) {
      showMessage('Passwords Do Not Match', 'error')
      return false
    }

    return true
  }

  // Form Submission
  signupForm.addEventListener('submit', async function (e) {
    e.preventDefault()

    const name = document.getElementById('name').value.trim()
    const email = document.getElementById('email').value.trim()
    const password = document.getElementById('password').value
    const confirmPassword = document.getElementById('confirm-password').value

    // Validate Form
    if (!validateForm(name, email, password, confirmPassword)) return

    // Set Loading State
    setLoadingState(true)

    try {
      // Simulate API Call - Replace With Actual Fetch In Production
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Show Success Message
      showMessage(
        'Account Created Successfully! Redirecting To Login...',
        'success'
      )

      // Redirect After Delay
      setTimeout(() => {
        window.location.href = 'login.html'
      }, 2000)
    } catch (error) {
      console.error('Signup error:', error)
      showMessage('Signup Failed. Please Try Again...', 'error')
    } finally {
      setLoadingState(false)
    }
  })
})
