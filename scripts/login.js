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

  // Hash password using SHA-256
  async function hashPassword(password) {
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  }

  // Initialize Form
  function initForm() {
    // Remembered Email
    const rememberedEmail = localStorage.getItem('rememberEmail')
    if (rememberedEmail) {
      emailInput.value = rememberedEmail
      rememberMe.checked = true
      emailInput.parentNode.classList.add('focused')
    }

    initFloatingLabels()
    initPasswordToggle()
  }

  function initFloatingLabels() {
    document.querySelectorAll('.floating-input input').forEach((input) => {
      input.addEventListener('focus', () => input.parentNode.classList.add('focused'))
      input.addEventListener('blur', () => {
        if (!input.value) input.parentNode.classList.remove('focused')
      })
      if (input.value) input.parentNode.classList.add('focused')
    })
  }

  function initPasswordToggle() {
    passwordToggle.addEventListener('click', togglePasswordVisibility)
    updatePasswordToggle()
  }

  function togglePasswordVisibility() {
    const isPassword = passwordInput.type === 'password'
    passwordInput.type = isPassword ? 'text' : 'password'
    updatePasswordToggle(isPassword)
  }

  function updatePasswordToggle(isPassword) {
    passwordIcon.className = isPassword ? 'far fa-eye-slash' : 'far fa-eye'
    passwordToggle.setAttribute(
      'aria-label',
      isPassword ? 'Hide password' : 'Show password'
    )
  }

  function showMessage(message, type = 'success') {
    messageBox.textContent = message
    messageBox.className = `message-box ${type} show`
    setTimeout(() => messageBox.classList.remove('show'), 3000)
  }

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
      showMessage(`Password Must Be At Least ${MIN_PASSWORD_LENGTH} Characters`, 'error')
      return false
    }
    return true
  }

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

  // Handle Login
  async function handleLogin(e) {
    e.preventDefault()

    const email = emailInput.value.trim()
    const password = passwordInput.value
    const shouldRemember = rememberMe.checked

    if (!validateForm(email, password)) return
    setLoadingState(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // simulate delay

      // Get user from localStorage
      const storedUser = localStorage.getItem(email)
      if (!storedUser) {
        showMessage('Invalid email or password', 'error')
        setLoadingState(false)
        return
      }

      const parsedUser = JSON.parse(storedUser)
      const hashedInput = await hashPassword(password)

      if (parsedUser.password !== hashedInput) {
        showMessage('Invalid email or password', 'error')
        setLoadingState(false)
        return
      }

      // ✅ Login success
      if (shouldRemember) {
        localStorage.setItem('rememberEmail', email)
      } else {
        localStorage.removeItem('rememberEmail')
      }

      showMessage('Login Successful! Redirecting...', 'success')
      setTimeout(() => {
        const emailInput = document.getElementById("email"); // or your form field id
        const userEmail = emailInput.value.trim();

        localStorage.setItem("loggedInUser", JSON.stringify({ email: userEmail }));
        window.location.href = 'dashboard.html'
      }, 1500)

    } catch (error) {
      console.error('Login error:', error)
      showMessage('Login Failed. Please Try Again...', 'error')
    } finally {
      setLoadingState(false)
    }
  }

  loginForm.addEventListener('submit', handleLogin)
  initForm()
})
