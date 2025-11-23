document.addEventListener('DOMContentLoaded', () => {
  const DOM = {
    searchBranchContainer: document.getElementById('search-parameters-branch'),
    searchSemesterContainer: document.getElementById('search-parameters-semester'),
    searchSubjectContainer: document.getElementById('search-parameters-subject'),
    typewriterElement: document.getElementById('typewriter'),
    searchForm: document.querySelector('.search-form'),
    yearElement: document.getElementById('year'),
    backToTop: document.querySelector('.back-to-top'),
    testimonialTrack: document.querySelector('.testimonial-track'),
    testimonialCarousel: document.querySelector('.testimonial-carousel'),
    testimonialCards: document.querySelectorAll('.testimonial-card'),
    carouselDots: document.querySelector('.carousel-dots'),
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
    menuToggle?.classList.toggle('active')
    mobileNav?.classList.toggle('active')
    overlay?.classList.toggle('active')
    document.body.style.overflow = mobileNav?.classList.contains('active') ? 'hidden' : ''
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

    const handleScroll = () => {
      DOM.backToTop.classList.toggle('visible', window.scrollY > 300)
    }
    window.addEventListener('scroll', throttle(handleScroll, 100))
    DOM.backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }

  const throttle = (func, limit) => {
    let inThrottle
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }

  const updateNavbarAuth = () => {

    const user = window.auth && typeof window.auth.getUser === 'function' ? window.auth.getUser() : JSON.parse(localStorage.getItem('loggedInUser'))

    const loginLink = document.getElementById('nav-login')
    const signupLink = document.getElementById('nav-signup')
    const navUser = document.getElementById('nav-user')
    const navUserBtn = document.getElementById('nav-user-btn')
    const navUserName = document.getElementById('nav-user-name')
    const navUserDropdown = document.getElementById('nav-user-dropdown')
    const navLogoutBtn = document.getElementById('nav-logout-btn')

    const mobileLoginBtn = document.getElementById('mobile-nav-login')
    const mobileSignupBtn = document.getElementById('mobile-nav-signup')
    const mobileProfileBtn = document.getElementById('mobile-nav-profile')
    const mobileLogoutBtn = document.getElementById('mobile-nav-logout')
    const mobileMenuProfileItem = document.getElementById('mobile-menu-profile')

    const showLoggedIn = !!user

    if (loginLink && signupLink && navUser) {
      if (showLoggedIn) {
        loginLink.style.display = 'none'
        signupLink.style.display = 'none'
        navUser.style.display = 'inline-block'
        if (navUserName) navUserName.textContent = (user && (user.name || user.email)) || 'User'
      } else {
        loginLink.style.display = 'inline-block'
        signupLink.style.display = 'inline-block'
        navUser.style.display = 'none'
        if (navUserDropdown) navUserDropdown.style.display = 'none'
      }
    }

    if (mobileLoginBtn && mobileSignupBtn && mobileProfileBtn && mobileLogoutBtn) {
      if (showLoggedIn) {
        mobileLoginBtn.style.display = 'none'
        mobileSignupBtn.style.display = 'none'
        mobileProfileBtn.style.display = 'inline-block'
        mobileLogoutBtn.style.display = 'inline-block'
      } else {
        mobileLoginBtn.style.display = 'inline-block'
        mobileSignupBtn.style.display = 'inline-block'
        mobileProfileBtn.style.display = 'none'
        mobileLogoutBtn.style.display = 'none'
      }
    }

    if (mobileMenuProfileItem) mobileMenuProfileItem.style.display = showLoggedIn ? 'block' : 'none'

    if (navUserBtn && navUserDropdown) {
      navUserBtn.onclick = (e) => {
        e.preventDefault()
        const isOpen = navUserDropdown.style.display === 'block'
        navUserDropdown.style.display = isOpen ? 'none' : 'block'
        navUserBtn.setAttribute('aria-expanded', String(!isOpen))
      }

      document.addEventListener('click', (ev) => {
        if (!navUser.contains(ev.target)) {
          navUserDropdown.style.display = 'none'
          navUserBtn.setAttribute('aria-expanded', 'false')
        }
      })
    }

    if (navLogoutBtn) {
      navLogoutBtn.addEventListener('click', (e) => {
        e.preventDefault()
        if (window.auth && typeof window.auth.logout === 'function') {
          window.auth.logout()
        } else {
          localStorage.removeItem('loggedInUser')
          window.location.href = '/pages/login.html'
        }
      })
    }

    if (mobileLogoutBtn) {
      mobileLogoutBtn.addEventListener('click', (e) => {
        e.preventDefault()
        if (window.auth && typeof window.auth.logout === 'function') {
          window.auth.logout()
        } else {
          localStorage.removeItem('loggedInUser')
          window.location.href = '/pages/login.html'
        }
      })
    }
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

      document.addEventListener('auth-changed', updateNavbarAuth)
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

  const initTestimonialCarousel = () => {
    if (!DOM.testimonialTrack) return;

    const cards = DOM.testimonialCards;
    let currentIndex = 0;
    let autoSlideInterval;

    if (DOM.carouselDots && cards.length) {
      cards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        DOM.carouselDots.appendChild(dot);
      });
    }

    if (cards.length) {
      cards[0].classList.add('active');
    }

    const goToSlide = (index) => {
      if (!DOM.testimonialTrack || !cards.length) return;

      currentIndex = index;

      if (currentIndex < 0) currentIndex = cards.length - 1;
      if (currentIndex >= cards.length) currentIndex = 0;

      const slideWidth = cards[0].offsetWidth + parseInt(window.getComputedStyle(cards[0]).marginLeft) * 2;
      DOM.testimonialTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

      cards.forEach((card, i) => {
        card.classList.toggle('active', i === currentIndex);
      });

      const dots = DOM.carouselDots.querySelectorAll('.carousel-dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });

      resetAutoSlide();
    };

    const nextSlide = () => {
      goToSlide(currentIndex + 1);
    };

    const prevSlide = () => {
      goToSlide(currentIndex - 1);
    };

    const startAutoSlide = () => {
      autoSlideInterval = setInterval(nextSlide, 4000); // Change slide every 4 seconds
    };

    const resetAutoSlide = () => {
      clearInterval(autoSlideInterval);
      startAutoSlide();
    };

    startAutoSlide();

    let touchStartX = 0;
    let touchEndX = 0;

    if (DOM.testimonialCarousel) {
      DOM.testimonialCarousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      DOM.testimonialCarousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }, { passive: true });
    }

    const handleSwipe = () => {
      const swipeThreshold = 50;
      if (touchStartX - touchEndX > swipeThreshold) {

        nextSlide();
      } else if (touchEndX - touchStartX > swipeThreshold) {

        prevSlide();
      }
    };
  };

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


    DOM.testimonialTrack = document.querySelector('.testimonial-track');
    DOM.testimonialCarousel = document.querySelector('.testimonial-carousel');
    DOM.testimonialCards = document.querySelectorAll('.testimonial-card');
    DOM.carouselDots = document.querySelector('.carousel-dots');

    if (DOM.testimonialTrack) {
      initTestimonialCarousel();
    }
  }

  init()
})

document.addEventListener("DOMContentLoaded", () => {
  const welcomeBtn = document.getElementById("welcomeBackBtn");

  if (welcomeBtn) {
    welcomeBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const loggedInUser = localStorage.getItem("loggedInUser");

      if (loggedInUser) {
        window.location.href = "/pages/dashboard.html";
      } else {
        window.location.href = "/pages/login.html";
      }
    });
  }
});

function submitFeedback() {
    const rating = document.querySelector('input[name="rating"]:checked');
    const feedbackText = document.getElementById("feedback-text");
    const message = document.getElementById("feedback-message");

    const textValue = feedbackText.value.trim();
    if (!rating) {
      message.textContent = "Please select a rating before submitting.";
      message.style.color = "red";
      message.style.display = "block";
      return;
    }

    if (textValue.length > 0 && textValue.length < 2) {
      message.textContent = "Feedback must be at least 2 characters long.";
      message.style.color = "red";
      message.style.display = "block";
      return;
    }

    message.textContent = "✅ Your feedback has been submitted successfully!";
    message.style.color = "green";
    message.style.display = "block";

    feedbackText.value = "";
    rating.checked = false;

    setTimeout(() => {
      message.style.display = "none";
    }, 3000);
  }

  function skipFeedback() {
    const message = document.getElementById("feedback-message");
    message.textContent = "Feedback skipped.";
    message.style.color = "#555";
    message.style.display = "block";

    setTimeout(() => {
      message.style.display = "none";
    }, 2000);
  }