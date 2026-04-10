/**
 * Login Page
 *
 * Handles user authentication with email and password
 *
 * CONCEPTS: Form handling, validation, async operations, useNavigate
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../hooks/useForm';
import { useAuth } from '../hooks/useAuth';
import { validateLoginForm } from '../utils/validators';
import { VALIDATION_RULES } from '../utils/constants';
import '../styles/AuthPage.css';

interface LoginFormValues {
  email: string;
  password: string;
}

/**
 * LoginPage Component
 *
 * Provides login form and handles authentication
 *
 * CONCEPT: Form management with custom hook, async auth, navigation
 *
 * USAGE:
 * <Route path="/login" element={<LoginPage />} />
 */
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, error: authError } = useAuth();

  /**
   * Use custom form hook for form state management
   * CONCEPT: Custom hook for form logic encapsulation
   */
  const form = useForm<LoginFormValues>(
    { email: '', password: '' },
    async (values) => {
      // Call login from auth context
      // The form hook handles errors automatically
      await login(values.email, values.password);
    },
    (values) => validateLoginForm(values.email, values.password)
  );

  /**
   * Redirect to dashboard if already logged in
   * CONCEPT: useEffect for side effects, conditional navigation
   */
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-box">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your account</p>

          {/* Demo credentials help */}
          <div className="demo-credentials">
            <p>Demo account:</p>
            <p><strong>Email:</strong> demo@example.com</p>
            <p><strong>Password:</strong> password</p>
          </div>

          {/* Error message */}
          {(form.errors.submit || authError) && (
            <div className="error-message">
              {form.errors.submit || authError}
            </div>
          )}

          {/* Login form */}
          <form onSubmit={form.handleSubmit(async () => {
            try {
              await login(form.values.email, form.values.password);
              navigate('/dashboard');
            } catch (err) {
              // Error is handled by form hook
            }
          })}>
            {/* Email field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.values.email}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                className={`form-input ${form.errors.email ? 'error' : ''}`}
                placeholder="you@example.com"
              />
              {form.touched.email && form.errors.email && (
                <span className="error-text">{form.errors.email}</span>
              )}
            </div>

            {/* Password field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={form.values.password}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                className={`form-input ${form.errors.password ? 'error' : ''}`}
                placeholder="••••••••"
              />
              {form.touched.password && form.errors.password && (
                <span className="error-text">{form.errors.password}</span>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="submit-btn"
              disabled={form.isSubmitting || !form.isDirty}
            >
              {form.isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Link to signup */}
          <p className="auth-link">
            Don't have an account? <a href="/signup">Sign up here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
