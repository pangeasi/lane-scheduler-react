#!/bin/bash

# Script to deploy Storybook to GitHub Pages

set -e

echo "🚀 Starting Storybook deployment to GitHub Pages..."

# Clean docs directory
echo "🧹 Cleaning docs directory..."
rm -rf docs

# Build Storybook
echo "📦 Building Storybook..."
NODE_ENV=production npm run build:storybook

# Verify that docs directory was created
if [ ! -d "docs" ]; then
    echo "❌ Error: Could not create docs directory"
    exit 1
fi

# Create .nojekyll file for GitHub Pages
echo "📄 Creating .nojekyll..."
touch docs/.nojekyll

# Add specific README for documentation
echo "📝 Creating README for documentation..."
cat > docs/README.md << EOF
# Lane Scheduler React - Documentation

This directory contains the built Storybook documentation for Lane Scheduler React.

🔗 **[View Documentation](https://pangeasi.github.io/lane-scheduler-react/)**

## About Lane Scheduler React

A flexible, drag-and-drop scheduler component library for React with full TypeScript support.

### Features
- 🎯 Drag & Drop appointments between lanes
- 📏 Resizable appointments  
- 🔒 Blocked slots and locked appointments
- 🎨 Customizable rendering
- 📱 Mobile/touch support
- ⚡ TypeScript support

### Links
- [GitHub Repository](https://github.com/pangeasi/lane-scheduler-react)
- [NPM Package](https://www.npmjs.com/package/@pangeasi/lane-scheduler-react)
EOF

echo "✅ Storybook built successfully in ./docs"
echo "📖 Documentation available at: ./docs/index.html"
echo ""
echo "To deploy to GitHub Pages, run:"
echo "git add docs/ && git commit -m 'Deploy Storybook documentation' && git push origin main"