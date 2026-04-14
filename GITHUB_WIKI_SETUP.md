# 📚 GitHub Wiki Setup Guide

GitHub wikis are stored in a **separate git repository** from your main code repository. Follow these steps to enable and populate the wiki.

## 🚀 Quick Setup (5 minutes)

### Step 1: Enable Wiki on GitHub

1. Go to your repository: https://github.com/S2Sys/React101
2. Click **Settings** (gear icon)
3. Scroll down to **Features** section
4. Check ✅ **Wikis** to enable it
5. Click **Save** (or it auto-saves)

### Step 2: Create Wiki Home Page

1. Go to https://github.com/S2Sys/React101/wiki
2. Click **Create the first page** button
3. In the editor, paste the content from [`.github/wiki-home.md`](.github/wiki-home.md)
4. Name it: `Home`
5. Click **Save Page**

### Step 3: Clone Wiki Repository

The wiki has its own git repository. Clone it:

```bash
# Navigate to a temporary location
cd ~/temp-wiki

# Clone the wiki repository
git clone https://github.com/S2Sys/React101.wiki.git

# Navigate into it
cd React101.wiki
```

### Step 4: Copy All Wiki Files

```bash
# Copy all wiki markdown files from your React101 repo
cp ~/React101/wiki/*.md ./

# Check what was copied
ls -la
```

You should see:
```
01-quick-start.md
02-architecture.md
03-hooks-guide.md
... (20 total files)
```

### Step 5: Update Links in Wiki Files

The links need to reference other wiki pages. Update the "**Next:**" sections:

**Example:** In `01-quick-start.md`, change:
```markdown
**Next**: Learn about [Project Architecture](02-architecture.md).
```

(This format works automatically in GitHub wiki!)

### Step 6: Commit and Push

```bash
# Add all files
git add *.md

# Commit
git commit -m "Add complete React101 wiki documentation (20 guides)"

# Push to GitHub wiki
git push -u origin master
```

### Step 7: Create Sidebar (Optional but Recommended)

Create a file named `_Sidebar.md` in the wiki repository:

```markdown
# 📚 React101 Wiki

## Quick Navigation
- **[Home](Home)**
- **[Getting Started](01-quick-start)**

## Learning Paths
### 🟢 Beginner
- **[Architecture](02-architecture)**
- **[Hooks Guide](03-hooks-guide)**
- **[State Management](04-state-management)**
- **[Components](05-components-guide)**

### 🟡 Intermediate
- **[Custom Hooks](06-custom-hooks)**
- **[Pages & Features](07-pages-features)**
- **[Authentication](08-authentication)**
- **[CRUD Operations](09-crud-operations)**
- **[Form Handling](10-form-handling)**
- **[Mock API](11-mock-api)**
- **[Styling](12-styling)**

### 🔴 Advanced
- **[Performance](13-performance)**
- **[Error Handling](14-error-handling)**
- **[TypeScript](15-typescript)**
- **[Testing](16-testing)**
- **[Best Practices](17-best-practices)**
- **[Troubleshooting](18-troubleshooting)**

## Reference
- **[FAQ](19-faq)**
- **[Advanced FAQ](20-advanced-faq)**
```

Then commit and push:
```bash
git add _Sidebar.md
git commit -m "Add wiki sidebar navigation"
git push
```

---

## 📋 What Gets Created

After following these steps, you'll have:

✅ GitHub wiki at: https://github.com/S2Sys/React101/wiki  
✅ **Home page** with overview and navigation  
✅ **20 complete guides** all linked together  
✅ **Sidebar navigation** for easy browsing  
✅ **Searchable content** (GitHub wiki has built-in search)  
✅ **Editable pages** (anyone with access can edit)  

---

## 🔗 Full File List

These are the files that should be in your GitHub wiki:

```
Home.md (GitHub wiki home - from .github/wiki-home.md)
01-quick-start.md
02-architecture.md
03-hooks-guide.md
04-state-management.md
05-components-guide.md
06-custom-hooks.md
07-pages-features.md
08-authentication.md
09-crud-operations.md
10-form-handling.md
11-mock-api.md
12-styling.md
13-performance.md
14-error-handling.md
15-typescript.md
16-testing.md
17-best-practices.md
18-troubleshooting.md
19-faq.md
20-advanced-faq.md
_Sidebar.md (Navigation menu)
```

---

## ⚙️ Automated Setup (Advanced)

If you prefer automated setup, create a script:

### `setup-wiki.sh`

```bash
#!/bin/bash

# Navigate to temp directory
TEMP_DIR="/tmp/react101-wiki"
mkdir -p "$TEMP_DIR"
cd "$TEMP_DIR"

# Clean up old clone if exists
rm -rf React101.wiki

# Clone wiki repo
git clone https://github.com/S2Sys/React101.wiki.git
cd React101.wiki

# Copy files from main repo
cp ~/React101/wiki/*.md ./

# Create sidebar
cat > _Sidebar.md << 'EOF'
# 📚 React101 Wiki

## Learning Paths
- **[Home](Home)**
- **[Quick Start](01-quick-start)**
- **[Architecture](02-architecture)**
- **[Hooks](03-hooks-guide)**
- **[State](04-state-management)**
- **[Components](05-components-guide)**
- **[Custom Hooks](06-custom-hooks)**
- **[Pages](07-pages-features)**
- **[Auth](08-authentication)**
- **[CRUD](09-crud-operations)**
- **[Forms](10-form-handling)**
- **[API](11-mock-api)**
- **[Styling](12-styling)**
- **[Performance](13-performance)**
- **[Errors](14-error-handling)**
- **[TypeScript](15-typescript)**
- **[Testing](16-testing)**
- **[Best Practices](17-best-practices)**
- **[Troubleshooting](18-troubleshooting)**
- **[FAQ](19-faq)**
- **[Advanced FAQ](20-advanced-faq)**
EOF

# Commit and push
git add *.md
git commit -m "Add complete React101 wiki documentation"
git push -u origin master

echo "✅ Wiki setup complete!"
echo "View at: https://github.com/S2Sys/React101/wiki"
```

Run it:
```bash
chmod +x setup-wiki.sh
./setup-wiki.sh
```

---

## 🔍 Verify Wiki is Working

After setup, verify everything works:

1. ✅ Visit: https://github.com/S2Sys/React101/wiki
2. ✅ Home page displays
3. ✅ Click links to navigate between pages
4. ✅ Sidebar shows on the right
5. ✅ Search works (GitHub provides this)
6. ✅ All 20 documents accessible

---

## 📝 Important Notes

- **Wiki files are in a separate repository** - They're not in your main code repo
- **No PR required** - Wiki edits don't require pull requests
- **Public by default** - Wiki is visible to anyone with repo access
- **Everyone can edit** - By default, anyone with push access can edit wiki
- **History tracked** - GitHub keeps version history of wiki changes

---

## 🐛 Troubleshooting

### Wiki button not showing on GitHub
- Go to **Settings** → **Features**
- Make sure ✅ **Wikis** is checked
- Wait a few seconds and refresh

### Can't push to wiki
- Make sure you have write access to the repository
- Use your GitHub credentials (token/SSH key)
- Wiki repo URL: `https://github.com/S2Sys/React101.wiki.git`

### Links not working in wiki
- Don't use `.md` extension in wiki links
- Use: `[Guide](01-quick-start)` not `[Guide](01-quick-start.md)`
- Spaces become hyphens: `Custom Hooks` → `Custom-Hooks`

### Want to edit a page
- Click **Edit** button on any wiki page
- Make changes in the editor
- Click **Save Page**

---

## ✅ Next Steps

1. **Enable Wiki** on GitHub (Settings → Features)
2. **Clone wiki repo** and copy files (instructions above)
3. **Push to GitHub** using git
4. **Visit wiki** at https://github.com/S2Sys/React101/wiki
5. **Share the link** with your team!

---

**That's it! You now have a fully-populated GitHub wiki!** 🎉
