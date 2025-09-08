// Main (JavaScript)

document.addEventListener('DOMContentLoaded', () => {
  // Global DOM Elements
  const DOM = {
    searchBranchContainer: document.getElementById('search-parameters-branch'),
    searchSemesterContainer: document.getElementById(
      'search-parameters-semester'
    ),
    searchSubjectContainer: document.getElementById(
      'search-parameters-subject'
    ),
    typewriterElement: document.getElementById('typewriter'),
    searchForm: document.querySelector('.search-form'),
    yearElement: document.getElementById('year'),
    backToTop: document.querySelector('.back-to-top'),
  }

  const TYPEWRITER_WORDS = ['Branch', 'Semester', 'Subject', 'Year']
  let allData = { branches: [] }

  // Authentication Helper Functions //
  const isUserLoggedIn = () => {
    // Check if user is logged in by looking for stored session data
    const userEmail = localStorage.getItem('rememberEmail')
    const loginStatus = localStorage.getItem('isLoggedIn')
    return loginStatus === 'true' || userEmail !== null
  }

  const requireAuth = (redirectPath = 'upload.html') => {
    if (!isUserLoggedIn()) {
      // Store the intended destination for redirect after login
      localStorage.setItem('redirectAfterLogin', redirectPath)
      window.location.href = 'login.html'
      return false
    }
    return true
  }

  // Navigation Helper Functions //
  const navigateToLogin = () => {
    // Determine the correct path based on current location
    const currentPath = window.location.pathname
    if (currentPath.includes('/pages/')) {
      window.location.href = 'login.html'
    } else {
      window.location.href = 'pages/login.html'
    }
  }

  const navigateToSignup = () => {
    // Determine the correct path based on current location
    const currentPath = window.location.pathname
    if (currentPath.includes('/pages/')) {
      window.location.href = 'signup.html'
    } else {
      window.location.href = 'pages/signup.html'
    }
  }

  // Make navigation functions globally available
  window.navigateToLogin = navigateToLogin
  window.navigateToSignup = navigateToSignup

  // Helper Functions //
  const createDropdown = (container, id, placeholder, options) => {
    if (!container) return null

    container.innerHTML = `
      <select id="${id}" class="search-parameters-select" aria-label="${placeholder}">
        <option value="" disabled selected>${placeholder}</option>
        ${options
          .map((opt) => `<option value="${opt}">${opt}</option>`)
          .join('')}
      </select>
    `

    return container.firstElementChild
  }
     
     const updateWelcomeUI = () => {
     const user = localStorage.getItem('nv_user');                      // truthy = logged in
     const userName = (localStorage.getItem('nv_user_name') || '').trim();
     const welcomeText = document.querySelector('.welcome-text');
     const primaryCTA = document.querySelector('.cta-buttons .btn.btn-primary'); // Upload/Sign Up button

    // If elements aren't present on this page, do nothing
      if (!welcomeText || !primaryCTA) return;

    if (user) {
    // logged in
    welcomeText.textContent = userName ? `Welcome back, ${userName}` : 'Welcome back';
    primaryCTA.setAttribute('href', 'upload.html');
    primaryCTA.innerHTML = '<i class="fas fa-upload"></i>Upload Notes';
  } else {
    // logged out
    welcomeText.textContent = 'Welcome to NotesVault';
    primaryCTA.setAttribute('href', 'signup.html');
    primaryCTA.innerHTML = '<i class="fas fa-user-plus"></i>Sign Up';
  }
};

  // Search Function //
  const updateSemesters = () => {
    const branchSelect = document.getElementById('selectBranch')
    if (!branchSelect?.value) return

    DOM.searchSemesterContainer.innerHTML = ''
    DOM.searchSubjectContainer.innerHTML = ''

    const branchData = allData.branches.find(
      (b) => b.name === branchSelect.value
    )
    if (!branchData?.semesters) return

    const semesterSelect = createDropdown(
      DOM.searchSemesterContainer,
      'selectSemester',
      'Select Semester',
      branchData.semesters.map((sem) => sem.semester)
    )

    semesterSelect?.addEventListener('change', updateSubjects)
  }

  const updateSubjects = () => {
    const branchSelect = document.getElementById('selectBranch')
    const semesterSelect = document.getElementById('selectSemester')
    if (!branchSelect?.value || !semesterSelect?.value) return

    DOM.searchSubjectContainer.innerHTML = ''

    const branchData = allData.branches.find(
      (b) => b.name === branchSelect.value
    )
    const semesterData = branchData?.semesters?.find(
      (sem) => sem.semester === semesterSelect.value
    )

    if (semesterData?.subjects) {
      createDropdown(
        DOM.searchSubjectContainer,
        'selectSubject',
        'Select Subject',
        semesterData.subjects.map((sub) => Object.values(sub)[0])
      )
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const searchInput = DOM.searchForm?.querySelector("input[type='text']")
    if (searchInput?.value) {
      window.location.href = `pages/notes.html?query=${encodeURIComponent(
        searchInput.value
      )}`
    }
  }

  // Typewriter Effect //
  const typeWriter = (wordIndex = 0, charIndex = 0, isDeleting = false) => {
    if (!DOM.typewriterElement) return

    const word = TYPEWRITER_WORDS[wordIndex % TYPEWRITER_WORDS.length]
    DOM.typewriterElement.textContent = word.substring(
      0,
      isDeleting ? charIndex - 1 : charIndex + 1
    )

    let delay
    if (!isDeleting && charIndex === word.length) {
      delay = 2000
      isDeleting = true
    } else if (isDeleting && charIndex === 0) {
      delay = 500
      isDeleting = false
      wordIndex++
    } else {
      delay = isDeleting ? 75 : 150
    }

    setTimeout(
      () =>
        typeWriter(
          wordIndex,
          isDeleting ? charIndex - 1 : charIndex + 1,
          isDeleting
        ),
      delay
    )
  }

  // Theme Toggle //
  const getPreferredTheme = () => {
    const stored = localStorage.getItem('theme')
    return (
      stored ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light')
    )
  }

  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }

  const setupThemeToggle = () => {
    setTheme(getPreferredTheme())
    document
      .querySelectorAll('.theme-toggle, .mobile-theme-toggle')
      .forEach((toggle) => {
        toggle.addEventListener('click', () => {
          const current =
            document.documentElement.getAttribute('data-theme') || 'light'
          setTheme(current === 'dark' ? 'light' : 'dark')
        })
      })
  }

  // Mobile Menu Navigation //
  const toggleMobileMenu = () => {
    const menuToggle = document.querySelector('.menu-toggle')
    const mobileNav = document.querySelector('.mobile-nav')
    const overlay = document.querySelector('.overlay')
    const backToTop  = document.querySelector('.back-to-top');

    menuToggle?.classList.toggle('active')
    mobileNav?.classList.toggle('active')
    overlay?.classList.toggle('active')

    const isOpen = mobileNav?.classList.contains('active');      // ✅ define it
    document.body.style.overflow = isOpen ? 'hidden' : '';       // lock/unlock scroll
    document.body.classList.toggle('drawer-open', isOpen);       // ✅ add/remove class

    // hide the back-to-top while drawer is open
    if (backToTop && isOpen) backToTop.classList.remove('visible');
    
  }

  const setupMobileMenu = () => {
    const menuToggle = document.querySelector('.menu-toggle')
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link')
    const overlay = document.querySelector('.overlay')

    menuToggle?.addEventListener('click', toggleMobileMenu)
    overlay?.addEventListener('click', toggleMobileMenu)
    mobileNavLinks.forEach((link) =>
      link.addEventListener('click', toggleMobileMenu)
    )
  }

  // Back to Top Button //
  const setupBackToTop = () => {
    if (!DOM.backToTop) return
    window.addEventListener('scroll', () => {
      const footer = document.querySelector('footer')
      const backToTop = document.querySelector('.back-to-top')

      if (!footer || !backToTop) return

      const footerRect = footer.getBoundingClientRect()
      const isFooterVisible = footerRect.top < window.innerHeight

      // Show/hide button based on scroll position AND footer visibility
      if (window.scrollY > 300 && !isFooterVisible) {
        backToTop.classList.add('visible')
      } else {
        backToTop.classList.remove('visible')
      }
    })

    DOM.backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }

  // Load Components (Header & Footer) //
  const loadComponents = async () => {
    try {
      const [header, footer] = await Promise.all([
        fetch('../components/header.html').then((res) => res.text()),
        fetch('../components/footer.html').then((res) => res.text()),
      ])

      document.getElementById('header-placeholder').innerHTML = header
      document.getElementById('footer-placeholder').innerHTML = footer

      // Re-initialize Header-Based Features
      setupThemeToggle()
      setupMobileMenu()

      // Set Active Nav Link //
      const currentPath = window.location.pathname.split('/').pop()

      document
        .querySelectorAll('.nav-link, .mobile-nav-link')
        .forEach((link) => {
          const linkPath = link.getAttribute('href')?.split('/').pop()
          if (linkPath === currentPath) {
            link.classList.add('active')
          }
        })

      // Set Active Footer Link //
      document.querySelectorAll('.footer-link').forEach((link) => {
        const linkPath = link.getAttribute('href')?.split('/').pop()
        if (linkPath === currentPath) {
          link.classList.add('active')
        }
      })
    } catch (error) {
      console.error('Error loading header/footer:', error)
    }
  }

  // Init //
  const init = async () => {
    if (DOM.typewriterElement) typeWriter()
    if (DOM.searchForm) DOM.searchForm.addEventListener('submit', handleSearch)

    if (DOM.yearElement) DOM.yearElement.textContent = new Date().getFullYear()

    // Load Search Data
    try {
      const response = await fetch('data/search_parameters/parameters.json')
      allData.branches = (await response.json()).branches.filter((b) =>
        b.name?.trim()
      )

      const branchSelect = createDropdown(
        DOM.searchBranchContainer,
        'selectBranch',
        'Select Branch',
        allData.branches.map((b) => b.name)
      )

      branchSelect?.addEventListener('change', updateSemesters)
    } catch (error) {
      console.error('Error loading search parameters:', error)
    }

    // Load Header & Footer
    await loadComponents()

    // Load Back To Top Button
    DOM.backToTop = document.querySelector('.back-to-top')
    setupBackToTop()
    // Update hero greeting & CTA based on auth
    updateWelcomeUI();

  }

  init()
})
