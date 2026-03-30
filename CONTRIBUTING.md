# Contributing to ArtisanPack UI React

Thank you for your interest in contributing! This guide covers the local development setup, code style, changeset workflow, and PR process.

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 9+
- **Git**

## Local Development Setup

### 1. Clone and install

```bash
git clone https://github.com/ArtisanPack-UI/react.git
cd react
npm install
```

### 2. Build all packages

```bash
npm run build
```

This builds `tokens` → `react` → `react-laravel` in workspace order.

### 3. Start Storybook

```bash
npm run storybook
```

Opens at [http://localhost:6006](http://localhost:6006) with all component stories and a DaisyUI theme switcher.

### 4. Run tests

```bash
npm test
```

Or run tests for a specific package:

```bash
cd packages/tokens && npm test
cd packages/react && npm test
```

## Monorepo Structure

```
packages/
├── tokens/         # @artisanpack-ui/tokens — Design tokens and utilities
├── react/          # @artisanpack-ui/react — React component library
└── react-laravel/  # @artisanpack-ui/react-laravel — Inertia.js adapters
```

All three packages are versioned together using [Changesets](https://github.com/changesets/changesets) linked versioning.

## Code Style

### Formatting

We use **Prettier** for code formatting and **ESLint** for linting.

```bash
# Format all source files
npm run format

# Check formatting without writing
npm run format:check

# Lint
npm run lint
```

### TypeScript

- Strict mode is enabled across all packages
- All exports must have explicit type annotations
- Use JSDoc/TSDoc comments on all public APIs

### Component Conventions

- One component per file
- Props interface named `{ComponentName}Props`
- Export both the component and its props type from the component file
- Use `cn()` from `@artisanpack-ui/tokens` for conditional class names
- Style with DaisyUI classes and Tailwind utilities

### File Naming

- Components: `PascalCase.tsx` (e.g. `Button.tsx`)
- Hooks: `camelCase.ts` (e.g. `useTheme.ts`)
- Types: `camelCase.ts` (e.g. `types.ts`)
- Tests: `{name}.test.ts` or `{name}.test.tsx`
- Stories: `{ComponentName}.stories.tsx`

## Adding a New Component

1. Create the component file in the appropriate category under `packages/react/src/components/`:
   ```
   packages/react/src/components/form/MyComponent/MyComponent.tsx
   ```

2. Export from the category index:
   ```ts
   // packages/react/src/components/form/index.ts
   export { MyComponent } from './MyComponent/MyComponent';
   export type { MyComponentProps } from './MyComponent/MyComponent';
   ```

3. Export from the package root:
   ```ts
   // packages/react/src/index.ts
   export { MyComponent } from './components/form/MyComponent/MyComponent';
   export type { MyComponentProps } from './components/form/MyComponent/MyComponent';
   ```

4. Add a Storybook story:
   ```
   packages/react/src/components/form/MyComponent/MyComponent.stories.tsx
   ```

5. Add tests:
   ```
   packages/react/src/components/form/MyComponent/__tests__/MyComponent.test.tsx
   ```

## Changeset Workflow

Every PR that changes published code **must include a changeset**.

### Adding a changeset

```bash
npm run changeset
```

The interactive CLI walks you through:
1. Which packages are affected
2. Bump type (major / minor / patch)
3. A summary (this becomes the changelog entry)

This creates a file in `.changeset/` — commit it with your PR.

### When to use each bump type

| Bump | When |
|------|------|
| **patch** | Bug fixes, documentation improvements, internal refactors |
| **minor** | New components, new props, new hooks, new features |
| **major** | Breaking changes to existing component APIs or removal of exports |

## Pull Request Process

1. **Branch from `release/1.0`** (or the current release branch):
   ```bash
   git checkout -b feature/my-change release/1.0
   ```

2. **Make your changes** following the code style and conventions above.

3. **Add a changeset** if you changed published code.

4. **Run checks locally**:
   ```bash
   npm run build
   npm test
   npm run lint
   npm run format:check
   npm run type-check
   ```

5. **Push and open a PR** targeting the release branch.

6. **CI runs automatically** — build, lint, tests, and Chromatic visual regression.

7. **Address review feedback** — CodeRabbit and maintainers will review.

## Releasing

See the [Releasing](https://github.com/ArtisanPack-UI/react/wiki/Releasing) wiki page for the full release process, including stable releases, snapshots, and troubleshooting.

## Getting Help

- Open an issue on [GitHub](https://github.com/ArtisanPack-UI/react/issues)
- Check existing issues and discussions before opening a new one

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
