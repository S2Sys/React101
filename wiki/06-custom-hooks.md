# Custom Hooks Library

Complete guide to all custom hooks in the application.

## 📚 Custom Hooks Overview

This app includes **12 custom hooks** that encapsulate reusable React logic.

| Hook | File | Purpose |
|------|------|---------|
| useAuth | useAuth.ts | Authentication state & methods |
| useAuthToken | useAuth.ts | Get auth token |
| useIsAuthenticated | useAuth.ts | Check if logged in |
| useLogout | useAuth.ts | Logout functionality |
| useFetch | useFetch.ts | Generic data fetching |
| useFetchOnDemand | useFetch.ts | Fetch on demand |
| usePolling | useFetch.ts | Polling data updates |
| useLazyFetch | useFetch.ts | Lazy loading fetch |
| useForm | useForm.ts | Form state management |
| useFormField | useForm.ts | Single field management |
| useFormArray | useForm.ts | Array field management |
| useLocalStorage | useLocalStorage.ts | Browser storage |
| useSessionStorage | useSessionStorage.ts | Session storage |
| useClipboard | useLocalStorage.ts | Clipboard operations |
| useDebounce | useDebounce.ts | Debounce values |
| useDebounceFn | useDebounce.ts | Debounce functions |
| useThrottle | useDebounce.ts | Throttle values |
| useThrottleFn | useDebounce.ts | Throttle functions |
| useAsync | useDebounce.ts | Async operations |

## 🔐 Authentication Hooks

### useAuth()
Main hook for accessing authentication context.

```typescript
const {
  user,
  token,
  isAuthenticated,
  isLoading,
  error,
  login,
  signup,
  logout,
  clearError
} = useAuth();
```

### useAuthToken()
Get only the auth token.

```typescript
const token = useAuthToken();
// Use with API calls
```

### useIsAuthenticated()
Boolean check for authentication status.

```typescript
const isLoggedIn = useIsAuthenticated();
if (isLoggedIn) { /* show UI */ }
```

### useLogout()
Memoized logout function.

```typescript
const logout = useLogout();
<button onClick={logout}>Logout</button>
```

**File**: `src/hooks/useAuth.ts`

## 📡 Data Fetching Hooks

### useFetch()
Generic hook for fetching data with loading/error states.

```typescript
const { data, isLoading, error, refetch } = useFetch(
  async () => {
    const response = await fetch('/api/data');
    return response.json();
  }
);
```

**Features:**
- ✅ Automatic fetch on mount
- ✅ Loading state
- ✅ Error handling
- ✅ Refetch function
- ✅ Generic type support

### useFetchOnDemand()
Like useFetch but manual triggering.

```typescript
const { data, isLoading, error, fetch } = useFetchOnDemand(asyncFn);
<button onClick={() => fetch()}>Load Data</button>
```

### usePolling()
Auto-refetch at intervals.

```typescript
const { data, stop } = usePolling(asyncFn, 5000);  // Fetch every 5s
```

### useLazyFetch()
Tuple-based API like Apollo.

```typescript
const [fetch, { data, isLoading }] = useLazyFetch(asyncFn);
```

**File**: `src/hooks/useFetch.ts`

## 📝 Form Hooks

### useForm()
Complete form state management.

```typescript
const form = useForm(
  initialValues,
  onSubmit,
  validate
);

// Returns:
{
  values,         // Form input values
  errors,         // Validation errors
  touched,        // Which fields were touched
  isSubmitting,   // Is submitting?
  isDirty,        // Has form changed?
  handleChange,   // Input change handler
  handleBlur,     // Blur handler
  handleSubmit,   // Form submission
  resetForm,      // Reset to initial
  setFieldValue   // Set field programmatically
}
```

### useFormField()
Single field management.

```typescript
const field = useFormField('', validateEmail);

<input
  value={field.value}
  onChange={field.handleChange}
  onBlur={field.handleBlur}
/>
{field.error && <span>{field.error}</span>}
```

### useFormArray()
Array field management (for dynamic fields).

```typescript
const tags = useFormArray(['tag1']);
tags.push('tag2');
tags.remove(0);
tags.setValue(0, 'newtag');
```

**File**: `src/hooks/useForm.ts`

## 💾 Storage Hooks

### useLocalStorage()
Persist state to localStorage.

```typescript
const [value, setValue, removeValue] = useLocalStorage('key', initialValue);

setValue(newValue);  // Auto-saves to localStorage
removeValue();       // Remove from localStorage
```

**Features:**
- ✅ Auto-persist
- ✅ Auto-restore
- ✅ JSON serialization
- ✅ Cross-tab sync
- ✅ Generic types

### useSessionStorage()
Like useLocalStorage but session-only.

```typescript
const [value, setValue] = useSessionStorage('key', initialValue);
// Cleared when tab closes
```

### useLocalStorageObject()
Object-level updates.

```typescript
const user = useLocalStorageObject('user', { name: '', age: 0 });
user.update('name', 'John');
user.updateMultiple({ name: 'John', age: 30 });
```

### useClipboard()
Copy to clipboard.

```typescript
const { copy, isCopied } = useClipboard();
await copy('text to copy');
{isCopied && <p>Copied!</p>}
```

**File**: `src/hooks/useLocalStorage.ts`

## ⏱️ Timing Hooks

### useDebounce()
Debounce a value.

```typescript
const [searchInput, setSearchInput] = useState('');
const debouncedSearch = useDebounce(searchInput, 300);

useEffect(() => {
  searchNotes(debouncedSearch);
}, [debouncedSearch]);
```

### useDebounceFn()
Debounce a function.

```typescript
const debouncedSearch = useDebounceFn(async (term) => {
  const results = await api.search(term);
}, 300);

<input onChange={(e) => debouncedSearch(e.target.value)} />
```

### useThrottle()
Throttle a value.

```typescript
const throttledScroll = useThrottle(window.scrollY, 100);
```

### useThrottleFn()
Throttle a function.

```typescript
const throttledResize = useThrottleFn(() => {
  console.log('resized');
}, 200);
```

### useAsync()
Async operations with debouncing.

```typescript
const { status, data, error, execute } = useAsync(
  async (term) => api.search(term),
  false,  // Don't execute immediately
  500     // 500ms debounce
);
```

**File**: `src/hooks/useDebounce.ts`

## 🎓 How to Create Custom Hooks

### Pattern
```typescript
// 1. Name starts with "use"
// 2. Only call other hooks
// 3. Return data and methods

const useMyHook = (param) => {
  const [state, setState] = useState('');
  
  useEffect(() => {
    // Setup
  }, [param]);

  const method = useCallback(() => {
    // Implementation
  }, [state]);

  // Return what consumers need
  return { state, method };
};
```

### Best Practices

**DO:**
- ✅ Keep hooks focused (one job)
- ✅ Return stable references (useCallback)
- ✅ Memoize expensive operations (useMemo)
- ✅ Document parameters and return value
- ✅ Add error handling
- ✅ Cleanup side effects

**DON'T:**
- ❌ Call hooks conditionally
- ❌ Call from regular functions
- ❌ Use in loops
- ❌ Make overly complex logic
- ❌ Forget cleanup functions

## 📖 Usage Examples

### Example 1: Fetching Notes
```typescript
const NotesPage = () => {
  const { data: notes, isLoading, error } = useFetch(
    () => apiFetchNotes(user.id)
  );

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      {notes.map(note => <NoteCard key={note.id} note={note} />)}
    </div>
  );
};
```

### Example 2: Form with Validation
```typescript
const LoginForm = () => {
  const form = useForm(
    { email: '', password: '' },
    async (values) => {
      await login(values.email, values.password);
    },
    (values) => validateLoginForm(values.email, values.password)
  );

  return (
    <form onSubmit={form.handleSubmit(async () => {
      // Submit logic
    })}>
      <input
        name="email"
        value={form.values.email}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
      />
      {form.touched.email && form.errors.email && (
        <span>{form.errors.email}</span>
      )}
      <button type="submit" disabled={form.isSubmitting}>
        Submit
      </button>
    </form>
  );
};
```

### Example 3: Debounced Search
```typescript
const SearchNotes = () => {
  const [input, setInput] = useState('');
  const debouncedInput = useDebounce(input, 300);
  const { setSearchTerm } = useNotes();

  useEffect(() => {
    setSearchTerm(debouncedInput);
  }, [debouncedInput]);

  return (
    <input
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Search notes..."
    />
  );
};
```

### Example 4: localStorage Preferences
```typescript
const SettingsPage = () => {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [notifications, setNotifications] = useLocalStorage('notifications', true);

  return (
    <>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option>light</option>
        <option>dark</option>
      </select>
      <label>
        <input
          type="checkbox"
          checked={notifications}
          onChange={(e) => setNotifications(e.target.checked)}
        />
        Email Notifications
      </label>
    </>
  );
};
```

---

**Next**: Learn about [Pages & Features](07-pages-features).
