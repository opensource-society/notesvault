// Centralized client-side auth helpers
(function () {
  const API_BASE = 'http://localhost:5000'
  function isLoggedIn() {
    try {
      const u = localStorage.getItem('loggedInUser')
      if (!u) return false
      // loggedInUser should be a JSON object
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
      // small UX message then redirect
      try {
        alert('You must be logged in to access this page.')
      } catch (e) {}
      redirectToLogin()
      return false
    }
    return true
  }

  function logout() {
    // try server logout (best-effort)
    try {
      fetch(`${API_BASE}/api/logout`, { method: 'POST', credentials: 'include' }).catch(() => {})
    } catch (e) {}
    localStorage.removeItem('loggedInUser')
    // notify listeners that auth changed
    notifyAuthChange()
    redirectToLogin()
  }

  function notifyAuthChange() {
    try {
      const user = getUser()
      const ev = new CustomEvent('auth-changed', { detail: { user } })
      document.dispatchEvent(ev)
    } catch (e) {
      // ignore
    }
  }

  // expose on window
  window.auth = {
    isLoggedIn,
    getUser,
    requireAuth,
    redirectToLogin,
    logout,
    notifyAuthChange,
  }

  // Auto-run when a page opts-in via <body data-require-auth="true">
  document.addEventListener('DOMContentLoaded', function () {
    const body = document.body
    // try to sync with server session (best-effort)
    try {
      fetch(`${API_BASE}/api/user`, { method: 'GET', credentials: 'include' })
        .then((r) => r.json())
        .then((data) => {
          if (data && data.user) {
            localStorage.setItem('loggedInUser', JSON.stringify(data.user))
          } else {
            localStorage.removeItem('loggedInUser')
          }
          // notify listeners about current auth state on load
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
