# Quick Start Guide

Get the React Comprehensive Learning App running in 5 minutes!

## 📋 Prerequisites

- Node.js 16+ ([Download](https://nodejs.org/))
- npm 7+ (comes with Node.js)
- A code editor (VS Code recommended)
- A web browser

## 🚀 Installation & Setup

### Step 1: Navigate to Project Directory

```bash
cd /home/user/React101
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages (React, React Router, TypeScript, etc.).

### Step 3: Start the Development Server

```bash
npm start
```

The application will automatically open at:
```
http://localhost:3000
```

### Step 4: Log In

Use the demo account:
- **Email**: `demo@example.com`
- **Password**: `password`

Or create a new account by clicking "Sign Up".

## ✅ Verify Installation

Once the app loads, you should see:
- ✅ Navigation bar at the top
- ✅ Login form with demo credentials
- ✅ "Sign Up" link at the bottom
- ✅ Settings and help text

If you see errors, check [Troubleshooting](18-troubleshooting).

## 🎯 First Steps in the App

### 1. Log In
```
Email: demo@example.com
Password: password
```

You'll see the Dashboard with 2 demo notes.

### 2. Explore the Dashboard
- **View Notes**: Click any note to view its full content
- **Edit Note**: Click the edit button to modify
- **Delete Note**: Click delete button to remove
- **Search**: Type in the search box to filter notes
- **Create Note**: Click "+ New Note" button

### 3. Create Your First Note
1. Click "+ New Note"
2. Add a title: "My First Note"
3. Add content: "This is my first note!"
4. Add tags: "learning, react" (comma-separated)
5. Click "Create Note"

### 4. Edit the Note
1. Click on your new note
2. Click "✏️ Edit"
3. Modify the content
4. Click "Save Changes"

### 5. Delete the Note
1. Click on the note
2. Click "🗑️ Delete"
3. Confirm deletion

### 6. Explore Other Pages
- **Profile** → View your account information
- **Settings** → Change preferences and theme
- **Logout** → Click your name in navbar to logout

## 📁 Project Structure

```
React101/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Full page components
│   ├── hooks/          # Custom React hooks
│   ├── context/        # State management
│   ├── services/       # API calls
│   ├── types/          # TypeScript interfaces
│   ├── utils/          # Helper functions
│   ├── styles/         # CSS files
│   ├── App.tsx         # Main app component
│   └── index.tsx       # React entry point
├── public/             # Static files
├── package.json        # Dependencies
└── README.md          # Project overview
```

## 🛠️ Available Commands

### Development
```bash
npm start              # Run dev server (http://localhost:3000)
npm test               # Run tests
npm run build          # Build for production
```

### Linting & Formatting
```bash
npm run lint           # Check code quality
npm run format         # Format code
```

### Clean Install
```bash
rm -rf node_modules    # Delete dependencies
npm install            # Reinstall everything
```

## 🎓 Learning the App

### For Complete Beginners
1. Read: [Project Architecture](02-architecture)
2. Read: [React Hooks Explained](03-hooks-guide)
3. Read: [Components Guide](05-components-guide)

### For Intermediate Developers
1. Read: [State Management](04-state-management)
2. Read: [Custom Hooks Library](06-custom-hooks)
3. Read: [CRUD Operations](09-crud-operations)

### For Advanced Developers
1. Read: [Performance Tips](13-performance)
2. Read: [TypeScript Guide](15-typescript)
3. Read: [Best Practices](17-best-practices)

## 💡 Key Files to Explore

Start with these files to understand the structure:

### Foundation
- `src/App.tsx` - Main app with routing
- `src/index.tsx` - React entry point

### Authentication
- `src/context/AuthContext.tsx` - Auth state management
- `src/pages/LoginPage.tsx` - Login form

### Core Features
- `src/pages/DashboardPage.tsx` - Notes list
- `src/context/NotesContext.tsx` - Notes state management
- `src/services/mockApi.ts` - Simulated backend

### Hooks ](Most Important!)
- `src/hooks/useAuth.ts` - Authentication hook
- `src/hooks/useForm.ts` - Form management
- `src/hooks/useFetch.ts` - Data fetching

## 🔗 Important Resources

- [React Official Docs](https://react.dev)
- [React Router Docs](https://reactrouter.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [MDN Web Docs](https://developer.mozilla.org/)

## ❓ Troubleshooting Quick Tips

**Port 3000 already in use?**
```bash
npm start -- --port 3001
```

**Module not found errors?**
```bash
npm install --legacy-peer-deps
```

**TypeScript errors?**
- Check that all imports match file paths
- Verify type definitions in `src/types/index.ts`

**App won't load?**
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console for errors (F12)
- Try restarting the dev server

See [Troubleshooting](18-troubleshooting) for more help.

## ✨ Next Steps

1. ✅ **Get it running** (you just did this!)
2. 📖 **Read the Architecture guide**
3. 🎣 **Learn React Hooks**
4. 🏗️ **Understand State Management**
5. 🧪 **Modify the code and experiment**
6. 📚 **Read the entire wiki**

## 🎉 You're Ready!

You now have a fully functional React application running. Take some time to explore and understand how everything works together.

**Next**: Read [Project Architecture](02-architecture) to understand how everything is organized.

---

**Questions?** Check [Troubleshooting](18-troubleshooting) or review the [Best Practices](17-best-practices) guide.
