#!/bin/bash

# Script para hacer deploy de Storybook a GitHub Pages

set -e

echo "🚀 Iniciando deploy de Storybook a GitHub Pages..."

# Limpiar directorio docs
echo "🧹 Limpiando directorio docs..."
rm -rf docs

# Construir Storybook
echo "📦 Construyendo Storybook..."
NODE_ENV=production npm run build:storybook

# Verificar que se creó el directorio docs
if [ ! -d "docs" ]; then
    echo "❌ Error: No se pudo crear el directorio docs"
    exit 1
fi

# Crear archivo .nojekyll para GitHub Pages
echo "📄 Creando .nojekyll..."
touch docs/.nojekyll

# Agregar README específico para la documentación
echo "📝 Creando README para la documentación..."
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

echo "✅ Storybook construido exitosamente en ./docs"
echo "📖 Documentación disponible en: ./docs/index.html"
echo ""
echo "Para hacer deploy a GitHub Pages, ejecuta:"
echo "git add docs/ && git commit -m 'Deploy Storybook documentation' && git push origin main"