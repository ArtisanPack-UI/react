# React 18 vs 19 Compatibility

All ArtisanPack UI React packages support both React 18 and React 19.

## Peer Dependency Range

```json
{
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  }
}
```

## What Works on Both Versions

All components, hooks, and providers work identically on React 18 and React 19:

- `ThemeProvider` and `useTheme`
- All form, layout, navigation, data display, feedback, and utility components
- `ToastProvider` and `useToast`
- All `@artisanpack-ui/react-laravel` hooks and wrappers

## React 19 Features

The component library does not require React 19 features, but it is fully compatible with React 19 applications that use:

- **React Server Components** — All components are client components (`'use client'` is not currently needed since the package targets CSR and Inertia SSR, but components work fine when imported into client component boundaries).
- **`use()` hook** — You can use React 19's `use()` in your own code alongside ArtisanPack UI components.
- **Actions and `useActionState`** — ArtisanPack UI form components work with React 19 actions. You can use `useActionState` in place of `useInertiaForm` for non-Inertia projects.
- **`ref` as a prop** — Components that accept refs use `forwardRef`, which works on both React 18 and 19.

## React 18 Considerations

- The `ThemeProvider` uses `useSyncExternalStore` (available since React 18) to track OS color scheme changes.
- No React 18-only APIs are used — upgrading to React 19 requires no changes to ArtisanPack UI code.

## Verified Compatibility

A full code audit confirms that the library uses **no React 19-only APIs**:

| API                                        | Status   |
| ------------------------------------------ | -------- |
| `use()`                                    | Not used |
| `useActionState()`                         | Not used |
| `useFormStatus()`                          | Not used |
| `useOptimistic()`                          | Not used |
| `'use client'` / `'use server'` directives | Not used |
| `React.cache()`                            | Not used |
| Async `startTransition`                    | Not used |

All ref-accepting components use `forwardRef`, which works on both React 18 and 19. Named imports (`import { useState } from 'react'`) are used throughout — no legacy `import React` patterns.

## Testing Across Versions

The CI pipeline tests against both React 18 and React 19 to ensure compatibility. If you encounter a version-specific issue, please [open an issue](https://github.com/ArtisanPack-UI/react/issues).
