/**
 * Loading Spinner Component
 *
 * Reusable loading indicator shown during async operations.
 *
 * CONCEPTS: React components, conditional rendering, simple UI
 */

import React from 'react';
import '../styles/LoadingSpinner.css';

interface LoadingSpinnerProps {
  message?: string;
}

/**
 * LoadingSpinner Component
 *
 * Displays a spinning loader with optional message
 *
 * USAGE:
 * <LoadingSpinner message="Loading notes..." />
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
