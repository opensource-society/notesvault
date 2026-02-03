// Utility functions for performance optimization

/**
 * Debounce function - delays execution until after wait milliseconds have elapsed since last invocation
 * Useful for: search inputs, form validation, window resize handlers
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @returns {Function} - The debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function - ensures function is called at most once per specified time period
 * Useful for: scroll handlers, mouse move handlers, continuous events
 * @param {Function} func - The function to throttle
 * @param {number} limit - The time limit in milliseconds
 * @returns {Function} - The throttled function
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Cache a DOM element query to avoid repeated lookups
 * @param {string} selector - The CSS selector
 * @returns {Element|null} - The cached element
 */
const domCache = new Map();
function getCachedElement(selector) {
  if (!domCache.has(selector)) {
    domCache.set(selector, document.querySelector(selector));
  }
  return domCache.get(selector);
}

/**
 * Clear the DOM cache (useful after dynamic content changes)
 */
function clearDOMCache() {
  domCache.clear();
}
