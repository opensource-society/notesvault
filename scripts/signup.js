
document.addEventListener('DOMContentLoaded', function () {

  const signupForm = document.getElementById('signupForm')
  const messageBox = document.getElementById('messageBox')
  const passwordInput = document.getElementById('password')
  const confirmPasswordInput = document.getElementById('confirm-password')
  const passwordToggles = Array.from(document.querySelectorAll('.password-toggle'))

  const passwordIcon = passwordToggles[0]?.querySelector('i')
  const confirmPasswordIcon = passwordToggles[1]?.querySelector('i')
  const signupBtn = document.getElementById('signupBtn')
  const spinner = document.getElementById('spinner')
  const btnText = document.getElementById('btnText')

  const MIN_PASSWORD_LENGTH = 6
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (passwordToggles[0]) {
    passwordToggles[0].addEventListener('click', function () {
      const isPassword = passwordInput.type === 'password'
      passwordInput.type = isPassword ? 'text' : 'password'
      if (passwordIcon) passwordIcon.className = isPassword ? 'far fa-eye-slash' : 'far fa-eye'
      passwordToggles[0].setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password')
    })
  }

  function toggleConfirmPassword() {
    const isPassword = confirmPasswordInput.type === 'password'
    confirmPasswordInput.type = isPassword ? 'text' : 'password'
    if (confirmPasswordIcon) confirmPasswordIcon.className = isPassword ? 'far fa-eye-slash' : 'far fa-eye'
    if (passwordToggles[1]) passwordToggles[1].setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password')
  }
  if (passwordToggles[1]) passwordToggles[1].addEventListener('click', toggleConfirmPassword)


  document.querySelectorAll('.floating-input input').forEach((input) => {

    if (input.value && input.value.trim() !== '') {
      input.parentNode.classList.add('focused')
    }
    input.addEventListener('focus', () => input.parentNode.classList.add('focused'))
    input.addEventListener('blur', () => {
      if (!input.value) input.parentNode.classList.remove('focused')
    })
  })

  function showMessage(text, type) {
    messageBox.textContent = text
    messageBox.className = `message-box ${type} show`
    setTimeout(() => messageBox.classList.remove('show'), 3000)
  }

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

  async function hashPassword(password) {
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  }

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

  const API_BASE = 'http://localhost:5000'

  signupForm.addEventListener('submit', async function (e) {
    e.preventDefault()

    const name = document.getElementById('name').value.trim()
    const email = document.getElementById('email').value.trim()
    const password = passwordInput.value
    const confirmPassword = confirmPasswordInput.value

    if (!validateForm(name, email, password, confirmPassword)) return

    setLoadingState(true)

    try {

      const hashedPassword = await hashPassword(password)

      const res = await fetch(`${API_BASE}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: hashedPassword }),
        credentials: 'include',
      })

      const data = await res.json()
      if (!res.ok) {
        showMessage(data.error || 'Signup failed', 'error')
        setLoadingState(false)
        return
      }

      showMessage('Account Created Successfully! Redirecting To Login...', 'success')
      setTimeout(() => {
        window.location.href = '/pages/login.html'
      }, 1200)
    } catch (error) {
      console.error('Signup error:', error)
      showMessage('Signup Failed. Please Try Again...', 'error')
    } finally {
      setLoadingState(false)
    }
  })
})
