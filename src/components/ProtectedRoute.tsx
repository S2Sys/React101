/**
 * Protected Route Component
 *
 * Wraps routes that require authentication.
 * Redirects unauthenticated users to login page.
 *
 * CONCEPTS: React Router, conditional rendering, authentication guards
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute Component
 *
 * Checks if user is authenticated before rendering the component.
 * If not authenticated, redirects to login page.
 *
 * CONCEPT: React Router v6 pattern, useAuth hook, conditional routing
 *
 * USAGE:
 * <ProtectedRoute>
 *   <DashboardPage />
 * </ProtectedRoute>
 *
 * Or in router config:
 * <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Get auth state from context
  // CONCEPT: useAuth hook, custom hook usage
  const { isAuthenticated, isLoading } = useAuth();

  // While checking auth status, show loading spinner
  // CONCEPT: Handling loading states in route guards
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // If user is not authenticated, redirect to login
  // CONCEPT: React Router Navigate component for redirects
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
