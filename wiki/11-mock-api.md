# Mock API Guide

Complete reference for the mock backend API that powers the learning application.

## 📡 What is the Mock API?

The mock API simulates a real backend server without requiring an actual server. It:
- **Simulates network delays** using `setTimeout()` to feel realistic
- **Stores data in memory** using JavaScript Maps (like a database)
- **Validates requests** just like a real API
- **Returns errors** for invalid operations
- **Persists demo data** that loads on app start

This allows you to learn full-stack concepts without backend complexity.

## 🔧 How the Mock API Works

### In-Memory Storage

```typescript
// src/services/mockApi.ts

// These Maps simulate a database
let mockUsers: Map<string, { user: User; password: string }> = new Map();
let mockNotes: Map<string, Note> = new Map();

// Initialize demo data on app load
const initializeMockData = () => {
  const demoUser: User = {
    id: generateId(),
    email: 'demo@example.com',
    name: 'Demo User',
    createdAt: new Date().toISOString(),
  };
  mockUsers.set(demoUser.email, { user: demoUser, password: 'password' });
  
  // ... demo notes ...
};
```

**Key Concepts:**
- ✅ Data stored in Maps for fast lookup
- ✅ Demo user created with email: `demo@example.com`, password: `password`
- ✅ Data resets when you refresh the page (no persistence)
- ✅ Each call waits for a simulated delay

### Network Delay Simulation

```typescript
const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Usage in API endpoints
export const apiFetchNotes = async (userId: string): Promise<Note[]> => {
  await delay(MOCK_API_DELAY.MEDIUM);  // 300-500ms
  return getNotesByUserId(userId);
};
```

**Delay Constants** (from `src/utils/constants.ts`):
- `MOCK_API_DELAY.SHORT` = 100ms (quick operations)
- `MOCK_API_DELAY.MEDIUM` = 300-500ms (normal operations)
- `MOCK_API_DELAY.LONG` = 1000ms (simulating slow network)

---

## 🔐 Authentication Endpoints

### Login: `apiLogin()`

Validates user credentials and returns a JWT token.

```typescript
export const apiLogin = async (email: string, password: string): Promise<AuthResponse> => {
  await delay(MOCK_API_DELAY.MEDIUM);
  
  const userData = findUserByEmail(email);
  if (!userData || userData.password !== password) {
    throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
  }
  
  return {
    user: userData.user,
    token: btoa(`${userData.user.id}:${Date.now()}`)  // Mock JWT
  };
};
```

**Usage:**
```typescript
const { user, token } = await apiLogin('demo@example.com', 'password');
// Returns: { user: User, token: string }
```

**Errors:**
- Throws `'Invalid credentials'` if email or password is wrong
- Throws `'User not found'` if email doesn't exist

**Demo Account:**
- Email: `demo@example.com`
- Password: `password`

### Signup: `apiSignup()`

Creates a new user account.

```typescript
export const apiSignup = async (
  email: string,
  password: string,
  name: string
): Promise<AuthResponse> => {
  await delay(MOCK_API_DELAY.MEDIUM);
  
  if (mockUsers.has(email)) {
    throw new Error(ERROR_MESSAGES.USER_EXISTS);
  }
  
  const newUser: User = {
    id: generateId(),
    email,
    name,
    createdAt: new Date().toISOString(),
  };
  
  mockUsers.set(email, { user: newUser, password });
  
  return {
    user: newUser,
    token: btoa(`${newUser.id}:${Date.now()}`)
  };
};
```

**Usage:**
```typescript
const { user, token } = await apiSignup('john@example.com', 'secret123', 'John Doe');
```

**Errors:**
- Throws `'User already exists'` if email is taken

**Security Note:**
⚠️ This is demo code. Passwords are NOT hashed. In production, use bcrypt or Argon2.

### Token Validation: `apiValidateToken()`

Validates an existing token and returns the user.

```typescript
export const apiValidateToken = async (token: string): Promise<User | null> => {
  await delay(MOCK_API_DELAY.SHORT);
  
  try {
    const decoded = atob(token);  // Decode mock token
    const [userId] = decoded.split(':');
    
    for (const userData of mockUsers.values()) {
      if (userData.user.id === userId) {
        return userData.user;
      }
    }
    return null;
  } catch {
    return null;
  }
};
```

**Usage:**
```typescript
const user = await apiValidateToken(token);
if (user) {
  console.log('Token is valid for:', user.email);
} else {
  console.log('Token is invalid');
}
```

---

## 📝 Notes CRUD Endpoints

### Fetch All Notes: `apiFetchNotes()`

Gets all notes for a user.

```typescript
export const apiFetchNotes = async (userId: string): Promise<Note[]> => {
  await delay(MOCK_API_DELAY.MEDIUM);
  return getNotesByUserId(userId);
};
```

**Usage:**
```typescript
const notes = await apiFetchNotes(user.id);
// Returns: Note[]
```

**Returns:** Array of notes belonging to the user

### Fetch Single Note: `apiFetchNoteById()`

Gets one note by ID.

```typescript
export const apiFetchNoteById = async (
  noteId: string,
  userId: string
): Promise<Note> => {
  await delay(MOCK_API_DELAY.SHORT);
  
  const note = findNoteById(noteId);
  if (!note || note.userId !== userId) {
    throw new Error(ERROR_MESSAGES.NOTE_NOT_FOUND);
  }
  
  return note;
};
```

**Usage:**
```typescript
const note = await apiFetchNoteById(noteId, user.id);
```

**Security:** Verifies note belongs to the user (authorization check)

### Create Note: `apiCreateNote()`

Creates a new note.

```typescript
export const apiCreateNote = async (
  userId: string,
  request: CreateNoteRequest
): Promise<Note> => {
  await delay(MOCK_API_DELAY.MEDIUM);
  
  const now = new Date().toISOString();
  const newNote: Note = {
    id: generateId(),
    userId,
    title: request.title,
    content: request.content,
    tags: request.tags || [],
    createdAt: now,
    updatedAt: now,
  };
  
  mockNotes.set(newNote.id, newNote);
  return newNote;
};
```

**Request Format:**
```typescript
interface CreateNoteRequest {
  title: string;
  content: string;
  tags?: string[];
}
```

**Usage:**
```typescript
const newNote = await apiCreateNote(user.id, {
  title: 'My First Note',
  content: 'Some content here',
  tags: ['learning', 'react']
});
```

**Returns:** Created Note with ID and timestamps

### Update Note: `apiUpdateNote()`

Updates an existing note.

```typescript
export const apiUpdateNote = async (
  noteId: string,
  userId: string,
  request: UpdateNoteRequest
): Promise<Note> => {
  await delay(MOCK_API_DELAY.MEDIUM);
  
  const note = findNoteById(noteId);
  if (!note || note.userId !== userId) {
    throw new Error(ERROR_MESSAGES.NOTE_NOT_FOUND);
  }
  
  const updatedNote: Note = {
    ...note,
    title: request.title,
    content: request.content,
    tags: request.tags || [],
    updatedAt: new Date().toISOString(),
  };
  
  mockNotes.set(noteId, updatedNote);
  return updatedNote;
};
```

**Request Format:**
```typescript
interface UpdateNoteRequest {
  title: string;
  content: string;
  tags?: string[];
}
```

**Usage:**
```typescript
const updated = await apiUpdateNote(noteId, user.id, {
  title: 'Updated Title',
  content: 'Updated content',
  tags: ['updated']
});
```

**Key Points:**
- ✅ Creates new object (immutability)
- ✅ Updates `updatedAt` timestamp
- ✅ Verifies ownership before updating

### Delete Note: `apiDeleteNote()`

Deletes a note by ID.

```typescript
export const apiDeleteNote = async (
  noteId: string,
  userId: string
): Promise<void> => {
  await delay(MOCK_API_DELAY.MEDIUM);
  
  const note = findNoteById(noteId);
  if (!note || note.userId !== userId) {
    throw new Error(ERROR_MESSAGES.NOTE_NOT_FOUND);
  }
  
  mockNotes.delete(noteId);
};
```

**Usage:**
```typescript
await apiDeleteNote(noteId, user.id);
// Note is now deleted
```

---

## 👤 User Profile Endpoints

### Get Profile: `apiGetUserProfile()`

Fetches user profile data.

```typescript
export const apiGetUserProfile = async (userId: string): Promise<User> => {
  await delay(MOCK_API_DELAY.SHORT);
  
  for (const userData of mockUsers.values()) {
    if (userData.user.id === userId) {
      return userData.user;
    }
  }
  
  throw new Error(ERROR_MESSAGES.NOT_FOUND);
};
```

### Update Profile: `apiUpdateUserProfile()`

Updates user profile information.

```typescript
export const apiUpdateUserProfile = async (
  userId: string,
  updates: Partial<User>
): Promise<User> => {
  await delay(MOCK_API_DELAY.MEDIUM);
  
  for (const userData of mockUsers.values()) {
    if (userData.user.id === userId) {
      const updatedUser = { ...userData.user, ...updates };
      userData.user = updatedUser;
      return updatedUser;
    }
  }
  
  throw new Error(ERROR_MESSAGES.NOT_FOUND);
};
```

---

## 🧪 Testing Utilities

### Clear All Data: `apiClearAllData()`

Resets the database to initial state (useful for testing).

```typescript
export const apiClearAllData = (): void => {
  mockUsers.clear();
  mockNotes.clear();
  initializeMockData();
};
```

**Usage:**
```typescript
// Clear all data and reset to demo state
apiClearAllData();
```

---

## 📊 Error Handling

All endpoints throw errors for invalid operations:

```typescript
// Example error handling
try {
  const user = await apiLogin('wrong@example.com', 'wrongpass');
} catch (error) {
  console.error(error.message);
  // Output: "Invalid credentials"
}
```

**Common Errors:**
- `'Invalid credentials'` - Login failed
- `'User already exists'` - Email taken on signup
- `'Note not found'` - Note doesn't exist or wrong user
- `'User not found'` - User doesn't exist

---

## 🔄 Complete CRUD Flow Example

```typescript
const user = await apiLogin('demo@example.com', 'password');

// Fetch all notes
const notes = await apiFetchNotes(user.id);

// Create a new note
const newNote = await apiCreateNote(user.id, {
  title: 'Learning React',
  content: 'useState, useEffect, useContext...',
  tags: ['react', 'hooks']
});

// Update the note
const updated = await apiUpdateNote(newNote.id, user.id, {
  title: 'Advanced React',
  content: 'useReducer, useCallback, useMemo...',
  tags: ['react', 'advanced']
});

// Get single note
const note = await apiFetchNoteById(updated.id, user.id);

// Delete the note
await apiDeleteNote(updated.id, user.id);

// Fetch all notes again (one less now)
const finalNotes = await apiFetchNotes(user.id);
```

---

## 🎓 Key Concepts Covered

| Concept | Example |
|---------|---------|
| **In-Memory Storage** | Using Maps instead of a database |
| **Mock Tokens** | btoa() encoding for demo JWT |
| **Error Handling** | throw new Error() for failures |
| **Async/Await** | Simulating async operations |
| **Immutability** | `...object` spread for updates |
| **Authorization** | Verifying userId matches |
| **Timestamps** | ISO string dates for created/updated |

---

## 💡 Real-World Transition

To use a real backend instead of mock API:

1. Replace `mockApi.ts` imports with HTTP client (`fetch`, `axios`)
2. Change endpoints to API URLs: `apiLogin()` → `POST /api/auth/login`
3. Remove `delay()` (real network handles timing)
4. Keep the same interfaces (types don't change)

```typescript
// Before (mock)
const { user, token } = await apiLogin(email, password);

// After (real API)
const response = await fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});
const { user, token } = await response.json();
```

The component code stays the same because we use the same types!

---

**Next**: Learn about [Styling Guide](12-styling).
