/**
 * Settings Page
 *
 * User settings and preferences
 *
 * CONCEPTS: User preferences, state management, settings UI
 */

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLocalStorage } from '../hooks/useLocalStorage';
import '../styles/SettingsPage.css';

/**
 * SettingsPage Component
 *
 * Demonstrates user settings with localStorage persistence
 *
 * CONCEPT: useLocalStorage hook, user preferences, UI toggles
 *
 * USAGE:
 * <Route path="/settings" element={
 *   <ProtectedRoute>
 *     <SettingsPage />
 *   </ProtectedRoute>
 * } />
 */
const SettingsPage: React.FC = () => {
  const { user } = useAuth();

  /**
   * Use localStorage hook to persist settings
   * CONCEPT: useLocalStorage for data persistence
   */
  const [theme, setTheme, removeTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
  const [emailNotifications, setEmailNotifications, removeEmailNotifications] = useLocalStorage<boolean>(
    'emailNotifications',
    true
  );
  const [autoSave, setAutoSave, removeAutoSave] = useLocalStorage<boolean>('autoSave', true);

  /**
   * Handle settings changes
   * CONCEPT: Event handling, localStorage updates
   */
  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value as 'light' | 'dark');
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailNotifications(e.target.checked);
  };

  const handleAutoSaveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAutoSave(e.target.checked);
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      removeTheme();
      removeEmailNotifications();
      removeAutoSave();
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <h1>⚙️ Settings</h1>

        {user && (
          <div className="settings-box">
            {/* Display Preferences */}
            <section className="settings-section">
              <h2>Display Preferences</h2>

              <div className="setting-item">
                <label htmlFor="theme" className="setting-label">
                  Theme
                </label>
                <select
                  id="theme"
                  value={theme}
                  onChange={handleThemeChange}
                  className="setting-select"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </section>

            {/* Notifications */}
            <section className="settings-section">
              <h2>Notifications</h2>

              <div className="setting-item">
                <label htmlFor="emailNotifications" className="setting-label">
                  <input
                    id="emailNotifications"
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={handleNotificationChange}
                    className="setting-checkbox"
                  />
                  Email Notifications
                </label>
                <p className="setting-description">
                  Receive email updates about new comments and changes
                </p>
              </div>

              <div className="setting-item">
                <label htmlFor="autoSave" className="setting-label">
                  <input
                    id="autoSave"
                    type="checkbox"
                    checked={autoSave}
                    onChange={handleAutoSaveChange}
                    className="setting-checkbox"
                  />
                  Auto-Save
                </label>
                <p className="setting-description">
                  Automatically save notes as you type
                </p>
              </div>
            </section>

            {/* About This App */}
            <section className="settings-section">
              <h2>About This Application</h2>

              <div className="about-content">
                <p>
                  <strong>React Comprehensive Learning App</strong>
                </p>
                <p>Version 1.0.0</p>
                <p>
                  A full-featured React application demonstrating:
                </p>
                <ul>
                  <li>✓ All React Hooks (useState, useEffect, useContext, useReducer, etc.)</li>
                  <li>✓ Authentication & Protected Routes</li>
                  <li>✓ Client-Server Communication</li>
                  <li>✓ CRUD Operations</li>
                  <li>✓ State Management with Context API</li>
                  <li>✓ Form Handling & Validation</li>
                  <li>✓ Custom Hooks</li>
                  <li>✓ Error Boundaries & Error Handling</li>
                  <li>✓ Performance Optimization (useMemo, useCallback)</li>
                  <li>✓ Data Persistence (localStorage)</li>
                </ul>
              </div>
            </section>

            {/* Danger Zone */}
            <section className="settings-section danger-section">
              <h2>Danger Zone</h2>

              <div className="setting-item">
                <button
                  className="danger-btn"
                  onClick={handleResetSettings}
                >
                  Reset All Settings
                </button>
                <p className="setting-description">
                  This will reset all settings to their default values
                </p>
              </div>
            </section>

            {/* Settings Info */}
            <div className="settings-info">
              <p>
                💡 <strong>Note:</strong> Settings are saved to your browser's localStorage.
                They will persist even after closing the browser.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
