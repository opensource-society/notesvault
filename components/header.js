document.addEventListener('DOMContentLoaded', () => {
    fetch('../components/header.html')
    .then(res => res.text())
    .then(data => {
        document.getElementById('header-holder').innerHTML = data;
        
        // NOW initialize the theme toggle after header is loaded
        initializeThemeToggle();
    });
});

// Theme toggle functionality
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    if (!themeToggle) {
        console.error('Theme toggle button not found');
        return;
    }
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    body.classList.add(currentTheme + '-mode');
    
    // Update button icon based on current theme
    themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
    
    themeToggle.addEventListener('click', function() {
        if (body.classList.contains('dark-mode')) {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
            themeToggle.textContent = '🌙';
        } else {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
            themeToggle.textContent = '☀️';
        }
    });
}