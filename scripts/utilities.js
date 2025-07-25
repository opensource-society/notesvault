// Utility functions for NotesVault
// Common helper functions used across multiple JavaScript files

/**
 * Creates a dropdown select element with options
 * @param {HTMLElement} container - The container to append the dropdown to
 * @param {string} id - The ID for the select element
 * @param {string} defaultText - The default placeholder text
 * @param {Array} options - Array of option values
 * @returns {HTMLSelectElement} The created select element
 */
function createDropdown(container, id, defaultText, options) {
  // Clear the container first
  container.innerHTML = '';

  // Create the <select> element
  const select = document.createElement("select");
  select.id = id;
  select.className = "search-parameters-select";

  // Create the disabled default option
  const defaultOption = document.createElement("option");
  defaultOption.disabled = true;
  defaultOption.selected = true;
  defaultOption.innerHTML = defaultText;
  select.appendChild(defaultOption);

  // Create options from the provided array
  options.forEach(opt => {
    const option = document.createElement("option");
    option.value = opt;
    option.innerHTML = opt;
    select.appendChild(option);
  });

  // Add the new dropdown to the page
  container.appendChild(select);
  return select; // Return the created select element
}

/**
 * Shows a message box with specified text and type
 * @param {string} message - The message to display
 * @param {string} type - The type of message (success, error, info)
 */
function showMessage(message, type = 'info') {
  const messageBox = document.createElement('div');
  messageBox.className = `message-box ${type}`;
  messageBox.textContent = message;
  
  document.body.appendChild(messageBox);
  
  // Show the message
  setTimeout(() => {
    messageBox.classList.add('show');
  }, 100);
  
  // Hide the message after 3 seconds
  setTimeout(() => {
    messageBox.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(messageBox);
    }, 500);
  }, 3000);
}

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - The function to debounce
 * @param {number} delay - The delay in milliseconds
 * @returns {Function} The debounced function
 */
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Export functions if using modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createDropdown,
    showMessage,
    debounce
  };
}