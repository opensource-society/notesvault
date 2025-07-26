document.addEventListener('DOMContentLoaded', function () {
    // --- Mobile Sidebar Toggle ---
    const hamburger = document.getElementById('hamburgerMenu');
    const sidebar = document.getElementById('mobileSidebar');

    if (hamburger && sidebar) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            sidebar.classList.toggle('active');
        });
    }
    
    document.addEventListener('click', (e) => {
        if (sidebar && !sidebar.contains(e.target) && sidebar.classList.contains('active')) {
            hamburger.classList.remove('active');
            sidebar.classList.remove('active');
        }
    });

    // --- Theme Toggle ---
    const themeToggleButton = document.getElementById('themeToggle');
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            const html = document.documentElement;
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // --- Initialize Theme on Page Load ---
    (function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', savedTheme || (prefersDark ? 'dark' : 'light'));
    })();

    // --- Typewriter Effect (for homepage) ---
    const typewriterElement = document.getElementById('typeWriterText');
    if (typewriterElement) {
        const words = ['Branch', 'Semester', 'Subject', 'Year'];
        let i = 0, j = 0, isDeleting = false;
        function type() {
            const currentWord = words[i];
            if (isDeleting) {
                typewriterElement.textContent = currentWord.substring(0, j--);
                if (j < 0) {
                    isDeleting = false; i = (i + 1) % words.length;
                }
            } else {
                typewriterElement.textContent = currentWord.substring(0, j++);
                if (j > currentWord.length) {
                    isDeleting = true;
                }
            }
            setTimeout(type, isDeleting ? 100 : 200);
        }
        type();
    }

    // --- Footer Year ---
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
