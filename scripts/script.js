document.addEventListener('DOMContentLoaded', () => {
  const DOM = {
    searchBranchContainer: document.getElementById('search-parameters-branch'),
    searchSemesterContainer: document.getElementById('search-parameters-semester'),
    searchSubjectContainer: document.getElementById('search-parameters-subject'),
    typewriterElement: document.getElementById('typewriter'),
    searchForm: document.querySelector('.search-form'),
    yearElement: document.getElementById('year'),
    backToTop: document.querySelector('.back-to-top'),
  }

  const TYPEWRITER_WORDS = ['Branch', 'Semester', 'Subject', 'Year']
  let allData = { branches: [] }

  const createDropdown = (container, id, placeholder, options) => {
    if (!container) return null
    container.innerHTML = `
      <select id="${id}" class="search-parameters-select" aria-label="${placeholder}">
        <option value="" disabled selected>${placeholder}</option>
        ${options.map((opt) => `<option value="${opt}">${opt}</option>`).join('')}
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

  const updateSemesters = () => {
    const branchSelect = document.getElementById('selectBranch')
    if (!branchSelect?.value) return
    DOM.searchSemesterContainer.innerHTML = ''
    DOM.searchSubjectContainer.innerHTML = ''
    const branchData = allData.branches.find((b) => b.name === branchSelect.value)
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
    const branchData = allData.branches.find((b) => b.name === branchSelect.value)
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
      // Redirect to notes.html in the same directory — avoid `pages/pages/` when current page is in /pages/
      window.location.href = `notes.html?query=${encodeURIComponent(searchInput.value)}`
    }
  }

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
      () => typeWriter(wordIndex, isDeleting ? charIndex - 1 : charIndex + 1, isDeleting),
      delay
    )
  }

  const getPreferredTheme = () => {
    const stored = localStorage.getItem('theme')
    return stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  }

  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }

  const setupThemeToggle = () => {
    setTheme(getPreferredTheme())
    document.querySelectorAll('.theme-toggle, .mobile-theme-toggle').forEach((toggle) => {
      toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light'
        setTheme(current === 'dark' ? 'light' : 'dark')
      })
    })
  }

  const toggleMobileMenu = () => {
    const menuToggle = document.querySelector('.menu-toggle')
    const mobileNav = document.querySelector('.mobile-nav')
    const overlay = document.querySelector('.overlay')
 my-feature
    menuToggle?.classList.toggle('active')
    mobileNav?.classList.toggle('active')
    overlay?.classList.toggle('active')
    document.body.style.overflow = mobileNav?.classList.contains('active') ? 'hidden' : ''

    const backToTop  = document.querySelector('.back-to-top');

    menuToggle?.classList.toggle('active')
    mobileNav?.classList.toggle('active')
    overlay?.classList.toggle('active')

    const isOpen = mobileNav?.classList.contains('active');      // ✅ define it
    document.body.style.overflow = isOpen ? 'hidden' : '';       // lock/unlock scroll
    document.body.classList.toggle('drawer-open', isOpen);       // ✅ add/remove class

    // hide the back-to-top while drawer is open
    if (backToTop && isOpen) backToTop.classList.remove('visible');
    
 main
  }

  const setupMobileMenu = () => {
    const menuToggle = document.querySelector('.menu-toggle')
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link')
    const overlay = document.querySelector('.overlay')
    menuToggle?.addEventListener('click', toggleMobileMenu)
    overlay?.addEventListener('click', toggleMobileMenu)
    mobileNavLinks.forEach((link) => link.addEventListener('click', toggleMobileMenu))
  }

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

  const updateNavbarAuth = () => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'))
    const loginLink = document.getElementById('nav-login')
    const signupLink = document.getElementById('nav-signup')
    const profileLink = document.getElementById('nav-profile')
    const logoutLink = document.getElementById('nav-logout')
    if (!loginLink || !signupLink || !profileLink || !logoutLink) return
    if (user) {
      loginLink.style.display = 'none'
      signupLink.style.display = 'none'
      profileLink.style.display = 'inline-block'
      logoutLink.style.display = 'inline-block'
    } else {
      loginLink.style.display = 'inline-block'
      signupLink.style.display = 'inline-block'
      profileLink.style.display = 'none'
      logoutLink.style.display = 'none'
    }
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault()
      localStorage.removeItem('loggedInUser')
      window.location.href = 'login.html'
    })
  }

  const loadComponents = async () => {
    try {
      const [header, footer] = await Promise.all([
        fetch('../components/header.html').then((res) => res.text()),
        fetch('../components/footer.html').then((res) => res.text()),
      ])
      document.getElementById('header-placeholder').innerHTML = header
      document.getElementById('footer-placeholder').innerHTML = footer
      setupThemeToggle()
      setupMobileMenu()
      updateNavbarAuth()
      const currentPath = window.location.pathname.split('/').pop()
      document.querySelectorAll('.nav-link, .mobile-nav-link').forEach((link) => {
        const linkPath = link.getAttribute('href')?.split('/').pop()
        if (linkPath === currentPath) {
          link.classList.add('active')
        }
      })
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

  const init = async () => {
    if (DOM.typewriterElement) typeWriter()
    if (DOM.searchForm) DOM.searchForm.addEventListener('submit', handleSearch)
    if (DOM.yearElement) DOM.yearElement.textContent = new Date().getFullYear()
    try {
      const response = await fetch('/data/parameters.json')
      allData.branches = (await response.json()).branches.filter((b) => b.name?.trim())
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
    await loadComponents()
    DOM.backToTop = document.querySelector('.back-to-top')
    setupBackToTop()
    // Update hero greeting & CTA based on auth
    updateWelcomeUI();

  }

  init()
})
