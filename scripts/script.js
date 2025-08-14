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

    menuToggle?.classList.toggle('active')
    mobileNav?.classList.toggle('active')
    overlay?.classList.toggle('active')
    document.body.style.overflow = mobileNav?.classList.contains('active')
      ? 'hidden'
      : ''
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
      DOM.backToTop.classList.toggle('visible', window.scrollY > 300)
    })

    DOM.backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }

  // Load Components (Header & Footer) //
  const loadComponents = async () => {
    try {
      const [header, footer] = await Promise.all([
        fetch('/components/header.html').then((res) => res.text()),
        fetch('/components/footer.html').then((res) => res.text()),
      ])

      document.getElementById('header-placeholder').innerHTML = header
      document.getElementById('footer-placeholder').innerHTML = footer

      // Re-initialize Header-Based Features
      setupThemeToggle()
      setupMobileMenu()

          // ===== Add header streak call here =====
          setupHeaderStreak() 

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

      // ===== Streak Section =====
      const setupHeaderStreak = () => {
        const streakEl = document.getElementById('streak-count');
        const streakCalendar = document.getElementById('streak-calendar');

        // Load streak dates from localStorage
        let streakDates = JSON.parse(localStorage.getItem('streakDates') || '[]');
        const lastLogin = localStorage.getItem('lastLogin') || null;

        const today = new Date();
        const todayStr = today.toDateString();

        // Reset streak if missed a day
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        if (lastLogin && lastLogin !== todayStr && lastLogin !== yesterday.toDateString()) {
          streakDates = [];
        }

        // Add today if not already in streakDates
        if (!streakDates.includes(todayStr)) streakDates.push(todayStr);
        localStorage.setItem('streakDates', JSON.stringify(streakDates));
        localStorage.setItem('lastLogin', todayStr);

        // Header streak display
        if (streakEl) streakEl.textContent = `${streakDates.length}🔥`;

        // Calendar state
        let currentMonth = today.getMonth();
        let currentYear = today.getFullYear();

        // Render calendar
        const renderCalendar = (month = currentMonth, year = currentYear) => {
          // Fade out old grid if exists
          const oldGrid = streakCalendar.querySelector('.days-grid');
          if (oldGrid) oldGrid.classList.add('fade-out');

          setTimeout(() => {
            streakCalendar.innerHTML = '';

            // Calendar header
            const header = document.createElement('div');
            header.classList.add('calendar-header');

            const prevBtn = document.createElement('button');
            prevBtn.textContent = '<';
            const nextBtn = document.createElement('button');
            nextBtn.textContent = '>';
            const monthYear = document.createElement('span');
            const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
            monthYear.textContent = `${monthNames[month]} ${year}`;

            header.appendChild(prevBtn);
            header.appendChild(monthYear);
            header.appendChild(nextBtn);
            streakCalendar.appendChild(header);

            // Weekdays
            const weekdaysContainer = document.createElement('div');
            weekdaysContainer.classList.add('weekdays');
            ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(day => {
              const wd = document.createElement('div');
              wd.textContent = day;
              weekdaysContainer.appendChild(wd);
            });
            streakCalendar.appendChild(weekdaysContainer);

            // Days grid
            const daysGrid = document.createElement('div');
            daysGrid.classList.add('days-grid');

            const firstDay = new Date(year, month, 1).getDay();
            const totalDays = new Date(year, month + 1, 0).getDate();

            for (let i = 0; i < firstDay; i++) daysGrid.appendChild(document.createElement('div'));

            for (let day = 1; day <= totalDays; day++) {
              const dateStr = new Date(year, month, day).toDateString();
              const dayEl = document.createElement('div');
              dayEl.classList.add('day');
              dayEl.textContent = day;

              if (streakDates.includes(dateStr)) {
                dayEl.classList.add('streak-day');
                setTimeout(() => dayEl.classList.add('fade-in'), 50);
              }

              daysGrid.appendChild(dayEl);
            }

            streakCalendar.appendChild(daysGrid);

            // Navigation
            prevBtn.addEventListener('click', () => {
              currentMonth--;
              if (currentMonth < 0) { currentMonth = 11; currentYear--; }
              renderCalendar(currentMonth, currentYear);
            });
            nextBtn.addEventListener('click', () => {
              currentMonth++;
              if (currentMonth > 11) { currentMonth = 0; currentYear++; }
              renderCalendar(currentMonth, currentYear);
            });
          }, 200); // fade duration
        };

        renderCalendar();
      };


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
  }

  init()
})