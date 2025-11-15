// Login (JavaScript)

document.addEventListener('DOMContentLoaded', function () {
  // DOM Elements
  const loginForm = document.getElementById('loginForm')
  const messageBox = document.getElementById('messageBox')
  const emailInput = document.getElementById('email')
  const passwordInput = document.getElementById('password')
  const passwordToggle = document.querySelector('.password-toggle')
  const passwordIcon = passwordToggle.querySelector('i')
  const rememberMe = document.getElementById('remember-me')
  const loginBtn = document.getElementById('loginBtn')
  const spinner = document.getElementById('spinner')
  const btnText = document.getElementById('btnText')

  // Constants
  const MIN_PASSWORD_LENGTH = 6
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  // Initialize Form
  function initForm() {
    // Check For Remembered Email
    const rememberedEmail = localStorage.getItem('rememberEmail')
    if (rememberedEmail) {
      emailInput.value = rememberedEmail
      rememberMe.checked = true
      emailInput.parentNode.classList.add('focused')
    }

    // Setup Floating Labels
    initFloatingLabels()

    // Setup Password Toggle
    initPasswordToggle()
  }

  // Initialize Floating Labels
  function initFloatingLabels() {
    document.querySelectorAll('.floating-input input').forEach((input) => {
      input.addEventListener('focus', () => {
        input.parentNode.classList.add('focused')
      })

      input.addEventListener('blur', () => {
        if (!input.value) {
          input.parentNode.classList.remove('focused')
        }
      })

      if (input.value) {
        input.parentNode.classList.add('focused')
      }
    })
  }

  // Initialize Password Toggle
  function initPasswordToggle() {
    passwordToggle.addEventListener('click', togglePasswordVisibility)
    updatePasswordToggle()
  }

  // Toggle Password Visibility
  function togglePasswordVisibility() {
    const isPassword = passwordInput.type === 'password'
    passwordInput.type = isPassword ? 'text' : 'password'
    updatePasswordToggle(isPassword)
  }

  // Update Password Toggle State
  function updatePasswordToggle(isPassword) {
    passwordIcon.className = isPassword ? 'far fa-eye-slash' : 'far fa-eye'
    passwordToggle.setAttribute(
      'aria-label',
      isPassword ? 'Hide password' : 'Show password'
    )
  }

  // Message Function
  function showMessage(message, type = 'success') {
    messageBox.textContent = message
    messageBox.className = `message-box ${type} show`

    // Auto-Hide Message After Timeout
    setTimeout(() => {
      messageBox.classList.remove('show')
    }, 3000)
  }

  // Validate Form Inputs
  function validateForm(email, password) {
    if (!email || !password) {
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

    return true
  }

  // Set Loading State
  function setLoadingState(isLoading) {
    if (isLoading) {
      spinner.classList.remove('hidden')
      btnText.textContent = 'Signing in...'
      loginBtn.disabled = true
    } else {
      spinner.classList.add('hidden')
      btnText.textContent = 'Sign in'
      loginBtn.disabled = false
    }
  }

  // Handle Form Submission
  async function handleLogin(e) {
    e.preventDefault()

    const email = emailInput.value.trim()
    const password = passwordInput.value
    const shouldRemember = rememberMe.checked

    // Validate Form
    if (!validateForm(email, password)) return

    // Set Loading State
    setLoadingState(true)

    try {
      // Simulate API Call - Replace With Actual Fetch In Production
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Store Remember Me Preference
      if (shouldRemember) {
        localStorage.setItem('rememberEmail', email)
      } else {
        localStorage.removeItem('rememberEmail')
      }

      // Show Success Message
      showMessage('Login Successful! Redirecting...', 'success')

      // Redirect After Delay
      setTimeout(() => {
        window.location.href = 'dashboard.html'
      }, 1500)
    } catch (error) {
      console.error('Login error:', error)
      showMessage('Login Failed. Please Try Again...', 'error')
    } finally {
      setLoadingState(false)
    }
  }

  // Event Listeners
  loginForm.addEventListener('submit', handleLogin)

  // Initialize The Form
  initForm()
})
