/**
 * React Application Entry Point
 *
 * This is where the React application is mounted into the DOM.
 *
 * CONCEPTS: React rendering, ReactDOM, application initialization
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/App.css';

/**
 * Get the root DOM element
 * CONCEPT: DOM mounting, strict mode
 */
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

/**
 * Create React root and render the app
 * CONCEPT: React 18+ rendering API
 *
 * StrictMode:
 * - Highlights potential problems in the application
 * - Runs effects twice in development to detect issues
 * - Checks for deprecated API usage
 * - Only affects development, not production
 */
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
