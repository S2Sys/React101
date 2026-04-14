# Advanced & Tricky Questions FAQ

Expert-level questions and gotchas that advanced developers encounter.

## 🎯 Advanced Concepts

### Q: Why do I get "exhaustive-deps" ESLint warning?

**A:** Missing dependency in useEffect:
```typescript
// ❌ Warning - count is used but not in dependencies
useEffect(() => {
  setInterval(() => {
    console.log(count);  // Uses count!
  }, 1000);
}, []);  // count missing!

// ✅ Correct
useEffect(() => {
  const timer = setInterval(() => {
    console.log(count);
  }, 1000);
  return () => clearInterval(timer);
}, [count]);  // count included
```

**But this causes infinite loops!** Solution:
```typescript
// Use functional state update
useEffect(() => {
  const timer = setInterval(() => {
    setCount(prev => prev + 1);  // Don't need count dependency!
  }, 1000);
  return () => clearInterval(timer);
}, []);  // Empty array - no infinite loop!
```

### Q: How do I avoid infinite loops in useEffect?

**A:** Three strategies:

**1. Use functional updates (don't depend on state):**
```typescript
useEffect(() => {
  setCount(prev => prev + 1);  // Reference-free
}, []);  // No infinite loop
```

**2. Use useCallback to stabilize function dependency:**
```typescript
const handleFetch = useCallback(() => {
  fetchData();
}, []);  // Stable function

useEffect(() => {
  handleFetch();
}, [handleFetch]);  // Won't change, no loop
```

**3. Extract out of effect (if not needed in effect):**
```typescript
// Define outside effect
const config = { timeout: 5000 };

useEffect(() => {
  // Use config
}, []);  // config doesn't change
```

### Q: What's the "stale closure" problem?

**A:** Inner function captures old variable values:
```typescript
// ❌ Problem - closure captures old count
const [count, setCount] = useState(0);

const handleClick = () => {
  setTimeout(() => {
    console.log(count);  // Always logs old value!
  }, 1000);
};

// Click button, count goes to 5, wait 1 second
// Logs "0" instead of "5"!

// ✅ Solution 1 - useRef
const countRef = useRef(count);
useEffect(() => {
  countRef.current = count;
}, [count]);

const handleClick = () => {
  setTimeout(() => {
    console.log(countRef.current);  // Gets current value
  }, 1000);
};

// ✅ Solution 2 - useCallback with dependency
const handleClick = useCallback(() => {
  setTimeout(() => {
    console.log(count);
  }, 1000);
}, [count]);  // Re-create function when count changes
```

### Q: Should I use keys as array index?

**A:** **No!** This breaks reconciliation:
```typescript
// ❌ Bad - key is array index
{items.map((item, index) => (
  <div key={index}>{item.name}</div>
))}

// If you delete first item, all keys change!
// React thinks items changed instead of deleted

// ✅ Good - key is unique ID
{items.map((item) => (
  <div key={item.id}>{item.name}</div>
))}
```

### Q: What happens with mutating state?

**A:** React doesn't detect mutations:
```typescript
// ❌ Wrong - React doesn't see the change
const handleAddNote = () => {
  notes.push(newNote);  // Mutates!
  setNotes(notes);      // Same reference, no re-render
};

// ✅ Correct - creates new array
const handleAddNote = () => {
  setNotes([...notes, newNote]);  // New array, React sees change
};

// ✅ Also works
const handleAddNote = () => {
  setNotes(prev => [...prev, newNote]);  // Create new array
};
```

### Q: Why does my component render twice in development?

**A:** React 18's Strict Mode intentionally double-renders in development to detect bugs:
```typescript
// Development: renders twice
// Production: renders once

// This is GOOD - it catches hidden bugs!

// Make sure your effects handle being called twice:
useEffect(() => {
  const timer = setInterval(() => {
    console.log('tick');
  }, 1000);

  // MUST return cleanup!
  return () => clearInterval(timer);  // Remove first timer
}, []);
```

### Q: What's the "race condition" in async effects?

**A:** When multiple async operations compete:
```typescript
// ❌ Race condition - multiple requests
const [userId, setUserId] = useState(1);
const [user, setUser] = useState(null);

useEffect(() => {
  // Request for userId=1
  fetchUser(userId).then(setUser);
  // Change userId to 2 while request pending
  // Request for userId=2 starts
  // Request 2 finishes first, sets user
  // Request 1 finishes, overwrites with old user!
}, [userId]);

// ✅ Solution 1 - Check if still relevant
useEffect(() => {
  let isMounted = true;

  fetchUser(userId).then(data => {
    if (isMounted) {
      setUser(data);  // Only set if still mounted
    }
  });

  return () => {
    isMounted = false;  // Cleanup
  };
}, [userId]);

// ✅ Solution 2 - Use AbortController
useEffect(() => {
  const controller = new AbortController();

  fetchUser(userId, { signal: controller.signal })
    .then(setUser)
    .catch(err => {
      if (err.name !== 'AbortError') {
        console.error(err);
      }
    });

  return () => {
    controller.abort();  // Cancel request
  };
}, [userId]);

// ✅ Solution 3 - Use library (React Query)
const { data: user } = useQuery(['user', userId], () => fetchUser(userId));
```

### Q: How do I properly debounce search?

**A:**
```typescript
// Using custom hook
const [searchInput, setSearchInput] = useState('');
const debouncedTerm = useDebounce(searchInput, 300);

useEffect(() => {
  // Only fires 300ms after user stops typing
  searchNotes(debouncedTerm);
}, [debouncedTerm]);

// OR using useCallback + ref
const [searchInput, setSearchInput] = useState('');
const timeoutRef = useRef(null);

const handleSearch = useCallback((value) => {
  setSearchInput(value);

  // Clear previous timeout
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
  }

  // Set new timeout
  timeoutRef.current = setTimeout(() => {
    searchNotes(value);
  }, 300);
}, []);
```

### Q: What's the difference between controlled and uncontrolled components?

**A:**
```typescript
// ❌ Uncontrolled - value lives in DOM
const Component = () => {
  return <input defaultValue="initial" />;
};

// ✅ Controlled - value in React state
const Component = () => {
  const [value, setValue] = useState('initial');
  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};
```

**Use controlled for:**
- ✅ Validation
- ✅ Conditional enabling/disabling
- ✅ Clearing on submit
- ✅ Dynamic placeholder

---

## 🔄 Tricky State Patterns

### Q: How do I update nested state?

**A:** Use spread operator:
```typescript
// Nested state
const [user, setUser] = useState({
  name: 'John',
  address: {
    city: 'NYC',
    zip: '10001'
  }
});

// ❌ Wrong - loses structure
user.address.city = 'LA';
setUser(user);

// ✅ Correct - shallow copy all levels
setUser({
  ...user,
  address: {
    ...user.address,
    city: 'LA'
  }
});

// ✅ Or use Immer library for easier nested updates
import { useImmer } from 'use-immer';

const [user, setUser] = useImmer({
  name: 'John',
  address: { city: 'NYC' }
});

setUser(draft => {
  draft.address.city = 'LA';  // Looks like mutation!
});
```

### Q: How do I handle an array of objects in state?

**A:**
```typescript
const [notes, setNotes] = useState([
  { id: 1, title: 'Note 1' },
  { id: 2, title: 'Note 2' }
]);

// Add
setNotes([...notes, { id: 3, title: 'Note 3' }]);

// Update
setNotes(notes.map(n =>
  n.id === 2 ? { ...n, title: 'Updated' } : n
));

// Delete
setNotes(notes.filter(n => n.id !== 1));

// Or use useReducer for complex operations
const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      return [...state, action.payload];
    case 'UPDATE':
      return state.map(n =>
        n.id === action.id ? { ...n, ...action.updates } : n
      );
    case 'DELETE':
      return state.filter(n => n.id !== action.id);
    default:
      return state;
  }
};

const [notes, dispatch] = useReducer(reducer, []);

dispatch({ type: 'ADD', payload: newNote });
dispatch({ type: 'UPDATE', id: 1, updates: { title: 'New' } });
dispatch({ type: 'DELETE', id: 1 });
```

### Q: How do I sync multiple pieces of state?

**A:** Use a single state object or context:
```typescript
// ❌ Bad - multiple states out of sync
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [name, setName] = useState('');

// ✅ Good - single object
const [formData, setFormData] = useState({
  email: '',
  password: '',
  name: ''
});

// ✅ Good - use useReducer
const [form, dispatch] = useReducer(reducer, initialState);
dispatch({ type: 'SET_EMAIL', payload: email });
```

### Q: How do I maintain order in async state updates?

**A:** Use a version counter:
```typescript
const [version, setVersion] = useState(0);
const [data, setData] = useState(null);

const fetchData = async (id) => {
  const currentVersion = version + 1;
  setVersion(currentVersion);

  const result = await fetch(`/api/data/${id}`);
  const json = await result.json();

  // Only update if this is still the latest version
  if (currentVersion === version + 1) {
    setData(json);
  }
};
```

---

## 🎣 Context & Hook Tricks

### Q: How do I create a custom hook that combines multiple hooks?

**A:**
```typescript
// Custom hook combining multiple hooks
const useFormWithValidation = (initialValues, onSubmit, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    // Validate
    if (validate) {
      const fieldErrors = validate(values);
      if (fieldErrors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: fieldErrors[name]
        }));
      }
    }
  }, [validate, values]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const allErrors = validate ? validate(values) : {};
    
    if (Object.keys(allErrors).length === 0) {
      onSubmit(values);
    } else {
      setErrors(allErrors);
    }
  }, [validate, values, onSubmit]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit
  };
};
```

### Q: How do I avoid context re-rendering everything?

**A:** Split context by concerns:
```typescript
// ❌ Bad - single context with everything
const AppContext = createContext({
  user: null,
  setUser: () => {},
  theme: 'light',
  setTheme: () => {},
  notifications: [],
  setNotifications: () => {}
});

// Every update to any value re-renders all subscribers!

// ✅ Good - split into separate contexts
const AuthContext = createContext();
const ThemeContext = createContext();
const NotificationsContext = createContext();

// Now each context only re-renders its subscribers
```

### Q: How do I update context from a child component?

**A:**
```typescript
// Create context with updater function
const AuthContext = createContext({
  user: null,
  setUser: (user) => {}
});

// Provider
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Child component
const UserProfile = () => {
  const { user, setUser } = useContext(AuthContext);

  return (
    <button onClick={() => setUser({ name: 'John' })}>
      Update User
    </button>
  );
};
```

### Q: How do I use context with useReducer for complex state?

**A:**
```typescript
const StateContext = createContext();
const DispatchContext = createContext();

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

// Separate contexts prevent unnecessary re-renders
// Components that only need dispatch don't re-render when state changes
```

---

## ⚡ Performance Gotchas

### Q: When does useCallback actually help?

**A:** Only when the function is memoized child's dependency:
```typescript
// ❌ Uselessly memoizing
const Parent = () => {
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);

  return <div onClick={handleClick}>Click</div>;  // Not memoized child
};

// ✅ Actually helps
const Parent = () => {
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);

  return <MemoizedChild onClick={handleClick} />;  // Memoized child
};

const MemoizedChild = React.memo(({ onClick }) => (
  <button onClick={onClick}>Click</button>
));
```

### Q: How do I find performance bottlenecks?

**A:** Use React DevTools Profiler:
```typescript
// 1. Open React DevTools
// 2. Go to Profiler tab
// 3. Click record button
// 4. Interact with app
// 5. See which components re-render
// 6. See render duration
// 7. Optimize slow ones

// Or use performance API
useEffect(() => {
  const startTime = performance.now();

  return () => {
    const endTime = performance.now();
    console.log(`Render took ${endTime - startTime}ms`);
  };
}, []);
```

### Q: How do I memoize computed values?

**A:**
```typescript
// ❌ Recomputes every render
const Component = ({ items }) => {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  return <div>{total}</div>;
};

// ✅ Memoized
const Component = ({ items }) => {
  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price, 0),
    [items]
  );
  return <div>{total}</div>;
};
```

---

## 🔐 Async & Side Effect Patterns

### Q: How do I handle errors in async operations?

**A:**
```typescript
useEffect(() => {
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/data');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, []);
```

### Q: How do I retry failed requests?

**A:**
```typescript
const [retryCount, setRetryCount] = useState(0);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      setData(data);
    } catch (err) {
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(retryCount + 1);
        }, 1000 * Math.pow(2, retryCount));  // Exponential backoff
      } else {
        setError(err.message);
      }
    }
  };

  fetchData();
}, [retryCount]);
```

### Q: How do I handle timeouts?

**A:**
```typescript
const fetchDataWithTimeout = (url, timeout = 5000) => {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error]('Timeout')), timeout)
    )
  ]);
};

useEffect(() => {
  fetchDataWithTimeout('/api/data', 5000)
    .then(r => r.json())
    .then(setData)
    .catch(err => {
      if (err.message === 'Timeout') {
        setError('Request took too long');
      } else {
        setError(err.message);
      }
    });
}, []);
```

---

## 🧠 Memory & Cleanup

### Q: How do I prevent memory leaks?

**A:** Always clean up in useEffect:
```typescript
// ❌ Memory leak - listener never removed
useEffect(() => {
  window.addEventListener('resize', handleResize);
}, []);

// ✅ Correct - listener removed on unmount
useEffect(() => {
  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);  // Cleanup!
  };
}, []);
```

**Common cleanup scenarios:**
```typescript
// Timers
useEffect(() => {
  const timer = setTimeout(() => {}, 1000);
  return () => clearTimeout(timer);
}, []);

// Intervals
useEffect(() => {
  const interval = setInterval(() => {}, 1000);
  return () => clearInterval(interval);
}, []);

// Subscriptions
useEffect(() => {
  const unsubscribe = subscribe(handleChange);
  return () => unsubscribe();
}, []);

// Event listeners
useEffect(() => {
  element.addEventListener('click', handler);
  return () => element.removeEventListener('click', handler);
}, []);

// Mounted flag
useEffect(() => {
  let isMounted = true;

  fetchData().then(data => {
    if (isMounted) setData(data);
  });

  return () => {
    isMounted = false;
  };
}, []);
```

---

## 🎯 Edge Cases

### Q: What happens if I dispatch inside render?

**A:** **Don't do this!** It causes infinite loops:
```typescript
// ❌ WRONG - render causes dispatch causes re-render
const Component = () => {
  const [count, setCount] = useState(0);

  setCount(count + 1);  // Called during render!

  return <div>{count}</div>;  // Infinite loop!
};

// ✅ Correct - dispatch only in event/effect
const Component = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);  // In event handler
  };

  useEffect(() => {
    setCount(count + 1);  // In effect with proper dependencies
  }, []);

  return <div onClick={handleClick}>{count}</div>;
};
```

### Q: What if component unmounts while async operation pending?

**A:** Use cleanup function:
```typescript
useEffect(() => {
  let isMounted = true;

  setTimeout(() => {
    if (isMounted) {  // Only update if still mounted!
      setData(newData);
    }
  }, 1000);

  return () => {
    isMounted = false;  // Cleanup: mark as unmounted
  };
}, []);
```

### Q: How do I handle conditional rendering of hooks?

**A:** You can't - hooks must always run:
```typescript
// ❌ WRONG - hooks called conditionally
const Component = ({ shouldFetch }) => {
  if (shouldFetch) {
    useEffect(() => {  // This breaks rules of hooks!
      fetchData();
    }, []);
  }
};

// ✅ Correct - hook always runs, logic inside
const Component = ({ shouldFetch }) => {
  useEffect(() => {
    if (shouldFetch) {
      fetchData();
    }
  }, [shouldFetch]);
};
```

---

## 📚 Real-World Patterns

### Q: How do I implement infinite scroll?

**A:**
```typescript
const [items, setItems] = useState([]);
const [page, setPage] = useState(1);
const observerTarget = useRef(null);

useEffect(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      setPage(p => p + 1);  // Load more
    }
  });

  if (observerTarget.current) {
    observer.observe(observerTarget.current);
  }

  return () => observer.disconnect();
}, []);

useEffect(() => {
  fetchItems(page).then(newItems => {
    setItems(prev => [...prev, ...newItems]);
  });
}, [page]);

return (
  <>
    {items.map(item => <Item key={item.id} item={item} />)}
    <div ref={observerTarget} />
  </>
);
```

### Q: How do I implement optimistic updates?

**A:**
```typescript
const handleDelete = async (id) => {
  // Update UI immediately
  setNotes(prev => prev.filter(n => n.id !== id));

  try {
    // Try to delete on server
    await apiDeleteNote(id);
  } catch (err) {
    // Revert if fails
    setNotes(prev => [...prev, ...deletedNote]);
    setError('Failed to delete');
  }
};
```

### Q: How do I implement undo/redo?

**A:**
```typescript
const [history, setHistory] = useState([initialState]);
const [currentIndex, setCurrentIndex] = useState(0);

const state = history[currentIndex];

const setState = (newState) => {
  // Add new state to history
  const newHistory = history.slice(0, currentIndex + 1);
  newHistory.push(newState);
  setHistory(newHistory);
  setCurrentIndex(newHistory.length - 1);
};

const undo = () => {
  if (currentIndex > 0) {
    setCurrentIndex(currentIndex - 1);
  }
};

const redo = () => {
  if (currentIndex < history.length - 1) {
    setCurrentIndex(currentIndex + 1);
  }
};
```

---

## 🔥 Performance Benchmarks

### Q: When should I use memo?

**A:** Only if measurable improvement:
```typescript
// Use Profiler to measure
import { Profiler } from 'react';

<Profiler id="MyComponent" onRender={console.log}>
  <MyComponent />
</Profiler>

// If re-renders are frequent and slow, consider:
const MemoizedComponent = React.memo(MyComponent);
```

### Q: What's the cost of using hooks?

**A:** Minimal! Hooks are:
- ✅ Fast (O(n) where n = number of hooks)
- ✅ Optimized by React team
- ✅ Better than class components in most cases

Don't worry about performance until profiling shows issue.

---

**These advanced patterns will help you build robust, performant React applications!** 🚀
