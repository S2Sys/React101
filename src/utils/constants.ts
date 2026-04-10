/**
 * Application Constants
 *
 * Centralized constants used throughout the application.
 * This makes it easy to change behavior globally.
 *
 * CONCEPTS: Constants, Configuration, API Configuration
 */

// ============================================================================
// API SIMULATION SETTINGS
// ============================================================================

/**
 * Delay in milliseconds for mock API responses
 * Simulates network latency to make the app feel more realistic
 * CONCEPT: Network simulation, realistic delays
 */
export const MOCK_API_DELAY = {
  SHORT: 200,    // Fast operations
  MEDIUM: 500,   // Standard operations
  LONG: 1000,    // Slow operations (for testing error states)
};

/**
 * Storage keys for localStorage
 * CONCEPT: Data persistence
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  NOTES: 'notes_data',
  SEARCH_HISTORY: 'search_history',
};

// ============================================================================
// VALIDATION RULES
// ============================================================================

/**
 * Email regex pattern for validation
 * CONCEPT: Input validation, regular expressions
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Password requirements
 * CONCEPT: Security, input validation
 */
export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 6,
  REQUIRE_UPPERCASE: false,
  REQUIRE_NUMBERS: false,
  REQUIRE_SPECIAL_CHARS: false,
};

/**
 * Form field validation rules
 * CONCEPT: Centralized validation configuration
 */
export const VALIDATION_RULES = {
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_MIN_LENGTH: `Password must be at least ${PASSWORD_REQUIREMENTS.MIN_LENGTH} characters`,
  NAME_REQUIRED: 'Name is required',
  CONFIRM_PASSWORD_REQUIRED: 'Please confirm your password',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  TITLE_REQUIRED: 'Title is required',
  CONTENT_REQUIRED: 'Content is required',
};

// ============================================================================
// ERROR MESSAGES
// ============================================================================

/**
 * Error messages used throughout the app
 * CONCEPT: User-friendly error handling
 */
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_EXISTS: 'User with this email already exists',
  NETWORK_ERROR: 'Network error. Please try again.',
  SERVER_ERROR: 'Server error. Please try again.',
  UNKNOWN_ERROR: 'An unknown error occurred',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'The requested resource was not found',
  NOTE_NOT_FOUND: 'Note not found',
  INVALID_INPUT: 'Invalid input provided',
};

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================

/**
 * Success messages for user feedback
 * CONCEPT: User experience, feedback messages
 */
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  SIGNUP_SUCCESS: 'Account created successfully',
  NOTE_CREATED: 'Note created successfully',
  NOTE_UPDATED: 'Note updated successfully',
  NOTE_DELETED: 'Note deleted successfully',
  LOGOUT_SUCCESS: 'You have been logged out',
};

// ============================================================================
// ROUTES
// ============================================================================

/**
 * Application routes
 * CONCEPT: Centralized route configuration
 */
export const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  NOTE_DETAIL: '/notes/:id',
  PROFILE: '/profile',
  SETTINGS: '/settings',
};

// ============================================================================
// UI CONSTANTS
// ============================================================================

/**
 * Debounce delays for search and input
 * CONCEPT: Performance optimization, debouncing
 */
export const DEBOUNCE_DELAY = {
  SEARCH: 300,
  INPUT: 500,
  RESIZE: 200,
};

/**
 * Pagination settings
 * CONCEPT: Data pagination, limits
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

/**
 * Default note tags for suggestions
 */
export const DEFAULT_TAGS = [
  'personal',
  'work',
  'ideas',
  'todo',
  'important',
  'archive',
];

// ============================================================================
// LOCAL STORAGE QUOTA
// ============================================================================

/**
 * Maximum notes to store in mock backend
 * CONCEPT: Limits, constraints
 */
export const MAX_NOTES = 100;

/**
 * Token expiration time (in milliseconds)
 * For demo purposes, tokens don't actually expire
 * CONCEPT: Authentication, token management
 */
export const TOKEN_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours
