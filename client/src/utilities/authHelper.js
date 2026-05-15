// Helper functions for authentication and localStorage management

/**
 * Save user data to localStorage and trigger userChanged event
 * @param {Object} userData - User data object
 */
export const setUserToStorage = (userData) => {
  if (userData) {
    localStorage.setItem("user", JSON.stringify(userData));
    // Trigger custom event to notify all listeners
    window.dispatchEvent(new CustomEvent("userChanged", { detail: userData }));
  }
};

/**
 * Remove user data from localStorage and trigger userChanged event
 */
export const removeUserFromStorage = () => {
  localStorage.removeItem("user");
  // Trigger custom event with null detail
  window.dispatchEvent(new CustomEvent("userChanged", { detail: null }));
};

/**
 * Get user data from localStorage
 * @returns {Object|null} User data or null
 */
export const getUserFromStorage = () => {
  try {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  } catch (e) {
    console.error("Error reading user data from localStorage:", e);
    return null;
  }
};
