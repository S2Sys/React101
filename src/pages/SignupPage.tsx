/**
 * Signup Page
 *
 * Handles user registration
 *
 * CONCEPTS: Form validation, password confirmation, error handling
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../hooks/useForm';
import { useAuth } from '../hooks/useAuth';
import { validateSignupForm } from '../utils/validators';
import '../styles/AuthPage.css';

interface SignupFormValues {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

/**
 * SignupPage Component
 *
 * Provides signup form for new users
 *
 * CONCEPT: Form validation with multiple fields, password confirmation
 *
 * USAGE:
 * <Route path="/signup" element={<SignupPage />} />
 */
const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, isAuthenticated, error: authError } = useAuth();

  /**
   * Use custom form hook
   * CONCEPT: Custom hook for complex form state
   */
  const form = useForm<SignupFormValues>(
    { email: '', name: '', password: '', confirmPassword: '' },
    async (values) => {
      await signup(values.email, values.password, values.name);
    },
    (values) =>
      validateSignupForm(
        values.email,
        values.password,
        values.confirmPassword,
        values.name
      )
  );

  /**
   * Redirect if already logged in
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
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join our community today</p>

          {/* Error message */}
          {(form.errors.submit || authError) && (
            <div className="error-message">
              {form.errors.submit || authError}
            </div>
          )}

          {/* Signup form */}
          <form onSubmit={form.handleSubmit(async () => {
            try {
              await signup(
                form.values.email,
                form.values.password,
                form.values.name
              );
              navigate('/dashboard');
            } catch (err) {
              // Error handled by form hook
            }
          })}>
            {/* Name field */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={form.values.name}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                className={`form-input ${form.errors.name ? 'error' : ''}`}
                placeholder="John Doe"
              />
              {form.touched.name && form.errors.name && (
                <span className="error-text">{form.errors.name}</span>
              )}
            </div>

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

            {/* Confirm password field */}
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={form.values.confirmPassword}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                className={`form-input ${
                  form.errors.confirmPassword ? 'error' : ''
                }`}
                placeholder="••••••••"
              />
              {form.touched.confirmPassword && form.errors.confirmPassword && (
                <span className="error-text">
                  {form.errors.confirmPassword}
                </span>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="submit-btn"
              disabled={form.isSubmitting || !form.isDirty}
            >
              {form.isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Link to login */}
          <p className="auth-link">
            Already have an account? <a href="/login">Log in here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
