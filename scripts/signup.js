// Sign Up (JavaScript)
document.addEventListener('DOMContentLoaded', function () {
  // DOM Elements
  const signupForm = document.getElementById('signupForm')
  const messageBox = document.getElementById('messageBox')
  const passwordInput = document.getElementById('password')
  const confirmPasswordInput = document.getElementById('confirm-password')
  const passwordToggles = Array.from(document.querySelectorAll('.password-toggle'))
  // Safely get icons for toggles (may not exist if markup is incomplete)
  const passwordIcon = passwordToggles[0]?.querySelector('i')
  const confirmPasswordIcon = passwordToggles[1]?.querySelector('i')
  const signupBtn = document.getElementById('signupBtn')
  const spinner = document.getElementById('spinner')
  const btnText = document.getElementById('btnText')

  // Constants
  const MIN_PASSWORD_LENGTH = 6
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  // Toggle Password Visibility for password field (if toggle exists)
  if (passwordToggles[0]) {
    passwordToggles[0].addEventListener('click', function () {
      const isPassword = passwordInput.type === 'password'
      passwordInput.type = isPassword ? 'text' : 'password'
      if (passwordIcon) passwordIcon.className = isPassword ? 'far fa-eye-slash' : 'far fa-eye'
      passwordToggles[0].setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password')
    })
  }

  // Toggle Confirm Password Visibility
  function toggleConfirmPassword() {
    const isPassword = confirmPasswordInput.type === 'password'
    confirmPasswordInput.type = isPassword ? 'text' : 'password'
    if (confirmPasswordIcon) confirmPasswordIcon.className = isPassword ? 'far fa-eye-slash' : 'far fa-eye'
    if (passwordToggles[1]) passwordToggles[1].setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password')
  }
  if (passwordToggles[1]) passwordToggles[1].addEventListener('click', toggleConfirmPassword)

  // Floating Label Effect
  // Floating Label Effect
  document.querySelectorAll('.floating-input input').forEach((input) => {
    // Initialize focused state if input already has value (e.g., browser autofill)
    if (input.value && input.value.trim() !== '') {
      input.parentNode.classList.add('focused')
    }
    input.addEventListener('focus', () => input.parentNode.classList.add('focused'))
    input.addEventListener('blur', () => {
      if (!input.value) input.parentNode.classList.remove('focused')
    })
  })

  // Show Message
  function showMessage(text, type) {
    messageBox.textContent = text
    messageBox.className = `message-box ${type} show`
    setTimeout(() => messageBox.classList.remove('show'), 3000)
  }

  // Set Loading State
  function setLoadingState(isLoading) {
    if (isLoading) {
      spinner.classList.remove('hidden')
      btnText.textContent = 'Signing up...'
      signupBtn.disabled = true
    } else {
      spinner.classList.add('hidden')
      btnText.textContent = 'Sign Up'
      signupBtn.disabled = false
    }
  }

  // Hash password using SHA-256
  async function hashPassword(password) {
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
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
      showMessage(`Password Must Be At Least ${MIN_PASSWORD_LENGTH} Characters`, 'error')
      return false
    }
    if (password !== confirmPassword) {
      showMessage('Passwords Do Not Match', 'error')
      return false
    }
    if (localStorage.getItem(email)) {
      showMessage('Email Already Registered', 'error')
      return false
    }
    return true
  }

  // Form Submission
  signupForm.addEventListener('submit', async function (e) {
    e.preventDefault()

    const name = document.getElementById('name').value.trim()
    const email = document.getElementById('email').value.trim()
    const password = passwordInput.value
    const confirmPassword = confirmPasswordInput.value

    if (!validateForm(name, email, password, confirmPassword)) return

    setLoadingState(true)

    try {
      // Hash the password
      const hashedPassword = await hashPassword(password)

      // Store user in localStorage
      localStorage.setItem(email, JSON.stringify({ name, password: hashedPassword }))
      console.log('Stored user:', localStorage.getItem(email))

      showMessage('Account Created Successfully! Redirecting To Login...', 'success')

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
