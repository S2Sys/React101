# TypeScript Guide

Comprehensive guide to using TypeScript with React for type safety.

## 🎯 Why TypeScript?

TypeScript catches errors at compile time, not runtime:

```typescript
// ❌ Without TypeScript - Error at runtime
const user = { name: 'John' };
console.log(user.age.toUpperCase());  // Runtime error!

// ✅ With TypeScript - Error caught before running
interface User {
  name: string;
  age?: number;
}

const user: User = { name: 'John' };
console.log(user.age.toUpperCase());  // Compile error! age might be undefined
```

---

## 📋 Basic Type Definitions

### Primitive Types

```typescript
// Strings
const email: string = 'user@example.com';

// Numbers
const age: number = 25;
const count: number = 100;

// Booleans
const isLogged: boolean = true;

// Any (avoid!)
const anything: any = 'could be anything';  // ❌ Type safety lost

// Unknown (safer alternative)
const unknown: unknown = 'value';
if (typeof unknown === 'string') {
  console.log(unknown.toUpperCase());  // ✅ Safe
}

// Null and Undefined
const empty: null = null;
const undef: undefined = undefined;
```

### Unions (Multiple Types)

```typescript
// Value can be string OR number
const id: string | number = '123';
const count: string | number = 456;

// Can be any string value
type Status = 'pending' | 'success' | 'error';
const status: Status = 'success';  // ✅
const status2: Status = 'loading';  // ❌ Error!

// Discriminated union
type Result = 
  | { status: 'success'; data: Note }
  | { status: 'error'; error: string };

const handleResult = (result: Result) => {
  if (result.status === 'success') {
    console.log(result.data);  // data is available here
  } else {
    console.log(result.error);  // error is available here
  }
};
```

---

## 📦 Interfaces & Types

### Interface vs Type

```typescript
// Interface - for objects/contracts
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// Type - for anything (functions, unions, primitives)
type UserId = string;
type Status = 'active' | 'inactive';

// Both can be implemented
interface Note {
  id: string;
  title: string;
  content: string;
}

type NoteWithAuthor = Note & { author: User };

// Extending interfaces
interface AdminUser extends User {
  role: 'admin';
  permissions: string[];
}
```

### Optional Properties

```typescript
interface CreateNoteRequest {
  title: string;
  content: string;
  tags?: string[];  // Optional - can be undefined
}

// Usage
const note1: CreateNoteRequest = {
  title: 'My Note',
  content: 'Content',
  tags: ['react']  // ✅
};

const note2: CreateNoteRequest = {
  title: 'My Note',
  content: 'Content'  // ✅ tags not required
};

const note3: CreateNoteRequest = {
  title: 'My Note'
  // ❌ content is required!
};
```

### Readonly Properties

```typescript
interface User {
  readonly id: string;  // Can't be modified
  readonly email: string;
  name: string;  // Can be modified
}

const user: User = { id: '1', email: 'john@example.com', name: 'John' };
user.name = 'Jane';  // ✅ OK
user.id = '2';       // ❌ Error! id is readonly
```

---

## ⚙️ Typing React Components

### Functional Component

```typescript
interface GreetingProps {
  name: string;
  age: number;
}

// Option 1: Function with type
const Greeting = (props: GreetingProps) => {
  return <div>Hello {props.name}, you are {props.age}</div>;
};

// Option 2: React.FC (Function Component)
const Greeting: React.FC<GreetingProps> = ({ name, age }) => {
  return <div>Hello {name}, you are {age}</div>;
};

// Usage
<Greeting name="John" age={25} />  // ✅
<Greeting name="John" />           // ❌ age is required
<Greeting name="John" age="25" />  // ❌ age must be number
```

### With Children

```typescript
interface CardProps {
  children: React.ReactNode;  // Any valid React content
  title: string;
}

const Card: React.FC<CardProps> = ({ children, title }) => {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  );
};

// Usage
<Card title="My Card">
  <p>Some content</p>
  <button>Click me</button>
</Card>
```

### Event Handlers

```typescript
interface InputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
}

const TextInput: React.FC<InputProps> = ({ value, onChange, onSubmit }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit(e.currentTarget.value);
    }
  };

  return (
    <input
      value={value}
      onChange={handleChange}
      onKeyPress={handleKeyPress}
    />
  );
};
```

---

## 🔧 Typing Hooks

### useState

```typescript
// Implicit type (inferred from initial value)
const [count, setCount] = useState(0);  // count: number
const [name, setName] = useState('');   // name: string

// Explicit type (for complex types)
const [notes, setNotes] = useState<Note[]>([]);
const [user, setUser] = useState<User | null>(null);

// Union state
type AuthState = 
  | { status: 'idle'; user: null }
  | { status: 'loading'; user: null }
  | { status: 'success'; user: User };

const [auth, setAuth] = useState<AuthState>({ status: 'idle', user: null });
```

### useEffect

```typescript
import { useEffect } from 'react';

// Return type can be void or cleanup function
useEffect(() => {
  const handleResize = () => {
    console.log('Resized');
  };

  window.addEventListener('resize', handleResize);

  // Cleanup function (optional)
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);  // Dependencies array
```

### useContext

```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Type-safe hook
const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Usage
const MyComponent = () => {
  const { user, login, logout } = useAuth();  // All properties typed!
};
```

### useReducer

```typescript
interface State {
  notes: Note[];
  isLoading: boolean;
  error: string | null;
}

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Note[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'ADD_NOTE'; payload: Note };

const notesReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, notes: action.payload, isLoading: false };
    case 'FETCH_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'ADD_NOTE':
      return { ...state, notes: [...state.notes, action.payload] };
    default:
      return state;
  }
};

// Usage
const [state, dispatch] = useReducer(notesReducer, initialState);
```

---

## 🎨 Typing the application data (src/types/index.ts)

```typescript
// User types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

// Note types
export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// API Request/Response types
export interface CreateNoteRequest {
  title: string;
  content: string;
  tags?: string[];
}

export interface UpdateNoteRequest extends CreateNoteRequest {}

export interface AuthResponse {
  user: User;
  token: string;
}

// Context types
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export interface NotesContextType {
  notes: Note[];
  filteredNotes: Note[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  fetchNotes: () => Promise<void>;
  createNote: (request: CreateNoteRequest) => Promise<Note>;
  updateNote: (id: string, request: UpdateNoteRequest) => Promise<Note>;
  deleteNote: (id: string) => Promise<void>;
  setSearchTerm: (term: string) => void;
  clearError: () => void;
}

// Form types
export interface FormErrors {
  [key: string]: string;
}

export interface Touched {
  [key: string]: boolean;
}

export interface FormState<T> {
  values: T;
  errors: FormErrors;
  touched: Touched;
  isSubmitting: boolean;
  isDirty: boolean;
}
```

---

## 🔍 Advanced TypeScript Patterns

### Generics

```typescript
// Generic function
function getFirstItem<T>(items: T[]): T | undefined {
  return items[0];
}

const firstString = getFirstItem<string>(['a', 'b']);  // Type: string | undefined
const firstNumber = getFirstItem<number>([1, 2, 3]);   // Type: number | undefined

// Generic interface
interface AsyncResult<T> {
  status: 'pending' | 'success' | 'error';
  data?: T;
  error?: string;
}

const noteResult: AsyncResult<Note> = {
  status: 'success',
  data: { id: '1', userId: '1', title: 'Note', content: '', tags: [], createdAt: '', updatedAt: '' }
};

const userResult: AsyncResult<User> = {
  status: 'error',
  error: 'Not found'
};
```

### Conditional Types

```typescript
// Type that changes based on condition
type IsString<T> = T extends string ? true : false;

const a: IsString<'hello'> = true;   // ✅
const b: IsString<number> = false;   // ✅
const c: IsString<'hello'> = false;  // ❌ Error

// Extracting from union types
type Flatten<T> = T extends Array<infer U> ? U : T;

type A = Flatten<string[]>;  // string
type B = Flatten<string>;     // string
```

### Mapped Types

```typescript
// Create new types by transforming existing ones
interface User {
  id: string;
  name: string;
  email: string;
}

// Make all properties readonly
type ReadonlyUser = {
  readonly [K in keyof User]: User[K];
};

// Make all properties optional
type PartialUser = {
  [K in keyof User]?: User[K];
};

// Make all properties nullable
type NullableUser = {
  [K in keyof User]: User[K] | null;
};
```

### Utility Types

```typescript
// Partial - make all properties optional
type OptionalNote = Partial<Note>;

// Pick - select specific properties
type NotePreview = Pick<Note, 'id' | 'title' | 'createdAt'>;

// Omit - exclude specific properties
type NoteWithoutContent = Omit<Note, 'content'>;

// Record - create object type with keys
type UserRoles = Record<'admin' | 'user' | 'guest', { permissions: string[] }>;

// Readonly - make all properties readonly
type FinalNote = Readonly<Note>;
```

---

## 🔐 Type Narrowing

### Type Guards

```typescript
// Function that narrows type
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'email' in value &&
    'name' in value
  );
}

const data: unknown = { id: '1', email: 'john@example.com', name: 'John' };

if (isUser(data)) {
  console.log(data.email);  // Safe! TypeScript knows it's User
} else {
  console.log('Not a user');
}
```

### Discriminated Unions

```typescript
type Result = 
  | { success: true; data: Note[] }
  | { success: false; error: string };

const handleResult = (result: Result) => {
  if (result.success) {
    // TypeScript knows result.data exists
    console.log(result.data);
  } else {
    // TypeScript knows result.error exists
    console.log(result.error);
  }
};
```

---

## ⚙️ TypeScript Configuration

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "node",
    
    // Strict mode - enforce type safety
    "strict": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitReturns": true,
    
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

---

## 🔗 Common Patterns

### API Response Handling

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function fetchNotes(userId: string): Promise<Note[]> {
  const response: ApiResponse<Note[]> = await api.get(`/notes/${userId}`);
  
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Unknown error');
  }
  
  return response.data;
}
```

### Props Interface with Spread

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

const Button = ({ variant = 'primary', size = 'md', ...props }: ButtonProps) => {
  return (
    <button 
      className={`btn btn--${variant} btn--${size}`}
      {...props}
    />
  );
};
```

---

## 💡 TypeScript Checklist

- [ ] All function parameters are typed
- [ ] All function return types are explicit
- [ ] Props interfaces defined for all components
- [ ] Context types properly defined
- [ ] API responses typed
- [ ] Form state interfaces created
- [ ] Union types for discriminated unions
- [ ] Strict mode enabled in tsconfig.json
- [ ] No `any` types (use `unknown` instead)
- [ ] Readonly used for immutable data

---

## 🔗 Related Documentation

- [Components Guide](05-components-guide) - Component examples
- [Custom Hooks](06-custom-hooks) - Hook patterns
- [State Management](04-state-management) - Context typing
- [Best Practices](17-best-practices) - General patterns

---

**Next**: Learn about [Testing Guide](16-testing).
