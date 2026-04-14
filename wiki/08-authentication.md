# Authentication Guide

Complete guide to authentication system in the app.

## 🔑 Authentication Flow

### User Registration (Signup)

```
┌─────────────────────────────────┐
│  1. User on SignupPage          │
│     Fills: email, password, name│
└──────────────┬──────────────────┘
               ↓
┌─────────────────────────────────┐
│  2. Form Validation             │
│     useForm hook validates      │
└──────────────┬──────────────────┘
               ↓
┌─────────────────────────────────┐
│  3. Call signup method          │
│     From useAuth hook           │
└──────────────┬──────────────────┘
               ↓
┌─────────────────────────────────┐
│  4. dispatch AUTH_START         │
│     Show loading state          │
└──────────────┬──────────────────┘
               ↓
┌─────────────────────────────────┐
│  5. Call apiSignup              │
│     From mockApi service        │
└──────────────┬──────────────────┘
               ↓
┌─────────────────────────────────┐
│  6. Mock API checks             │
│     User doesn't already exist  │
└──────────────┬──────────────────┘
               ↓
┌─────────────────────────────────┐
│  7. Create user in memory       │
│     Generate token              │
└──────────────┬──────────────────┘
               ↓
┌─────────────────────────────────┐
│  8. Return user + token         │
└──────────────┬──────────────────┘
               ↓
┌─────────────────────────────────┐
│  9. dispatch AUTH_SUCCESS       │
│     Save to localStorage        │
└──────────────┬──────────────────┘
               ↓
┌─────────────────────────────────┐
│  10. Update state               │
│     All useAuth subscribers     │
│     get new user + token        │
└──────────────┬──────────────────┘
               ↓
┌─────────────────────────────────┐
│  11. Navigate to /dashboard     │
└─────────────────────────────────┘
```

### User Login

```
SignupPage Form
    ↓
Call login(email, password)
    ↓
AUTH_START
    ↓
apiLogin(email, password)
    ↓
Validate credentials match user
    ↓
Return user + token
    ↓
AUTH_SUCCESS
    ↓
Save to localStorage
    ↓
All subscribers notified
    ↓
ProtectedRoute checks auth
    ↓
Navigate to /dashboard
```

### User Logout

```
Navbar logout button clicked
    ↓
Call logout()
    ↓
dispatch(LOGOUT)
    ↓
Clear localStorage
    ↓
Reset auth state
    ↓
All subscribers notified
    ↓
ProtectedRoute redirects to /login
```

### Session Restoration

```
App mounts
    ↓
AuthContext restoreAuth effect runs
    ↓
Check localStorage for token
    ↓
Found? Restore user + token
    ↓
Not found? Set as logged out
    ↓
Show dashboard/login accordingly
```

## 🔒 Token Management

### What is a Token?

A token is a unique string that proves you're logged in. It's like a temporary ID card.

```typescript
// Mock token format
const token = btoa(`${userId}:${timestamp}`);
// Example: "ZDJmZDM5NDA6MTY0NDMyMTU0OTg0Mg=="
```

### Token Storage

```typescript
// When user logs in
localStorage.setItem('auth_token', token);

// When user loads page
const token = localStorage.getItem('auth_token');

// When user logs out
localStorage.removeItem('auth_token');
```

### Token in Requests

In a real app, you'd send the token with every request:

```typescript
const response = await fetch('/api/notes', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Token Expiration

In this app, tokens don't expire (for demo). Real apps would:

```typescript
// Check if token is expired
if (token && isTokenExpired(token)) {
  logout();  // Force re-login
  return <Navigate to="/login" />;
}
```

## 🛡️ Protected Routes

### How Protection Works

```typescript
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // While loading, show spinner
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated, show component
  return children;
};
```

### Using Protected Routes

```typescript
// Routes that require authentication
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>

// Routes that don't (public)
<Route path="/login" element={<LoginPage />} />
<Route path="/signup" element={<SignupPage />} />
```

### What Happens Without Protection

```
Without ProtectedRoute:
User not logged in
  ↓
Can still access /dashboard
  ↓
useNotes hook tries to fetch user's notes
  ↓
Error: user.id is null
  ↓
Components crash

With ProtectedRoute:
User not logged in
  ↓
Redirected to /login
  ↓
No error, good UX
```

## 👤 User Data Structure

```typescript
interface User {
  id: string;           // Unique ID
  email: string;        // Email address
  name: string;         // Full name
  createdAt: string;    // Account creation date
}
```

### Example User

```javascript
{
  id: "1644321549842_abc1234567",
  email: "demo@example.com",
  name: "Demo User",
  createdAt: "2026-02-08T10:32:29.842Z"
}
```

## 🔄 Auth Context API

### Available Methods

```typescript
const {
  user,               // Current user or null
  token,              // Auth token or null
  isAuthenticated,    // Boolean: logged in?
  isLoading,          // Boolean: loading?
  error,              // Error message or null
  
  login,              // Method: login(email, password)
  signup,             // Method: signup(email, password, name)
  logout,             // Method: logout()
  clearError,         // Method: clearError()
} = useAuth();
```

### Using Auth in Components

```typescript
const MyComponent = () => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <p>Please log in</p>;
  }

  return (
    <>
      <p>Welcome, {user?.name}!</p>
      <button onClick={logout}>Logout</button>
    </>
  );
};
```

## 🛠️ Demo Credentials

For testing, use these credentials:

```
Email: demo@example.com
Password: password
```

They're hardcoded in the mock API for convenience.

## ⚠️ Error Handling

### Login Errors

```typescript
try {
  await login(email, password);
} catch (error) {
  // Show error message
  console.error(error.message);
  // Example: "Invalid email or password"
}
```

### Signup Errors

```typescript
try {
  await signup(email, password, name);
} catch (error) {
  // Show error message
  // Example: "User with this email already exists"
}
```

### Error Display

```typescript
const LoginPage = () => {
  const { error: authError } = useAuth();
  const form = useForm(/* ... */);

  return (
    <>
      {(form.errors.submit || authError) && (
        <div className="error-message">
          {form.errors.submit || authError}
        </div>
      )}
    </>
  );
};
```

## 🚀 Real Backend Integration

To connect to a real authentication backend, modify `src/services/mockApi.ts`:

### Before (Mock)

```typescript
export const apiLogin = async (email: string, password: string) => {
  await delay(500);  // Simulate network
  const userData = findUserByEmail(email);
  if (!userData || userData.password !== password) {
    throw new Error('Invalid credentials');
  }
  return { user: userData.user, token: '...' };
};
```

### After (Real)

```typescript
export const apiLogin = async (email: string, password: string) => {
  const response = await fetch('https://api.example.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();  // { user, token }
};
```

**Important:** No other code needs to change! The rest of the app stays the same.

## 📱 Authentication Flow Diagram

```
App Loads
  ↓
AuthContext effect runs
  ↓
Check localStorage for token
  ├─ Token found → Restore user → isAuthenticated = true
  └─ No token → isAuthenticated = false
  ↓
Navbar renders
  ├─ If authenticated → Show user name + logout
  └─ If not → Show login + signup links
  ↓
Router renders
  ├─ If authenticated → Allow /dashboard, /notes, etc
  └─ If not → Only allow /login, /signup
```

## ✅ Testing Authentication

### Test Login

1. Go to /login
2. Enter demo@example.com and password
3. Should redirect to /dashboard
4. Should show user name in navbar

### Test Signup

1. Go to /signup
2. Fill form with new credentials
3. Should create account
4. Should auto-login
5. Should redirect to /dashboard

### Test Logout

1. Click user name in navbar
2. Click logout
3. Should redirect to /login
4. Dashboard should be inaccessible

### Test Session Persistence

1. Login
2. Refresh page
3. Should still be logged in
4. Token should be in localStorage

---

**Next**: Learn about [CRUD Operations](09-crud-operations).
