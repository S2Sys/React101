# Styling Guide

Complete guide to CSS organization and responsive design in the application.

## 🎨 CSS Architecture

The app uses component-scoped CSS files for maintainability:

```
src/styles/
├── App.css              (Global styles, resets, utilities)
├── Navbar.css           (Navigation component)
├── LoadingSpinner.css   (Loading indicator)
├── ErrorBoundary.css    (Error display)
├── AuthPage.css         (Login/Signup pages)
├── DashboardPage.css    (Main notes page)
├── NotePage.css         (Single note page)
├── NoteCard.css         (Note card component)
├── ProfilePage.css      (User profile page)
└── SettingsPage.css     (Settings page)
```

**Benefits:**
- ✅ Each component has its own styles
- ✅ Easy to find styles for a component
- ✅ Prevents style conflicts
- ✅ Scales with app growth

---

## 🌍 Global Styles (App.css)

### CSS Reset

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;  /* Width includes padding/border */
}
```

**Why:** Creates consistent baseline across browsers

### Font Stack

```css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
               'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 
               'Helvetica Neue', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  background-color: #f8f9fa;
}
```

**System Font Stack:**
- macOS/iOS: `-apple-system`, `BlinkMacSystemFont`
- Android: `Roboto`
- Windows: `Segoe UI`
- Fallback: `sans-serif`

### Utility Classes

```css
/* Container - centers content with max width */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Hide elements visually but keep for screen readers */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}

/* Generic hide class */
.hidden {
  display: none;
}
```

---

## 📱 Responsive Design Strategy

The app uses a **mobile-first approach**:

1. **Base styles** target mobile (smallest devices)
2. **Media queries** add styles for larger screens
3. **Breakpoints** mark where layouts change

### Standard Breakpoints

```css
/* Mobile (default/320px) */
.container {
  padding: 0 0.5rem;
}

/* Tablet (640px+) */
@media (min-width: 640px) {
  .container {
    padding: 0 1rem;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .container {
    padding: 0 2rem;
  }
}

/* Large Desktop (1200px+) */
@media (min-width: 1200px) {
  .container {
    max-width: 1200px;
  }
}
```

### Viewport Meta Tag (in index.html)

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**Ensures:** Page scales properly on mobile devices

---

## 🎯 Component Styling Patterns

### Example: Card Component (NoteCard.css)

```css
/* Base card styles */
.note-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

/* Interactive states */
.note-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

/* Responsive layout */
@media (min-width: 640px) {
  .note-card {
    padding: 1.5rem;
  }
}
```

**Naming Convention:**
- Component name: `.note-card`
- Variants: `.note-card--large`, `.note-card--featured`
- States: `.note-card:hover`, `.note-card.is-active`
- Children: `.note-card__title`, `.note-card__content`

### Example: Form Styles (AuthPage.css)

```css
/* Form container */
.form {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Form groups */
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

.form-input.error {
  border-color: #dc3545;
}

/* Error message */
.form-error {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
```

---

## 🎨 Color Palette

### Standard Colors

```css
/* Primary colors */
:root {
  --color-primary: #0066cc;    /* Links, buttons, highlights */
  --color-primary-dark: #0052a3;  /* Hover state */
  
  /* Status colors */
  --color-success: #28a745;    /* Success, positive actions */
  --color-danger: #dc3545;     /* Errors, destructive actions */
  --color-warning: #ffc107;    /* Warnings, caution */
  --color-info: #17a2b8;       /* Information */
  
  /* Neutral colors */
  --color-text: #333;          /* Body text */
  --color-text-light: #666;    /* Secondary text */
  --color-bg: #f8f9fa;         /* Page background */
  --color-border: #ddd;        /* Borders */
  --color-white: #fff;         /* White */
  --color-black: #000;         /* Black */
}
```

### Using CSS Variables

```css
/* Instead of hardcoding colors */
.button {
  background-color: var(--color-primary);
  color: var(--color-white);
  border: none;
}

.button:hover {
  background-color: var(--color-primary-dark);
}
```

**Benefits:**
- ✅ Easy theme switching
- ✅ Consistent colors across app
- ✅ One place to change colors

---

## 🔲 Layout Patterns

### Flexbox Layout

```css
/* Navigation bar with flex */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-bottom: 1px solid #ddd;
}

.navbar__brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.navbar__links {
  display: flex;
  gap: 1rem;
  align-items: center;
}
```

### Grid Layout for Notes

```css
/* Responsive grid */
.notes-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;  /* 1 column on mobile */
}

@media (min-width: 640px) {
  .notes-grid {
    grid-template-columns: repeat(2, 1fr);  /* 2 columns on tablet */
  }
}

@media (min-width: 1024px) {
  .notes-grid {
    grid-template-columns: repeat(3, 1fr);  /* 3 columns on desktop */
  }
}
```

---

## ⌨️ Form Styling

### Text Input

```css
input[type="text"],
input[type="email"],
input[type="password"],
textarea,
select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.2s ease;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

/* Placeholder styling */
input::placeholder {
  color: #999;
}
```

### Button Styles

```css
/* Base button */
button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

/* Primary button */
.button--primary {
  background-color: #0066cc;
  color: white;
}

.button--primary:hover {
  background-color: #0052a3;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 102, 204, 0.3);
}

/* Danger button (delete) */
.button--danger {
  background-color: #dc3545;
  color: white;
}

.button--danger:hover {
  background-color: #c82333;
}

/* Disabled state */
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

---

## ♿ Accessibility in Styling

### Focus States

```css
/* Always provide visible focus indicator */
button:focus,
input:focus,
a:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}
```

### Color Contrast

```css
/* Sufficient contrast for readability */
body {
  color: #333;          /* Dark gray text */
  background: #f8f9fa;  /* Light gray background */
}

/* Links must have sufficient contrast */
a {
  color: #0066cc;  /* ~4.5:1 ratio with light background */
  text-decoration: underline;  /* Don't rely on color alone */
}
```

### Screen Reader Only Text

```html
<button>
  <svg aria-hidden="true"><!-- icon --></svg>
  <span class="sr-only">Delete Note</span>  <!-- Read by screen readers -->
</button>
```

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}
```

---

## 🌙 Dark Mode (Future Enhancement)

### CSS Variables Approach

```css
/* Light mode (default) */
:root {
  --bg-color: #f8f9fa;
  --text-color: #333;
  --border-color: #ddd;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #1e1e1e;
    --text-color: #e0e0e0;
    --border-color: #444;
  }
}

/* Usage */
body {
  background-color: var(--bg-color);
  color: var(--text-color);
}
```

### JavaScript-based Dark Mode

```javascript
// In SettingsPage or useLocalStorage hook
const [theme, setTheme] = useLocalStorage('theme', 'light');

useEffect(() => {
  document.documentElement.dataset.theme = theme;
}, [theme]);
```

```css
/* In App.css */
[data-theme="dark"] {
  --bg-color: #1e1e1e;
  --text-color: #e0e0e0;
}
```

---

## 📐 Spacing System

### Consistent Spacing Scale

```css
/* Based on 0.5rem increment */
:root {
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
  --spacing-2xl: 3rem;     /* 48px */
}

/* Usage */
.button {
  padding: var(--spacing-sm) var(--spacing-md);
}

.card {
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
}
```

---

## 📦 Working with CSS in React

### Import CSS in Components

```typescript
// LoginPage.tsx
import '../styles/AuthPage.css';

export const LoginPage = () => {
  return (
    <form className="form">
      <div className="form-group">
        <label className="form-label">Email</label>
        <input className="form-input" type="email" />
      </div>
    </form>
  );
};
```

### CSS Class Names Best Practice

```typescript
// DashboardPage.tsx
const [viewMode, setViewMode] = useState('grid');

return (
  <div className={`notes-container notes-container--${viewMode}`}>
    {notes.map(note => (
      <div key={note.id} className="note-card">
        {/* ... */}
      </div>
    ))}
  </div>
);
```

### Dynamic Classes (Using Template Literals)

```typescript
<button 
  className={`button button--${isLoading ? 'disabled' : 'primary'}`}
  disabled={isLoading}
>
  {isLoading ? 'Loading...' : 'Submit'}
</button>
```

### Using classnames Library (Optional)

```typescript
import classNames from 'classnames';

<div className={classNames('note-card', {
  'note-card--featured': note.important,
  'note-card--archived': note.archived,
})}>
```

---

## 🔍 Browser DevTools Tips

### Inspecting Styles

1. **Right-click → Inspect** to open DevTools
2. **Elements tab** shows HTML and applied CSS
3. **Styles panel** on the right shows all rules
4. **Toggle rules** on/off to test changes
5. **Edit temporarily** to prototype changes

### Debugging Responsive Design

1. Press **F12** to open DevTools
2. Click **device toolbar icon** (Ctrl+Shift+M)
3. Select device or custom size
4. Test how layout responds

### Color Picker

1. In Styles panel, click any color
2. Opens color picker for testing
3. Shows contrast ratio for accessibility

---

## 📊 Performance Considerations

### CSS Optimization

✅ **DO:**
- Use CSS shorthand: `margin: 1rem 0.5rem;` not `margin-top: margin-bottom...`
- Minimize use of expensive properties like `box-shadow`
- Use CSS Grid/Flexbox instead of floats
- Leverage CSS variables for theming

❌ **DON'T:**
- Avoid inline styles in React (use classes instead)
- Don't use `@import` (blocks page rendering)
- Avoid overly specific selectors: `.container .form form input[type="text"]`

### Class Naming

```typescript
// ❌ Bad - Changes style with name
<div className={isActive ? 'active-blue' : 'inactive-gray'}>

// ✅ Good - Semantic class name
<div className={classNames('tab', { 'tab--active': isActive })}>
```

---

## 🔗 Related Documentation

- [Components Guide](05-components-guide.md) - Component structure
- [Performance Tips](13-performance.md) - Optimization techniques
- [Best Practices](17-best-practices.md) - Code organization

---

**Next**: Learn about [Performance Tips](13-performance.md).
