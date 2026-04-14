# Components Guide

Complete guide to all components in the application.

## 📦 Component Types

The app has two types of components:

1. **Page Components** - Full page layouts (6 total)
2. **Reusable Components** - Used in multiple places (5+ total)

## 🔐 ProtectedRoute Component

### Purpose

Guards routes that require authentication. Redirects unauthenticated users to login.

### Location

`src/components/ProtectedRoute.tsx`

### How It Works

```typescript
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return children;
};
```

### Usage

```typescript
// In routes
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

### Features

- ✅ Shows loading spinner while checking auth
- ✅ Redirects to login if not authenticated
- ✅ Renders protected component if authenticated
- ✅ Uses useAuth hook

---

## ⏳ LoadingSpinner Component

### Purpose

Shows a spinning loader with optional message during async operations.

### Location

`src/components/LoadingSpinner.tsx`

### Usage

```typescript
{isLoading && <LoadingSpinner message="Loading notes..." />}
```

### Customization

```typescript
<LoadingSpinner />
// Shows default "Loading..."

<LoadingSpinner message="Fetching data..." />
// Shows custom message
```

---

## ⚠️ ErrorBoundary Component

### Purpose

Catches JavaScript errors anywhere in the component tree.

### Location

`src/components/ErrorBoundary.tsx`

### How It Works

```typescript
class ErrorBoundary extends React.Component {
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorUI error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

### Usage

```typescript
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### Important Notes

- ⚠️ Must be class component (not functional)
- ✅ Catches rendering errors
- ✅ Shows fallback UI
- ❌ Doesn't catch async errors
- ❌ Doesn't catch event handler errors

---

## 🧭 Navbar Component

### Purpose

Application navigation bar with user info and logout.

### Location

`src/components/Navbar.tsx`

### Features

**When not authenticated:**
- Shows "Login" link
- Shows "Sign Up" link

**When authenticated:**
- Shows user name
- Shows logout button
- Shows dashboard, profile, settings links

### Usage

```typescript
// No props needed - uses useAuth internally
<Navbar />
```

### Code

```typescript
const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      {isAuthenticated ? (
        <>
          <span>Welcome, {user?.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </>
      )}
    </nav>
  );
};
```

---

## 📝 NoteCard Component

### Purpose

Displays a single note in card format with preview.

### Location

`src/components/NoteCard.tsx`

### Props

```typescript
interface NoteCardProps {
  note: Note;
  onDelete?: (id: string) => void;
}
```

### Features

- ✅ Shows note title
- ✅ Shows content preview (truncated)
- ✅ Shows tags
- ✅ Shows creation date
- ✅ Delete button (optional)
- ✅ Clickable to view full note

### Usage

```typescript
<NoteCard
  note={note}
  onDelete={handleDelete}
/>
```

### Interaction

- **Click card** → Navigate to note detail
- **Click delete button** → Delete note (with confirmation)
- **Hover** → Shows delete button

---

## 📄 Page Components

### Structure

All page components:
- Use `useAuth()` for authentication
- Use `useNotes()` for note management
- Have their own `useState` for local UI state
- Use `useForm()` for forms
- Are wrapped in `<ProtectedRoute>` (except Login/Signup)

### Navigation

```
/ → /login (default)
/login → LoginPage
/signup → SignupPage
/dashboard → DashboardPage (protected)
/notes/:id → NotePage (protected)
/profile → ProfilePage (protected)
/settings → SettingsPage (protected)
```

---

## 🔐 Authentication Pages

### LoginPage

**Location:** `src/pages/LoginPage.tsx`

**Purpose:** User login form

**Features:**
- Email input validation
- Password input
- Remember me option
- Error display
- Demo credentials hint
- Link to signup
- Auto-redirect if already logged in

**Key Hooks:**
- `useAuth()` - For login method
- `useForm()` - For form state
- `useNavigate()` - For redirect

### SignupPage

**Location:** `src/pages/SignupPage.tsx`

**Purpose:** User registration form

**Features:**
- Email validation
- Name input
- Password with confirmation
- Password match validation
- Error display
- Link to login
- Auto-redirect if already logged in

**Key Hooks:**
- `useAuth()` - For signup method
- `useForm()` - For form state
- `useNavigate()` - For redirect

---

## 📋 Notes Pages

### DashboardPage

**Location:** `src/pages/DashboardPage.tsx`

**Purpose:** List all notes with search and create

**Features:**
- Shows all user notes in grid layout
- Search notes (debounced 300ms)
- Filter by title, content, or tags
- Create new note modal
- Delete notes with confirmation
- Responsive grid layout

**Key Hooks:**
- `useNotes()` - Get notes and CRUD methods
- `useForm()` - For create note form
- `useDebounce()` - Debounce search input
- `useState()` - Modal visibility

### NotePage

**Location:** `src/pages/NotePage.tsx`

**Purpose:** View and edit a single note

**Features:**
- Display full note content
- Edit mode with form
- Save changes
- Delete note
- Show metadata (created, updated dates)
- Display tags

**Key Hooks:**
- `useParams()` - Get note ID from URL
- `useNotes()` - Get note and CRUD methods
- `useForm()` - For edit form
- `useNavigate()` - For redirect

---

## 👤 User Pages

### ProfilePage

**Location:** `src/pages/ProfilePage.tsx`

**Purpose:** Display user profile information

**Features:**
- Show user email
- Show user name
- Show member since date
- Show account status
- Responsive layout

**Key Hooks:**
- `useAuth()` - Get user data

### SettingsPage

**Location:** `src/pages/SettingsPage.tsx`

**Purpose:** User preferences and settings

**Features:**
- Theme selector (light/dark)
- Email notification toggle
- Auto-save toggle
- Information about the app
- Reset settings button

**Key Hooks:**
- `useLocalStorage()` - Persist preferences
- `useState()` - For temporary settings

---

## 🎨 Styling Components

### CSS Files Location

```
src/styles/
├── App.css                  # Main styles
├── Navbar.css              # Navigation
├── AuthPage.css            # Login/Signup
├── DashboardPage.css       # Dashboard
├── NotePage.css            # Note detail
├── ProfilePage.css         # Profile
├── SettingsPage.css        # Settings
├── NoteCard.css            # Note card
├── LoadingSpinner.css      # Loading
└── ErrorBoundary.css       # Errors
```

### Common Patterns

**Button Styling:**
```css
.primary-btn { background: #0066cc; }
.secondary-btn { background: #e0e0e0; }
.danger-btn { background: #d32f2f; }
```

**Form Input Styling:**
```css
.form-input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-input.error {
  border-color: #d32f2f;
}
```

**Responsive:**
```css
@media (max-width: 768px) {
  .desktop-only { display: none; }
  .mobile-only { display: block; }
}
```

---

## 🔄 Component Communication

### Props Down

```
Parent
  ↓ (props)
Child
  ↓ (props)
GrandChild
```

### Events Up

```
GrandChild
  ↓ (onClick)
handleEvent
  ↓
Parent state updates
  ↓
Re-renders with new props
```

### Context Across

```
AuthProvider
  ├→ Page 1 (useAuth)
  ├→ Page 2 (useAuth)
  └→ Page 3 (useAuth)
All can access same state!
```

---

## ✨ Component Best Practices

### DO ✅

1. **Keep components focused**
   ```typescript
   // ✅ Does one thing well
   const NoteCard = ({ note, onDelete }) => { ... };
   ```

2. **Use descriptive names**
   ```typescript
   // ✅ Clear what it does
   const ProtectedRoute = ({ children }) => { ... };
   ```

3. **Extract reusable components**
   ```typescript
   // ✅ Can be used multiple places
   const LoadingSpinner = () => { ... };
   ```

4. **Use props for customization**
   ```typescript
   // ✅ Reusable with different data
   const Modal = ({ title, children, onClose }) => { ... };
   ```

5. **Handle errors gracefully**
   ```typescript
   // ✅ Shows fallback UI
   if (error) return <ErrorMessage message={error} />;
   ```

### DON'T ❌

1. **Don't make mega-components**
   ```typescript
   // ❌ Too much responsibility
   const Dashboard = ({ /* 20 props */ }) => { ... };
   ```

2. **Don't hide required props**
   ```typescript
   // ❌ What props does it need?
   const Card = (props) => { ... };
   ```

3. **Don't make props optional without reason**
   ```typescript
   // ❌ When should I pass it?
   const Button = ({ onClick?: () => void }) => { ... };
   ```

4. **Don't compute in render**
   ```typescript
   // ❌ Slow and not memoized
   const filtered = notes.filter(n => n.tag === 'work');
   return <List items={filtered} />;

   // ✅ Use useMemo
   const filtered = useMemo(
     () => notes.filter(n => n.tag === 'work'),
     [notes]
   );
   ```

---

**Next**: Learn about [Custom Hooks](06-custom-hooks) for reusable logic.
