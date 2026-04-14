# Pages & Features Guide

Complete documentation of all pages and their features.

## 📄 Page Overview

The application has **6 main pages**, each with specific features and responsibilities.

| Page | Route | Protected | Features |
|------|-------|-----------|----------|
| LoginPage | /login | No | Email/password login |
| SignupPage | /signup | No | User registration |
| DashboardPage | /dashboard | Yes | Notes list, search, create |
| NotePage | /notes/:id | Yes | View, edit, delete |
| ProfilePage | /profile | Yes | User information |
| SettingsPage | /settings | Yes | Preferences |

## 🔑 LoginPage

**File**: `src/pages/LoginPage.tsx`

**Purpose**: Authenticate existing users

**Features:**
- Email validation
- Password input
- Demo credentials display
- Error message handling
- Link to signup
- Auto-redirect if logged in
- Loading state during submission

**Hooks Used:**
- `useAuth()` - Login method
- `useForm()` - Form state
- `useNavigate()` - Redirect after login

**User Flow:**
```
User enters credentials
    ↓
Form validates
    ↓
Calls login() from useAuth
    ↓
Auth context updates
    ↓
Token saved to localStorage
    ↓
Redirect to /dashboard
```

## 📝 SignupPage

**File**: `src/pages/SignupPage.tsx`

**Purpose**: Create new user accounts

**Features:**
- Name input
- Email validation
- Password with confirmation
- Password match validation
- Error display
- Link to login
- Auto-redirect if already logged in
- Loading state

**Hooks Used:**
- `useAuth()` - Signup method
- `useForm()` - Form management
- `useNavigate()` - Redirect

**Validation Rules:**
- Email must be valid format
- Password minimum 6 characters
- Passwords must match
- Name is required

## 📊 DashboardPage

**File**: `src/pages/DashboardPage.tsx`

**Purpose**: Main notes list and management

**Features:**
- Display all notes in grid layout
- Search notes (debounced 300ms)
- Filter by title, content, tags
- Create new note modal
- Delete notes with confirmation
- Responsive grid (auto-fit columns)
- No notes message

**Hooks Used:**
- `useNotes()` - Notes management
- `useForm()` - Create note form
- `useDebounce()` - Search debounce
- `useState()` - Modal visibility

**Search Algorithm:**
```typescript
Filter notes where:
- Title contains search term (case-insensitive)
- Content contains search term (case-insensitive)
- Any tag contains search term (case-insensitive)
```

**Modal Features:**
- Create note form
- Title & content validation
- Tag input (comma-separated)
- Cancel/Submit buttons

## 📖 NotePage

**File**: `src/pages/NotePage.tsx`

**Purpose**: View and edit individual notes

**Features:**
- Display full note content
- Edit mode with form
- Save changes
- Delete with confirmation
- Show metadata (dates)
- Display tags
- Back navigation

**Hooks Used:**
- `useParams()` - Get note ID from URL
- `useNotes()` - CRUD methods
- `useForm()` - Edit form
- `useNavigate()` - Navigation

**Two Modes:**
```
View Mode:
- Shows full content
- Edit/Delete buttons
- Click edit to switch

Edit Mode:
- Form with title, content
- Tags input
- Save/Cancel buttons
- Form validation
```

## 👤 ProfilePage

**File**: `src/pages/ProfilePage.tsx`

**Purpose**: Display user profile information

**Features:**
- Show email address
- Show full name
- Show account creation date
- Account status display
- Email verification status
- Responsive layout

**Hooks Used:**
- `useAuth()` - User data

**Displayed Info:**
```
Email: user@example.com
Full Name: John Doe
Member Since: February 08, 2026
Account Status: Active ✓
Email Verified: Yes ✓
```

## ⚙️ SettingsPage

**File**: `src/pages/SettingsPage.tsx`

**Purpose**: User preferences and settings

**Features:**
- Theme selector (light/dark)
- Email notification toggle
- Auto-save toggle
- App information
- Reset settings button
- About section

**Hooks Used:**
- `useLocalStorage()` - Persist preferences
- `useAuth()` - User context

**Persisted Settings:**
```
theme: 'light' | 'dark'
emailNotifications: boolean
autoSave: boolean
```

**About Section:**
- App name and version
- List of covered topics
- Learning paths description
- GitHub link

## 🔄 Page Relationships

```
App Router
├── Public Routes
│   ├── LoginPage
│   └── SignupPage
└── Protected Routes
    ├── DashboardPage
    │   ├── Create → Modal
    │   └── Click note → NotePage
    ├── NotePage
    │   ├── Edit note
    │   └── Delete note
    ├── ProfilePage
    └── SettingsPage
```

## 📱 Responsive Behavior

All pages use mobile-first responsive design:

```css
/* Base: Mobile (320px+) */
.container { width: 100%; }

/* Tablet (768px+) */
@media (min-width: 768px) {
  .container { width: 90%; }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .container { width: 80%; }
}
```

## 🎨 Page Styling

Each page has its own CSS file:
- `styles/AuthPage.css` - Login & Signup
- `styles/DashboardPage.css` - Dashboard
- `styles/NotePage.css` - Note detail
- `styles/ProfilePage.css` - Profile
- `styles/SettingsPage.css` - Settings

## ⚡ Page Performance

**Optimization strategies:**

- `DashboardPage`: useMemo for filtered notes
- `NotePage`: useCallback for handlers
- `SettingsPage`: useLocalStorage for no re-renders
- All: useCallback for event handlers

## 🧪 Testing Each Page

### LoginPage
- ✅ Valid login redirects to dashboard
- ✅ Invalid credentials show error
- ✅ Demo credentials work
- ✅ Signup link navigates correctly

### SignupPage
- ✅ Valid signup creates account
- ✅ Password mismatch shows error
- ✅ Duplicate email shows error
- ✅ Auto-login after signup

### DashboardPage
- ✅ All notes display
- ✅ Search filters notes
- ✅ Create note modal works
- ✅ Delete with confirmation works

### NotePage
- ✅ Note loads from URL
- ✅ Edit mode enables form
- ✅ Save updates note
- ✅ Delete removes note
- ✅ Back button navigates

### ProfilePage
- ✅ User info displays
- ✅ Dates format correctly
- ✅ Status shows active

### SettingsPage
- ✅ Theme preference saves
- ✅ Toggles persist
- ✅ Reset clears all
- ✅ About info displays

---

**Next**: Learn about [CRUD Operations](09-crud-operations).
