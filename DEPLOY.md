# Deploy Instructions for Lane Scheduler React Storybook

## Manual Deploy

To manually deploy Storybook to GitHub Pages:

```bash
# Build and deploy in one command
npm run deploy:storybook
```

Or step by step:

```bash
# 1. Clean and build Storybook
npm run clean:storybook
npm run build:storybook

# 2. Commit and push to GitHub
git add docs/
git commit -m "Deploy Storybook documentation"
git push origin main
```

## Automatic Deploy with GitHub Actions

The repository includes a GitHub Actions workflow that automatically deploys Storybook to GitHub Pages on every push to the `main` branch.

### Setup GitHub Pages

1. Go to your repository Settings → Pages
2. Under "Source", select "GitHub Actions"
3. The workflow will automatically trigger on the next push

### Workflow File

The deployment is configured in `.github/workflows/deploy-storybook.yml`

## Local Preview

To preview the built Storybook locally:

```bash
# Install http-server globally if not already installed
npm install -g http-server

# Serve the docs directory
npm run preview:storybook
```

Then visit `http://localhost:6007`

## Troubleshooting

### Build Issues

If the build fails, check:

1. All dependencies are installed: `npm ci`
2. TypeScript compilation is successful: `npm run build:types`
3. Stories are properly configured in `.storybook/main.ts`

### GitHub Pages Issues

If the deployed site doesn't work:

1. Ensure `.nojekyll` file exists in `docs/`
2. Check that base path is configured correctly in `.storybook/main.ts`
3. Verify GitHub Pages is configured to use GitHub Actions

### Path Issues

If assets don't load correctly:

1. Verify the `viteFinal` configuration in `.storybook/main.ts`
2. Check that the base path matches your repository name
3. Ensure the repository name in the base path is correct
