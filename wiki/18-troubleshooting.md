# Troubleshooting Guide

Common issues, solutions, and debugging strategies for React applications.

## 🔴 Runtime Errors

### "Cannot read property X of undefined"

**Problem:** Accessing a property on something that doesn't exist

```typescript
// ❌ Causes error
const user = null;
console.log(user.name);  // TypeError!

// ✅ Solution 1: Optional chaining
console.log(user?.name);

// ✅ Solution 2: Check before accessing
if (user) {
  console.log(user.name);
}

// ✅ Solution 3: Provide default
const name = user?.name ?? 'Unknown';
```

**In Components:**

```typescript
// ❌ Bad: Crashes if notes is undefined
const NotesList = ({ notes }) => (
  <div>{notes.map(n => <div key={n.id}>{n.title}</div>)}</div>
);

// ✅ Good: Handle undefined
const NotesList = ({ notes = [] }) => (
  <div>
    {notes.length === 0 ? (
      <p>No notes</p>
    ) : (
      notes.map(n => <div key={n.id}>{n.title}</div>)
    )}
  </div>
);
```

---

### "Cannot update a component while rendering a different component"

**Problem:** Updating parent state from child during render

```typescript
// ❌ Bad: Calling setState during render
const Parent = () => {
  const [parentState, setParentState] = useState('');
  
  return (
    <Child onData={(data) => setParentState(data)} />
    // If Child calls this during render, error!
  );
};

// ✅ Good: Use callback or useEffect
const Child = ({ onData }) => {
  useEffect(() => {
    // Safe to update parent from effect
    onData('some data');
  }, [onData]);
  
  return <div>Child</div>;
};
```

---

### "Missing dependency warning"

**Problem:** useEffect/useMemo dependency array incomplete

```typescript
// ❌ Bad: searchTerm is used but not in dependencies
const SearchNotes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    console.log(searchTerm);  // Warning: missing dependency
  }, []);
};

// ✅ Good: Include all dependencies
const SearchNotes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    console.log(searchTerm);
  }, [searchTerm]);
};

// ✅ If many dependencies, move logic inside
const SearchNotes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const handleSearch = () => {
      console.log(searchTerm);
    };
    handleSearch();
  }, [searchTerm]);
};
```

---

## 🔄 Infinite Loops

### useEffect Running Forever

**Problem:** Effect has no dependencies or creates infinite loop

```typescript
// ❌ Bad: Effect runs every render, which updates state, which triggers effect
const BadComponent = () => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    setCount(count + 1);  // Updates state
    // Effect runs again because state changed
    // Creates infinite loop!
  });  // No dependency array!
};

// ✅ Good: Use dependency array
const GoodComponent = () => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setCount(c => c + 1), 1000);
    return () => clearTimeout(timer);
  }, []);  // Empty array = run once on mount
};
```

### Infinite API Calls

```typescript
// ❌ Bad: Fetches every render because missing dependencies
const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  
  useEffect(() => {
    apiFetchNotes().then(setNotes);
  });  // No dependencies = runs every render
};

// ✅ Good: Specify dependencies
const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const { user } = useAuth();
  
  useEffect(() => {
    apiFetchNotes(user.id).then(setNotes);
  }, [user.id]);  // Only fetch when userId changes
};
```

---

## 🔒 Stale Closures

**Problem:** Function uses old value from closure

```typescript
// ❌ Bad: handleDelete uses stale noteId
const NoteCard = ({ note, onDelete }) => {
  const handleDelete = () => {
    console.log(note.id);  // May be old value!
  };
  
  return (
    <button onClick={handleDelete}>Delete</button>
  );
};

// ✅ Good: Use effect to recreate function when dependencies change
const NoteCard = ({ note, onDelete }) => {
  const handleDelete = useCallback(() => {
    console.log(note.id);
  }, [note.id]);  // Updated when note.id changes
  
  return (
    <button onClick={handleDelete}>Delete</button>
  );
};
```

---

## 🔀 Race Conditions

**Problem:** Async operations complete out of order

```typescript
// ❌ Bad: Results show in wrong order
const SearchPage = () => {
  const [results, setResults] = useState([]);
  
  const handleSearch = async (query) => {
    const data1 = await search(query);
    setResults(data1);  // May overwrite newer results!
  };
  
  // User searches "a", then "ab"
  // Both fetch, but "a" results might arrive last
};

// ✅ Good: Cancel previous requests
const SearchPage = () => {
  const [results, setResults] = useState([]);
  const abortController = useRef(new AbortController());
  
  const handleSearch = async (query) => {
    // Cancel previous request
    abortController.current.abort();
    abortController.current = new AbortController();
    
    const data = await search(query, {
      signal: abortController.current.signal
    });
    setResults(data);  // Only latest request updates state
  };
};

// ✅ Simpler: Track latest query
const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    const searchAsync = async () => {
      const data = await search(query);
      // Only update if this is still the latest query
      setResults(data);
    };
    
    searchAsync();
  }, [query]);
};
```

---

## 💾 localStorage Issues

### Data Not Persisting

```typescript
// ❌ Bad: Not using useLocalStorage hook
const SettingsPage = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    // localStorage not updated!
  };
};

// ✅ Good: Use custom hook
const SettingsPage = () => {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);  // Automatically saves to localStorage
  };
};
```

### Cross-Tab Sync Not Working

```typescript
// ✅ Listen for storage events from other tabs
useEffect(() => {
  const handleStorageChange = (e) => {
    if (e.key === 'theme') {
      setTheme(e.newValue || 'light');
    }
  };
  
  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, []);
```

---

## 🎨 Styling Issues

### Styles Not Applying

```typescript
// ❌ Bad: CSS file not imported
// Component file
export const NoteCard = () => (
  <div className="note-card">Note</div>
);

// ❌ styles/NoteCard.css not imported in component

// ✅ Good: Import CSS in component
import '../styles/NoteCard.css';

export const NoteCard = () => (
  <div className="note-card">Note</div>
);
```

### CSS Specificity Issues

```css
/* ❌ Bad: Lower specificity loses */
.button {
  background: blue;
}

/* This wins because it's more specific */
div button {
  background: red;
}

/* ✅ Good: Use consistent specificity */
.button {
  background: blue;
}

.button--primary {
  background: green;
}
```

---

## 🔐 Authentication Issues

### Token Expired, User Still Logged In

**Problem:** Token expires but app doesn't refresh

```typescript
// ✅ Solution: Check token on mount
export const AuthProvider = ({ children }) => {
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const user = await apiValidateToken(token);
          if (user) {
            dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } });
          } else {
            // Token invalid, logout
            dispatch({ type: 'LOGOUT' });
          }
        } catch {
          dispatch({ type: 'LOGOUT' });
        }
      }
    };
    
    checkAuthStatus();
  }, []);
  
  return (
    <AuthContext.Provider value={state}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

## 📦 Build and Deploy Issues

### "Module not found" Error

```
Error: Cannot find module './components/NoteCard'
```

**Solutions:**
1. Check file exists and path is correct (case-sensitive on Linux!)
2. Check file extension (.tsx, .ts, .jsx, .js)
3. Check import statement spelling

```typescript
// ❌ Wrong path/name
import { NoteCard } from './components/notecard';  // 'notecard' != 'NoteCard'
import { NoteCard } from './components/NoteCard/';  // Directory, not file

// ✅ Correct
import { NoteCard } from './components/NoteCard';
import NoteCard from './components/NoteCard';  // Default export
```

---

### "Maximum call stack size exceeded"

**Problem:** Infinite recursion or circular dependency

```typescript
// ❌ Bad: Infinite recursion
const Component = () => {
  useEffect(() => {
    setData(Component);  // Renders again, creates new Component, etc.
  });
  
  return <div>{data}</div>;
};

// ✅ Solution: Add dependency array
const Component = () => {
  useEffect(() => {
    setData(Component);
  }, []);  // Only run once
  
  return <div>{data}</div>;
};
```

---

## 🧪 Testing Issues

### "act() warning" in Tests

```typescript
// ❌ Bad: Not wrapping state updates
test('should update state', () => {
  const { result } = renderHook(() => useState(0));
  result.current[1](1);  // Warning: not wrapped in act()
});

// ✅ Good: Wrap in act()
test('should update state', () => {
  const { result } = renderHook(() => useState(0));
  act(() => {
    result.current[1](1);
  });
});
```

---

## 🐛 Debugging Strategies

### React DevTools Profiler

1. Open DevTools → Components tab
2. Click component to see props/state
3. Switch to Profiler tab
4. Record user actions
5. See which components render and why

### Console Logging

```typescript
// Log on render
const MyComponent = () => {
  console.log('MyComponent rendered');  // Don't commit this!
  return <div>Hello</div>;
};

// Log with custom prefix
const logger = {
  debug: (msg, data) => console.debug(`[DEBUG] ${msg}`, data),
  error: (msg, err) => console.error(`[ERROR] ${msg}`, err),
};

logger.debug('Loading notes', { userId: '123' });
```

### Network Tab (DevTools)

1. Open DevTools → Network tab
2. Reload page
3. See all API calls
4. Click request to see headers, body, response
5. Check status codes (200 ok, 401 unauthorized, 500 error)

### React Query DevTools

```bash
npm install @tanstack/react-query-devtools
```

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export const App = () => (
  <>
    <BrowserRouter>{/* app */}</BrowserRouter>
    <ReactQueryDevtools initialIsOpen={false} />
  </>
);
```

---

## 📋 Debugging Checklist

- [ ] Check browser console for errors
- [ ] Use React DevTools to inspect props/state
- [ ] Use Network tab to see API calls
- [ ] Check localStorage for persisted data
- [ ] Look for missing dependency array warnings
- [ ] Test on a different browser
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Verify API endpoint URL
- [ ] Check token is being sent in headers
- [ ] Verify data structure matches TypeScript types

---

## 🔗 Additional Resources

- [Quick Start - Troubleshooting](01-quick-start.md#troubleshooting)
- [Error Handling](14-error-handling) - Error strategies
- [State Management](04-state-management) - State issues
- [FAQ](19-faq) - Common questions answered
- [Advanced FAQ](20-advanced-faq) - Advanced issues

---

**Complete!** You've covered all 18 documentation sections. For more detailed questions, check [FAQ](19-faq) and [Advanced FAQ](20-advanced-faq).
