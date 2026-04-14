#!/bin/bash

# ============================================================================
# React101 GitHub Wiki Setup Script
# This script automates the wiki repository setup
# ============================================================================

set -e  # Exit on error

echo "📚 Starting React101 GitHub Wiki Setup..."
echo ""

# Step 1: Create temporary directory
WIKI_TEMP="/tmp/react101-wiki-setup"
REACT_REPO="/home/user/React101"

echo "📁 Step 1: Creating working directory..."
rm -rf "$WIKI_TEMP"
mkdir -p "$WIKI_TEMP"
cd "$WIKI_TEMP"
echo "✅ Working directory: $WIKI_TEMP"
echo ""

# Step 2: Clone GitHub wiki repository
echo "📥 Step 2: Cloning GitHub wiki repository..."
echo "   (This will ask for GitHub credentials)"
git clone https://github.com/S2Sys/React101.wiki.git
cd React101.wiki
echo "✅ Wiki repository cloned"
echo ""

# Step 3: Copy all wiki markdown files
echo "📋 Step 3: Copying all wiki documentation files..."
cp "$REACT_REPO/wiki"/*.md ./

# Verify files were copied
FILE_COUNT=$(ls -1 *.md | wc -l)
echo "✅ Copied $FILE_COUNT markdown files"
ls -1 *.md | head -10
echo "   ... and more"
echo ""

# Step 4: Create comprehensive sidebar navigation
echo "🗂️  Step 4: Creating sidebar navigation..."
cat > _Sidebar.md << 'SIDEBAR_EOF'
# 📚 React101 Wiki

## 🟢 Beginner
- **[Home](Home)**
- **[Quick Start](01-quick-start)**
- **[Architecture](02-architecture)**
- **[Hooks Guide](03-hooks-guide)**
- **[State Management](04-state-management)**
- **[Components](05-components-guide)**

## 🟡 Intermediate
- **[Custom Hooks](06-custom-hooks)**
- **[Pages & Features](07-pages-features)**
- **[Authentication](08-authentication)**
- **[CRUD Operations](09-crud-operations)**
- **[Form Handling](10-form-handling)**
- **[Mock API](11-mock-api)**
- **[Styling](12-styling)**

## 🔴 Advanced
- **[Performance](13-performance)**
- **[Error Handling](14-error-handling)**
- **[TypeScript](15-typescript)**
- **[Testing](16-testing)**
- **[Best Practices](17-best-practices)**
- **[Troubleshooting](18-troubleshooting)**

## 📖 Reference
- **[FAQ](19-faq)**
- **[Advanced FAQ](20-advanced-faq)**

---
**Total:** 20 complete guides
SIDEBAR_EOF
echo "✅ Sidebar created (_Sidebar.md)"
echo ""

# Step 5: Create footer file (optional)
echo "📝 Step 5: Creating footer file..."
cat > _Footer.md << 'FOOTER_EOF'
---

**React101 Wiki** | [Home](Home) | [GitHub](https://github.com/S2Sys/React101) | [Issues](https://github.com/S2Sys/React101/issues)

Last updated: $(date)
FOOTER_EOF
echo "✅ Footer created (_Footer.md)"
echo ""

# Step 6: Display files to be pushed
echo "📊 Step 6: Files ready to push:"
echo "   Markdown files: $(ls -1 [0-9]*.md | wc -l)"
echo "   Navigation: _Sidebar.md"
echo "   Footer: _Footer.md"
echo "   Total: $(ls -1 *.md | wc -l) files"
echo ""

# Step 7: Git status
echo "🔍 Step 7: Git status before push:"
git status
echo ""

# Step 8: Add all files
echo "➕ Step 8: Staging all files..."
git add *.md
echo "✅ Files staged"
echo ""

# Step 9: Commit
echo "💾 Step 9: Creating commit..."
git commit -m "Add React101 complete wiki documentation (20 guides)

Features:
- 20 complete documentation guides
- Organized by difficulty level (Beginner/Intermediate/Advanced)
- Comprehensive sidebar navigation
- Quick reference tables
- Learning paths
- 50+ FAQ questions
- Code examples throughout
- Troubleshooting guide

Guides included:
01-quick-start.md - Installation and first steps
02-architecture.md - System architecture and design
03-hooks-guide.md - All React hooks explained
04-state-management.md - Context API and state patterns
05-components-guide.md - Component design principles
06-custom-hooks.md - 12+ custom hooks
07-pages-features.md - Application pages
08-authentication.md - Auth flows and tokens
09-crud-operations.md - Create/Read/Update/Delete
10-form-handling.md - Forms and validation
11-mock-api.md - API simulation
12-styling.md - CSS and responsive design
13-performance.md - Optimization techniques
14-error-handling.md - Error boundaries and recovery
15-typescript.md - TypeScript with React
16-testing.md - Unit, component, and E2E tests
17-best-practices.md - React patterns
18-troubleshooting.md - Common issues and solutions
19-faq.md - 50+ common questions
20-advanced-faq.md - 40+ advanced questions"
echo "✅ Commit created"
echo ""

# Step 10: Push to GitHub
echo "🚀 Step 10: Pushing to GitHub..."
echo "   (This will ask for GitHub credentials if not cached)"
git push -u origin master
echo "✅ Pushed to GitHub!"
echo ""

# Step 11: Summary
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    ✅ WIKI SETUP COMPLETE!                     ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📚 Your wiki is now live at:"
echo "   👉 https://github.com/S2Sys/React101/wiki"
echo ""
echo "📋 What was added:"
echo "   ✅ 20 complete documentation guides"
echo "   ✅ Sidebar navigation"
echo "   ✅ Footer with links"
echo "   ✅ All properly organized and linked"
echo ""
echo "🎯 Next steps:"
echo "   1. Visit: https://github.com/S2Sys/React101/wiki"
echo "   2. Click through the guides"
echo "   3. Test the sidebar navigation"
echo "   4. Verify all links work"
echo "   5. Share the wiki with your team!"
echo ""
echo "💡 Tips:"
echo "   - Edit any page by clicking 'Edit'"
echo "   - Search works across all pages"
echo "   - History tab shows all changes"
echo "   - Sidebar appears on right side"
echo ""
echo "📁 Working files are in: $WIKI_TEMP"
echo "   You can delete this folder after verifying the wiki is live"
echo ""
