# Testing Guide

Comprehensive guide to testing React components, hooks, and integration flows.

## 🎯 Testing Strategy

The app uses multiple testing levels:

```
┌─────────────────────────────────────────┐
│         E2E Tests (Cypress)             │ (Full user flows)
│    "User logs in, creates note"         │
├─────────────────────────────────────────┤
│   Integration Tests (React Testing      │ (Multiple components)
│   Library + vitest)                     │ "Form submits and shows result"
│    "Component + API interaction"        │
├─────────────────────────────────────────┤
│   Unit Tests (vitest)                   │ (Single units)
│    "Function returns expected output"   │
├─────────────────────────────────────────┤
│   Manual Testing                        │ (Browser testing)
│    "Click around, see if it works"      │
└─────────────────────────────────────────┘
```

---

## 🧪 Unit Testing (vitest)

### Setting Up

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

### Testing Utilities

```typescript
// src/utils/__tests__/validators.test.ts
import { describe, it, expect } from 'vitest';
import { validateEmail, validatePassword } from '../validators';

describe('validateEmail', () => {
  it('should accept valid email', () => {
    const result = validateEmail('user@example.com');
    expect(result).toBe('');  // No error
  });

  it('should reject invalid email', () => {
    const result = validateEmail('invalid-email');
    expect(result).toContain('valid email');  // Has error message
  });

  it('should reject empty email', () => {
    const result = validateEmail('');
    expect(result).toContain('required');
  });
});

describe('validatePassword', () => {
  it('should accept strong password', () => {
    const result = validatePassword('SecurePass123!');
    expect(result).toBe('');
  });

  it('should reject weak password', () => {
    const result = validatePassword('123');
    expect(result).toContain('at least 8 characters');
  });
});
```

### Testing Helpers

```typescript
// src/utils/__tests__/helpers.test.ts
import { describe, it, expect } from 'vitest';
import { formatDate, truncateString, searchNotes, generateId } from '../helpers';

describe('formatDate', () => {
  it('should format ISO date to readable format', () => {
    const date = '2024-01-15T10:30:00Z';
    const formatted = formatDate(date);
    expect(formatted).toMatch(/Jan|January/);
  });
});

describe('truncateString', () => {
  it('should truncate long strings', () => {
    const long = 'This is a very long string that needs truncating';
    const result = truncateString(long, 10);
    expect(result).toHaveLength(13);  // 10 + '...'
  });

  it('should not truncate short strings', () => {
    const short = 'Hello';
    const result = truncateString(short, 10);
    expect(result).toBe('Hello');
  });
});

describe('generateId', () => {
  it('should generate unique IDs', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });

  it('should generate strings', () => {
    const id = generateId();
    expect(typeof id).toBe('string');
  });
});
```

---

## 🎨 Component Testing

### Testing Simple Component

```typescript
// src/components/__tests__/LoadingSpinner.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('should render loading text', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should have loading class', () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.querySelector('.loading-spinner')).toBeInTheDocument();
  });
});
```

### Testing Component with Props

```typescript
// src/components/__tests__/NoteCard.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NoteCard } from '../NoteCard';

describe('NoteCard', () => {
  const mockNote = {
    id: '1',
    userId: '1',
    title: 'Test Note',
    content: 'Test content',
    tags: ['test'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  };

  it('should display note title and content', () => {
    render(<NoteCard note={mockNote} onDelete={() => {}} />);
    
    expect(screen.getByText('Test Note')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should call onDelete when delete button clicked', async () => {
    const onDelete = vi.fn();  // Mock function
    render(<NoteCard note={mockNote} onDelete={onDelete} />);
    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await userEvent.click(deleteButton);
    
    expect(onDelete).toHaveBeenCalledWith('1');
  });

  it('should display tags', () => {
    render(<NoteCard note={mockNote} onDelete={() => {}} />);
    
    expect(screen.getByText('test')).toBeInTheDocument();
  });
});
```

### Testing Form Component

```typescript
// src/pages/__tests__/LoginPage.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { LoginPage } from '../LoginPage';

describe('LoginPage', () => {
  const renderLoginPage = () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
  };

  it('should render form fields', () => {
    renderLoginPage();
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should show validation error for empty form', async () => {
    renderLoginPage();
    
    const submitButton = screen.getByRole('button', { name: /login/i });
    await userEvent.click(submitButton);
    
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });

  it('should show validation error for invalid email', async () => {
    renderLoginPage();
    
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));
    
    expect(screen.getByText(/valid email/i)).toBeInTheDocument();
  });

  it('should enable submit button when form is valid', async () => {
    renderLoginPage();
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });
    
    await userEvent.type(emailInput, 'user@example.com');
    await userEvent.type(passwordInput, 'password123');
    
    expect(submitButton).not.toBeDisabled();
  });
});
```

---

## 🎣 Hook Testing

### Testing Custom Hook

```typescript
// src/hooks/__tests__/useForm.test.ts
import { renderHook, act } from '@testing-library/react';
import { useForm } from '../useForm';

describe('useForm', () => {
  const initialValues = { email: '', password: '' };
  const mockValidator = (values) => ({
    email: !values.email ? 'Email is required' : '',
    password: !values.password ? 'Password is required' : '',
  });
  const mockOnSubmit = vi.fn();

  it('should initialize with default values', () => {
    const { result } = renderHook(() =>
      useForm(initialValues, mockOnSubmit, mockValidator)
    );

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
  });

  it('should update values on handleChange', () => {
    const { result } = renderHook(() =>
      useForm(initialValues, mockOnSubmit, mockValidator)
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'user@example.com' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.values.email).toBe('user@example.com');
  });

  it('should validate on submit', () => {
    const { result } = renderHook(() =>
      useForm(initialValues, mockOnSubmit, mockValidator)
    );

    act(() => {
      result.current.handleSubmit({
        preventDefault: () => {},
      } as React.FormEvent);
    });

    expect(result.current.errors.email).toBe('Email is required');
    expect(result.current.errors.password).toBe('Password is required');
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should call onSubmit when valid', () => {
    const { result } = renderHook(() =>
      useForm(initialValues, mockOnSubmit, mockValidator)
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'user@example.com' },
      } as React.ChangeEvent<HTMLInputElement>);
      result.current.handleChange({
        target: { name: 'password', value: 'password123' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleSubmit({
        preventDefault: () => {},
      } as React.FormEvent);
    });

    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'password123',
    });
  });
});
```

### Testing useFetch Hook

```typescript
// src/hooks/__tests__/useFetch.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useFetch } from '../useFetch';

describe('useFetch', () => {
  it('should fetch data on mount', async () => {
    const mockData = { id: '1', name: 'Test' };
    const fetchFn = vi.fn(async () => mockData);

    const { result } = renderHook(() => useFetch(fetchFn));

    // Initially loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBe(undefined);

    // Wait for data
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(fetchFn).toHaveBeenCalled();
  });

  it('should handle errors', async () => {
    const error = new Error('API error');
    const fetchFn = vi.fn(async () => {
      throw error;
    });

    const { result } = renderHook(() => useFetch(fetchFn));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('API error');
    expect(result.current.data).toBe(undefined);
  });
});
```

---

## 🔗 Integration Testing

### Testing with Context

```typescript
// src/__tests__/integration/auth.integration.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../../context/AuthContext';
import { LoginPage } from '../../pages/LoginPage';

describe('Auth Integration', () => {
  it('should login user and navigate to dashboard', async () => {
    // Mock navigation
    const mockNavigate = vi.fn();
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useNavigate: () => mockNavigate,
      };
    });

    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    // Fill form with demo credentials
    await userEvent.type(emailInput, 'demo@example.com');
    await userEvent.type(passwordInput, 'password');
    await userEvent.click(submitButton);

    // Wait for navigation
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});
```

---

## 🧪 E2E Testing (Cypress)

### Setup

```bash
npm install --save-dev cypress
npx cypress open
```

### Example E2E Test

```typescript
// cypress/e2e/auth.cy.ts
describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('should signup new user', () => {
    // Click signup link
    cy.contains('Sign Up').click();

    // Fill signup form
    cy.get('input[name="name"]').type('John Doe');
    cy.get('input[name="email"]').type('john@example.com');
    cy.get('input[name="password"]').type('SecurePass123!');
    cy.get('input[name="confirmPassword"]').type('SecurePass123!');

    // Submit form
    cy.get('button[type="submit"]').click();

    // Should redirect to dashboard
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome John').should('be.visible');
  });

  it('should create and delete note', () => {
    // Login
    cy.login('demo@example.com', 'password');

    // Create note
    cy.contains('Create Note').click();
    cy.get('input[name="title"]').type('My Test Note');
    cy.get('textarea[name="content"]').type('Note content');
    cy.contains('Save').click();

    // Note should appear
    cy.contains('My Test Note').should('be.visible');

    // Delete note
    cy.contains('My Test Note').within(() => {
      cy.contains('Delete').click();
    });

    // Confirm deletion
    cy.contains('Confirm').click();

    // Note should be gone
    cy.contains('My Test Note').should('not.exist');
  });
});

// Custom command
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.contains('Login').click();
  cy.url().should('include', '/dashboard');
});
```

---

## 📊 Testing Checklist

### Unit Tests
- [ ] All validators have tests
- [ ] All helpers have tests
- [ ] Edge cases covered (empty, null, invalid)

### Component Tests
- [ ] Component renders correctly
- [ ] Props are handled correctly
- [ ] User interactions work (click, type, submit)
- [ ] Events are fired correctly
- [ ] Conditional rendering works
- [ ] Error states display correctly

### Hook Tests
- [ ] Initial state is correct
- [ ] State updates work
- [ ] Effects run when expected
- [ ] Cleanup functions work
- [ ] Dependencies tracked correctly

### Integration Tests
- [ ] Multiple components work together
- [ ] Context provides state correctly
- [ ] Form submission works end-to-end
- [ ] Navigation works
- [ ] Error handling works

### E2E Tests
- [ ] User can signup
- [ ] User can login
- [ ] User can create note
- [ ] User can edit note
- [ ] User can delete note
- [ ] User can logout
- [ ] Protected routes redirect to login

---

## 🔗 Related Documentation

- [Error Handling](14-error-handling) - Error states to test
- [Form Handling](10-form-handling) - Form testing examples
- [Components Guide](05-components-guide) - Component structure
- [Custom Hooks](06-custom-hooks) - Hook patterns

---

**Next**: Learn about [Best Practices](17-best-practices).
