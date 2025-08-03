/**
 * Unified Header JavaScript
 * Handles mobile navigation functionality with proper accessibility and smooth animations
 */

class UnifiedHeader {
  constructor() {
    this.init();
  }

  init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this.setupEventListeners()
      );
    } else {
      this.setupEventListeners();
    }
  }

  setupEventListeners() {
    // Get DOM elements
    this.hamburgerBtn = document.getElementById("hamburger-btn");
    this.mobileNavOverlay = document.getElementById("mobile-nav-overlay");
    this.mobileNav = document.getElementById("mobile-nav");
    this.body = document.body;

    // Ensure elements exist
    if (!this.hamburgerBtn || !this.mobileNavOverlay) {
      console.warn("UnifiedHeader: Required elements not found");
      return;
    }

    // Hamburger button click handler
    this.hamburgerBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.toggleMobileNav();
    });

    // Overlay click handler (close menu when clicking outside)
    this.mobileNavOverlay.addEventListener("click", (e) => {
      if (e.target === this.mobileNavOverlay) {
        this.closeMobileNav();
      }
    });

    // Escape key handler
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isMobileNavOpen()) {
        this.closeMobileNav();
      }
    });

    // Handle window resize
    window.addEventListener("resize", () => this.handleResize());

    // Close mobile nav when clicking on navigation links
    const mobileNavLinks = this.mobileNav?.querySelectorAll(".mobile-nav-link");
    mobileNavLinks?.forEach((link) => {
      link.addEventListener("click", () => {
        // Small delay to allow navigation to start before closing menu
        setTimeout(() => this.closeMobileNav(), 100);
      });
    });

    // Set up focus trap for accessibility
    this.setupFocusTrap();
  }

  toggleMobileNav() {
    if (this.isMobileNavOpen()) {
      this.closeMobileNav();
    } else {
      this.openMobileNav();
    }
  }

  openMobileNav() {
    // Add active classes
    this.hamburgerBtn.classList.add("active");
    this.mobileNavOverlay.classList.add("active");

    // Prevent body scroll
    this.body.style.overflow = "hidden";

    // Update ARIA attributes for accessibility
    this.hamburgerBtn.setAttribute("aria-expanded", "true");
    this.mobileNavOverlay.setAttribute("aria-hidden", "false");

    // Focus first link in mobile nav for keyboard navigation
    const firstLink = this.mobileNav?.querySelector(".mobile-nav-link");
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 300);
    }

    // Announce to screen readers
    this.announceToScreenReader("Navigation menu opened");
  }

  closeMobileNav() {
    // Remove active classes
    this.hamburgerBtn.classList.remove("active");
    this.mobileNavOverlay.classList.remove("active");

    // Restore body scroll
    this.body.style.overflow = "";

    // Update ARIA attributes
    this.hamburgerBtn.setAttribute("aria-expanded", "false");
    this.mobileNavOverlay.setAttribute("aria-hidden", "true");

    // Return focus to hamburger button
    this.hamburgerBtn.focus();

    // Announce to screen readers
    this.announceToScreenReader("Navigation menu closed");
  }

  isMobileNavOpen() {
    return this.mobileNavOverlay?.classList.contains("active") || false;
  }

  handleResize() {
    // Close mobile nav when resizing to desktop view
    if (window.innerWidth > 768 && this.isMobileNavOpen()) {
      this.closeMobileNav();
    }
  }

  setupFocusTrap() {
    if (!this.mobileNav) return;

    const focusableElements = this.mobileNav.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );

    if (focusableElements.length === 0) return;

    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement =
      focusableElements[focusableElements.length - 1];

    this.mobileNav.addEventListener("keydown", (e) => {
      if (!this.isMobileNavOpen()) return;

      if (e.key === "Tab") {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            e.preventDefault();
          }
        } else {
          // Tab
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            e.preventDefault();
          }
        }
      }
    });
  }

  announceToScreenReader(message) {
    // Create a temporary element for screen reader announcements
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", "polite");
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;

    // Add styles to hide visually but keep accessible
    announcement.style.position = "absolute";
    announcement.style.left = "-10000px";
    announcement.style.width = "1px";
    announcement.style.height = "1px";
    announcement.style.overflow = "hidden";

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  // Public methods for external control
  open() {
    this.openMobileNav();
  }

  close() {
    this.closeMobileNav();
  }

  toggle() {
    this.toggleMobileNav();
  }

  isOpen() {
    return this.isMobileNavOpen();
  }
}

// Auto-initialize when script loads
const unifiedHeader = new UnifiedHeader();

// Export for use in other scripts if needed
if (typeof module !== "undefined" && module.exports) {
  module.exports = UnifiedHeader;
}

// Global access for debugging/external control
window.UnifiedHeader = UnifiedHeader;
window.unifiedHeaderInstance = unifiedHeader;
