
document.addEventListener('DOMContentLoaded', () => {
    function toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', savedTheme || (prefersDark ? 'dark' : 'light'));
    }

    const themeToggleButton = document.getElementById('themeToggle');
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', toggleTheme);
    }

    initTheme();
});

