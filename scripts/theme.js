// MultipleFiles/theme.js

document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('theme-toggle');
  
  // Exit if theme toggle button is not found on the page
  if (!themeToggle) {
    console.warn("Theme toggle button not found. Ensure an element with id 'theme-toggle' exists.");
    return; 
  }

  /**
   * Applies the given theme to the document's root element.
   * @param {string} theme - 'light' or 'dark'.
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    // Update the icon based on the applied theme
    if (theme === 'dark') {
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>'; // Sun icon for dark mode
      themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>'; // Moon icon for light mode
      themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
  }

  /**
   * Toggles the theme between 'light' and 'dark'.
   * Saves the new theme preference to localStorage.
   */
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme); // Save preference
  }

  /**
   * Initializes the theme on page load.
   * Checks localStorage first, then system preference (prefers-color-scheme).
   */
  function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
      applyTheme(savedTheme);
    } else if (prefersDark) {
      applyTheme('dark');
    } else {
      applyTheme('light'); // Default to light if no preference found
    }
  }

  // Attach event listener to the theme toggle button
  themeToggle.addEventListener('click', toggleTheme);

  // Initialize theme when the DOM content is fully loaded
  initTheme();
});
