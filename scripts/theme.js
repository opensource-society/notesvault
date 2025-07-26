// ===== THEME MANAGEMENT SYSTEM =====
// This script provides consistent theme switching across all pages

class ThemeManager {
  constructor() {
    this.themeToggleButton = document.getElementById('themeToggle');
    this.html = document.documentElement;
    this.currentTheme = this.getCurrentTheme();
    
    this.init();
  }

  getCurrentTheme() {
    return localStorage.getItem('theme') || this.getSystemPreference();
  }

  getSystemPreference() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  setTheme(theme) {
    this.html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.currentTheme = theme;
    
    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(theme);
    
    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
  }

  updateMetaThemeColor(theme) {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    
    metaThemeColor.content = theme === 'dark' ? '#0d0d0d' : '#ffffff';
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
    
    // Add animation class for smooth transition
    if (this.themeToggleButton) {
      this.themeToggleButton.classList.add('theme-transitioning');
      setTimeout(() => {
        this.themeToggleButton.classList.remove('theme-transitioning');
      }, 300);
    }
  }

  init() {
    // Set initial theme
    this.setTheme(this.currentTheme);
    
    // Add event listener to toggle button
    if (this.themeToggleButton) {
      this.themeToggleButton.addEventListener('click', () => this.toggleTheme());
      
      // Add keyboard support
      this.themeToggleButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleTheme();
        }
      });
    }
    
    // Listen for system theme changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        if (!localStorage.getItem('theme')) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  window.themeManager = new ThemeManager();
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
  // DOM is still loading, wait for DOMContentLoaded
} else {
  // DOM is already loaded, initialize immediately
  window.themeManager = new ThemeManager();
} 