---
title: Server Rendering
menu_order: 8
---

# Server Rendering

The components render on the server (Next.js, Remix, Astro, Inertia's server-side rendering) and are built to hydrate on the client without mismatches.

## What renders where

- **IDs** come from React's `useId()`, so the IDs that link labels, hints, errors and ARIA attributes match between the server and the client.
- **Overlay parts rendered in a portal** render nothing on the server and during hydration, and appear once the component has mounted on the client. That covers the panels of Dialog, Drawer, Popover, Tooltip, DropdownMenu, UserMenu, Spotlight, Combobox, DatePicker, ColorPicker and ImageGallery, the menu of a ThemeToggle with `variant="menu"`, and the Toaster region. The components that take a `portal` prop render in place on both when it's off.
- **The theme** is an attribute on `<html>`, so it's applied by the [theme script](Theming) before the first paint, not by React. Nothing in the server output depends on the visitor's theme.

## Next.js App Router

The package's modules don't carry a `'use client'` directive, and the components use hooks, so React Server Components can't render them directly. Render them from your own client components.

For `ThemeScript`, which belongs in the root layout (a Server Component), re-export it from a client module:

```tsx
// app/theme-script.tsx
'use client';

export { ThemeScript } from '@artisanpack-ui/react/utility';
```

```tsx
// app/layout.tsx
import '@artisanpack-ui/css';
import { ThemeScript } from './theme-script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

The script sets `data-theme` on `<html>` before React hydrates, so `suppressHydrationWarning` on `<html>` keeps React from warning about the attribute it didn't render.

## Inertia

With Inertia's server-side rendering, the components need nothing extra. The `<head>` is your Blade root view; see [Laravel and Inertia](Laravel-Inertia) for the theme script there.
