/**
 * Notes Context
 *
 * Provides global state for notes management.
 * Demonstrates useReducer with complex state and multiple actions.
 *
 * CONCEPTS: React Context, useReducer, useMemo, context composition
 */

import React, { createContext, useReducer, useCallback, useMemo, useRef } from 'react';
import { NotesContextType, Note, CreateNoteRequest, UpdateNoteRequest, NotesAction, NotesState } from '../types';
import {
  apiFetchNotes,
  apiFetchNoteById,
  apiCreateNote,
  apiUpdateNote,
  apiDeleteNote,
} from '../services/mockApi';
import { searchNotes } from '../utils/helpers';
import { useAuth } from '../hooks/useAuth';

// ============================================================================
// CONTEXT CREATION
// ============================================================================

/**
 * Create the notes context
 */
export const NotesContext = createContext<NotesContextType | undefined>(undefined);

// ============================================================================
// NOTES REDUCER
// ============================================================================

/**
 * Initial notes state
 */
const initialNotesState: NotesState = {
  notes: [],
  isLoading: false,
  error: null,
  searchTerm: '',
};

/**
 * Notes reducer function
 *
 * CONCEPT: useReducer with complex state management
 * Handles multiple actions for CRUD operations
 */
const notesReducer = (state: NotesState, action: NotesAction): NotesState => {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'FETCH_SUCCESS':
      return {
        ...state,
        notes: action.payload,
        isLoading: false,
        error: null,
      };

    case 'FETCH_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case 'ADD_NOTE':
      return {
        ...state,
        notes: [action.payload, ...state.notes],
      };

    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map((note) =>
          note.id === action.payload.id ? action.payload : note
        ),
      };

    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter((note) => note.id !== action.payload),
      };

    case 'SET_FILTER':
      return {
        ...state,
        searchTerm: action.payload,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// ============================================================================
// NOTES PROVIDER COMPONENT
// ============================================================================

interface NotesProviderProps {
  children: React.ReactNode;
}

/**
 * NotesProvider Component
 *
 * Provides global notes state and operations
 *
 * CONCEPT: Context provider, useReducer, useCallback, useMemo
 *
 * USAGE:
 * <NotesProvider>
 *   <App />
 * </NotesProvider>
 */
export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
  // Get user from auth context
  // This ensures we only manage notes for the authenticated user
  const { user } = useAuth();

  // Use useReducer for complex state management
  const [state, dispatch] = useReducer(notesReducer, initialNotesState);

  // Track if initial fetch has been done to avoid duplicate fetches
  const initialFetchDoneRef = useRef(false);

  /**
   * Fetch all notes
   * CONCEPT: useCallback, async operation, error handling
   */
  const fetchNotes = useCallback(async () => {
    if (!user) return;

    dispatch({ type: 'FETCH_START' });

    try {
      const notes = await apiFetchNotes(user.id);
      dispatch({ type: 'FETCH_SUCCESS', payload: notes });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch notes';
      dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
    }
  }, [user]);

  /**
   * Fetch notes on mount or when user changes
   * CONCEPT: useEffect via callback pattern, authentication dependency
   */
  React.useEffect(() => {
    if (!initialFetchDoneRef.current && user) {
      initialFetchDoneRef.current = true;
      fetchNotes();
    }
  }, [user, fetchNotes]);

  /**
   * Create a new note
   * CONCEPT: useCallback, async creation, state update
   */
  const createNote = useCallback(
    async (request: CreateNoteRequest): Promise<Note> => {
      if (!user) throw new Error('User not authenticated');

      dispatch({ type: 'FETCH_START' });

      try {
        const newNote = await apiCreateNote(user.id, request);
        dispatch({ type: 'ADD_NOTE', payload: newNote });
        return newNote;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create note';
        dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
        throw error;
      }
    },
    [user]
  );

  /**
   * Update an existing note
   * CONCEPT: useCallback, async update, state synchronization
   */
  const updateNote = useCallback(
    async (id: string, request: UpdateNoteRequest): Promise<Note> => {
      if (!user) throw new Error('User not authenticated');

      dispatch({ type: 'FETCH_START' });

      try {
        const updatedNote = await apiUpdateNote(id, user.id, request);
        dispatch({ type: 'UPDATE_NOTE', payload: updatedNote });
        return updatedNote;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update note';
        dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
        throw error;
      }
    },
    [user]
  );

  /**
   * Delete a note
   * CONCEPT: useCallback, async deletion, confirmation pattern
   */
  const deleteNote = useCallback(
    async (id: string) => {
      if (!user) throw new Error('User not authenticated');

      dispatch({ type: 'FETCH_START' });

      try {
        await apiDeleteNote(id, user.id);
        dispatch({ type: 'DELETE_NOTE', payload: id });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete note';
        dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
        throw error;
      }
    },
    [user]
  );

  /**
   * Set search filter
   * CONCEPT: useCallback for search state management
   */
  const setSearchTerm = useCallback((term: string) => {
    dispatch({ type: 'SET_FILTER', payload: term });
  }, []);

  /**
   * Clear errors
   */
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  /**
   * Compute filtered notes based on search term
   * CONCEPT: useMemo for performance optimization
   * This prevents expensive filtering on every render
   */
  const filteredNotes = useMemo(() => {
    if (!state.searchTerm) return state.notes;
    return searchNotes(state.notes, state.searchTerm);
  }, [state.notes, state.searchTerm]);

  /**
   * Context value to provide
   */
  const value: NotesContextType = {
    notes: state.notes,
    isLoading: state.isLoading,
    error: state.error,
    filteredNotes,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    setSearchTerm,
    clearError,
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};

/**
 * Hook to use Notes context
 * Ensures context is only used within provider
 */
export const useNotes = (): NotesContextType => {
  const context = React.useContext(NotesContext);

  if (!context) {
    throw new Error(
      'useNotes must be used within a NotesProvider. Wrap your app with <NotesProvider>'
    );
  }

  return context;
};
