# CRUD Operations Guide

Complete guide to Create, Read, Update, Delete operations.

## 🔄 CRUD Overview

CRUD stands for **C**reate, **R**ead, **U**pdate, **D**elete - the four basic operations.

### Notes CRUD Lifecycle

```
Create Note
    ↓
Read/Display Notes
    ↓
Update Note Content
    ↓
Delete Note
    ↓
Back to list of notes
```

## ✨ CREATE - Creating Notes

### Creating a Note

```typescript
const { createNote } = useNotes();

const newNote = await createNote({
  title: 'My Note',
  content: 'Note content here',
  tags: ['react', 'learning']
});
```

### Process

```
User fills form (title, content, tags)
    ↓
Click "Create Note"
    ↓
Form validates
    ↓
Calls createNote()
    ↓
NotesContext dispatches ADD_NOTE
    ↓
Note added to state
    ↓
Mock API saves note
    ↓
Modal closes
    ↓
New note appears in list
```

### Data Structure

```typescript
interface CreateNoteRequest {
  title: string;           // Required, non-empty
  content: string;         // Required, non-empty
  tags: string[];         // Optional, comma-separated
}

// Returns
interface Note {
  id: string;             // Generated ID
  userId: string;         // Current user ID
  title: string;
  content: string;
  tags: string[];
  createdAt: string;      // ISO timestamp
  updatedAt: string;      // ISO timestamp
}
```

## 📖 READ - Reading/Fetching Notes

### Fetching All Notes

```typescript
const { notes, isLoading } = useNotes();

// Returns array of all user's notes
// Auto-fetches on mount via useEffect
```

### Fetching Single Note

```typescript
// From URL param
const { id } = useParams();
const note = notes.find(n => n.id === id);

// Or directly
const note = await apiFetchNoteById(id, userId);
```

### Searching Notes

```typescript
const { setSearchTerm, filteredNotes } = useNotes();

// Update search term
setSearchTerm('react');  // 300ms debounce

// Filters notes where:
// - Title contains 'react' (case-insensitive)
// - Content contains 'react'
// - Any tag contains 'react'
```

### Filtering

```
All Notes
    ↓
Apply search filter
    ↓
useMemo computes filtered list
    ↓
Display filtered results
```

## ✏️ UPDATE - Updating Notes

### Editing a Note

```typescript
const { updateNote } = useNotes();

const updated = await updateNote(noteId, {
  title: 'Updated title',
  content: 'Updated content',
  tags: ['new', 'tags']
});
```

### Process

```
Click note to view
    ↓
Click "Edit" button
    ↓
Form populates with current data
    ↓
User modifies content
    ↓
Click "Save Changes"
    ↓
Form validates
    ↓
Calls updateNote()
    ↓
NotesContext dispatches UPDATE_NOTE
    ↓
Note updated in state
    ↓
Mock API saves changes
    ↓
Modal closes
    ↓
List refreshes with updated note
```

### What Can Be Updated

- ✅ Title
- ✅ Content
- ✅ Tags
- ❌ ID (immutable)
- ❌ userId (immutable)
- ⚠️ Dates (auto-updated)

### Example Edit Form

```typescript
const form = useForm(
  {
    title: note.title,
    content: note.content,
    tags: note.tags.join(', ')
  },
  async (values) => {
    await updateNote(noteId, {
      title: values.title,
      content: values.content,
      tags: values.tags.split(',').map(t => t.trim())
    });
  },
  (values) => validateNoteForm(values.title, values.content)
);
```

## 🗑️ DELETE - Deleting Notes

### Deleting a Note

```typescript
const { deleteNote } = useNotes();

if (window.confirm('Delete this note?')) {
  await deleteNote(noteId);
}
```

### Process

```
User clicks delete button
    ↓
Confirmation dialog appears
    ↓
User confirms
    ↓
Calls deleteNote()
    ↓
NotesContext dispatches DELETE_NOTE
    ↓
Note removed from state
    ↓
Mock API deletes note
    ↓
List refreshes
    ↓
Navigate back to dashboard
```

### Safety

```
✅ Confirmation dialog required
✅ Cannot be undone
✅ Removes immediately from UI
✅ Clears from state
```

## 📊 CRUD State Flow

### Creating

```
Component
    ↓
User fills form
    ↓
handleSubmit
    ↓
createNote()
    ↓
dispatch(ADD_NOTE)
    ↓
State updates
    ↓
Component re-renders
    ↓
New note appears
```

### Reading

```
Component mounts
    ↓
useEffect runs
    ↓
fetchNotes()
    ↓
dispatch(FETCH_SUCCESS)
    ↓
State updates with notes
    ↓
Component re-renders
    ↓
Notes display
```

### Updating

```
User edits note
    ↓
Form validates
    ↓
updateNote(id, changes)
    ↓
dispatch(UPDATE_NOTE)
    ↓
State updates specific note
    ↓
Component re-renders
    ↓
Changes visible
```

### Deleting

```
User clicks delete
    ↓
Confirm dialog
    ↓
deleteNote(id)
    ↓
dispatch(DELETE_NOTE)
    ↓
Note removed from state
    ↓
Component re-renders
    ↓
Note gone from list
```

## 🔗 Relations

### Notes Context Actions

```typescript
const context = useNotes();

// Create
await context.createNote({
  title: 'Title',
  content: 'Content',
  tags: []
});

// Read
context.notes  // All notes
context.filteredNotes  // Filtered

// Update
await context.updateNote(id, {
  title: 'New title',
  content: 'New content',
  tags: []
});

// Delete
await context.deleteNote(id);

// Helpers
context.setSearchTerm('search');
context.clearError();
```

## ⚡ Performance

### Optimizations

- **Search**: Debounced 300ms
- **Filtered Notes**: Memoized with useMemo
- **Re-renders**: Only affected components

### When Notes Update

```
One note added/updated/deleted
    ↓
NotesContext state changes
    ↓
All useNotes subscribers notified
    ↓
Only components using useNotes re-render
    ↓
Other components unaffected
```

## 🧪 Testing CRUD

### Test Create
```
✅ Form validates
✅ createNote called
✅ Note added to list
✅ Modal closes
```

### Test Read
```
✅ Notes load on mount
✅ Search filters correctly
✅ filteredNotes computed
```

### Test Update
```
✅ Form pre-fills
✅ Changes saved
✅ List updates
✅ updatedAt changes
```

### Test Delete
```
✅ Confirmation appears
✅ Deletion confirmed works
✅ Note removed from list
✅ Cancellation works
```

---

**Next**: Learn about [Form Handling](10-form-handling.md).
