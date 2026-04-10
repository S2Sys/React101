/**
 * Navbar Component
 *
 * Navigation bar with user info and logout button
 *
 * CONCEPTS: React hooks, conditional rendering, user state
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/Navbar.css';

/**
 * Navbar Component
 *
 * Shows user info when logged in, login/signup links when not
 *
 * CONCEPT: Conditional rendering based on auth state
 *
 * USAGE:
 * <Navbar />
 */
const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  /**
   * Handle logout
   * CONCEPT: Event handling, navigation after logout
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-brand">
          📝 React App
        </Link>

        {/* Nav Links */}
        <div className="navbar-links">
          {isAuthenticated ? (
            <>
              {/* User is logged in - show these links */}
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/profile">Profile</Link>
              <Link to="/settings">Settings</Link>

              {/* User Info and Logout */}
              <div className="user-section">
                <span className="user-name">{user?.name}</span>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              {/* User is not logged in - show these links */}
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
