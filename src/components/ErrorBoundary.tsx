/**
 * Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree.
 * Logs error information and displays a fallback UI.
 *
 * CONCEPTS: React Error Boundaries, lifecycle methods, error handling
 */

import React, { ReactNode } from 'react';
import '../styles/ErrorBoundary.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary Class Component
 *
 * React Error Boundaries must be class components.
 * They catch errors during rendering, in lifecycle methods, and in constructors.
 *
 * CONCEPT: Class components, error boundaries, lifecycle methods
 *
 * USAGE:
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 */
class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    // Initialize state
    // CONCEPT: Class component state initialization
    this.state = { hasError: false, error: null };
  }

  /**
   * Update state so the next render will show the fallback UI
   * CONCEPT: getDerivedStateFromError lifecycle method
   */
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  /**
   * Log error details
   * CONCEPT: componentDidCatch lifecycle method, error logging
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);
  }

  /**
   * Reset error boundary
   */
  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <div className="error-content">
            <h1>🚨 Something went wrong</h1>
            <p className="error-message">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <p className="error-explanation">
              The application encountered an error. Try refreshing the page or contact support.
            </p>
            <button className="error-button" onClick={this.resetError}>
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
