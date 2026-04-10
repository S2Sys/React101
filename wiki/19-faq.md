# Frequently Asked Questions (FAQ)

Complete answers to common questions about React, hooks, and this application.

## 🎯 Quick Navigation

- [Installation & Setup](#installation--setup)
- [React Fundamentals](#react-fundamentals)
- [Hooks Questions](#hooks-questions)
- [State Management](#state-management)
- [Components & Props](#components--props)
- [Authentication](#authentication)
- [Forms & Validation](#forms--validation)
- [CRUD Operations](#crud-operations)
- [Performance](#performance)
- [TypeScript](#typescript)
- [Styling](#styling)
- [Debugging](#debugging)
- [Common Errors](#common-errors)
- [Advanced Topics](#advanced-topics)

---

## Installation & Setup

### Q: What do I need to install before running the app?

**A:** You need:
1. Node.js 16+ (includes npm)
2. Code editor (VS Code recommended)
3. Web browser

Download Node.js from https://nodejs.org/

### Q: How do I install dependencies?

**A:** Run in the project directory:
```bash
npm install
```

Or with legacy peer deps (if issues):
```bash
npm install --legacy-peer-deps
```

### Q: Port 3000 is already in use. What do I do?

**A:** Use a different port:
```bash
npm start -- --port 3001
```

### Q: App won't start. What should I check?

**A:** Try these steps:
1. Delete node_modules: `rm -rf node_modules`
2. Clear npm cache: `npm cache clean --force`
3. Reinstall: `npm install --legacy-peer-deps`
4. Start: `npm start`

### Q: How do I know if it's working?

**A:** You should see:
- ✅ Browser opens automatically
- ✅ App loads at http://localhost:3000
- ✅ Login page appears
- ✅ No errors in console (F12)

### Q: Can I use different package manager (yarn, pnpm)?

**A:** Yes! The app works with any Node.js package manager:
```bash
yarn install
yarn start
```

---

## React Fundamentals

### Q: What is React?

**A:** React is a JavaScript library for building user interfaces using components. Key ideas:
- **Components** - Reusable UI pieces
- **State** - Data that can change
- **Props** - Data passed to components
- **Re-rendering** - UI updates when state changes

### Q: What's the difference between a component and an element?

**A:**
```typescript
// Component - the blueprint/function
const Button = () => <button>Click me</button>;

// Element - what you create by using the component
<Button />  // This creates an element
```

### Q: Do I need to learn Class Components?

**A:** No! This app uses **Functional Components** which are:
- ✅ Modern (React 16.8+)
- ✅ Simpler to write
- ✅ Support hooks
- ✅ Recommended by React team

Class components are legacy - you don't need them.

### Q: What are props?

**A:** Props are how you pass data from parent to child component:
```typescript
// Parent
<NoteCard note={myNote} />

// Child receives props
const NoteCard = ({ note }) => {
  return <div>{note.title}</div>;
};
```

### Q: What's the difference between props and state?

**A:**

| Feature | Props | State |
|---------|-------|-------|
| Set by | Parent | Component itself |
| Mutable | No (read-only) | Yes (via setState) |
| Purpose | Configure component | Track data changes |
| Causes re-render | Yes | Yes |

### Q: Can I change props?

**A:** No! Props are read-only. If you need to change something, use **state**:
```typescript
// ❌ Wrong - don't modify props
const Component = ({ count }) => {
  count = count + 1;  // Error!
};

// ✅ Right - use state
const Component = ({ initialCount }) => {
  const [count, setCount] = useState(initialCount);
  setCount(count + 1);  // Correct!
};
```

### Q: When does a component re-render?

**A:** Components re-render when:
1. **State changes** - Call setState
2. **Props change** - Parent passes new props
3. **Parent re-renders** - All children also re-render

---

## Hooks Questions

### Q: What are React Hooks?

**A:** Hooks are functions that let you "hook into" React features in functional components:
- Add state with `useState`
- Add side effects with `useEffect`
- Use context with `useContext`
- Create custom logic with custom hooks

### Q: Why are hooks important?

**A:** Hooks let you:
- ✅ Use state without classes
- ✅ Reuse logic with custom hooks
- ✅ Keep related code together
- ✅ Simplify component logic

### Q: What's the most important hook to learn first?

**A:** **useState** - it's the foundation:
```typescript
const [count, setCount] = useState(0);
// Click button → setCount(count + 1) → re-render with new count
```

### Q: Can I use hooks anywhere?

**A:** No! Only:
- ✅ In functional components
- ✅ In custom hooks
- ❌ NOT in regular JavaScript functions
- ❌ NOT inside loops/conditions

### Q: What's the difference between useState and useReducer?

**A:**

| Scenario | useState | useReducer |
|----------|----------|-----------|
| Single value | ✅ | ❌ |
| Multiple related values | ❌ | ✅ |
| Complex logic | ❌ | ✅ |
| Multiple update locations | ❌ | ✅ |

```typescript
// useState - simple
const [name, setName] = useState('John');

// useReducer - complex
const [state, dispatch] = useReducer(reducer, initialState);
dispatch({ type: 'SET_NAME', payload: 'John' });
```

### Q: When should I use useEffect?

**A:** Use for side effects:
- ✅ Fetch data
- ✅ Set up subscriptions
- ✅ Timers/intervals
- ✅ Update DOM

### Q: What's the dependency array in useEffect?

**A:**
```typescript
// No array: Runs after EVERY render (expensive!)
useEffect(() => { ... });

// Empty array: Runs ONCE on mount
useEffect(() => { ... }, []);

// With dependencies: Runs when they change
useEffect(() => { ... }, [count, name]);
```

### Q: How do I clean up in useEffect?

**A:** Return a cleanup function:
```typescript
useEffect(() => {
  const timer = setInterval(() => {
    console.log('tick');
  }, 1000);

  // Cleanup function
  return () => {
    clearInterval(timer);  // Prevent memory leaks
  };
}, []);
```

### Q: What's the difference between useEffect and useLayoutEffect?

**A:**
- **useEffect** - Runs AFTER browser paints (most cases, 99%)
- **useLayoutEffect** - Runs BEFORE browser paints (rare, measuring DOM)

Use `useEffect` by default!

### Q: When should I use useCallback?

**A:** Use when passing callbacks to optimized children:
```typescript
// Without - new function every render (slower)
<Button onClick={() => handleClick()} />

// With useCallback - same function reference (faster)
const handleClick = useCallback(() => {
  // ...
}, []);
<Button onClick={handleClick} />
```

### Q: When should I use useMemo?

**A:** Use for expensive computations:
```typescript
// Without - filters notes every render (slow with many notes)
const filtered = notes.filter(n => n.tag === 'work');

// With useMemo - only when dependencies change
const filtered = useMemo(
  () => notes.filter(n => n.tag === 'work'),
  [notes]
);
```

### Q: What's useRef used for?

**A:** Store mutable values that don't cause re-renders:
```typescript
const timeoutRef = useRef(null);

// Cancel timeout if component unmounts
return () => {
  if (timeoutRef.current) clearTimeout(timeoutRef.current);
};
```

---

## State Management

### Q: Should I use Context API or Redux?

**A:** For this app, **Context API** is perfect because:
- ✅ Simpler to learn
- ✅ Built into React
- ✅ Good for medium-sized apps
- ❌ Not ideal for very large apps

Use Redux when you have:
- Complex state logic
- Many dispatched actions
- Large team
- Time-travel debugging needs

### Q: How do I create context?

**A:**
```typescript
// 1. Create context
const MyContext = React.createContext();

// 2. Create provider
const MyProvider = ({ children }) => {
  const [state, setState] = useState('value');
  return (
    <MyContext.Provider value={{ state, setState }}>
      {children}
    </MyContext.Provider>
  );
};

// 3. Use in components
const MyComponent = () => {
  const { state } = useContext(MyContext);
};
```

### Q: What's the difference between context and props?

**A:**

| Feature | Props | Context |
|---------|-------|---------|
| Passing data | Pass to each component | Available everywhere |
| Prop drilling | Tedious with many levels | Not needed |
| Performance | Good | Can cause re-renders |
| Use case | Child needs parent data | Global data (auth, theme) |

### Q: How do I avoid prop drilling?

**A:** Use context or custom hooks:
```typescript
// ❌ Bad - prop drilling
<Parent theme={theme}>
  <Child theme={theme}>
    <GrandChild theme={theme} />
  </Child>
</Parent>

// ✅ Good - context
<ThemeProvider>
  <Parent />
  <Child />
  <GrandChild />
</ThemeProvider>

// ✅ Good - custom hook
const useTheme = () => useContext(ThemeContext);
```

### Q: How do I persist state to localStorage?

**A:** Use the custom hook:
```typescript
const [value, setValue] = useLocalStorage('key', initialValue);

// Automatically saves to localStorage
setValue(newValue);

// Even after page refresh, value persists!
```

### Q: When should state change?

**A:** State should change when:
- ✅ User interacts (click, type, etc)
- ✅ Data from API arrives
- ✅ Timer/interval fires
- ✅ External event happens

### Q: Should I fetch data in useEffect or render?

**A:** Always in `useEffect`:
```typescript
// ❌ Wrong - infinite loop
const Component = () => {
  const [data, setData] = useState(null);
  setData(fetchData());  // Runs every render!
};

// ✅ Correct - runs once on mount
const Component = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetchData().then(setData);
  }, []);
};
```

---

## Components & Props

### Q: How do I create a component?

**A:** It's just a function:
```typescript
const MyComponent = () => {
  return <div>Hello!</div>;
};

// Or arrow function
const MyComponent = () => <div>Hello!</div>;
```

### Q: How do I accept props?

**A:**
```typescript
// Simple
const Component = (props) => {
  return <div>{props.name}</div>;
};

// Destructured (better)
const Component = ({ name }) => {
  return <div>{name}</div>;
};

// Multiple props
const Component = ({ name, age, email }) => { ... };
```

### Q: How do I pass props?

**A:**
```typescript
// Passing props
<Component name="John" age={30} email="john@example.com" />

// Or spread object
const data = { name: 'John', age: 30 };
<Component {...data} />
```

### Q: Should I pass functions as props?

**A:** Yes, but use `useCallback` to prevent unnecessary re-renders:
```typescript
// Parent passes function
const handleDelete = useCallback((id) => {
  deleteNote(id);
}, []);

<NoteCard onDelete={handleDelete} />
```

### Q: How do I default prop values?

**A:**
```typescript
// Default parameters
const Component = ({ name = 'Guest', age = 0 }) => { ... };

// Or with ?? operator
const name = props.name ?? 'Guest';
```

### Q: How do I handle children prop?

**A:**
```typescript
const Modal = ({ children, onClose }) => {
  return (
    <div className="modal">
      {children}  {/* Content passed between tags */}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

// Usage
<Modal onClose={handleClose}>
  <p>Modal content here!</p>
</Modal>
```

### Q: When should I split a component?

**A:** Split when:
- ✅ Component > 200 lines
- ✅ Multiple responsibilities
- ✅ Used in multiple places
- ✅ Hard to understand

```typescript
// ❌ Too much in one component
const Page = () => {
  // Form code
  // List code
  // Modal code
  // All mixed together
};

// ✅ Split into smaller components
const Page = () => (
  <>
    <FormComponent />
    <ListComponent />
    <ModalComponent />
  </>
);
```

---

## Authentication

### Q: How does authentication work in this app?

**A:** Three steps:
1. User enters credentials (email, password)
2. Validated against mock API
3. Token saved to localStorage
4. Used to access protected routes

### Q: What's a token?

**A:** A unique string proving you're logged in:
```javascript
// Example token
"ZDJmZDM5NDA6MTY0NDMyMTU0OTg0Mg=="

// Like a temporary ID card
```

### Q: How do I check if user is logged in?

**A:**
```typescript
const { isAuthenticated, user } = useAuth();

if (isAuthenticated) {
  <p>Welcome, {user.name}</p>
} else {
  <p>Please log in</p>
}
```

### Q: How do I protect a route?

**A:**
```typescript
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

### Q: How do I log out?

**A:**
```typescript
const { logout } = useAuth();

<button onClick={logout}>Logout</button>
```

### Q: How do I connect to a real authentication backend?

**A:** Modify `src/services/mockApi.ts`:
```typescript
export const apiLogin = async (email: string, password: string) => {
  const response = await fetch('https://api.example.com/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
};
```

That's it! No other code changes needed.

---

## Forms & Validation

### Q: How do I validate form inputs?

**A:** Use the `useForm` hook:
```typescript
const form = useForm(
  { email: '', password: '' },
  async (values) => {
    await login(values.email, values.password);
  },
  (values) => validateLoginForm(values.email, values.password)
);
```

### Q: How do I show form errors?

**A:**
```typescript
{form.touched.email && form.errors.email && (
  <span className="error">{form.errors.email}</span>
)}
```

### Q: How do I validate on blur vs on change?

**A:**
```typescript
const form = useForm(/* ... */);

<input
  value={form.values.email}
  onChange={form.handleChange}  // Updates value, clears error
  onBlur={form.handleBlur}      // Validates and shows error
/>
```

### Q: How do I validate passwords match?

**A:**
```typescript
const errors = validateSignupForm(
  email,
  password,
  confirmPassword,
  name
);

// In validator
if (password !== confirmPassword) {
  errors.confirmPassword = 'Passwords do not match';
}
```

### Q: How do I disable submit button?

**A:**
```typescript
<button
  type="submit"
  disabled={form.isSubmitting || !form.isDirty}
>
  {form.isSubmitting ? 'Submitting...' : 'Submit'}
</button>
```

### Q: How do I reset a form?

**A:**
```typescript
const form = useForm(/* ... */);

<button onClick={form.resetForm}>
  Reset Form
</button>
```

---

## CRUD Operations

### Q: What's CRUD?

**A:** **C**reate, **R**ead, **U**pdate, **D**elete - basic data operations.

### Q: How do I create a note?

**A:**
```typescript
const { createNote } = useNotes();

const newNote = await createNote({
  title: 'My Note',
  content: 'Content here',
  tags: ['work']
});
```

### Q: How do I read notes?

**A:**
```typescript
const { notes, filteredNotes } = useNotes();

// All notes
{notes.map(note => <NoteCard key={note.id} note={note} />)}

// Filtered by search
{filteredNotes.map(note => <NoteCard key={note.id} note={note} />)}
```

### Q: How do I update a note?

**A:**
```typescript
const { updateNote } = useNotes();

await updateNote(noteId, {
  title: 'Updated title',
  content: 'Updated content',
  tags: ['new-tag']
});
```

### Q: How do I delete a note?

**A:**
```typescript
const { deleteNote } = useNotes();

if (window.confirm('Are you sure?')) {
  await deleteNote(noteId);
}
```

### Q: How do I search/filter notes?

**A:**
```typescript
const { setSearchTerm, filteredNotes } = useNotes();

<input
  value={searchInput}
  onChange={(e) => setSearchTerm(e.target.value)}
/>

{/* Filtered notes render automatically */}
{filteredNotes.map(note => <NoteCard key={note.id} note={note} />)}
```

### Q: How are changes saved?

**A:** They're saved to:
1. React state (immediate UI update)
2. Mock API (simulated backend)
3. The component re-renders

In a real app, also saved to backend database.

---

## Performance

### Q: Why is my app slow?

**A:** Common causes:
1. Re-rendering too often
2. Expensive computations every render
3. Not using useMemo
4. Not using useCallback
5. Large lists without key prop

### Q: How do I prevent unnecessary re-renders?

**A:** Use `useMemo` and `useCallback`:
```typescript
// Memoize values
const filtered = useMemo(
  () => notes.filter(n => n.tag === 'work'),
  [notes]
);

// Memoize callbacks
const handleDelete = useCallback((id) => {
  deleteNote(id);
}, []);
```

### Q: Why do I need the `key` prop in lists?

**A:** Keys help React identify which items changed:
```typescript
// ❌ Bad - no key, React has to re-render everything
{items.map((item, index) => (
  <Item key={index} item={item} />
))}

// ✅ Good - unique key
{items.map((item) => (
  <Item key={item.id} item={item} />
))}
```

### Q: How do I measure performance?

**A:** Use React DevTools Profiler:
1. Open DevTools → Profiler tab
2. Record component renders
3. See which components re-render
4. See render time
5. Optimize slow ones

### Q: Should I always use useMemo?

**A:** No! Only use when:
- Computation is expensive
- List/object is large
- Noticeable performance issue

For simple computations, it's overhead.

---

## TypeScript

### Q: Do I need TypeScript to use this app?

**A:** No! The app works with or without understanding TypeScript. But it's recommended because:
- ✅ Catches errors before runtime
- ✅ Better IDE autocomplete
- ✅ Clearer code
- ✅ Good practice

### Q: What's an interface?

**A:** Blueprint for object shape:
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

// Now TypeScript checks all objects match this shape
const user: User = {
  id: '123',
  name: 'John',
  email: 'john@example.com',
  age: 30
};
```

### Q: What's the difference between interface and type?

**A:** For this app, they're mostly interchangeable:
```typescript
// interface
interface User {
  name: string;
  age: number;
}

// type
type User = {
  name: string;
  age: number;
};
```

Interfaces are better for object shapes, types are more flexible.

### Q: How do I type React components?

**A:**
```typescript
interface ComponentProps {
  name: string;
  age: number;
  onClick?: () => void;  // Optional
}

const Component: React.FC<ComponentProps> = ({ name, age, onClick }) => {
  return <div onClick={onClick}>{name}, {age}</div>;
};
```

### Q: How do I type hooks?

**A:**
```typescript
const [count, setCount] = useState<number>(0);
const [user, setUser] = useState<User | null>(null);
const ref = useRef<HTMLInputElement>(null);
```

### Q: What if TypeScript is confusing?

**A:** That's okay! You can:
1. Ignore type errors initially
2. Focus on learning React first
3. Learn TypeScript gradually
4. Use `any` type temporarily (not recommended long-term)

---

## Styling

### Q: How do I style components?

**A:** This app uses CSS files:
```typescript
import '../styles/Component.css';

const Component = () => (
  <div className="component-class">...</div>
);
```

### Q: Can I use other styling libraries?

**A:** Yes! Popular options:
- **Tailwind CSS** - Utility-first CSS
- **Styled Components** - CSS-in-JS
- **Sass/SCSS** - Enhanced CSS
- **CSS Modules** - Scoped CSS

### Q: How do I make my app responsive?

**A:** Use media queries:
```css
/* Mobile first */
.container {
  font-size: 14px;
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    font-size: 16px;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    font-size: 18px;
  }
}
```

### Q: How do I add dark mode?

**A:** Store theme preference:
```typescript
const [theme, setTheme] = useLocalStorage('theme', 'light');

<div className={`app ${theme}`}>
  {/* Content */}
</div>
```

---

## Debugging

### Q: How do I debug my app?

**A:** Methods:
1. **Browser DevTools** (F12)
   - Check Console for errors
   - Inspect HTML elements
   - Monitor Network

2. **React DevTools** (browser extension)
   - See component tree
   - Inspect props and state
   - Profile performance

3. **Console.log**
   ```typescript
   const [count, setCount] = useState(0);
   console.log('Count changed:', count);
   ```

4. **Debugger statement**
   ```typescript
   const handleClick = () => {
     debugger;  // Pauses here, you can step through
     setCount(count + 1);
   };
   ```

### Q: Why isn't my component updating?

**A:** Likely causes:
1. **Forgot to call setState** - State won't update
2. **Mutated state directly** - React doesn't detect change
3. **Async operation not awaited** - Data arrives late
4. **Wrong dependency array** - Effect doesn't run

### Q: How do I log state changes?

**A:**
```typescript
useEffect(() => {
  console.log('Count changed:', count);
}, [count]);
```

### Q: How do I inspect context values?

**A:** Log in component using context:
```typescript
const MyComponent = () => {
  const auth = useAuth();
  console.log('Auth context:', auth);
  return <div>...</div>;
};
```

---

## Common Errors

### Q: "Cannot read property 'map' of undefined"

**A:** Item is undefined. Check:
```typescript
// ❌ Wrong
{items.map(item => <Item key={item.id} item={item} />)}

// ✅ Right - check if exists first
{items && items.map(item => <Item key={item.id} item={item} />)}

// Or use optional chaining
{items?.map(item => <Item key={item.id} item={item} />)}
```

### Q: "setState is not a function"

**A:** Not using useState correctly:
```typescript
// ❌ Wrong
const count = useState(0);
count(count + 1);  // Wrong!

// ✅ Right
const [count, setCount] = useState(0);
setCount(count + 1);  // Correct
```

### Q: "Hooks can only be called inside a component"

**A:** Using hook outside component:
```typescript
// ❌ Wrong
const value = useAuth();  // In global scope

// ✅ Right
const Component = () => {
  const value = useAuth();  // Inside component
};
```

### Q: "You provided a 'checked' prop to form field without onChange handler"

**A:** Missing onChange handler:
```typescript
// ❌ Wrong
<input type="checkbox" checked={isChecked} />

// ✅ Right
<input
  type="checkbox"
  checked={isChecked}
  onChange={(e) => setIsChecked(e.target.checked)}
/>
```

### Q: "Infinite loop in useEffect"

**A:** Missing or wrong dependency array:
```typescript
// ❌ Infinite loop - no dependency array
useEffect(() => {
  setCount(count + 1);
});

// ✅ Correct - runs once
useEffect(() => {
  console.log('Mounted');
}, []);

// ✅ Correct - runs when count changes
useEffect(() => {
  console.log('Count:', count);
}, [count]);
```

### Q: "Hydration mismatch" in Next.js

**A:** Server and client render differently. Not relevant for this app (uses Create React App).

---

## Advanced Topics

### Q: How do I use multiple contexts?

**A:**
```typescript
<AuthProvider>
  <NotesProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </NotesProvider>
</AuthProvider>
```

### Q: How do I create a custom hook?

**A:** It's a function starting with "use":
```typescript
const useMyHook = (param) => {
  const [state, setState] = useState('');
  
  useEffect(() => {
    // Setup
  }, [param]);

  return { state, setState };
};

// Use it
const MyComponent = () => {
  const { state } = useMyHook('param');
};
```

### Q: How do I test my component?

**A:** Use React Testing Library:
```typescript
import { render, screen } from '@testing-library/react';

test('renders button', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

### Q: How do I optimize a very large list?

**A:** Use virtualization:
```typescript
// Only render visible items
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={items.length}
  itemSize={35}
>
  {({index, style}) => (
    <div style={style}>
      {items[index]}
    </div>
  )}
</FixedSizeList>
```

### Q: How do I add authentication to a real backend?

**A:** Replace mock API with real calls:
```typescript
// Instead of mockApi
const apiLogin = async (email, password) => {
  const response = await fetch('https://api.myserver.com/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (!response.ok) throw new Error('Login failed');
  return response.json();  // Returns { user, token }
};
```

### Q: How do I deploy this app?

**A:** Create production build:
```bash
npm run build
```

Deploy the `build` folder to:
- Vercel (recommended)
- Netlify
- AWS S3
- GitHub Pages
- Your own server

---

## Still Have Questions?

**Check these resources:**

1. **React Docs** - https://react.dev
2. **This Wiki** - Read the detailed guides
3. **Stack Overflow** - Search common questions
4. **MDN Web Docs** - JavaScript & DOM reference
5. **ChatGPT** - Ask specific questions

**In This Wiki:**
- [Quick Start](01-quick-start.md) - Getting started
- [Hooks Guide](03-hooks-guide.md) - All hooks explained
- [State Management](04-state-management.md) - Managing state
- [Components](05-components-guide.md) - Component patterns
- [Authentication](08-authentication.md) - Auth flow

---

**Remember:** Learning React takes time. Be patient with yourself, and keep practicing! 🚀
