/**
 * Main Application Component
 *
 * Sets up routing, providers, and the overall application structure.
 *
 * CONCEPTS: React Router, Context Providers, Error Boundaries, App Architecture
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotesProvider } from './context/NotesContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Import pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import NotePage from './pages/NotePage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

// Import styles
import './styles/App.css';

/**
 * App Component
 *
 * Root component of the application.
 * Wraps everything with necessary providers and sets up routing.
 *
 * CONCEPTS: Component composition, provider hierarchy, routing setup
 *
 * Provider Order (innermost to outermost):
 * 1. AuthProvider - Manages authentication state
 * 2. NotesProvider - Manages notes state (depends on AuthProvider)
 * 3. Router - Provides routing functionality
 * 4. ErrorBoundary - Catches errors from entire app
 *
 * USAGE:
 * This is the root component that gets mounted in index.tsx
 */
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <NotesProvider>
            {/* Navigation bar */}
            <Navbar />

            {/* Main content area */}
            <main>
              <Routes>
                {/* Authentication Routes (public) */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* Protected Routes (require authentication) */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notes/:id"
                  element={
                    <ProtectedRoute>
                      <NotePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Default route - redirect to dashboard if logged in, login otherwise */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* Catch-all - 404 redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </NotesProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
