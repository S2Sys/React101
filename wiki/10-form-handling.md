# Form Handling Guide

Complete guide to forms, validation, and submission.

## 📋 Form Architecture

This app uses `useForm` hook for all form handling.

### Form Components

- LoginPage - Email/password login
- SignupPage - User registration with password confirm
- DashboardPage - Create note modal
- NotePage - Edit note form
- SettingsPage - Preference toggles

## 🎯 Form Lifecycle

```
User sees form
    ↓
Enters data
    ↓
onChange → handleChange updates state
    ↓
onBlur → handleBlur marks touched, validates
    ↓
Error shows if validation fails
    ↓
User corrects
    ↓
onClick submit → handleSubmit
    ↓
All fields validated
    ↓
If valid → onSubmit callback
    ↓
Async operation (API call)
    ↓
Success or error
    ↓
Form resets or shows error
```

## 📝 useForm Hook

### Setup

```typescript
const form = useForm(
  { email: '', password: '' },  // Initial values
  async (values) => {           // On submit
    await login(values.email, values.password);
  },
  (values) => {                 // Validation
    return validateLoginForm(values.email, values.password);
  }
);
```

### Returned Object

```typescript
{
  values: { email: '', password: '' },  // Current input values
  errors: {},                            // Error messages
  touched: { email: false, password: false },  // Which fields touched
  isSubmitting: false,                  // Currently submitting?
  isDirty: false,                       // Has changed from initial?
  
  // Methods
  handleChange,     // onChange handler
  handleBlur,       // onBlur handler
  handleSubmit,     // onSubmit handler
  resetForm,        // Reset to initial values
  setFieldValue     // Set field programmatically
}
```

## ⚙️ Form Configuration

### Input Fields

```typescript
<input
  name="email"
  type="email"
  value={form.values.email}
  onChange={form.handleChange}       // Updates on every keystroke
  onBlur={form.handleBlur}           // Validates when leaving field
  placeholder="your@email.com"
  className={form.errors.email ? 'error' : ''}  // Style if error
/>
```

### Error Display

```typescript
{form.touched.email && form.errors.email && (
  <span className="error-text">
    {form.errors.email}
  </span>
)}
```

### Submit Button

```typescript
<button
  type="submit"
  disabled={form.isSubmitting || !form.isDirty}
>
  {form.isSubmitting ? 'Submitting...' : 'Submit'}
</button>
```

## ✔️ Validation

### Validation Functions

Located in `src/utils/validators.ts`:

```typescript
// Single field validators
validateEmail(email)          // Email format
validatePassword(password)    // Min 6 chars
validatePasswordMatch(p1, p2) // Must match

// Form validators
validateLoginForm(email, password)
validateSignupForm(email, password, confirm, name)
validateNoteForm(title, content)
```

### Custom Validation

```typescript
const customValidate = (values) => {
  const errors = {};
  
  if (!values.email) {
    errors.email = 'Email required';
  } else if (!values.email.includes('@')) {
    errors.email = 'Invalid email';
  }
  
  return errors;
};

const form = useForm(initialValues, onSubmit, customValidate);
```

## 🔄 Form Interaction Flow

### On Change

```
User types in input
    ↓
onChange fired
    ↓
handleChange updates form.values
    ↓
If field has error, error cleared
    ↓
Component re-renders with new value
```

### On Blur

```
User leaves field
    ↓
onBlur fired
    ↓
handleBlur marks field as touched
    ↓
Validates field
    ↓
If invalid, stores error
    ↓
Component re-renders with error
```

### On Submit

```
User clicks submit
    ↓
Prevents default
    ↓
Marks all fields as touched
    ↓
Validates all fields
    ↓
If errors, shows them
    ↓
If valid, calls onSubmit callback
    ↓
Sets isSubmitting = true
    ↓
Async operation runs
    ↓
Success: reset or navigate
    ↓
Error: display error message
    ↓
Sets isSubmitting = false
```

## 🧪 Form Examples

### Login Form

```typescript
const form = useForm(
  { email: '', password: '' },
  async (values) => {
    await login(values.email, values.password);
    navigate('/dashboard');
  },
  (values) => validateLoginForm(values.email, values.password)
);

return (
  <form onSubmit={form.handleSubmit(async () => {})}>
    <div className="form-group">
      <input
        name="email"
        value={form.values.email}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
      />
      {form.touched.email && form.errors.email && (
        <span>{form.errors.email}</span>
      )}
    </div>
    {/* More fields... */}
    <button type="submit" disabled={form.isSubmitting}>
      {form.isSubmitting ? 'Logging in...' : 'Login'}
    </button>
  </form>
);
```

### Create Note Form

```typescript
const form = useForm(
  { title: '', content: '', tags: '' },
  async (values) => {
    await createNote({
      title: values.title,
      content: values.content,
      tags: values.tags.split(',').map(t => t.trim())
    });
    form.resetForm();
  },
  (values) => validateNoteForm(values.title, values.content)
);
```

## 🎨 Form Styling

Classes added based on state:

```css
.form-input {
  padding: 0.75rem;
  border: 1px solid #ddd;
}

.form-input.error {
  border-color: #d32f2f;  /* Red border */
  background-color: #ffebee;  /* Light red bg */
}

.error-text {
  color: #d32f2f;
  font-size: 0.9em;
  margin-top: 0.3rem;
}
```

## ⚡ Advanced Features

### Programmatic Value Setting

```typescript
form.setFieldValue('email', 'new@example.com');
```

### Form Reset

```typescript
<button onClick={form.resetForm}>
  Clear Form
</button>
```

### Conditional Fields

```typescript
{form.values.userType === 'business' && (
  <input
    name="companyName"
    value={form.values.companyName}
    onChange={form.handleChange}
  />
)}
```

## 🔍 Troubleshooting Forms

### Form not submitting
- Check validation isn't failing
- Verify button type="submit"
- Check form tag wraps inputs

### Errors not showing
- Verify field is in touched
- Check validation function returns errors
- Verify conditional rendering

### Values not updating
- Check name attribute matches
- Verify onChange handler connected
- Check initial values set

---

**Next**: Learn about [Mock API](11-mock-api.md).
