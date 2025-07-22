(function initTheme() {
            const savedTheme = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const defaultTheme = savedTheme || (prefersDark ? 'dark' : 'light');
            document.documentElement.setAttribute('data-theme', defaultTheme);
            
            const themeIcon = document.querySelector('.theme-toggle i');
            if (defaultTheme === 'dark') {
                themeIcon.classList.replace('fa-moon', 'fa-sun');
            }
        })();

        // Theme toggle function
        function toggleTheme() {
            const html = document.documentElement;
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            const themeIcon = document.querySelector('.theme-toggle i');
            if (newTheme === 'dark') {
                themeIcon.classList.replace('fa-moon', 'fa-sun');
            } else {
                themeIcon.classList.replace('fa-sun', 'fa-moon');
            }
        }

        // Typewriter effect
        document.addEventListener('DOMContentLoaded', function() {
            const texts = ['Subject', 'Semester', 'Branch', 'Course', 'Topic'];
            let textIndex = 0;
            let charIndex = 0;
            let isDeleting = false;
            let typeSpeed = 100;
            
            function typeWriter() {
                const currentText = texts[textIndex];
                const typewriterElement = document.getElementById('typeWriterText');
                
                if (isDeleting) {
                    typewriterElement.textContent = currentText.substring(0, charIndex - 1);
                    charIndex--;
                } else {
                    typewriterElement.textContent = currentText.substring(0, charIndex + 1);
                    charIndex++;
                }
                
                if (!isDeleting && charIndex === currentText.length) {
                    typeSpeed = 2000;
                    isDeleting = true;
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    textIndex = (textIndex + 1) % texts.length;
                    typeSpeed = 500;
                } else {
                    typeSpeed = isDeleting ? 50 : 100;
                }
                
                setTimeout(typeWriter, typeSpeed);
            }
            
            typeWriter();
            
            // Mobile menu toggle
            const hamburgerMenu = document.getElementById('hamburgerMenu');
            const headerNav = document.getElementById('header-navigation');
            
            if (hamburgerMenu && headerNav) {
                hamburgerMenu.addEventListener('click', function() {
                    headerNav.classList.toggle('show');
                    hamburgerMenu.classList.toggle('active');
                });
            }
            
            // Smooth scrolling for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                });
            });
            
            // Simulate upload form submission
            const uploadForm = document.getElementById('uploadForm');
            if (uploadForm) {
                uploadForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    // Show success message
                    alert('Resource uploaded successfully! (Simulated)');
                    
                    // Reset form
                    this.reset();
                });
            }
        });
