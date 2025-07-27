document.addEventListener('DOMContentLoaded', function () {
  // GLOBAL VARIABLES
  const allData = {} // Will Hold Search Parameters Data
  const typewriterWords = ['Branch', 'Semester', 'Subject', 'Year']

  // ELEMENT REFERENCES
  const elements = {
    // Search Elements
    searchBranchContainer: document.getElementById('search-parameters-branch'),
    searchSemesterContainer: document.getElementById(
      'search-parameters-semester'
    ),
    searchSubjectContainer: document.getElementById(
      'search-parameters-subject'
    ),
    typewriterElement: document.getElementById('typewriter'),
    searchForm: document.querySelector('.search-form'),

    // Theme Elements
    themeToggle: document.querySelector('.theme-toggle'),
    mobileThemeToggle: document.querySelector('.mobile-theme-toggle'),

    // Mobile Menu Elements
    menuToggle: document.querySelector('.menu-toggle'),
    mobileNav: document.querySelector('.mobile-nav'),
    overlay: document.querySelector('.overlay'),

    // Footer Elements
    yearElement: document.getElementById('year'),

    // Back To Top Button
    backToTop: document.querySelector('.back-to-top'),
  }

  // HELPER FUNCTIONS

  /**
   * Creates a dropdown menu with options
   * @param {HTMLElement} container - Parent element to append the dropdown to
   * @param {string} id - ID for the select element
   * @param {string} defaultText - Placeholder text for the default option
   * @param {Array} options - Array of options to populate the dropdown
   * @returns {HTMLSelectElement} The created select element
   */
  function createDropdown(container, id, defaultText, options) {
    if (!container) return null

    container.innerHTML = ''
    const select = document.createElement('select')
    select.id = id
    select.className = 'search-parameters-select'
    select.setAttribute('aria-label', defaultText)

    // Default Option
    const defaultOption = document.createElement('option')
    defaultOption.value = ''
    defaultOption.disabled = true
    defaultOption.selected = true
    defaultOption.textContent = defaultText
    select.appendChild(defaultOption)

    // Add Options
    options.forEach((option) => {
      const optElement = document.createElement('option')
      optElement.value = option
      optElement.textContent = option
      select.appendChild(optElement)
    })

    container.appendChild(select)
    return select
  }

  // SEARCH FUNCTIONALITY

  function updateSemesters() {
    const selectedBranch = document.getElementById('selectBranch')?.value
    if (!selectedBranch) return

    // Clear Subsequent Dropdowns
    elements.searchSemesterContainer.innerHTML = ''
    elements.searchSubjectContainer.innerHTML = ''

    const branchData = allData.branches.find((b) => b.name === selectedBranch)
    if (!branchData?.semesters) return

    const semesterNames = branchData.semesters.map((sem) => sem.semester)
    const semesterSelect = createDropdown(
      elements.searchSemesterContainer,
      'selectSemester',
      'Select Semester',
      semesterNames
    )

    semesterSelect?.addEventListener('change', updateSubjects)
  }

  function updateSubjects() {
    const selectedBranch = document.getElementById('selectBranch')?.value
    const selectedSemester = document.getElementById('selectSemester')?.value
    if (!selectedBranch || !selectedSemester) return

    elements.searchSubjectContainer.innerHTML = ''

    const branchData = allData.branches.find((b) => b.name === selectedBranch)
    if (!branchData?.semesters) return

    const semesterData = branchData.semesters.find(
      (sem) => sem.semester === selectedSemester
    )
    if (!semesterData?.subjects) return

    const subjectNames = semesterData.subjects.map(
      (sub) => Object.values(sub)[0]
    )
    createDropdown(
      elements.searchSubjectContainer,
      'selectSubject',
      'Select Subject',
      subjectNames
    )
  }

  function handleSearchFormSubmit(e) {
    e.preventDefault()
    const searchInput = elements.searchForm.querySelector("input[type='text']")
    if (searchInput?.value) {
      window.location.href = `pages/BrowseNotes.html?query=${encodeURIComponent(
        searchInput.value
      )}`
    }
  }

  // TYPEWRITER EFFECT
  function typeWriterEffect(wordIndex = 0, charIndex = 0, isDeleting = false) {
    if (!elements.typewriterElement) return

    const currentWord = typewriterWords[wordIndex % typewriterWords.length]

    if (isDeleting) {
      elements.typewriterElement.textContent = currentWord.substring(
        0,
        charIndex - 1
      )
      charIndex--
    } else {
      elements.typewriterElement.textContent = currentWord.substring(
        0,
        charIndex + 1
      )
      charIndex++
    }

    // Timing Configuration
    let typeSpeed
    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 2000 // Pause At End Of Word
      isDeleting = true
    } else if (isDeleting && charIndex === 0) {
      typeSpeed = 500 // Pause Before Next Word
      isDeleting = false
      wordIndex++
    } else {
      typeSpeed = isDeleting ? 75 : 150
    }

    setTimeout(
      () => typeWriterEffect(wordIndex, charIndex, isDeleting),
      typeSpeed
    )
  }

  // THEME MANAGEMENT

  function initTheme() {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light')

    document.documentElement.setAttribute('data-theme', initialTheme)
  }

  function toggleTheme() {
    const html = document.documentElement
    const currentTheme = html.getAttribute('data-theme') || 'light'
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'

    html.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  // MOBILE MENU
  function setupMobileMenu() {
    if (!elements.menuToggle || !elements.mobileNav) return

    elements.menuToggle.addEventListener('click', () => {
      elements.menuToggle.classList.toggle('active')
      elements.mobileNav.classList.toggle('active')
      elements.overlay.classList.toggle('active')
      document.body.style.overflow = elements.mobileNav.classList.contains(
        'active'
      )
        ? 'hidden'
        : ''
    })

    elements.overlay.addEventListener('click', () => {
      elements.menuToggle.classList.remove('active')
      elements.mobileNav.classList.remove('active')
      elements.overlay.classList.remove('active')
      document.body.style.overflow = ''
    })

    // Close Menu When Clicking On links
    document.querySelectorAll('.mobile-nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        elements.menuToggle.classList.remove('active')
        elements.mobileNav.classList.remove('active')
        elements.overlay.classList.remove('active')
        document.body.style.overflow = ''
      })
    })
  }

  // BACK TO TOP BUTTON
  function setupBackToTop() {
    if (!elements.backToTop) return

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        elements.backToTop.classList.add('visible')
      } else {
        elements.backToTop.classList.remove('visible')
      }
    })

    elements.backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    })
  }

  // INITIALIZATION
  function init() {
    // Initialize Dropdowns
    fetch('data/search_parameters/parameters.json')
      .then((res) => res.json())
      .then((data) => {
        allData.branches = data.branches.filter((b) => b.name?.trim())
        const branchNames = allData.branches.map((b) => b.name)
        const branchSelect = createDropdown(
          elements.searchBranchContainer,
          'selectBranch',
          'Select Branch',
          branchNames
        )
        branchSelect?.addEventListener('change', updateSemesters)
      })
      .catch(console.error)

    // Initialize Theme
    initTheme()
    if (elements.themeToggle) {
      elements.themeToggle.addEventListener('click', toggleTheme)
    }
    if (elements.mobileThemeToggle) {
      elements.mobileThemeToggle.addEventListener('click', toggleTheme)
    }

    // Initialize Mobile Menu
    setupMobileMenu()

    // Initialize Typewriter Effect
    if (elements.typewriterElement) {
      typeWriterEffect()
    }

    // Initialize Search Form
    if (elements.searchForm) {
      elements.searchForm.addEventListener('submit', handleSearchFormSubmit)
    }

    // Initialize Back To Top Button
    setupBackToTop()

    // Current Year Logic
    if (elements.yearElement) {
      elements.yearElement.textContent = new Date().getFullYear()
    }
  }

  // Start the application
  init()
})
