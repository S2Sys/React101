/**
 * TypeScript Interface Definitions
 *
 * This file contains all the TypeScript interfaces and types used throughout
 * the application. Using interfaces ensures type safety and helps catch errors
 * at compile time.
 *
 * CONCEPTS: TypeScript Types, Interfaces, Union Types, Generic Types
 */

// ============================================================================
// USER & AUTHENTICATION TYPES
// ============================================================================

/**
 * Represents a user in the system
 * Used in auth context and user profile pages
 */
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

/**
 * Login request payload for the mock API
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Signup request payload for the mock API
 */
export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
}

/**
 * Authentication response from the mock API
 * Includes user info and JWT token
 */
export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * Auth context state - represents current authentication status
 */
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// ============================================================================
// NOTES/CONTENT TYPES
// ============================================================================

/**
 * Represents a single note in the application
 * CONCEPTS: Data structure, union types for status
 */
export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Request payload for creating a new note
 */
export interface CreateNoteRequest {
  title: string;
  content: string;
  tags: string[];
}

/**
 * Request payload for updating an existing note
 */
export interface UpdateNoteRequest {
  title: string;
  content: string;
  tags: string[];
}

/**
 * Notes context state - represents all notes and their management state
 * CONCEPTS: Complex state structure with loading/error states
 */
export interface NotesContextType {
  notes: Note[];
  isLoading: boolean;
  error: string | null;
  filteredNotes: Note[];
  fetchNotes: () => Promise<void>;
  createNote: (request: CreateNoteRequest) => Promise<Note>;
  updateNote: (id: string, request: UpdateNoteRequest) => Promise<Note>;
  deleteNote: (id: string) => Promise<void>;
  setSearchTerm: (term: string) => void;
  clearError: () => void;
}

/**
 * Notes reducer action types
 * CONCEPTS: Union types, discriminated unions for type safety
 */
export type NotesAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Note[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: Note }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'SET_FILTER'; payload: string }
  | { type: 'CLEAR_ERROR' };

/**
 * Notes reducer state
 * Separated from context to keep track of internal state
 */
export interface NotesState {
  notes: Note[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
}

// ============================================================================
// FORM & VALIDATION TYPES
// ============================================================================

/**
 * Form field error object
 * Maps field names to their error messages
 */
export type FormErrors = Record<string, string>;

/**
 * Form state for useForm hook
 * Generic type that can be used with any form data structure
 */
export interface FormState<T> {
  values: T;
  errors: FormErrors;
  touched: Record<keyof T, boolean>;
  isSubmitting: boolean;
  isDirty: boolean;
}

/**
 * Form handler type for useForm hook
 */
export interface FormHandlers<T> {
  values: T;
  errors: FormErrors;
  touched: Record<keyof T, boolean>;
  isSubmitting: boolean;
  isDirty: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (callback: (values: T) => Promise<void>) => (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
  setFieldValue: (field: keyof T, value: any) => void;
}

// ============================================================================
// API & HTTP TYPES
// ============================================================================

/**
 * Generic API response type
 * Represents successful API responses
 */
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

/**
 * API error response
 */
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

/**
 * Fetch hook state and handlers
 * Generic type for fetching any data type
 */
export interface UseFetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// ============================================================================
// PAGINATION & SORTING
// ============================================================================

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/**
 * Sorting configuration
 */
export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Generic success result type
 * Used in functions that can succeed or fail
 */
export interface Result<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Debounce options
 */
export interface DebounceOptions {
  delay: number;
  leading?: boolean;
  trailing?: boolean;
}
