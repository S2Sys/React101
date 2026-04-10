/**
 * Form Validation Utilities
 *
 * Reusable validation functions for form inputs.
 * Separated from components for better code organization and reusability.
 *
 * CONCEPTS: Validation logic, utility functions, error handling
 */

import { EMAIL_REGEX, PASSWORD_REQUIREMENTS, VALIDATION_RULES } from './constants';
import { FormErrors } from '../types';

// ============================================================================
// INDIVIDUAL FIELD VALIDATORS
// ============================================================================

/**
 * Validates an email address
 *
 * @param email - The email to validate
 * @returns Error message if invalid, empty string if valid
 *
 * CONCEPT: Email validation, string methods, regex matching
 */
export const validateEmail = (email: string): string => {
  if (!email || email.trim() === '') {
    return VALIDATION_RULES.EMAIL_REQUIRED;
  }
  if (!EMAIL_REGEX.test(email)) {
    return VALIDATION_RULES.EMAIL_INVALID;
  }
  return '';
};

/**
 * Validates a password
 *
 * @param password - The password to validate
 * @returns Error message if invalid, empty string if valid
 *
 * CONCEPT: Password validation, string length checking
 */
export const validatePassword = (password: string): string => {
  if (!password || password.trim() === '') {
    return VALIDATION_RULES.PASSWORD_REQUIRED;
  }
  if (password.length < PASSWORD_REQUIREMENTS.MIN_LENGTH) {
    return VALIDATION_RULES.PASSWORD_MIN_LENGTH;
  }
  return '';
};

/**
 * Validates that two passwords match
 *
 * @param password - First password
 * @param confirmPassword - Confirmation password
 * @returns Error message if they don't match, empty string if valid
 *
 * CONCEPT: Conditional validation, equality checking
 */
export const validatePasswordMatch = (password: string, confirmPassword: string): string => {
  if (!confirmPassword || confirmPassword.trim() === '') {
    return VALIDATION_RULES.CONFIRM_PASSWORD_REQUIRED;
  }
  if (password !== confirmPassword) {
    return VALIDATION_RULES.PASSWORDS_DONT_MATCH;
  }
  return '';
};

/**
 * Validates a name field
 *
 * @param name - The name to validate
 * @returns Error message if invalid, empty string if valid
 *
 * CONCEPT: String validation, trimming
 */
export const validateName = (name: string): string => {
  if (!name || name.trim() === '') {
    return VALIDATION_RULES.NAME_REQUIRED;
  }
  return '';
};

/**
 * Validates a note title
 *
 * @param title - The title to validate
 * @returns Error message if invalid, empty string if valid
 *
 * CONCEPT: Field validation, required fields
 */
export const validateTitle = (title: string): string => {
  if (!title || title.trim() === '') {
    return VALIDATION_RULES.TITLE_REQUIRED;
  }
  return '';
};

/**
 * Validates note content
 *
 * @param content - The content to validate
 * @returns Error message if invalid, empty string if valid
 *
 * CONCEPT: Text content validation
 */
export const validateContent = (content: string): string => {
  if (!content || content.trim() === '') {
    return VALIDATION_RULES.CONTENT_REQUIRED;
  }
  return '';
};

// ============================================================================
// FORM-LEVEL VALIDATORS
// ============================================================================

/**
 * Validates login form data
 *
 * @param email - Email from form
 * @param password - Password from form
 * @returns Object containing field errors
 *
 * CONCEPT: Form validation, object return types, multiple field validation
 */
export const validateLoginForm = (email: string, password: string): FormErrors => {
  const errors: FormErrors = {};

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;

  return errors;
};

/**
 * Validates signup form data
 *
 * @param email - Email from form
 * @param password - Password from form
 * @param confirmPassword - Password confirmation
 * @param name - User name
 * @returns Object containing field errors
 *
 * CONCEPT: Complex form validation, multiple field dependencies
 */
export const validateSignupForm = (
  email: string,
  password: string,
  confirmPassword: string,
  name: string
): FormErrors => {
  const errors: FormErrors = {};

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const nameError = validateName(name);
  if (nameError) errors.name = nameError;

  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;

  const passwordMatchError = validatePasswordMatch(password, confirmPassword);
  if (passwordMatchError) errors.confirmPassword = passwordMatchError;

  return errors;
};

/**
 * Validates note form data
 *
 * @param title - Note title
 * @param content - Note content
 * @returns Object containing field errors
 *
 * CONCEPT: Content validation, form-level validation
 */
export const validateNoteForm = (title: string, content: string): FormErrors => {
  const errors: FormErrors = {};

  const titleError = validateTitle(title);
  if (titleError) errors.title = titleError;

  const contentError = validateContent(content);
  if (contentError) errors.content = contentError;

  return errors;
};

// ============================================================================
// UTILITY VALIDATORS
// ============================================================================

/**
 * Checks if a form has any errors
 *
 * @param errors - The errors object to check
 * @returns True if there are any errors, false otherwise
 *
 * CONCEPT: Object property iteration, boolean logic
 */
export const hasErrors = (errors: FormErrors): boolean => {
  return Object.keys(errors).length > 0;
};

/**
 * Clears all errors from a field (or all fields)
 *
 * @param field - Optional field name to clear specific error
 * @returns New errors object with field error cleared
 *
 * CONCEPT: Immutable updates, object manipulation
 */
export const clearFieldError = (errors: FormErrors, field?: string): FormErrors => {
  if (!field) return {};
  const newErrors = { ...errors };
  delete newErrors[field];
  return newErrors;
};

/**
 * Validates an entire form with custom rules
 *
 * @param values - Form values object
 * @param rules - Custom validation rules
 * @returns Object containing validation errors
 *
 * CONCEPT: Flexible validation, custom rules, higher-order functions
 */
export const validateForm = (
  values: Record<string, any>,
  rules: Record<string, (value: any) => string>
): FormErrors => {
  const errors: FormErrors = {};

  Object.keys(rules).forEach((field) => {
    const error = rules[field](values[field]);
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
};
