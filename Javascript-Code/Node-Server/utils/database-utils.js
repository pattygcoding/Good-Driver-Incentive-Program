// Database utility functions to prevent SQL injection

/**
 * Escape string values for SQL queries (basic protection)
 * Note: This is a simple implementation. In production, always use parameterized queries
 * @param {string} str - String to escape
 * @returns {string} - Escaped string
 */
function escapeString(str) {
  if (typeof str !== 'string') {
    return str;
  }
  return str.replace(/'/g, "''").replace(/"/g, '""');
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (basic US format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid format
 */
function isValidPhone(phone) {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return phoneRegex.test(phone);
}

/**
 * Validate username (alphanumeric and underscores, 3-50 characters)
 * @param {string} username - Username to validate
 * @returns {boolean} - True if valid format
 */
function isValidUsername(username) {
  const usernameRegex = /^[a-zA-Z0-9_]{3,50}$/;
  return usernameRegex.test(username);
}

/**
 * Sanitize input to prevent XSS
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized input
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return input;
  }
  return input.replace(/[<>]/g, '');
}

/**
 * Generate secure random password
 * @param {number} length - Password length (default 12)
 * @returns {string} - Random password
 */
function generateRandomPassword(length = 12) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with isValid and message
 */
function validatePassword(password) {
  if (typeof password !== 'string') {
    return { isValid: false, message: 'Password must be a string' };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/\d/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  
  return { isValid: true, message: 'Password is valid' };
}

/**
 * Create parameterized query helper
 * @param {string} query - SQL query with ? placeholders
 * @param {array} params - Parameters to bind
 * @returns {object} - Query and params object
 */
function createQuery(query, params = []) {
  return { query, params };
}

module.exports = {
  escapeString,
  isValidEmail,
  isValidPhone,
  isValidUsername,
  sanitizeInput,
  generateRandomPassword,
  validatePassword,
  createQuery
};