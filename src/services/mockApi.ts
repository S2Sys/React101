/**
 * Mock API Service
 *
 * Simulates a backend API for authentication and CRUD operations.
 * This allows us to learn frontend concepts without needing a real server.
 *
 * CONCEPTS: Async/await, Promise, setTimeout, mock data, API simulation
 */

import { MOCK_API_DELAY, ERROR_MESSAGES } from '../utils/constants';
import { User, AuthResponse, Note, CreateNoteRequest, UpdateNoteRequest } from '../types';
import { generateId } from '../utils/helpers';

// ============================================================================
// IN-MEMORY STORAGE (Simulated Database)
// ============================================================================

/**
 * This simulates a database
 * In a real app, this would be on a server
 *
 * CONCEPT: Data persistence simulation, in-memory storage
 */
let mockUsers: Map<string, { user: User; password: string }> = new Map();
let mockNotes: Map<string, Note> = new Map();

/**
 * Initializes mock data for demonstration
 * CONCEPT: Initial data setup, demo data
 */
const initializeMockData = () => {
  // Demo users (password is always "password" for demo)
  const demoUser: User = {
    id: generateId(),
    email: 'demo@example.com',
    name: 'Demo User',
    createdAt: new Date().toISOString(),
  };

  mockUsers.set(demoUser.email, {
    user: demoUser,
    password: 'password',
  });

  // Demo notes for the demo user
  const demoNotes: Note[] = [
    {
      id: generateId(),
      userId: demoUser.id,
      title: 'React Hooks Guide',
      content: 'useState, useEffect, useContext are the most commonly used hooks...',
      tags: ['react', 'hooks', 'learning'],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      userId: demoUser.id,
      title: 'Understanding useEffect',
      content: 'useEffect runs after the component renders. The dependency array controls when it runs.',
      tags: ['react', 'hooks', 'useEffect'],
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  demoNotes.forEach((note) => {
    mockNotes.set(note.id, note);
  });
};

// Initialize on module load
initializeMockData();

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Simulates network delay for API calls
 * Makes the app feel more realistic
 *
 * @param ms - Delay in milliseconds
 * @returns Promise that resolves after the delay
 *
 * CONCEPT: setTimeout, Promise, async simulation
 */
const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Finds a user by email
 *
 * @param email - Email to search for
 * @returns User data or null if not found
 *
 * CONCEPT: Map searching, error handling
 */
const findUserByEmail = (email: string): { user: User; password: string } | null => {
  return mockUsers.get(email) || null;
};

/**
 * Finds a note by ID
 *
 * @param noteId - Note ID to search for
 * @returns Note or null if not found
 */
const findNoteById = (noteId: string): Note | null => {
  return mockNotes.get(noteId) || null;
};

/**
 * Gets all notes for a user
 *
 * @param userId - User ID to get notes for
 * @returns Array of notes for the user
 *
 * CONCEPT: Array filtering, data retrieval
 */
const getNotesByUserId = (userId: string): Note[] => {
  return Array.from(mockNotes.values()).filter((note) => note.userId === userId);
};

// ============================================================================
// AUTHENTICATION API
// ============================================================================

/**
 * Login endpoint
 *
 * Validates credentials and returns user with token
 *
 * @param email - User email
 * @param password - User password
 * @returns Promise with user and token
 *
 * CONCEPT: Authentication, error handling, async operations
 */
export const apiLogin = async (email: string, password: string): Promise<AuthResponse> => {
  // Simulate network delay
  await delay(MOCK_API_DELAY.MEDIUM);

  // Find user
  const userData = findUserByEmail(email);

  // Validate credentials
  if (!userData || userData.password !== password) {
    throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
  }

  // Return user and a mock JWT token
  // In a real app, this would come from the server
  const token = btoa(`${userData.user.id}:${Date.now()}`); // Simple mock token

  return {
    user: userData.user,
    token,
  };
};

/**
 * Signup endpoint
 *
 * Creates a new user account
 *
 * @param email - User email
 * @param password - User password
 * @param name - User name
 * @returns Promise with newly created user and token
 *
 * CONCEPT: User creation, validation, error handling
 */
export const apiSignup = async (
  email: string,
  password: string,
  name: string
): Promise<AuthResponse> => {
  // Simulate network delay
  await delay(MOCK_API_DELAY.MEDIUM);

  // Check if user already exists
  if (mockUsers.has(email)) {
    throw new Error(ERROR_MESSAGES.USER_EXISTS);
  }

  // Create new user
  const newUser: User = {
    id: generateId(),
    email,
    name,
    createdAt: new Date().toISOString(),
  };

  // Store user
  mockUsers.set(email, {
    user: newUser,
    password, // In a real app, this would be hashed!
  });

  // Return user and token
  const token = btoa(`${newUser.id}:${Date.now()}`);

  return {
    user: newUser,
    token,
  };
};

/**
 * Validates a token
 *
 * In a real app, this would verify the JWT signature
 *
 * @param token - Token to validate
 * @returns Promise with user data if valid
 *
 * CONCEPT: Token validation, authentication
 */
export const apiValidateToken = async (token: string): Promise<User | null> => {
  await delay(MOCK_API_DELAY.SHORT);

  try {
    // Decode the mock token (very basic, for demo only)
    const decoded = atob(token);
    const [userId] = decoded.split(':');

    // Find user by ID
    for (const userData of mockUsers.values()) {
      if (userData.user.id === userId) {
        return userData.user;
      }
    }

    return null;
  } catch {
    return null;
  }
};

// ============================================================================
// NOTES CRUD API
// ============================================================================

/**
 * Fetch all notes for a user
 *
 * @param userId - User ID to fetch notes for
 * @returns Promise with array of notes
 *
 * CONCEPT: Data retrieval, filtering, async operations
 */
export const apiFetchNotes = async (userId: string): Promise<Note[]> => {
  await delay(MOCK_API_DELAY.MEDIUM);

  return getNotesByUserId(userId);
};

/**
 * Fetch a single note by ID
 *
 * @param noteId - Note ID to fetch
 * @param userId - User ID (for verification)
 * @returns Promise with note data
 *
 * CONCEPT: Single item retrieval, error handling
 */
export const apiFetchNoteById = async (noteId: string, userId: string): Promise<Note> => {
  await delay(MOCK_API_DELAY.SHORT);

  const note = findNoteById(noteId);

  if (!note || note.userId !== userId) {
    throw new Error(ERROR_MESSAGES.NOTE_NOT_FOUND);
  }

  return note;
};

/**
 * Create a new note
 *
 * @param userId - User creating the note
 * @param request - Note creation data
 * @returns Promise with newly created note
 *
 * CONCEPT: Data creation, UUID generation, timestamp handling
 */
export const apiCreateNote = async (
  userId: string,
  request: CreateNoteRequest
): Promise<Note> => {
  await delay(MOCK_API_DELAY.MEDIUM);

  const now = new Date().toISOString();

  const newNote: Note = {
    id: generateId(),
    userId,
    title: request.title,
    content: request.content,
    tags: request.tags || [],
    createdAt: now,
    updatedAt: now,
  };

  // Store the note
  mockNotes.set(newNote.id, newNote);

  return newNote;
};

/**
 * Update an existing note
 *
 * @param noteId - Note ID to update
 * @param userId - User ID (for verification)
 * @param request - Note update data
 * @returns Promise with updated note
 *
 * CONCEPT: Data updates, immutability, error handling
 */
export const apiUpdateNote = async (
  noteId: string,
  userId: string,
  request: UpdateNoteRequest
): Promise<Note> => {
  await delay(MOCK_API_DELAY.MEDIUM);

  const note = findNoteById(noteId);

  if (!note || note.userId !== userId) {
    throw new Error(ERROR_MESSAGES.NOTE_NOT_FOUND);
  }

  // Create updated note (immutable update)
  const updatedNote: Note = {
    ...note,
    title: request.title,
    content: request.content,
    tags: request.tags || [],
    updatedAt: new Date().toISOString(),
  };

  // Store the update
  mockNotes.set(noteId, updatedNote);

  return updatedNote;
};

/**
 * Delete a note
 *
 * @param noteId - Note ID to delete
 * @param userId - User ID (for verification)
 * @returns Promise that resolves when deleted
 *
 * CONCEPT: Data deletion, verification, authorization
 */
export const apiDeleteNote = async (noteId: string, userId: string): Promise<void> => {
  await delay(MOCK_API_DELAY.MEDIUM);

  const note = findNoteById(noteId);

  if (!note || note.userId !== userId) {
    throw new Error(ERROR_MESSAGES.NOTE_NOT_FOUND);
  }

  // Delete the note
  mockNotes.delete(noteId);
};

// ============================================================================
// UTILITY API FUNCTIONS
// ============================================================================

/**
 * Gets user profile data
 *
 * @param userId - User ID to fetch
 * @returns Promise with user data
 *
 * CONCEPT: User profile fetching
 */
export const apiGetUserProfile = async (userId: string): Promise<User> => {
  await delay(MOCK_API_DELAY.SHORT);

  for (const userData of mockUsers.values()) {
    if (userData.user.id === userId) {
      return userData.user;
    }
  }

  throw new Error(ERROR_MESSAGES.NOT_FOUND);
};

/**
 * Updates user profile
 *
 * @param userId - User ID to update
 * @param updates - Fields to update
 * @returns Promise with updated user
 *
 * CONCEPT: Profile updates, partial object updates
 */
export const apiUpdateUserProfile = async (
  userId: string,
  updates: Partial<User>
): Promise<User> => {
  await delay(MOCK_API_DELAY.MEDIUM);

  for (const userData of mockUsers.values()) {
    if (userData.user.id === userId) {
      const updatedUser = { ...userData.user, ...updates };
      userData.user = updatedUser;
      return updatedUser;
    }
  }

  throw new Error(ERROR_MESSAGES.NOT_FOUND);
};

/**
 * Clears all mock data (useful for testing)
 * CONCEPT: Data cleanup, testing utilities
 */
export const apiClearAllData = (): void => {
  mockUsers.clear();
  mockNotes.clear();
  initializeMockData();
};
