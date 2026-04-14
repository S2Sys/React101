# Performance Optimization Guide

Learn how to measure and optimize React application performance.

## ⚡ Performance Principles

React renders efficiently by default, but you can optimize further:

1. **Identify bottlenecks** - Find slow operations with profiling
2. **Memoize expensive computations** - Cache results with `useMemo()`
3. **Memoize callbacks** - Prevent unnecessary re-renders with `useCallback()`
4. **Lazy load routes** - Split code with `React.lazy()`
5. **Bundle analysis** - Check bundle size

---

## 🔍 Profiling with React DevTools

### Installation

1. Install [React DevTools browser extension](https://react.devtools)
2. Go to DevTools → Profiler tab
3. Click the record button ⏺️
4. Interact with the app
5. Click stop ⏹️

### Analyzing Profile Results

The Profiler shows:

- **Component name** - Which component rendered
- **Duration** - How long the render took (ms)
- **Reason** - Why it re-rendered (props/state change)
- **Color code** - Yellow (slow) to green (fast)

### Example Session

```
Profile Recording Started...

User clicks "Create Note" button
  → DashboardPage renders (2.3ms)
    → Input field renders (0.8ms)
    → Modal renders (1.2ms)
  → Navbar renders (0.3ms)

Total render time: 4.6ms
```

**Good:** All renders complete in < 16ms (60 FPS threshold)

---

## 💾 useMemo() - Memoize Values

### Problem: Expensive Computation

```typescript
// DashboardPage.tsx
const DashboardPage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // ❌ Problem: This runs on every render!
  // If you have 1000 notes, filtering happens 1000 times
  const filteredNotes = searchNotes(notes, searchTerm);

  return (
    <>
      <SearchInput value={searchTerm} onChange={setSearchTerm} />
      <NotesList notes={filteredNotes} />
    </>
  );
};
```

**Issue:** `searchNotes()` is expensive with large datasets

### Solution: useMemo()

```typescript
import { useMemo } from 'react';

const DashboardPage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ Solution: Only recompute when notes or searchTerm change
  const filteredNotes = useMemo(() => {
    return searchNotes(notes, searchTerm);
  }, [notes, searchTerm]);  // Dependency array

  return (
    <>
      <SearchInput value={searchTerm} onChange={setSearchTerm} />
      <NotesList notes={filteredNotes} />
    </>
  );
};
```

**How it works:**
1. First render: Compute `searchNotes()`, cache result
2. User types in unrelated field: Cached result reused
3. User modifies search: Recompute with new dependencies
4. Dependencies change: Recalculate, update cache

### Performance Impact

```
Without useMemo:
- Search for "react" → Filter 1000 notes (5ms) ✓
- Toggle theme → Filter 1000 notes again (5ms) ❌ Wasted work
- Total: 10ms for what could be 5ms

With useMemo:
- Search for "react" → Filter 1000 notes (5ms)
- Toggle theme → Use cached result (0ms)
- Total: 5ms ✓
```

### useMemo with Filtering Example

```typescript
interface NotesContextType {
  notes: Note[];
  searchTerm: string;
  filteredNotes: Note[];  // Memoized
}

const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Memoize filtered and sorted notes
  const filteredNotes = useMemo(() => {
    let results = notes;

    // Filter by search term
    if (searchTerm) {
      results = results.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by date (newest first)
    return results.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [notes, searchTerm]);

  return (
    <NotesContext.Provider value={{ notes, searchTerm, filteredNotes }}>
      {children}
    </NotesContext.Provider>
  );
};
```

### When NOT to Use useMemo

```typescript
// ❌ Don't memoize simple operations
const doubled = useMemo(() => count * 2, [count]);

// ✅ Just compute it
const doubled = count * 2;

// ❌ Don't memoize primitive values
const userName = useMemo(() => user.name, [user]);

// ✅ Use as-is
const userName = user.name;
```

**Rule of Thumb:** Only memoize if the computation takes > 1ms

---

## 🎯 useCallback() - Memoize Functions

### Problem: Functions Recreated on Every Render

```typescript
// DashboardPage.tsx
const DashboardPage = () => {
  const { deleteNote } = useNotes();

  // ❌ Problem: New function created on every render
  // Child components see this as a different function
  const handleDelete = (noteId: string) => {
    deleteNote(noteId);
  };

  return (
    <NotesList notes={notes} onDelete={handleDelete} />
    // Even though logic is the same, function object is new!
  );
};
```

**Issue:** NoteCard's `useMemo` dependencies break if callback changes

### Solution: useCallback()

```typescript
import { useCallback } from 'react';

const DashboardPage = () => {
  const { deleteNote } = useNotes();

  // ✅ Solution: Function reference stays the same
  const handleDelete = useCallback((noteId: string) => {
    deleteNote(noteId);
  }, [deleteNote]);  // Only recreate if deleteNote changes

  return (
    <NotesList notes={notes} onDelete={handleDelete} />
  );
};
```

**How it works:**
1. First render: Create `handleDelete` function
2. State updates (unrelated): Reuse same `handleDelete` reference
3. `deleteNote` changes: Recreate `handleDelete`

### Real-World Example: Context Methods

```typescript
// NotesContext.tsx
const NotesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notesReducer, initialState);

  // Memoize context methods so components using them re-render less
  const createNote = useCallback(
    async (request: CreateNoteRequest) => {
      dispatch({ type: 'FETCH_START' });
      try {
        const note = await apiCreateNote(state.userId, request);
        dispatch({ type: 'ADD_NOTE', payload: note });
      } catch (error) {
        dispatch({ type: 'FETCH_ERROR', payload: error.message });
      }
    },
    [state.userId]
  );

  const deleteNote = useCallback(
    async (noteId: string) => {
      try {
        await apiDeleteNote(noteId, state.userId);
        dispatch({ type: 'DELETE_NOTE', payload: noteId });
      } catch (error) {
        dispatch({ type: 'FETCH_ERROR', payload: error.message });
      }
    },
    [state.userId]
  );

  const value = useMemo(() => ({
    notes: state.notes,
    createNote,
    deleteNote,
    // ... other methods
  }), [state.notes, createNote, deleteNote]);

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};
```

### useCallback in NoteCard

```typescript
interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
}

const NoteCard = memo(({ note, onDelete }: NoteCardProps) => {
  // Only re-render if note or onDelete reference changes
  const handleClick = useCallback(() => {
    onDelete(note.id);
  }, [note.id, onDelete]);

  return (
    <div className="note-card">
      <h3>{note.title}</h3>
      <p>{note.content}</p>
      <button onClick={handleClick}>Delete</button>
    </div>
  );
});
```

### Dependencies Matter!

```typescript
// ❌ Wrong: Dependencies are missing
const handleSearch = useCallback(() => {
  searchNotes(searchTerm);  // Uses stale searchTerm!
}, []);  // Empty dependency array

// ✅ Correct: Include all dependencies
const handleSearch = useCallback(() => {
  searchNotes(searchTerm);
}, [searchTerm]);  // searchTerm is a dependency

// ❌ Wrong: Unnecessary re-creation
const handleSearch = useCallback(() => {
  searchNotes(searchTerm);
}, [notes, user, theme, settings]);  // Too many dependencies!

// ✅ Correct: Only include what's needed
const handleSearch = useCallback(() => {
  searchNotes(searchTerm);
}, [searchTerm]);
```

---

## 🧩 React.memo() - Prevent Unnecessary Re-renders

### Without memo

```typescript
interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
}

export const NoteCard = ({ note, onDelete }: NoteCardProps) => {
  return (
    <div className="note-card">
      <h3>{note.title}</h3>
      <p>{note.content}</p>
      <button onClick={() => onDelete(note.id)}>Delete</button>
    </div>
  );
};

// Usage
const NotesList = ({ notes }: { notes: Note[] }) => {
  return (
    <div>
      {notes.map(note => (
        <NoteCard key={note.id} note={note} onDelete={deleteNote} />
        // Every time NotesList renders, ALL NoteCards re-render
      ))}
    </div>
  );
};
```

### With memo

```typescript
// Wrapped with memo
export const NoteCard = memo(({ note, onDelete }: NoteCardProps) => {
  return (
    <div className="note-card">
      <h3>{note.title}</h3>
      <p>{note.content}</p>
      <button onClick={() => onDelete(note.id)}>Delete</button>
    </div>
  );
});

// Only re-renders if note or onDelete reference changes
```

### When to Use memo

```typescript
// ✅ Good candidate for memo
// - Receives many props
// - Expensive to render (complex UI)
// - Parent re-renders frequently
const UserProfile = memo(({ user }: Props) => {
  // ... complex rendering
});

// ❌ Don't bother with memo
// - Simple component
// - Props always change
// - Parent rarely re-renders
const TextInput = ({ value, onChange }: Props) => (
  <input value={value} onChange={onChange} />
);
```

---

## 🚀 Code Splitting with React.lazy()

### Before: All code in one bundle

```typescript
// Single 500KB bundle
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NotePage from './pages/NotePage';
import ProfilePage from './pages/ProfilePage';
```

**Problem:** User must download all pages even if visiting only /login

### After: Split into chunks

```typescript
import { lazy, Suspense } from 'react';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const NotePage = lazy(() => import('./pages/NotePage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

export const App = () => (
  <Routes>
    <Route 
      path="/login" 
      element={
        <Suspense fallback={<LoadingSpinner />}>
          <LoginPage />
        </Suspense>
      }
    />
    <Route 
      path="/dashboard" 
      element={
        <Suspense fallback={<LoadingSpinner />}>
          <DashboardPage />
        </Suspense>
      }
    />
  </Routes>
);
```

**Benefits:**
- ✅ Initial bundle: 100KB (login page only)
- ✅ Dashboard: Loads only when accessed (200KB chunk)
- ✅ Faster initial page load

---

## 📦 Bundle Size Analysis

### Using create-react-app with source-map-explorer

```bash
# Install
npm install --save-dev source-map-explorer

# Analyze
npm run build
npx source-map-explorer 'build/static/js/*.js'
```

### Output Example

```
React              150KB  (30%)
React DOM          120KB  (24%)
React Router        45KB   (9%)
Context API         30KB   (6%)
Other dependencies  155KB  (31%)
```

### Optimization Strategies

1. **Remove unused packages**
   ```bash
   npm ls  # Find unused dependencies
   npm prune
   ```

2. **Use lighter alternatives**
   ```typescript
   // ❌ Moment.js is 65KB
   import moment from 'moment';

   // ✅ date-fns is 13KB (only import what you need)
   import { format } from 'date-fns';
   ```

3. **Lazy load heavy libraries**
   ```typescript
   const CodeEditor = lazy(() => import('monaco-editor'));
   ```

---

## 🐚 Performance Checklist

### Rendering Performance

- [ ] Identified slow components with React DevTools Profiler
- [ ] Used `useMemo()` for expensive calculations
- [ ] Used `useCallback()` for event handlers and context methods
- [ ] Used `React.memo()` for components that receive many props
- [ ] Avoided inline functions in render methods

### Bundle Size

- [ ] Analyzed bundle with source-map-explorer
- [ ] Removed unused dependencies
- [ ] Used `React.lazy()` for code splitting
- [ ] No duplicate dependencies

### Loading Performance

- [ ] Optimized images (compress, use appropriate formats)
- [ ] Configured mock API delays realistically
- [ ] Added loading states during fetches
- [ ] Implemented error handling for failed requests

---

## 📊 Performance Metrics

### Core Web Vitals

| Metric | Target | Measurement |
|--------|--------|-------------|
| **FCP** (First Contentful Paint) | < 1.8s | When first content appears |
| **LCP** (Largest Contentful Paint) | < 2.5s | When largest content appears |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Visual stability |

### Tools

1. **Lighthouse** - Chrome DevTools built-in
   - Press F12 → Lighthouse tab → Generate report

2. **WebPageTest** - https://webpagetest.org

3. **Chrome DevTools Audit** - F12 → Audit tab

---

## 🔗 Related Documentation

- [Custom Hooks](06-custom-hooks.md) - Reusable logic
- [State Management](04-state-management.md) - Context and useReducer
- [Best Practices](17-best-practices.md) - General optimization patterns

---

**Next**: Learn about [Error Handling](14-error-handling.md).
