import validator from 'validator';

/**
 * Validates a username string.
 * Rules: required, 5-30 chars, lowercase letters/numbers/underscores/hyphens only.
 * @param {string} value - The username to validate.
 * @param {object} [options]
 * @param {boolean} [options.required=true] - Whether the field is required.
 * @returns {string} Error message, or empty string if valid.
 */
const validateUsername = (value, { required = true } = {}) => {
  const trimmed = (value || '').trim();
  if (!trimmed) {
    return required ? 'Username is required.' : '';
  }
  if (trimmed.length < 5 || trimmed.length > 30) {
    return 'Username must be between 5 and 30 characters.';
  }
  if (!/^[a-z0-9_-]+$/.test(trimmed)) {
    return 'Username must contain only lowercase letters, numbers, underscores, and hyphens.';
  }
  return '';
};

/**
 * Validates a full name string.
 * Rules: required, 5-100 chars, letters and spaces only.
 * @param {string} value - The full name to validate.
 * @param {object} [options]
 * @param {boolean} [options.required=true] - Whether the field is required.
 * @returns {string} Error message, or empty string if valid.
 */
const validateFullName = (value, { required = true } = {}) => {
  const trimmed = (value || '').trim();
  if (!trimmed) {
    return required ? 'Full name is required.' : '';
  }
  if (trimmed.length < 5 || trimmed.length > 100) {
    return 'Full name must be between 5 and 100 characters.';
  }
  if (!/^[a-zA-Z\s]+$/.test(trimmed)) {
    return 'Full name must contain only letters and spaces.';
  }
  return '';
};

/**
 * Validates an email string.
 * @param {string} value - The email to validate.
 * @param {object} [options]
 * @param {boolean} [options.required=true] - Whether the field is required.
 * @returns {string} Error message, or empty string if valid.
 */
const validateEmail = (value, { required = true } = {}) => {
  const trimmed = (value || '').trim();
  if (!trimmed) {
    return required ? 'Email is required.' : '';
  }
  if (!validator.isEmail(trimmed)) {
    return 'Please enter a valid email address.';
  }
  return '';
};

/**
 * Validates a password string using validator.isStrongPassword.
 * Rules: min 8 chars, uppercase, lowercase, numbers, and symbols.
 * @param {string} value - The password to validate.
 * @param {object} [options]
 * @param {boolean} [options.required=true] - Whether the field is required.
 * @returns {string} Error message, or empty string if valid.
 */
const validatePassword = (value, { required = true } = {}) => {
  if (!value) {
    return required ? 'Password is required.' : '';
  }
  if (!validator.isStrongPassword(value)) {
    return 'Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and symbols.';
  }
  return '';
};

/**
 * Validates that two password strings match.
 * @param {string} password - The password value.
 * @param {string} confirmPassword - The confirmation password value.
 * @param {object} [options]
 * @param {boolean} [options.required=true] - Whether the field is required.
 * @returns {string} Error message, or empty string if valid.
 */
const validateConfirmPassword = (
  password,
  confirmPassword,
  { required = true } = {}
) => {
  if (!confirmPassword) {
    return required ? 'Please confirm your password.' : '';
  }
  if (password !== confirmPassword) {
    return "Passwords don't match.";
  }
  return '';
};

/**
 * Validates a phone number string.
 * @param {string} value - The phone number to validate.
 * @param {object} [options]
 * @param {string} [options.emptyValue='+91'] - Value treated as "empty" (prefix-only).
 * @returns {string} Error message, or empty string if valid.
 */
const validatePhoneNumber = (value, { emptyValue = '+91' } = {}) => {
  const trimmed = (value || '').trim();
  if (!trimmed || trimmed === emptyValue) {
    return ''; // Phone is optional
  }
  if (!validator.isMobilePhone(trimmed)) {
    return 'Please enter a valid phone number.';
  }
  return '';
};

export {
  validateUsername,
  validateFullName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validatePhoneNumber,
};
