/**
 * Profile Page
 *
 * Displays user profile information
 *
 * CONCEPTS: User context, conditional rendering, user data display
 */

import React from 'react';
import { useAuth } from '../hooks/useAuth';
import '../styles/ProfilePage.css';

/**
 * ProfilePage Component
 *
 * Shows user profile with account information
 *
 * CONCEPT: useAuth hook, user data display, profile information
 *
 * USAGE:
 * <Route path="/profile" element={
 *   <ProtectedRoute>
 *     <ProfilePage />
 *   </ProtectedRoute>
 * } />
 */
const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-box">
          <h1>👤 Your Profile</h1>

          {user ? (
            <div className="profile-info">
              <div className="profile-field">
                <label>Email Address</label>
                <p>{user.email}</p>
              </div>

              <div className="profile-field">
                <label>Full Name</label>
                <p>{user.name}</p>
              </div>

              <div className="profile-field">
                <label>Member Since</label>
                <p>{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="profile-section">
                <h2>Account Statistics</h2>
                <div className="stats">
                  <div className="stat-item">
                    <span className="stat-label">Account Status</span>
                    <span className="stat-value">Active ✓</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Email Verified</span>
                    <span className="stat-value">Yes ✓</span>
                  </div>
                </div>
              </div>

              <div className="profile-note">
                <p>
                  This is a demo profile page. In a real application, you could
                  update your information here.
                </p>
              </div>
            </div>
          ) : (
            <p>Loading profile...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
