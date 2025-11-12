# GitHub Pages Deployment Guide

Este documento explica cómo está configurado el despliegue automático en GitHub Pages para el demo de Lane Scheduler React.

## 🚀 Configuración Automática

### Workflow de GitHub Actions

El archivo `.github/workflows/deploy.yml` configura el despliegue automático que:

1. **Se ejecuta** en cada push a `main` y en pull requests
2. **Construye** el demo usando `npm run build:demo`
3. **Despliega** automáticamente a GitHub Pages (solo en push a main)

### Scripts de Build

- `npm run build:demo` - Construye el demo para producción
- `npm run preview:demo` - Preview local del demo

### Configuración

- **Directorio de salida**: `docs/` (configurado en `vite.demo.config.ts`)
- **Base URL**: `/lane-scheduler-react/` (ajustar según el nombre del repo)
- **Entorno**: Configurado para producción

## 📁 Estructura de Archivos

```
project/
├── docs/                    # ← Generado por build:demo (GitHub Pages)
├── dist/                    # ← Generado por build (NPM package)
├── .github/workflows/
│   └── deploy.yml          # ← Workflow de despliegue
├── vite.config.ts          # ← Config para librería NPM
├── vite.demo.config.ts     # ← Config para demo GitHub Pages
└── src/
    ├── Demo.tsx            # ← Página principal del demo
    └── main.tsx            # ← Entry point del demo
```

## 🛠️ Configuración Manual en GitHub

Para habilitar GitHub Pages en tu repositorio:

1. Ve a **Settings** > **Pages**
2. En **Source**, selecciona **GitHub Actions**
3. El workflow se ejecutará automáticamente en el siguiente push

## 🌐 URLs

- **Demo Live**: `https://pangeasi.github.io/lane-scheduler-react/`
- **Repositorio**: `https://github.com/pangeasi/lane-scheduler-react`
- **NPM Package**: `https://www.npmjs.com/package/@pangeasi/lane-scheduler-react`

## 🔧 Desarrollo Local

```bash
# Desarrollo del demo
npm run dev

# Build y preview del demo
npm run build:demo
npm run preview:demo

# Build de la librería NPM
npm run build
```

## 📦 Despliegue Manual

Si necesitas desplegar manualmente:

```bash
# 1. Construir el demo
npm run build:demo

# 2. Los archivos en docs/ están listos para GitHub Pages
# 3. Hacer commit y push a main
git add docs/
git commit -m "Deploy demo"
git push origin main
```

## ⚡ Notas Importantes

- El directorio `docs/` se genera automáticamente - no editar manualmente
- La URL base debe coincidir con el nombre del repositorio
- GitHub Pages puede tardar unos minutos en actualizar después del deploy
