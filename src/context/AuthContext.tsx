/**
 * Authentication Context
 *
 * Provides global authentication state and methods.
 * Uses React Context API for state management.
 *
 * CONCEPTS: React Context, useReducer, useCallback, authentication state
 */

import React, { createContext, useReducer, useCallback, useEffect } from 'react';
import { AuthContextType, User, AuthResponse } from '../types';
import { STORAGE_KEYS } from '../utils/constants';
import {
  apiLogin,
  apiSignup,
  apiValidateToken,
} from '../services/mockApi';

// ============================================================================
// CONTEXT CREATION
// ============================================================================

/**
 * Create the authentication context
 * CONCEPT: createContext for dependency injection
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================================
// AUTH REDUCER
// ============================================================================

/**
 * Auth reducer state
 * Defines the shape of authentication state
 */
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Auth reducer action types
 * CONCEPT: Discriminated unions for type-safe actions
 */
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

/**
 * Initial auth state
 */
const initialAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

/**
 * Auth reducer function
 *
 * CONCEPT: useReducer for complex state management
 * Similar to Redux reducers but built into React
 */
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case 'AUTH_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        user: null,
        token: null,
        isAuthenticated: false,
      };

    case 'LOGOUT':
      return {
        ...initialAuthState,
        isLoading: false,
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
// AUTH PROVIDER COMPONENT
// ============================================================================

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider Component
 *
 * Wraps the application and provides authentication context
 *
 * CONCEPT: Context provider, useReducer, useCallback, useEffect
 *
 * USAGE:
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Use useReducer for complex state management
  // CONCEPT: useReducer for multiple related state updates
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  /**
   * Login handler
   * CONCEPT: useCallback for memoization, async error handling
   */
  const login = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'AUTH_START' });

    try {
      const response: AuthResponse = await apiLogin(email, password);

      // Store token in localStorage
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: response.user,
          token: response.token,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({
        type: 'AUTH_ERROR',
        payload: errorMessage,
      });
      throw error;
    }
  }, []);

  /**
   * Signup handler
   * CONCEPT: useCallback for memoization, user creation
   */
  const signup = useCallback(async (email: string, password: string, name: string) => {
    dispatch({ type: 'AUTH_START' });

    try {
      const response: AuthResponse = await apiSignup(email, password, name);

      // Store token in localStorage
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: response.user,
          token: response.token,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      dispatch({
        type: 'AUTH_ERROR',
        payload: errorMessage,
      });
      throw error;
    }
  }, []);

  /**
   * Logout handler
   * CONCEPT: Clearing stored data, state reset
   */
  const logout = useCallback(() => {
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);

    // Reset state
    dispatch({ type: 'LOGOUT' });
  }, []);

  /**
   * Clear error handler
   */
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  /**
   * Effect to restore auth state from localStorage on mount
   * CONCEPT: useEffect for initialization, localStorage recovery
   */
  useEffect(() => {
    const restoreAuth = async () => {
      try {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);

        if (token && userData) {
          // Validate token is still valid
          // In a real app, this would check with the backend
          const user = JSON.parse(userData);

          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              user,
              token,
            },
          });
        } else {
          // No valid session found
          dispatch({
            type: 'AUTH_ERROR',
            payload: '',
          });
        }
      } catch (error) {
        dispatch({
          type: 'AUTH_ERROR',
          payload: 'Failed to restore session',
        });
      }
    };

    restoreAuth();
  }, []);

  /**
   * Context value to provide to consumers
   */
  const value: AuthContextType = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login,
    signup,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
