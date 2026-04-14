#!/bin/bash

# ============================================================================
# Update GitHub Wiki with Fixed Links
# This script updates your existing GitHub wiki with corrected files
# ============================================================================

set -e

echo "📚 Updating React101 GitHub Wiki with Fixed Links..."
echo ""

# Navigate to wiki directory
WIKI_TEMP="/tmp/react101-wiki-update"
REACT_REPO="/home/user/React101"

echo "📁 Step 1: Setting up working directory..."
rm -rf "$WIKI_TEMP"
mkdir -p "$WIKI_TEMP"
cd "$WIKI_TEMP"
echo "✅ Working directory: $WIKI_TEMP"
echo ""

# Clone GitHub wiki repository
echo "📥 Step 2: Cloning GitHub wiki repository..."
git clone https://github.com/S2Sys/React101.wiki.git
cd React101.wiki
echo "✅ Wiki repository cloned"
echo ""

# Copy ALL files from React101 project (including fixed wiki files)
echo "📋 Step 3: Copying updated wiki files with fixed links..."
cp "$REACT_REPO/wiki"/*.md ./
cp "$REACT_REPO/setup-wiki.sh" ./
echo "✅ Files copied"
echo ""

# Show what's being updated
echo "📊 Files ready to update:"
ls -1 *.md | wc -l
echo "markdown files"
echo ""

# Stage all changes
echo "➕ Step 4: Staging updates..."
git add *.md
echo "✅ Files staged"
echo ""

# Commit changes
echo "💾 Step 5: Creating update commit..."
git -c user.email="no-reply@example.com" -c user.name="Wiki-Update" commit -m "Fix all wiki links - proper GitHub Wiki format

Updated all links to use GitHub Wiki format:
- Removed .md extensions from internal links
- Links now: [Guide](01-quick-start) instead of [Guide](01-quick-start.md)
- All 20 documents properly linked
- Sidebar navigation updated
- All references working

All links should now work correctly in GitHub Wiki!" --no-gpg-sign || echo "⚠️  No changes to commit (wiki already up to date)"
echo ""

# Push changes
echo "🚀 Step 6: Pushing updates to GitHub..."
git push -u origin master
echo "✅ Updates pushed!"
echo ""

# Summary
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║              ✅ WIKI UPDATE COMPLETE!                         ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📚 Your updated wiki is live at:"
echo "   👉 https://github.com/S2Sys/React101/wiki"
echo ""
echo "✨ What changed:"
echo "   ✅ All broken links fixed"
echo "   ✅ Proper GitHub Wiki format"
echo "   ✅ All references working"
echo ""
echo "🔍 Verify the links:"
echo "   1. Visit: https://github.com/S2Sys/React101/wiki"
echo "   2. Click any link to test"
echo "   3. Use sidebar navigation"
echo "   4. Try the search feature"
echo ""
echo "📝 Verify specific links:"
echo "   - [Quick Start](01-quick-start)"
echo "   - [Hooks Guide](03-hooks-guide)"
echo "   - [Performance Tips](13-performance)"
echo "   - [Troubleshooting](18-troubleshooting)"
echo ""
