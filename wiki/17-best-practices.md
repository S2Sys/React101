# React Best Practices

Best practices and patterns for writing maintainable React code.

## 🎯 Component Design Principles

### Single Responsibility Principle

**One component = one job**

```typescript
// ❌ Bad: Component does too much
const NotesList = () => {
  const [notes, setNotes] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // 100+ lines mixing search, sort, edit, delete, display...
};

// ✅ Good: Separated concerns
const NotesListContainer = () => {
  const [notes, setNotes] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('date');
  
  const filtered = useMemo(() => filterNotes(notes, filter), [notes, filter]);
  const sorted = useMemo(() => sortNotes(filtered, sortBy), [filtered, sortBy]);
  
  return <NotesList notes={sorted} onSort={setSortBy} />;
};

const NotesList = ({ notes, onSort }) => (
  <>
    <SortControls onChange={onSort} />
    <div className="notes-list">
      {notes.map(note => <NoteCard key={note.id} note={note} />)}
    </div>
  </>
);
```

### Component Composition

```typescript
// ❌ Bad: Hard to reuse, tightly coupled
const UserProfile = ({ user }) => {
  return (
    <div className="profile">
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.bio}</p>
      <div className="actions">
        <button onClick={() => editUser(user.id)}>Edit</button>
        <button onClick={() => deleteUser(user.id)}>Delete</button>
      </div>
    </div>
  );
};

// ✅ Good: Composable, reusable pieces
const Avatar = ({ src, alt, size = 'md' }) => (
  <img src={src} alt={alt} className={`avatar avatar--${size}`} />
);

const UserInfo = ({ name, bio }) => (
  <>
    <h2>{name}</h2>
    <p>{bio}</p>
  </>
);

const ActionButtons = ({ userId, onEdit, onDelete }) => (
  <div className="action-buttons">
    <button onClick={() => onEdit(userId)}>Edit</button>
    <button onClick={() => onDelete(userId)}>Delete</button>
  </div>
);

const UserProfile = ({ user, onEdit, onDelete }) => (
  <div className="profile">
    <Avatar src={user.avatar} alt={user.name} />
    <UserInfo name={user.name} bio={user.bio} />
    <ActionButtons userId={user.id} onEdit={onEdit} onDelete={onDelete} />
  </div>
);
```

---

## 🧠 State Management Guidelines

### When to Use Each State Type

```typescript
// ❌ All in global state (unnecessary)
const context = useContext(AppContext);
const [isInputFocused] = context.isInputFocused;  // Overkill!

// ✅ Use local state for UI-only state
const [isInputFocused, setIsInputFocused] = useState(false);

// ❌ Props drilling (bad DX)
<Parent>
  <Child1 theme={theme} />
  <Child2 theme={theme} />
  <Child3 theme={theme} />
</Parent>

// ✅ Use context for global state
<ThemeProvider>
  <Child1 />
  <Child2 />
  <Child3 />
</ThemeProvider>

// ❌ Context for frequently changing state (performance issue)
const TimerContext = createContext<number>(0);  // Updates 60fps

// ✅ Keep frequently changing state local
const [time, setTime] = useState(0);
```

### State Update Patterns

```typescript
// ❌ Bad: Mutation
const [user, setUser] = useState({ name: 'John', age: 25 });
user.age = 26;  // ❌ Mutating!
setUser(user);

// ✅ Good: Immutable update
setUser({ ...user, age: 26 });

// ❌ Bad: Derived state (falls out of sync)
const [user, setUser] = useState(initialUser);
const [fullName, setFullName] = useState(`${user.firstName} ${user.lastName}`);

// ✅ Good: Computed state
const [user, setUser] = useState(initialUser);
const fullName = `${user.firstName} ${user.lastName}`;
```

---

## 🎯 Hook Best Practices

### Hook Rules

```typescript
// ❌ Bad: Hook in conditional
if (user) {
  useEffect(() => {
    // This breaks React's hook tracking!
  }, [user]);
}

// ✅ Good: Always call hooks
useEffect(() => {
  if (user) {
    // Logic inside effect
  }
}, [user]);

// ❌ Bad: Hook in loop
for (let i = 0; i < 10; i++) {
  useEffect(() => {
    // This breaks hook order!
  }, []);
}

// ✅ Good: Call hooks at top level
useEffect(() => {
  for (let i = 0; i < 10; i++) {
    // Logic inside effect
  }
}, []);
```

### Effect Dependencies

```typescript
// ❌ Bad: Missing dependency (stale closure)
const SearchNotes = () => {
  const [query, setQuery] = useState('');
  
  useEffect(() => {
    searchApi(query);  // Uses stale 'query'!
  }, []);  // Missing dependency
};

// ✅ Good: Complete dependencies
const SearchNotes = () => {
  const [query, setQuery] = useState('');
  
  useEffect(() => {
    searchApi(query);
  }, [query]);  // Includes all dependencies
};

// ❌ Bad: Unnecessary dependencies (re-run too often)
const NotesList = ({ notes, sortBy, filter }) => {
  const sorted = useMemo(() => {
    return notes.sort((a, b) => a.date - b.date);
  }, [notes, sortBy, filter, new Date()]);  // Too many!
};

// ✅ Good: Only necessary dependencies
const NotesList = ({ notes }) => {
  const sorted = useMemo(() => {
    return notes.sort((a, b) => a.date - b.date);
  }, [notes]);  // Only what's needed
};
```

### Custom Hook Patterns

```typescript
// ❌ Bad: Mixing concerns
const useFetchAndForm = (url) => {
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    fetch(url).then(r => setData(r.json()));
  }, [url]);
  
  return { data, formData, isLoading, setFormData };
};

// ✅ Good: Separate concerns
const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    fetch(url).then(r => setData(r.json()));
  }, [url]);
  
  return { data, isLoading };
};

const useFormInput = (initialValue = '') => {
  const [value, setValue] = useState(initialValue);
  return { value, onChange: (e) => setValue(e.target.value) };
};

// Usage
const SearchPage = () => {
  const { data, isLoading } = useFetch('/api/data');
  const searchInput = useFormInput('');
  
  return (
    <>
      <input {...searchInput} />
      {isLoading ? <Spinner /> : <Results data={data} />}
    </>
  );
};
```

---

## 📁 Code Organization

### File Structure

```
src/
├── pages/              # Page components (one per route)
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   └── NotePage.tsx
│
├── components/         # Reusable components
│   ├── NoteCard.tsx
│   ├── NoteForm.tsx
│   └── Navbar.tsx
│
├── hooks/              # Custom hooks
│   ├── useAuth.ts
│   ├── useFetch.ts
│   └── useForm.ts
│
├── context/            # Context providers
│   ├── AuthContext.tsx
│   └── NotesContext.tsx
│
├── types/              # TypeScript types
│   └── index.ts
│
├── services/           # API, external services
│   └── mockApi.ts
│
├── utils/              # Utility functions
│   ├── validators.ts
│   ├── helpers.ts
│   └── constants.ts
│
└── styles/             # CSS files
    └── App.css
```

### Feature-Based Organization (for larger apps)

```
src/features/
├── auth/
│   ├── components/
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── services/
│   │   └── authApi.ts
│   ├── types/
│   │   └── index.ts
│   └── AuthContext.tsx
│
├── notes/
│   ├── components/
│   │   ├── NoteCard.tsx
│   │   └── NoteForm.tsx
│   ├── hooks/
│   │   └── useNotes.ts
│   ├── services/
│   │   └── notesApi.ts
│   ├── types/
│   │   └── index.ts
│   └── NotesContext.tsx
│
└── shared/
    ├── components/
    │   └── Navbar.tsx
    ├── hooks/
    ├── utils/
    └── types/
```

---

## 🏷️ Naming Conventions

### Components

```typescript
// ✅ Good: PascalCase for component names
const NoteCard = () => { };
const UserProfile = () => { };
const AuthProvider = () => { };

// ❌ Bad: camelCase for components
const noteCard = () => { };
const userProfile = () => { };
```

### Functions and Variables

```typescript
// ✅ Good: camelCase for functions/variables
const getUserName = () => { };
const isNoteEmpty = false;
const handleSubmit = () => { };

// ❌ Bad: PascalCase for non-components
const GetUserName = () => { };
const IsNoteEmpty = false;
const HandleSubmit = () => { };
```

### Files and Folders

```
// ✅ Good: kebab-case for files
src/components/note-card.tsx
src/pages/dashboard-page.tsx
src/utils/string-helpers.ts

// Component: NoteCard (file: note-card.tsx)
// Function: getNoteById (file: note-utils.ts)
```

### Booleans

```typescript
// ✅ Good: is/has/should prefix
const isLoading = true;
const hasError = false;
const shouldFetch = true;

// ❌ Bad: Ambiguous names
const loading = true;
const error = false;
const fetch = true;
```

---

## 🔄 Common Patterns

### Controlled vs Uncontrolled Components

```typescript
// ✅ Controlled: React manages state
const ControlledInput = () => {
  const [value, setValue] = useState('');
  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      // React always knows the current value
    />
  );
};

// ✅ Uncontrolled: DOM manages state (less common)
const UncontrolledInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = () => {
    const value = inputRef.current?.value;  // Read from DOM
    console.log(value);
  };
  
  return (
    <>
      <input ref={inputRef} defaultValue="" />
      <button onClick={handleSubmit}>Submit</button>
    </>
  );
};

// Use controlled for forms with validation, uncontrolled for simple cases
```

### Render Props vs Custom Hooks

```typescript
// Old pattern: Render Props
const DataFetcher = ({ url, render }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchData(url).then(d => {
      setData(d);
      setIsLoading(false);
    });
  }, [url]);
  
  return render({ data, isLoading });
};

<DataFetcher
  url="/api/notes"
  render={({ data, isLoading }) => (
    isLoading ? <Spinner /> : <NotesList notes={data} />
  )}
/>

// ✅ Better: Custom Hook
const useFetchData = (url) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchData(url).then(d => {
      setData(d);
      setIsLoading(false);
    });
  }, [url]);
  
  return { data, isLoading };
};

const MyComponent = () => {
  const { data, isLoading } = useFetchData('/api/notes');
  return isLoading ? <Spinner /> : <NotesList notes={data} />;
};
```

### Conditional Rendering

```typescript
// ❌ Bad: Unnecessary variables
const shouldShow = user && user.isAdmin;
if (shouldShow) {
  return <AdminPanel />;
}
return null;

// ✅ Good: Direct condition
if (user?.isAdmin) {
  return <AdminPanel />;
}
return null;

// ✅ Good: Ternary for alternative UI
return user?.isAdmin ? <AdminPanel /> : <UserPanel />;

// ✅ Good: Logical AND for optional UI
return user?.isAdmin && <AdminPanel />;
```

---

## 🚀 Performance Optimization

### Keys in Lists

```typescript
// ❌ Bad: Using array index as key
{notes.map((note, index) => (
  <NoteCard key={index} note={note} />
))}

// ✅ Good: Using unique identifier
{notes.map((note) => (
  <NoteCard key={note.id} note={note} />
))}
```

### Lazy Loading Routes

```typescript
// ✅ Good: Split code by route
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const NotePage = lazy(() => import('./pages/NotePage'));

const App = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/notes/:id" element={<NotePage />} />
    </Routes>
  </Suspense>
);
```

---

## 📝 Comments and Documentation

### What to Comment

```typescript
// ✅ Good: Explain WHY, not WHAT
useEffect(() => {
  // We need to debounce search to avoid excessive API calls
  const timer = setTimeout(() => searchNotes(query), 300);
  return () => clearTimeout(timer);
}, [query]);

// ❌ Bad: Obvious what the code does
// Set timeout for 300ms
const timer = setTimeout(() => searchNotes(query), 300);
```

### JSDoc Comments

```typescript
/**
 * Creates a new note in the database
 * 
 * @param userId - The ID of the user creating the note
 * @param request - The note creation request
 * @returns Promise with the created note
 * @throws Error if note creation fails
 */
export const apiCreateNote = async (
  userId: string,
  request: CreateNoteRequest
): Promise<Note> => {
  // Implementation
};
```

---

## 🔗 Related Documentation

- [Custom Hooks](06-custom-hooks.md) - Hook patterns
- [Components Guide](05-components-guide.md) - Component design
- [State Management](04-state-management.md) - State patterns
- [Error Handling](14-error-handling.md) - Error handling patterns

---

**Next**: Learn about [Troubleshooting](18-troubleshooting.md).
