/**
 * useAuth Custom Hook
 *
 * Encapsulates authentication logic and provides login, signup, and logout functionality.
 * This is a custom hook that demonstrates how to extract logic from components.
 *
 * CONCEPTS: Custom hooks, useCallback, useContext, state management
 */

import { useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { AuthContextType } from '../types';

/**
 * useAuth Hook
 *
 * Provides access to authentication state and methods
 *
 * @returns Authentication context with user, token, and auth methods
 *
 * CONCEPT: Custom hook, context consumption, hook composition
 *
 * USAGE:
 * const { user, isAuthenticated, login, logout } = useAuth();
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider. Wrap your app with <AuthProvider>'
    );
  }

  return context;
};

/**
 * useRequireAuth Hook
 *
 * Hook that enforces authentication - useful for protected pages
 * Automatically redirects to login if user is not authenticated
 *
 * @returns User data if authenticated
 *
 * CONCEPT: Custom hook with side effects, conditional logic
 *
 * USAGE:
 * const user = useRequireAuth();
 * // Component won't render until user is authenticated
 */
export const useRequireAuth = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // While loading, we don't know if user is authenticated
  if (isLoading) {
    return null;
  }

  // If not authenticated, this will be null
  // Parent component should handle this with a ProtectedRoute
  return user;
};

/**
 * useAuthToken Hook
 *
 * Provides direct access to the authentication token
 * Useful for API calls that need the token
 *
 * @returns The authentication token or null
 *
 * CONCEPT: Custom hook, selective context usage
 *
 * USAGE:
 * const token = useAuthToken();
 * // Use token in API calls
 */
export const useAuthToken = (): string | null => {
  const { token } = useAuth();
  return token;
};

/**
 * useIsAuthenticated Hook
 *
 * Simple boolean hook for checking authentication status
 * More convenient than checking the full context in many cases
 *
 * @returns Boolean indicating if user is authenticated
 *
 * CONCEPT: Custom hook abstraction, simplification
 *
 * USAGE:
 * const isLoggedIn = useIsAuthenticated();
 * if (isLoggedIn) { // show logged in UI
 */
export const useIsAuthenticated = (): boolean => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
};

/**
 * useLogout Hook
 *
 * Provides just the logout function in a memoized form
 *
 * @returns Memoized logout function
 *
 * CONCEPT: Custom hook, useCallback for memoization
 *
 * USAGE:
 * const logout = useLogout();
 * <button onClick={logout}>Log Out</button>
 */
export const useLogout = (): () => void => {
  const { logout } = useAuth();

  return useCallback(() => {
    logout();
  }, [logout]);
};

/**
 * useAuthError Hook
 *
 * Gets the current authentication error message
 *
 * @returns Error message or null
 *
 * CONCEPT: Custom hook for specific context values
 */
export const useAuthError = (): string | null => {
  const { error } = useAuth();
  return error;
};
