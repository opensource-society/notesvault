
(function () {
  const API_BASE = 'http://localhost:5000'
  function isLoggedIn() {
    try {
      const u = localStorage.getItem('loggedInUser')
      if (!u) return false

      const parsed = JSON.parse(u)
      return !!(parsed && (parsed.email || parsed.name))
    } catch (e) {
      return false
    }
  }

  function getUser() {
    try {
      return JSON.parse(localStorage.getItem('loggedInUser'))
    } catch (e) {
      return null
    }
  }

  function redirectToLogin() {
    window.location.href = '/pages/login.html'
  }

  function requireAuth() {
    if (!isLoggedIn()) {

      try {
        alert('You must be logged in to access this page.')
      } catch (e) {}
      redirectToLogin()
      return false
    }
    return true
  }

  function logout() {

    try {
      fetch(`${API_BASE}/api/logout`, { method: 'POST', credentials: 'include' }).catch(() => {})
    } catch (e) {}
    localStorage.removeItem('loggedInUser')

    notifyAuthChange()
    redirectToLogin()
  }

  function notifyAuthChange() {
    try {
      const user = getUser()
      const ev = new CustomEvent('auth-changed', { detail: { user } })
      document.dispatchEvent(ev)
    } catch (e) {

    }
  }

  window.auth = {
    isLoggedIn,
    getUser,
    requireAuth,
    redirectToLogin,
    logout,
    notifyAuthChange,
  }

  document.addEventListener('DOMContentLoaded', function () {
    const body = document.body

    try {
      fetch(`${API_BASE}/api/user`, { method: 'GET', credentials: 'include' })
        .then((r) => r.json())
        .then((data) => {
          if (data && data.user) {
            localStorage.setItem('loggedInUser', JSON.stringify(data.user))
          } else {
            localStorage.removeItem('loggedInUser')
          }

          notifyAuthChange()
        })
        .catch(() => {
          notifyAuthChange()
        })
    } catch (e) {
      notifyAuthChange()
    }
    if (body && body.dataset && body.dataset.requireAuth === 'true') {
      requireAuth()
    }
  })
})()
