# State Management

Complete guide to managing state in the React application.

## 📊 State Management Architecture

The app uses a hybrid approach with three levels of state:

```
┌──────────────────────────────────────┐
│     Global State (Context API)       │
│  (User auth, All notes, App-wide)   │
└──────────────────────────────────────┘
              ↓
┌──────────────────────────────────────┐
│     Local Component State (useState)  │
│  (Form inputs, Modal visibility)     │
└──────────────────────────────────────┘
              ↓
┌──────────────────────────────────────┐
│  Persistent State (localStorage)     │
│  (Auth token, Theme, Preferences)   │
└──────────────────────────────────────┘
```

## 🔐 AuthContext - Authentication State

### What It Manages

```typescript
interface AuthState {
  user: User | null;           // Current logged-in user
  token: string | null;         // JWT authentication token
  isAuthenticated: boolean;     // Is user logged in?
  isLoading: boolean;           // Loading state for auth operations
  error: string | null;         // Error message if any
}
```

### User Interface

```typescript
interface AuthContextType {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Methods
  login(email: string, password: string): Promise<void>;
  signup(email: string, password: string, name: string): Promise<void>;
  logout(): void;
  clearError(): void;
}
```

### How to Use

```typescript
// In any component
const { user, isAuthenticated, login, logout } = useAuth();

// Check if user is logged in
if (isAuthenticated) {
  <button onClick={logout}>Logout {user?.name}</button>
} else {
  <Link to="/login">Login</Link>
}
```

### State Flow

```
User Input (email, password)
    ↓
dispatch({ type: 'AUTH_START' })
    ↓
Call mockApi.apiLogin()
    ↓
Success → dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } })
    ↓
Save to localStorage
    ↓
Update state
    ↓
useAuth hook subscribers get new state
    ↓
Components re-render
```

### Reducer Actions

```typescript
type AuthAction =
  | { type: 'AUTH_START' }  // Start loading
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }  // Success
  | { type: 'AUTH_ERROR'; payload: string }  // Error occurred
  | { type: 'LOGOUT' }  // User logged out
  | { type: 'CLEAR_ERROR' }  // Clear error message
```

### Persistence

```typescript
// On login, save to localStorage
localStorage.setItem('auth_token', token);
localStorage.setItem('user_data', JSON.stringify(user));

// On mount, restore from localStorage
const token = localStorage.getItem('auth_token');
const user = JSON.parse(localStorage.getItem('user_data'));

// On logout, clear localStorage
localStorage.removeItem('auth_token');
localStorage.removeItem('user_data');
```

### File Reference

See `src/context/AuthContext.tsx` for complete implementation.

---

## 📝 NotesContext - Notes State Management

### What It Manages

```typescript
interface NotesState {
  notes: Note[];               // All notes for current user
  isLoading: boolean;          // Loading state
  error: string | null;        // Error message
  searchTerm: string;          // Current search query
}
```

### User Interface

```typescript
interface NotesContextType {
  // State
  notes: Note[];
  isLoading: boolean;
  error: string | null;
  filteredNotes: Note[];  // Computed from notes + searchTerm

  // Methods
  fetchNotes(): Promise<void>;  // Get all notes
  createNote(request: CreateNoteRequest): Promise<Note>;
  updateNote(id: string, request: UpdateNoteRequest): Promise<Note>;
  deleteNote(id: string): Promise<void>;
  setSearchTerm(term: string): void;
  clearError(): void;
}
```

### How to Use

```typescript
// In any component
const { notes, filteredNotes, createNote, deleteNote, setSearchTerm } = useNotes();

// List notes
{filteredNotes.map(note => (
  <NoteCard key={note.id} note={note} onDelete={deleteNote} />
))}

// Create note
const newNote = await createNote({
  title: 'My Note',
  content: 'Content here',
  tags: ['work', 'important']
});

// Update search
setSearchTerm('react');  // Will filter notes in real-time
```

### State Flow

```
Initial Load
    ↓
useEffect → dispatch(FETCH_START)
    ↓
Call mockApi.apiFetchNotes()
    ↓
Success → dispatch(FETCH_SUCCESS, payload: notes)
    ↓
useMemo computes filteredNotes based on searchTerm
    ↓
Components render with notes
    ↓
User actions (create/update/delete)
    ↓
dispatch(ADD_NOTE/UPDATE_NOTE/DELETE_NOTE)
    ↓
State updates
    ↓
Components re-render with new data
```

### Reducer Actions

```typescript
type NotesAction =
  | { type: 'FETCH_START' }  // Start loading notes
  | { type: 'FETCH_SUCCESS'; payload: Note[] }  // Got all notes
  | { type: 'FETCH_ERROR'; payload: string }  // Error loading
  | { type: 'ADD_NOTE'; payload: Note }  // Note created
  | { type: 'UPDATE_NOTE'; payload: Note }  // Note updated
  | { type: 'DELETE_NOTE'; payload: string }  // Note deleted (by ID)
  | { type: 'SET_FILTER'; payload: string }  // Search term changed
  | { type: 'CLEAR_ERROR' }  // Clear error message
```

### Computed State (useMemo)

```typescript
// Expensive computation - only runs when dependencies change
const filteredNotes = useMemo(() => {
  if (!state.searchTerm) return state.notes;
  
  // This is expensive when you have many notes
  return searchNotes(state.notes, state.searchTerm);
}, [state.notes, state.searchTerm]);
```

### File Reference

See `src/context/NotesContext.tsx` for complete implementation.

---

## 📌 Local Component State

### When to Use Local State

Local state (useState) should be used for:
- Form input values
- Modal/dialog visibility
- UI-only state (isEditing, isExpanded)
- Temporary data

### Example: Form State

```typescript
// LoginPage.tsx
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // These are form-specific, don't need global state
  const handleChange = (e) => {
    if (e.target.name === 'email') setEmail(e.target.value);
    if (e.target.name === 'password') setPassword(e.target.value);
  };
};
```

### Example: Modal State

```typescript
// DashboardPage.tsx
const DashboardPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // These are UI-only states
  return (
    <>
      <button onClick={() => setIsCreateModalOpen(true)}>
        Create Note
      </button>

      {isCreateModalOpen && (
        <Modal onClose={() => setIsCreateModalOpen(false)} />
      )}
    </>
  );
};
```

### Example: Derived State

```typescript
// DashboardPage.tsx
const DashboardPage = () => {
  const [searchInput, setSearchInput] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  // These are component-specific states
  const isEditMode = editingNoteId !== null;
  
  return (
    <>
      <input
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
    </>
  );
};
```

---

## 💾 Persistent State (localStorage)

### What to Persist

```typescript
// Good candidates for localStorage:
- Authentication token
- User profile
- User preferences (theme, language, notifications)
- Form drafts
- Recent searches

// Bad candidates for localStorage:
- API response data (should use Context/Redux)
- Real-time data
- Large objects (localStorage is limited)
```

### How useLocalStorage Works

```typescript
const [value, setValue, removeValue] = useLocalStorage('key', initialValue);

// When you setValue:
// 1. Updates React state
// 2. Saves to localStorage
// 3. Dispatches storage event
// 4. Other tabs notified

// When you removeValue:
// 1. Resets to initialValue
// 2. Removes from localStorage
```

### Example: Theme Preference

```typescript
// SettingsPage.tsx
const SettingsPage = () => {
  const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light');

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);  // Saves to localStorage automatically
  };

  // Theme persists even after closing browser!
  return (
    <select value={theme} onChange={(e) => handleThemeChange(e.target.value)}>
      <option>light</option>
      <option>dark</option>
    </select>
  );
};
```

### File Reference

See `src/hooks/useLocalStorage.ts` for implementation.

---

## 🔄 State Flow Patterns

### Pattern 1: Simple State Update

```
Component
  ↓
User action
  ↓
setState(newValue)
  ↓
React updates state
  ↓
Component re-renders
```

### Pattern 2: Async State Update

```
Component
  ↓
User action
  ↓
dispatch(ACTION_START)
  ↓
Call async function
  ↓
Success → dispatch(ACTION_SUCCESS, data)
  ↓
State updated
  ↓
Component re-renders
```

### Pattern 3: Context-based State

```
App provides Context
  ↓
All children can useContext
  ↓
Any child calls context method
  ↓
Context updates state
  ↓
All subscribers notified
  ↓
All subscribers re-render
```

### Pattern 4: Form with Validation

```
User types
  ↓
onChange → setState
  ↓
onBlur → validate
  ↓
If error → setError
  ↓
Display error message
  ↓
User submits
  ↓
Validate all fields
  ↓
If valid → async action
  ↓
Update context state
```

---

## 🎯 Best Practices

### DO ✅

1. **Use context for global state**
   ```typescript
   // Shared across many components
   const { user } = useAuth();
   ```

2. **Use useState for local state**
   ```typescript
   // Component-specific
   const [isOpen, setIsOpen] = useState(false);
   ```

3. **Use localStorage for persistence**
   ```typescript
   // Survives page refresh
   const [theme, setTheme] = useLocalStorage('theme', 'light');
   ```

4. **Lift state when needed**
   ```typescript
   // If multiple components need same state, move it up
   const [shared, setShared] = useState('value');
   <ChildA state={shared} />
   <ChildB state={shared} />
   ```

5. **Use useCallback with context methods**
   ```typescript
   const createNote = useCallback(async (data) => {
     // Implementation
   }, [dependencies]);
   ```

### DON'T ❌

1. **Don't store derived state**
   ```typescript
   // ❌ Bad
   const [count, setCount] = useState(5);
   const [doubled, setDoubled] = useState(10);  // Derived!

   // ✅ Good
   const [count, setCount] = useState(5);
   const doubled = count * 2;  // Computed
   ```

2. **Don't sync state between unrelated components without context**
   ```typescript
   // ❌ Bad - prop drilling
   <Parent>
     <Child1 value={state} onChange={setState} />
     <Child2 value={state} onChange={setState} />
   </Parent>

   // ✅ Good - use context
   <StateProvider>
     <Child1 />
     <Child2 />
   </StateProvider>
   ```

3. **Don't update state based on props without useEffect**
   ```typescript
   // ❌ Bad - state falls out of sync
   const [name, setName] = useState(user.name);

   // ✅ Good - sync with effect
   const [name, setName] = useState(user.name);
   useEffect(() => {
     setName(user.name);
   }, [user.name]);
   ```

4. **Don't mutate state directly**
   ```typescript
   // ❌ Bad
   state.notes.push(newNote);  // Don't mutate!
   setState(state);

   // ✅ Good - create new array
   setState([...state, newNote]);
   ```

---

## 📊 State Debug Tips

### Use React DevTools

1. Install React Developer Tools browser extension
2. Open DevTools → Components tab
3. Click on component
4. See state in right panel
5. Edit state values to test

### Console Logging

```typescript
// Log state changes
useEffect(() => {
  console.log('Auth state updated:', { user, isAuthenticated });
}, [user, isAuthenticated]);

// Log context value
const context = useContext(AuthContext);
console.log('Auth context:', context);
```

### Debugging State Updates

```typescript
// Add logging to reducer
const reducer = (state, action) => {
  console.log('Action dispatched:', action.type);
  console.log('Previous state:', state);
  
  const newState = /* ... */;
  
  console.log('New state:', newState);
  return newState;
};
```

---

**Next**: Read about [Custom Hooks](06-custom-hooks) for reusable logic patterns.
