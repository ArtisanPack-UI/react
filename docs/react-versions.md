---
title: React 18 and 19
menu_order: 11
---

# React 18 and 19

`@artisanpack-ui/react` and `@artisanpack-ui/react-laravel` support React 18 and React 19:

```json
{
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  }
}
```

The behavior engine's React adapter, `@zag-js/react`, supports React 18 and later.

## What the code relies on

- The components use only APIs available in React 18: `forwardRef`, `useId`, `useSyncExternalStore` and the standard hooks. No React 19-only API (`use`, `useActionState`, `useOptimistic`, `useFormStatus`) is used.
- Refs are forwarded with `forwardRef`, which works on both versions. In React 19 you pass `ref` the same way.
- Moving an app from React 18 to 19 needs no changes to how you use the components.

## React 19 in your own code

The components are ordinary client components, so they work alongside React 19 features in your code. For example, a native `<form action={…}>` with `useActionState` works with the form fields, which render native controls with your `name` attributes.

The package's own tests run on React 19. If you hit a problem specific to React 18, please [open an issue](https://github.com/ArtisanPack-UI/react/issues).
