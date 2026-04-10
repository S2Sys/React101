/**
 * Helper Utility Functions
 *
 * General-purpose utility functions used throughout the application.
 *
 * CONCEPTS: Utility functions, date formatting, string manipulation, filtering
 */

import { Note } from '../types';

// ============================================================================
// DATE & TIME UTILITIES
// ============================================================================

/**
 * Formats a date string to a readable format
 *
 * Example: "2024-01-15T10:30:00Z" => "Jan 15, 2024"
 *
 * @param dateString - ISO date string
 * @returns Formatted date string
 *
 * CONCEPT: Date manipulation, Intl API, date formatting
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
};

/**
 * Formats a date with time
 *
 * Example: "2024-01-15T10:30:00Z" => "Jan 15, 2024 at 10:30 AM"
 *
 * @param dateString - ISO date string
 * @returns Formatted date and time string
 *
 * CONCEPT: Date and time formatting with Intl API
 */
export const formatDateTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return dateString;
  }
};

/**
 * Returns how long ago a date was (e.g., "2 hours ago")
 *
 * @param dateString - ISO date string
 * @returns Relative time string
 *
 * CONCEPT: Relative time calculation, date math
 */
export const getRelativeTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return formatDate(dateString);
  } catch {
    return dateString;
  }
};

// ============================================================================
// STRING UTILITIES
// ============================================================================

/**
 * Truncates a string to a maximum length with ellipsis
 *
 * Example: "Hello World" with maxLength 8 => "Hello..."
 *
 * @param str - String to truncate
 * @param maxLength - Maximum length
 * @returns Truncated string
 *
 * CONCEPT: String manipulation, conditional length checking
 */
export const truncateString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
};

/**
 * Converts a string to title case
 *
 * Example: "hello world" => "Hello World"
 *
 * @param str - String to convert
 * @returns Title cased string
 *
 * CONCEPT: String transformation, array methods, map/join
 */
export const toTitleCase = (str: string): string => {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Capitalizes the first letter of a string
 *
 * @param str - String to capitalize
 * @returns String with first letter capitalized
 *
 * CONCEPT: String manipulation
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Removes extra whitespace from a string
 *
 * @param str - String to clean
 * @returns Cleaned string
 *
 * CONCEPT: String trimming and whitespace handling
 */
export const cleanWhitespace = (str: string): string => {
  return str.replace(/\s+/g, ' ').trim();
};

// ============================================================================
// ARRAY & OBJECT UTILITIES
// ============================================================================

/**
 * Removes duplicates from an array
 *
 * @param arr - Array to deduplicate
 * @returns Array with unique values
 *
 * CONCEPT: Set data structure, array filtering, uniqueness
 */
export const getUnique = <T>(arr: T[]): T[] => {
  return Array.from(new Set(arr));
};

/**
 * Searches for notes by title or content
 *
 * @param notes - Array of notes to search
 * @param searchTerm - Term to search for (case-insensitive)
 * @returns Filtered array of matching notes
 *
 * CONCEPT: Array filtering, string searching, case-insensitive matching
 */
export const searchNotes = (notes: Note[], searchTerm: string): Note[] => {
  if (!searchTerm.trim()) return notes;

  const term = searchTerm.toLowerCase();
  return notes.filter(
    (note) =>
      note.title.toLowerCase().includes(term) ||
      note.content.toLowerCase().includes(term) ||
      note.tags.some((tag) => tag.toLowerCase().includes(term))
  );
};

/**
 * Filters notes by tags
 *
 * @param notes - Array of notes to filter
 * @param selectedTags - Tags to filter by
 * @returns Notes that have at least one of the selected tags
 *
 * CONCEPT: Array filtering, tag-based filtering, set intersection
 */
export const filterNotesByTags = (notes: Note[], selectedTags: string[]): Note[] => {
  if (selectedTags.length === 0) return notes;

  return notes.filter((note) =>
    note.tags.some((tag) => selectedTags.includes(tag))
  );
};

/**
 * Sorts notes by a specific field
 *
 * @param notes - Array of notes to sort
 * @param sortBy - Field to sort by ('createdAt', 'updatedAt', 'title')
 * @param ascending - Sort direction (true = ascending, false = descending)
 * @returns Sorted array of notes
 *
 * CONCEPT: Array sorting, date comparison, string comparison
 */
export const sortNotes = (
  notes: Note[],
  sortBy: 'createdAt' | 'updatedAt' | 'title' = 'createdAt',
  ascending: boolean = false
): Note[] => {
  const sorted = [...notes];

  sorted.sort((a, b) => {
    let aVal: any;
    let bVal: any;

    if (sortBy === 'title') {
      aVal = a.title.toLowerCase();
      bVal = b.title.toLowerCase();
    } else {
      aVal = new Date(a[sortBy]).getTime();
      bVal = new Date(b[sortBy]).getTime();
    }

    if (aVal < bVal) return ascending ? -1 : 1;
    if (aVal > bVal) return ascending ? 1 : -1;
    return 0;
  });

  return sorted;
};

/**
 * Groups notes by a specific field
 *
 * @param notes - Array of notes to group
 * @param groupBy - Field to group by
 * @returns Object with grouped notes
 *
 * CONCEPT: Object grouping, reduce function, higher-order data structures
 */
export const groupNotesByDate = (
  notes: Note[]
): Record<string, Note[]> => {
  return notes.reduce(
    (groups, note) => {
      const date = formatDate(note.createdAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(note);
      return groups;
    },
    {} as Record<string, Note[]>
  );
};

// ============================================================================
// ID & KEY GENERATION
// ============================================================================

/**
 * Generates a unique ID
 *
 * Uses timestamp + random number for simplicity
 * Not cryptographically secure, suitable for local/demo apps
 *
 * @returns Unique string ID
 *
 * CONCEPT: ID generation, random numbers, string concatenation
 */
export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generates a URL-friendly slug from a string
 *
 * Example: "Hello World" => "hello-world"
 *
 * @param str - String to convert to slug
 * @returns URL-friendly slug
 *
 * CONCEPT: String transformation, regex, URL encoding
 */
export const generateSlug = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// ============================================================================
// VALIDATION & TYPE CHECKING
// ============================================================================

/**
 * Checks if an object is empty (no keys)
 *
 * @param obj - Object to check
 * @returns True if empty, false otherwise
 *
 * CONCEPT: Object property iteration, truthiness
 */
export const isEmpty = (obj: Record<string, any>): boolean => {
  return Object.keys(obj).length === 0;
};

/**
 * Deep clones an object
 *
 * Note: Uses JSON.parse/stringify, suitable for simple objects
 * Does not work with functions, undefined, or circular references
 *
 * @param obj - Object to clone
 * @returns Deep cloned object
 *
 * CONCEPT: Object cloning, JSON serialization, immutability
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

// ============================================================================
// COLOR & DISPLAY UTILITIES
// ============================================================================

/**
 * Returns a consistent color based on a string
 * Useful for avatar backgrounds, tag colors, etc.
 *
 * @param str - String to generate color from
 * @returns Hex color code
 *
 * CONCEPT: Hash functions, color generation, consistency
 */
export const getColorFromString = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = (hash & 0xffffff).toString(16).padStart(6, '0');
  return `#${color}`;
};
