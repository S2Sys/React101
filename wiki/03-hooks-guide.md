# React Hooks - Complete Guide

A comprehensive guide to understanding all React Hooks used in the application.

## 📚 Table of Contents

1. [What Are Hooks?](#what-are-hooks)
2. [useState Hook](#usestate)
3. [useEffect Hook](#useeffect)
4. [useContext Hook](#usecontext)
5. [useReducer Hook](#usereducer)
6. [useCallback Hook](#usecallback)
7. [useMemo Hook](#usememo)
8. [useRef Hook](#useref)
9. [useLayoutEffect Hook](#uselayouteffect)
10. [Custom Hooks](#custom-hooks)
11. [Hooks Rules](#hooks-rules)
12. [Comparison Chart](#comparison-chart)

## What Are Hooks?

Hooks are functions that "hook into" React features. They let you use state and other React features in functional components (no class components needed).

**Key Points:**
- Introduced in React 16.8
- Allow you to use state in functional components
- Let you extract component logic into reusable hooks
- Don't break any existing code
- 100% backwards compatible

## useState

### Basic Concept

`useState` lets you add state to functional components. It returns an array with two elements:
1. Current state value
2. Function to update that state

### Signature

```typescript
const [state, setState] = useState<T>(initialValue: T): [T, ](value: T) => void]
```

### Basic Example

```typescript
const [count, setCount] = useState(0);

// Later...
setCount(count + 1);  // Update state
```

### How It Works

```
Initial Render:
┌─────────────────┐
│ count = 0      │  ← useState(0) returns 0
└─────────────────┘

User Clicks Button:
┌─────────────────┐
│ count = 1      │  ← setCount(1) queues state update
└─────────────────┘
                    ↓
              React Re-renders
                    ↓
              Component Returns JSX with new state
                    ↓
              Browser Updates DOM
```

### Real Example from App

```typescript
// LoginPage.tsx
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

// When user types
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setEmail(e.target.value);  // Updates state
};

// When submitted
const handleSubmit = async () => {
  await login(email, password);
};
```

### Common Patterns

**Updating from previous state:**
```typescript
const [count, setCount] = useState(0);

// Bad: May miss updates
setCount(count + 1);

// Good: Uses function form
setCount(prevCount => prevCount + 1);
```

**Complex state object:**
```typescript
const [form, setForm] = useState({
  email: '',
  password: '',
  remember: false
});

// Update one field
setForm(prev => ({
  ...prev,
  email: newEmail
}));
```

### File References
- See `src/pages/LoginPage.tsx` - Using useState for form inputs
- See `src/hooks/useForm.ts` - useState in custom hook

---

## useEffect

### Basic Concept

`useEffect` lets you perform side effects in functional components. Side effects include:
- Data fetching
- Setting up subscriptions
- Manually changing the DOM
- Running timers/intervals

### Signature

```typescript
useEffect(
  () => {
    // Effect code
    return () => {
      // Cleanup code (optional)
    };
  },
  [dependencies]  // Optional dependency array
);
```

### Dependency Array Behavior

```typescript
// No dependency array: Runs after EVERY render
useEffect(() => {
  console.log('Runs every render');
});

// Empty array: Runs ONCE after initial render (mount)
useEffect(() => {
  console.log('Runs once on mount');
}, []);

// With dependencies: Runs when dependencies change
useEffect(() => {
  console.log('Runs when count changes');
}, [count]);
```

### Effect Lifecycle

```
Initial Render
    ↓
useEffect runs (with empty dependency array)
    ↓
Component renders to DOM
    ↓
User interacts...
    ↓
State updates
    ↓
Component re-renders
    ↓
useEffect runs again if dependency changed
    ↓
Component unmounts
    ↓
Cleanup function runs (if exists)
```

### Cleanup Function

```typescript
useEffect(() => {
  // Setup
  const timer = setInterval(() => {
    console.log('Running');
  }, 1000);

  // Cleanup (called when component unmounts or dependencies change)
  return () => {
    clearInterval(timer);
  };
}, []);

// ✓ Prevents memory leaks
// ✓ Clears old subscriptions
// ✓ Removes event listeners
```

### Real Examples from App

**Restore Auth on Mount:**
```typescript
// src/context/AuthContext.tsx
useEffect(() => {
  const restoreAuth = async () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // User was logged in, restore session
    }
  };
  restoreAuth();
}, []);  // Runs once on component mount
```

**Fetch Data When Dependency Changes:**
```typescript
// src/hooks/useFetch.ts
useEffect(() => {
  const fetchData = async () => {
    const result = await fetchFn();
    setData(result);
  };
  fetchData();
}, [fetchFn]);  // Re-fetch when fetchFn changes
```

**Debounced Search:**
```typescript
// src/pages/DashboardPage.tsx
useEffect(() => {
  const timer = setTimeout(() => {
    setSearchTerm(debouncedSearchTerm);
  }, 300);

  return () => clearTimeout(timer);  // Cleanup
}, [debouncedSearchTerm]);
```

### File References
- See `src/context/AuthContext.tsx` - useEffect for initialization
- See `src/hooks/useFetch.ts` - useEffect for data fetching
- See `src/context/NotesContext.tsx` - useEffect for initial fetch

---

## useContext

### Basic Concept

`useContext` lets you subscribe to context without nesting. It provides a way to pass data through the component tree without passing props at every level.

### Signature

```typescript
const value = useContext(MyContext);
```

### How It Works

```
┌─────────────────────────┐
│    Context Provider     │
│  (Creates the context)  │
└──────────┬──────────────┘
           │ Wraps components
           ↓
┌──────────────────────┐
│   Child Component    │
│  (Uses useContext)   │
└──────────────────────┘
           ↓
    Gets the context value
```

### Basic Example

```typescript
// Create context
const ThemeContext = React.createContext('light');

// Provider component
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Header />
      <Content />
    </ThemeContext.Provider>
  );
}

// Consumer component
function Header() {
  const theme = useContext(ThemeContext);  // Gets 'dark'
  return <header className={theme}>...</header>;
}
```

### Real Example from App

**Using Auth Context:**
```typescript
// src/hooks/useAuth.ts
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// In any component:
const MyComponent = () => {
  const { user, isAuthenticated, logout } = useAuth();
  // Now has access to auth state!
};
```

**Using Notes Context:**
```typescript
// src/pages/DashboardPage.tsx
const DashboardPage = () => {
  const { notes, createNote, deleteNote } = useNotes();
  // Uses NotesContext through custom hook
};
```

### Context Hierarchy in App

```
App
├── AuthProvider (provides user, token, login, logout, etc)
│   └── NotesProvider (depends on auth to get user ID)
│       ├── Navbar (uses useAuth)
│       ├── DashboardPage (uses useNotes)
│       └── NotePage (uses useAuth + useNotes)
```

### File References
- See `src/context/AuthContext.tsx` - Creating context
- See `src/context/NotesContext.tsx` - Using context
- See `src/hooks/useAuth.ts` - Wrapping context in custom hook

---

## useReducer

### Basic Concept

`useReducer` is an alternative to `useState` for managing complex state. It's useful when:
- State logic has multiple sub-values
- Next state depends on previous state
- State gets complex

### Signature

```typescript
const [state, dispatch] = useReducer(
  (state, action) => newState,
  initialState
);
```

### How It Works

```
┌──────────────────┐
│  Initial State   │
└────────┬─────────┘
         │
         ↓
    Component Renders
         │
    User Interacts
         │
         ↓
  dispatch(action)
         │
         ↓
   Reducer Function
   (receives state + action)
         │
         ↓
   Returns new state
         │
         ↓
   Component Re-renders
```

### Example: Auth Reducer

```typescript
// Reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    
    case 'AUTH_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    
    case 'LOGOUT':
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    
    default:
      return state;
  }
};

// Using the reducer
const [state, dispatch] = useReducer(authReducer, initialAuthState);

// Dispatching actions
dispatch({ type: 'AUTH_START' });
dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } });
dispatch({ type: 'AUTH_ERROR', payload: 'Invalid credentials' });
dispatch({ type: 'LOGOUT' });
```

### Action Types Pattern

```typescript
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };
```

### Real Example from App

**Notes Reducer:**
```typescript
// src/context/NotesContext.tsx
const notesReducer = (state: NotesState, action: NotesAction): NotesState => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true };
    
    case 'FETCH_SUCCESS':
      return { ...state, notes: action.payload, isLoading: false };
    
    case 'ADD_NOTE':
      return { ...state, notes: [action.payload, ...state.notes] };
    
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map(n =>
          n.id === action.payload.id ? action.payload : n
        ),
      };
    
    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter(n => n.id !== action.payload),
      };
    
    default:
      return state;
  }
};
```

### When to Use useReducer vs useState

| Scenario | useState | useReducer |
|----------|----------|-----------|
| Single value | ✅ | ❌ |
| Multiple related values | ❌ | ✅ |
| Complex state logic | ❌ | ✅ |
| Previous state needed | ⚠️ | ✅ |
| Multiple dispatch locations | ❌ | ✅ |

### File References
- See `src/context/AuthContext.tsx` - useReducer for auth
- See `src/context/NotesContext.tsx` - useReducer for notes

---

## useCallback

### Basic Concept

`useCallback` returns a memoized callback function. It's useful for optimizing performance when passing callbacks to optimized child components.

### Signature

```typescript
const memoizedCallback = useCallback(
  () => {
    // Function code
  },
  [dependencies]
);
```

### Why It Matters

```typescript
// Without useCallback - new function created every render
const MyComponent = () => {
  const handleClick = () => {
    console.log('Clicked');
  };
  
  return <Button onClick={handleClick} />;  // Different function each time!
};

// With useCallback - same function unless dependencies change
const MyComponent = () => {
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []);  // Same function reference
  
  return <Button onClick={handleClick} />;  // Same function!
};
```

### Real Examples from App

**Form Handler:**
```typescript
// src/hooks/useForm.ts
const handleChange = useCallback(
  (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  },
  []  // No dependencies needed
);
```

**API Handler:**
```typescript
// src/context/NotesContext.tsx
const createNote = useCallback(
  async (request: CreateNoteRequest): Promise<Note> => {
    if (!user) throw new Error('Not authenticated');
    const newNote = await apiCreateNote(user.id, request);
    dispatch({ type: 'ADD_NOTE', payload: newNote });
    return newNote;
  },
  [user]  // Re-create if user changes
);
```

### Performance Impact

```
Without useCallback:
Every render → New function → Child re-renders → Slow

With useCallback:
Same dependencies → Same function → Child doesn't re-render → Fast
```

### File References
- See `src/hooks/useForm.ts` - useCallback for event handlers
- See `src/hooks/useFetch.ts` - useCallback for refetch function
- See `src/context/NotesContext.tsx` - useCallback for CRUD operations

---

## useMemo

### Basic Concept

`useMemo` returns a memoized value. It's useful for expensive computations that shouldn't run every render.

### Signature

```typescript
const memoizedValue = useMemo(
  () => {
    // Expensive computation
    return result;
  },
  [dependencies]
);
```

### Example: Expensive Computation

```typescript
// Without useMemo - runs every render (slow!)
const expensiveArray = array.filter(item => item.value > 100);

// With useMemo - only runs when dependencies change
const expensiveArray = useMemo(
  () => array.filter(item => item.value > 100),
  [array]
);
```

### Real Example from App

**Filtered Notes:**
```typescript
// src/context/NotesContext.tsx
const filteredNotes = useMemo(() => {
  if (!state.searchTerm) return state.notes;
  
  // This is expensive: searches all notes
  return searchNotes(state.notes, state.searchTerm);
}, [state.notes, state.searchTerm]);
```

This prevents:
- Searching through all notes every render
- Unnecessary array operations
- Slow performance with many notes

### When to Use useMemo

```typescript
// DON'T use useMemo for simple operations
const doubled = useMemo(() => count * 2, [count]);  // ❌ Overkill

// DO use useMemo for expensive operations
const filtered = useMemo(
  () => largeArray.filter(item => item.matches(criteria)),
  [largeArray, criteria]
);  // ✅ Worth it
```

### File References
- See `src/context/NotesContext.tsx` - useMemo for filtered notes

---

## useRef

### Basic Concept

`useRef` returns a mutable object that persists for the lifetime of the component. Refs don't cause re-renders when updated.

### Signature

```typescript
const ref = useRef<T>(initialValue);
```

### Key Differences from useState

| Feature | useState | useRef |
|---------|----------|--------|
| Causes re-render | ✅ | ❌ |
| Mutable | ❌ | ✅ |
| Persists | ✅ | ✅ |
| Use case | UI state | Store values, DOM access |

### Example: Storing Timeout ID

```typescript
const TimeoutComponent = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    timeoutRef.current = setTimeout(() => {
      console.log('Timer done');
    }, 1000);
  };

  const cancelTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  return (
    <>
      <button onClick={startTimer}>Start</button>
      <button onClick={cancelTimer}>Cancel</button>
    </>
  );
};
```

### Example: Debounce Implementation

```typescript
// src/hooks/useDebounce.ts
const useDebounceFn = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedFn = useCallback(
    (...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  return debouncedFn as T;
};
```

### Common Uses

1. **Storing timer/interval IDs** - To clear them later
2. **Accessing DOM directly** - Getting input value, focusing element
3. **Keeping track of previous value** - Comparing old vs new
4. **Storing mutable values** - That shouldn't trigger re-renders

### File References
- See `src/hooks/useDebounce.ts` - useRef for timer management
- See `src/hooks/useLocalStorage.ts` - useRef for mutable values

---

## useLayoutEffect

### Basic Concept

`useLayoutEffect` is similar to `useEffect`, but it fires synchronously after DOM mutations, before the browser has a chance to paint.

### When to Use

```
useEffect → Recommended for most cases (runs after paint)
useLayoutEffect → Use only if you need to manipulate DOM before paint
```

### Signature

```typescript
useLayoutEffect(() => {
  // DOM measurements or manipulations
  const width = element.offsetWidth;
}, []);
```

### Real-World Example

```typescript
const useWindowSize = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();  // Set initial size before paint

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
};
```

### File References
- Mentioned in `src/hooks/` documentation
- Generally not used in this app (useEffect is sufficient)

---

## Custom Hooks

### Creating Custom Hooks

A custom hook is a JavaScript function whose name starts with "use" and may call other hooks.

### Pattern

```typescript
// Custom hook
const useMyHook = (param: string) => {
  const [state, setState] = useState('');

  useEffect(() => {
    // Setup side effects
  }, [param]);

  const someMethod = useCallback(() => {
    // Do something
  }, [state]);

  return { state, someMethod };
};

// Using it
const MyComponent = () => {
  const { state, someMethod } = useMyHook('param');
  // Use the hook's returned values
};
```

### Hooks in This App

**useAuth:**
```typescript
export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};
```

**useFetch:**
```typescript
export const useFetch = <T,>(
  fetchFn: () => Promise<T>,
  immediate: boolean = true
): UseFetchState<T> => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(immediate);
  const [error, setError] = useState<string | null>(null);

  // ... implementation
  return { data, isLoading, error, refetch };
};
```

**useForm:**
```typescript
export const useForm = <T extends Record<string, any>>(
  initialValues: T,
  onSubmit: (values: T) => Promise<void>,
  validate?: (values: T) => FormErrors
): FormHandlers<T> => {
  // ... form state management
  return {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    // ...
  };
};
```

### File References
- See `src/hooks/useAuth.ts` - Authentication hooks
- See `src/hooks/useFetch.ts` - Data fetching hooks
- See `src/hooks/useForm.ts` - Form management hooks
- See `src/hooks/useLocalStorage.ts` - Storage hooks
- See `src/hooks/useDebounce.ts` - Debounce/throttle hooks

---

## Hooks Rules

### The Two Rules of Hooks

**Rule 1: Only Call Hooks at Top Level**
```typescript
// ✅ Good
const MyComponent = () => {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
};

// ❌ Bad - Hook inside condition
const MyComponent = () => {
  if (someCondition) {
    const [count, setCount] = useState(0);  // WRONG!
  }
};

// ❌ Bad - Hook inside loop
const MyComponent = () => {
  items.forEach(item => {
    const [value, setValue] = useState('');  // WRONG!
  });
};
```

**Rule 2: Only Call Hooks from React Functions**
```typescript
// ✅ Good - Inside functional component
const MyComponent = () => {
  const [count, setCount] = useState(0);
};

// ✅ Good - Inside custom hook
const useMyHook = () => {
  const [count, setCount] = useState(0);
};

// ❌ Bad - Regular JavaScript function
function regularFunction() {
  const [count, setCount] = useState(0);  // WRONG!
}
```

---

## Comparison Chart

### Quick Reference

| Hook | Purpose | Returns | Use When |
|------|---------|---------|----------|
| useState | Manage state | [value, setter] | Single value changes |
| useEffect | Side effects | void | Setup, cleanup, subscriptions |
| useContext | Access context | Context value | Need global state |
| useReducer | Complex state | [state, dispatch] | Multiple state values/complex logic |
| useCallback | Memoize callback | Function | Passing callbacks to optimized children |
| useMemo | Memoize value | Computed value | Expensive computations |
| useRef | Mutable value | Ref object | Store values, DOM access |
| useLayoutEffect | Layout effects | void | DOM measurements before paint |

### Hooks Usage Frequency in App

1. **useState** - Used everywhere
2. **useEffect** - Used in contexts, hooks, pages
3. **useContext** - Used in pages, components
4. **useReducer** - Used in contexts (2 places)
5. **useCallback** - Used in hooks and contexts
6. **useMemo** - Used in NotesContext
7. **useRef** - Used in custom hooks
8. **useLayoutEffect** - Mentioned but not actively used

---

## Practice Exercises

### Exercise 1: Create useCounter Hook

```typescript
// Create a custom hook that:
// - Starts at 0
// - Has increment, decrement, reset methods
// - Returns { count, increment, decrement, reset }
const useCounter = () => {
  // Your implementation
};
```

### Exercise 2: Create useLocalStorage Hook

```typescript
// Create a hook that:
// - Reads from localStorage on mount
// - Updates localStorage when value changes
// - Returns [value, setValue, removeValue]
const useLocalStorage = <T,>(key: string, initialValue: T) => {
  // Your implementation
};
```

### Exercise 3: Create usePreviousValue Hook

```typescript
// Create a hook that returns the previous value
// Useful for comparing old vs new values
const usePreviousValue = <T,>(value: T): T | undefined => {
  // Your implementation
};
```

---

**Next**: Learn about [State Management](04-state-management) patterns used in the app.
