# Error Handling Guide

Complete guide to handling errors gracefully in React applications.

## 🛡️ Error Handling Layers

A production-ready app needs error handling at multiple levels:

```
┌─────────────────────────────────────────┐
│   Component Error Boundaries            │ (Crash prevention)
├─────────────────────────────────────────┤
│   Async Error Handling (try/catch)      │ (API errors)
├─────────────────────────────────────────┤
│   Validation Errors                     │ (User input)
├─────────────────────────────────────────┤
│   Global Error Handler                  │ (Catch-all)
└─────────────────────────────────────────┘
```

---

## 🚨 Error Boundaries

### What They Catch

Error Boundaries catch rendering errors in child components:

```typescript
// ✅ Caught by Error Boundary
class MyComponent extends React.Component {
  render() {
    return this.props.data.name;  // TypeError if data is null
  }
}

// ❌ NOT caught by Error Boundary
// - Event handler errors (use try/catch)
// - Async code errors (use try/catch)
// - Server-side rendering
// - Errors in the Error Boundary itself
```

### Implementing Error Boundary

```typescript
// src/components/ErrorBoundary.tsx
import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details to service (Sentry, etc.)
    console.error('Error caught by boundary:', error);
    console.error('Component stack:', errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Using Error Boundary

```typescript
// App.tsx
export const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
};
```

### Multiple Error Boundaries

```typescript
// Wrap critical sections separately
export const App = () => {
  return (
    <ErrorBoundary>
      <Navbar />
      <ErrorBoundary>
        <DashboardPage />
      </ErrorBoundary>
      <ErrorBoundary>
        <SidebarPage />
      </ErrorBoundary>
    </ErrorBoundary>
  );
};
```

**Benefit:** If Dashboard crashes, Sidebar and Navbar still work

---

## ⚠️ Async Error Handling (Try/Catch)

### API Call with Error Handling

```typescript
// LoginPage.tsx
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Call API
      const response = await apiLogin(email, password);
      
      // Success handling
      localStorage.setItem('auth_token', response.token);
      navigate('/dashboard');
    } catch (err) {
      // Error handling
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}
      {/* form fields */}
    </form>
  );
};
```

### Error Handling Pattern

```
1. Start operation (setIsLoading(true))
2. Try async operation
   ✓ Success → Handle response
   ✗ Error → setError(message)
3. Finally block → setIsLoading(false)
4. Display loading state and error to user
```

### Multiple Async Operations

```typescript
const DashboardPage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchNotes = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await apiFetchNotes(user.id);
        setNotes(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch notes'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [user.id]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return <NotesList notes={notes} />;
};
```

---

## ✅ Validation Errors

### Form Validation

```typescript
// useForm.ts custom hook
const useForm = (initialValues, onSubmit, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Touched>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = validate(values);
    setErrors(newErrors);

    // Stop if there are errors
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // No errors, submit
    try {
      await onSubmit(values);
    } catch (error) {
      // Handle server error
      setErrors({ server: error.message });
    }
  };

  return { values, errors, touched, handleSubmit };
};
```

### Displaying Validation Errors

```typescript
// LoginPage.tsx
const LoginPage = () => {
  const form = useForm(
    { email: '', password: '' },
    loginUser,
    validateLoginForm
  );

  return (
    <form onSubmit={form.handleSubmit}>
      <div>
        <label>Email</label>
        <input
          name="email"
          value={form.values.email}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          className={form.errors.email ? 'input-error' : ''}
        />
        {form.touched.email && form.errors.email && (
          <span className="error-message">{form.errors.email}</span>
        )}
      </div>

      <div>
        <label>Password</label>
        <input
          name="password"
          type="password"
          value={form.values.password}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          className={form.errors.password ? 'input-error' : ''}
        />
        {form.touched.password && form.errors.password && (
          <span className="error-message">{form.errors.password}</span>
        )}
      </div>

      {form.errors.server && (
        <div className="alert alert-danger">{form.errors.server}</div>
      )}

      <button type="submit" disabled={form.isSubmitting}>
        {form.isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};
```

---

## 🔔 Error Messages

### User-Friendly vs Technical

```typescript
// ❌ Bad: Technical error
"TypeError: Cannot read property 'name' of undefined"

// ✅ Good: User-friendly error
"We couldn't load your notes. Please try again."

// ❌ Bad: Unhelpful
"Error"

// ✅ Good: Helpful
"This email is already registered. Try logging in instead."
```

### Mapping API Errors

```typescript
// src/utils/constants.ts
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_EXISTS: 'Email is already registered',
  NOTE_NOT_FOUND: 'Note not found or you don\'t have permission',
  NETWORK_ERROR: 'Connection failed. Please check your internet.',
  UNKNOWN_ERROR: 'Something went wrong. Please try again.',
};
```

### Error Components

```typescript
// src/components/ErrorAlert.tsx
interface ErrorAlertProps {
  message: string | null;
  onDismiss?: () => void;
}

export const ErrorAlert = ({ message, onDismiss }: ErrorAlertProps) => {
  if (!message) return null;

  return (
    <div className="alert alert-danger" role="alert">
      <div className="alert-content">
        <span className="alert-icon">⚠️</span>
        <span className="alert-message">{message}</span>
      </div>
      {onDismiss && (
        <button className="alert-close" onClick={onDismiss}>
          ✕
        </button>
      )}
    </div>
  );
};
```

---

## 🔄 Error Recovery Strategies

### Retry Logic

```typescript
const retryAsync = async <T,>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (i < maxRetries - 1) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }

  throw lastError;
};

// Usage
const notes = await retryAsync(
  () => apiFetchNotes(user.id),
  3,  // max 3 attempts
  1000  // 1s, 2s, 4s delays
);
```

### Fallback Data

```typescript
const DashboardPage = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await apiFetchNotes(user.id);
        setNotes(data);
      } catch (error) {
        // Fallback to empty array, show error message
        setNotes([]);
        showError('Could not load notes');
      }
    };

    fetchNotes();
  }, []);

  return (
    <div>
      {notes.length === 0 ? (
        <p>No notes yet. Create your first note!</p>
      ) : (
        <NotesList notes={notes} />
      )}
    </div>
  );
};
```

### Graceful Degradation

```typescript
// If advanced feature fails, basic version still works
export const NotesList = ({ notes }: Props) => {
  const [sortOrder, setSortOrder] = useState('newest');

  try {
    // Try to sort (may fail if comparison function breaks)
    const sorted = [...notes].sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
    return <div>{sorted.map(note => <NoteCard key={note.id} note={note} />)}</div>;
  } catch (error) {
    // Fallback: just show unsorted notes
    console.error('Sorting failed, showing unsorted notes', error);
    return <div>{notes.map(note => <NoteCard key={note.id} note={note} />)}</div>;
  }
};
```

---

## 📝 Error Logging

### Console Logging During Development

```typescript
// src/utils/logger.ts
export const logger = {
  error: (message: string, error?: unknown) => {
    console.error(`[ERROR] ${message}`, error);
  },
  warn: (message: string) => {
    console.warn(`[WARN] ${message}`);
  },
  info: (message: string) => {
    console.info(`[INFO] ${message}`);
  },
  debug: (message: string, data?: unknown) => {
    console.debug(`[DEBUG] ${message}`, data);
  },
};
```

### Usage

```typescript
try {
  const notes = await apiFetchNotes(user.id);
} catch (error) {
  logger.error('Failed to fetch notes', error);
  setError('Could not load notes');
}
```

### Production Error Tracking (Sentry)

```typescript
// For production, use a service like Sentry
// In ErrorBoundary.tsx
componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  // Send to Sentry
  if (process.env.NODE_ENV === 'production') {
    // Sentry.captureException(error);
  }
  
  // Local logging
  logger.error('Component error', error);
}
```

---

## 🎯 Error Handling Checklist

- [ ] ErrorBoundary wraps the entire app
- [ ] All async operations use try/catch
- [ ] Loading states show during API calls
- [ ] Error messages are user-friendly
- [ ] Validation errors display near inputs
- [ ] Error state resets when retrying
- [ ] Sensitive errors aren't shown to users
- [ ] Error logs are sent to monitoring service
- [ ] Common errors have retry logic
- [ ] Fallback UI shows when features fail

---

## 🔗 Related Documentation

- [State Management](04-state-management.md) - Managing error state
- [Form Handling](10-form-handling.md) - Validation errors
- [Components Guide](05-components-guide.md) - ErrorBoundary component
- [Best Practices](17-best-practices.md) - Error patterns

---

**Next**: Learn about [TypeScript Guide](15-typescript.md).
