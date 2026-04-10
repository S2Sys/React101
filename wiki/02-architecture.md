# Project Architecture

A comprehensive guide to understanding the structure and design of the React application.

## 🏗️ Overall Architecture

### Application Layers

```
┌─────────────────────────────────────────────┐
│           User Interface Layer              │
│  (Pages & Components - React Components)   │
├─────────────────────────────────────────────┤
│         State Management Layer              │
│  (Context API + useReducer - Global State) │
├─────────────────────────────────────────────┤
│           Logic Layer                       │
│  (Custom Hooks - Business Logic)           │
├─────────────────────────────────────────────┤
│           Services Layer                    │
│  (Mock API - Data Operations)              │
├─────────────────────────────────────────────┤
│           Type Layer                        │
│  (TypeScript Interfaces - Data Structures) │
└─────────────────────────────────────────────┘
```

## 📂 Directory Structure (Detailed)

```
src/
├── App.tsx                          # Main app component with routing
├── index.tsx                        # React entry point
│
├── components/                      # Reusable UI components
│   ├── ProtectedRoute.tsx          # Route guard for auth
│   ├── LoadingSpinner.tsx          # Loading indicator
│   ├── ErrorBoundary.tsx           # Error catching
│   ├── Navbar.tsx                  # Navigation bar
│   └── NoteCard.tsx                # Note preview card
│
├── pages/                           # Full page components
│   ├── LoginPage.tsx               # Login form
│   ├── SignupPage.tsx              # Registration form
│   ├── DashboardPage.tsx           # Notes list
│   ├── NotePage.tsx                # Note detail/edit
│   ├── ProfilePage.tsx             # User profile
│   └── SettingsPage.tsx            # User settings
│
├── hooks/                           # Custom React hooks
│   ├── useAuth.ts                  # Authentication (3 hooks)
│   ├── useFetch.ts                 # Data fetching (4 hooks)
│   ├── useForm.ts                  # Form management (3 hooks)
│   ├── useLocalStorage.ts          # Browser storage (3 hooks)
│   └── useDebounce.ts              # Debounce/throttle (5 hooks)
│
├── context/                         # Global state management
│   ├── AuthContext.tsx             # Auth state + provider
│   └── NotesContext.tsx            # Notes state + provider
│
├── services/                        # API and data services
│   └── mockApi.ts                  # Simulated backend (~15 endpoints)
│
├── types/                           # TypeScript type definitions
│   └── index.ts                    # 15+ interfaces
│
├── utils/                           # Utility functions
│   ├── constants.ts                # App-wide constants
│   ├── validators.ts               # Form validation functions
│   └── helpers.ts                  # Helper utilities
│
└── styles/                          # CSS stylesheets
    ├── App.css                     # Main styles
    ├── Navbar.css                  # Navigation bar
    ├── AuthPage.css                # Login/Signup pages
    ├── DashboardPage.css           # Dashboard page
    ├── NotePage.css                # Note detail page
    ├── ProfilePage.css             # Profile page
    ├── SettingsPage.css            # Settings page
    ├── NoteCard.css                # Note card component
    ├── LoadingSpinner.css          # Loading spinner
    └── ErrorBoundary.css           # Error boundary
```

## 🔀 Data Flow Architecture

### Authentication Flow

```
User Input (LoginPage)
    ↓
useAuth Hook
    ↓
AuthContext Provider
    ↓
useReducer (AUTH_START, AUTH_SUCCESS, AUTH_ERROR)
    ↓
mockApi.apiLogin()
    ↓
localStorage (stores token & user data)
    ↓
ProtectedRoute checks auth state
    ↓
User redirected to Dashboard
```

### Notes CRUD Flow

```
User Action (create/read/update/delete)
    ↓
notesContext method (createNote, updateNote, deleteNote)
    ↓
useReducer (FETCH_START, ADD_NOTE, UPDATE_NOTE, DELETE_NOTE)
    ↓
mockApi endpoint (apiCreateNote, apiUpdateNote, etc)
    ↓
State updated
    ↓
Components subscribe to NotesContext
    ↓
UI re-renders with new data
```

### Form Handling Flow

```
User Types in Input
    ↓
onChange → handleChange
    ↓
Form state updated (values)
    ↓
Errors cleared for that field
    ↓
onBlur → handleBlur
    ↓
Field marked as touched
    ↓
Validation runs if field has error
    ↓
Error displayed to user
    ↓
User submits form
    ↓
All fields validated
    ↓
Async operation (login, signup, create note)
    ↓
Success or error handling
```

## 🎯 Component Hierarchy

```
App
├── ErrorBoundary
├── Router
├── AuthProvider
│   └── NotesProvider
│       ├── Navbar (uses useAuth)
│       └── Routes
│           ├── LoginPage (useForm, useAuth)
│           ├── SignupPage (useForm, useAuth)
│           └── ProtectedRoute
│               ├── DashboardPage
│               │   ├── LoadingSpinner (conditional)
│               │   └── NoteCard[] (map)
│               ├── NotePage
│               │   └── NoteCard or NoteForm
│               ├── ProfilePage (useAuth)
│               └── SettingsPage (useLocalStorage)
```

## 🔄 Context Hierarchy

```
AuthContext
├── Provides: user, token, isAuthenticated, isLoading, error
├── Methods: login, signup, logout, clearError
└── Used by: Pages, NotesProvider, Components

NotesContext
├── Depends on: AuthContext (gets user ID)
├── Provides: notes, filteredNotes, isLoading, error
├── Methods: fetchNotes, createNote, updateNote, deleteNote, setSearchTerm
└── Used by: DashboardPage, NotePage, Components
```

## 🎣 Hooks Usage Map

### Which Hooks Are Used Where?

| Hook | Pages | Components | Services |
|------|-------|-----------|----------|
| useAuth | All except Login/Signup | Navbar | Context |
| useFetch | - | - | Hooks |
| useForm | LoginPage, SignupPage, NotePage | - | - |
| useLocalStorage | SettingsPage | - | - |
| useDebounce | DashboardPage | - | - |
| useState | All pages & components | - | - |
| useEffect | All pages, hooks | - | - |
| useContext | All pages | Navbar | - |
| useReducer | - | - | Contexts |
| useCallback | - | - | Hooks & Contexts |
| useMemo | NotesContext | - | - |
| useRef | - | - | Hooks |

## 📊 State Management Strategy

### Global State (Context)

```typescript
// AuthContext
{
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// NotesContext
{
  notes: Note[]
  filteredNotes: Note[]
  isLoading: boolean
  error: string | null
  searchTerm: string
}
```

### Local State (useState)

Used in components for:
- Form input values
- Modal visibility
- UI flags (isEditing, etc)
- Temporary UI state

### Persistent State (localStorage)

```javascript
// Keys stored in localStorage
AUTH_TOKEN = 'auth_token'
USER_DATA = 'user_data'
THEME = 'theme'
NOTIFICATIONS = 'emailNotifications'
```

## 🔐 Security Architecture

### Authentication Layers

1. **Storage Layer**: Token stored in localStorage
2. **Transport Layer**: Token sent with API requests (in headers)
3. **Validation Layer**: Token validated before accessing protected routes
4. **Expiration Layer**: Token expiry can be checked (though not enforced in demo)

### Protected Routes

```typescript
// Only authenticated users can access:
- /dashboard
- /notes/:id
- /profile
- /settings

// Public routes:
- /login
- /signup
```

## ⚡ Performance Architecture

### Optimization Strategies

1. **useMemo** - Memoize filtered notes list (expensive computation)
2. **useCallback** - Memoize event handlers (prevent re-renders)
3. **Code Splitting** - React Router lazy loads pages (can be added)
4. **Debouncing** - Search input debounced (300ms)
5. **Throttling** - Scroll events throttled (can be added)

### Lazy Loading Opportunities

```typescript
// Could be lazy loaded:
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const NotePage = React.lazy(() => import('./pages/NotePage'));
```

## 🧪 Testing Architecture

### Test Pyramid

```
                    🔼 E2E Tests (Cypress/Playwright)
                   📊 Integration Tests
                 🧪 Component Tests (React Testing Library)
               ⚡ Unit Tests (Jest)
```

### What to Test

- **Unit**: Validators, helpers, utils
- **Component**: Individual components with different props
- **Integration**: Hooks + Context together
- **E2E**: Complete user flows (login → create note → logout)

## 🔌 API Integration Architecture

### Mock API Structure

```
src/services/mockApi.ts

Auth Endpoints:
- apiLogin(email, password) → AuthResponse
- apiSignup(email, password, name) → AuthResponse
- apiValidateToken(token) → User | null

Notes Endpoints:
- apiFetchNotes(userId) → Note[]
- apiFetchNoteById(noteId, userId) → Note
- apiCreateNote(userId, request) → Note
- apiUpdateNote(noteId, userId, request) → Note
- apiDeleteNote(noteId, userId) → void

User Endpoints:
- apiGetUserProfile(userId) → User
- apiUpdateUserProfile(userId, updates) → User
```

### Real API Integration (Future)

To connect to a real backend, only modify `src/services/mockApi.ts`:

```typescript
// Replace mock implementations with real fetch calls
export const apiLogin = async (email: string, password: string) => {
  const response = await fetch('https://api.example.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
};
```

All other code stays the same!

## 🎨 Styling Architecture

### CSS Organization

```
Global Styles: App.css
├── Reset & Base Styles
├── Typography
├── Responsive Design

Component Styles:
├── Navbar.css
├── AuthPage.css (Login & Signup)
├── DashboardPage.css
├── NotePage.css
├── ProfilePage.css
├── SettingsPage.css
├── NoteCard.css
├── LoadingSpinner.css
└── ErrorBoundary.css
```

### Responsive Breakpoints

```css
Mobile First Approach:
- Base: 0px - 480px
- Tablet: 480px - 768px
- Desktop: 768px - 1024px
- Large: 1024px - 1280px
- XL: 1280px+
```

## 📝 Configuration Files

```
Root Directory:
├── package.json         # Dependencies & scripts
├── tsconfig.json        # TypeScript configuration
├── .gitignore          # Git ignore rules
├── public/
│   └── index.html      # HTML entry point
└── src/
    └── index.tsx       # React entry point
```

## 🔄 Development Workflow

### During Development

1. Edit source files
2. React dev server hot-reloads
3. Check browser console for errors
4. Open DevTools (F12) to inspect

### Before Deployment

1. Run tests: `npm test`
2. Build: `npm run build`
3. Check for console errors
4. Test in production build

## 🎓 Architecture Principles

The application follows these principles:

1. **Separation of Concerns** - Logic, state, and UI are separate
2. **Single Responsibility** - Each component/hook does one thing
3. **DRY (Don't Repeat Yourself)** - Reusable hooks and components
4. **Composition Over Inheritance** - React patterns
5. **Type Safety** - TypeScript for compile-time errors
6. **Performance** - useMemo, useCallback where needed
7. **Accessibility** - Semantic HTML, ARIA labels
8. **Responsive Design** - Mobile-first approach

## 🚀 Scaling Considerations

### To Add More Features

1. **New Page?** → Create in `src/pages/`
2. **New Component?** → Create in `src/components/`
3. **New State?** → Create new Context in `src/context/`
4. **New Business Logic?** → Create custom hook in `src/hooks/`
5. **New Types?** → Add to `src/types/index.ts`
6. **New Utilities?** → Add to `src/utils/`

### Potential Improvements

- Add state management library (Redux, Zustand)
- Add form library (React Hook Form, Formik)
- Add API library (axios, React Query)
- Add testing library (Vitest, Testing Library)
- Add authentication library (Auth0, Firebase)
- Add styling library (Tailwind, Styled Components)

## 📈 Architecture Evolution

```
Version 1.0 (Current)
└── Uses: Context API, useReducer, Custom Hooks

Version 2.0 (Future)
├── Add: Redux for state management
├── Add: React Query for data fetching
├── Add: React Hook Form for forms
└── Add: E2E tests with Cypress

Version 3.0 (Later)
├── Add: TypeScript strict mode
├── Add: Performance monitoring
├── Add: Storybook for components
└── Add: CI/CD pipeline
```

---

**Next**: Learn about [React Hooks](03-hooks-guide.md) which are the heart of this application.
