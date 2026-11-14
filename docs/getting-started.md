---
title: Getting Started
menu_order: 2
---

# Getting Started

This page sets up `@artisanpack-ui/react` in a React app. For how the CSS, the behavior engine and the theme script fit together, see [Getting Started with React](https://docs.artisanpackui.dev/documentation/design-system/getting-started/react) in the design system documentation.

## Install

```bash
npm install @artisanpack-ui/react @artisanpack-ui/css
```

`@artisanpack-ui/behavior` and `@zag-js/react` come as dependencies. `react` and `react-dom` (18 or 19) are peer dependencies.

Building a Laravel app with Inertia? Also see [Laravel and Inertia](Laravel-Inertia).

## Load the CSS

The components ship no CSS of their own. Load the design system's CSS once.

Without Tailwind, import it in your app's entry:

```ts
// main.tsx
import '@artisanpack-ui/css';
```

With Tailwind v4, import it from your Tailwind entry stylesheet instead, after a line that sets the layer order:

```css
@layer theme, base, apui, components, utilities;
@import 'tailwindcss';
@import '@artisanpack-ui/css';
@import '@artisanpack-ui/css/tailwind'; /* optional: utilities generated from the tokens */
```

The layer order keeps Tailwind's Preflight from restyling the components while still letting a utility on a component win. See [With Tailwind](https://docs.artisanpackui.dev/documentation/design-system/getting-started/tailwind).

## Apply the theme before the first paint

Render `ThemeScript` first in the document `<head>`, so a stored dark or high contrast choice applies before the page paints:

```tsx
import { ThemeScript } from '@artisanpack-ui/react';

<head>
  <ThemeScript />
</head>;
```

The inline script only runs when the browser parses it from server-rendered HTML. In a client-rendered app (a Vite single-page app), `ThemeScript` falls back to applying the stored choice when it mounts, after the first paint. For no flash there, inline the output of `themeScript()` from `@artisanpack-ui/behavior` in `index.html`'s `<head>` instead. See [Themes](https://docs.artisanpackui.dev/documentation/design-system/theming/themes).

In the Next.js App Router, `ThemeScript` has to be rendered from a client component. See [Server Rendering](Server-Rendering).

## Your first component

```tsx
import { Button, Form, Input } from '@artisanpack-ui/react';

export function SignIn() {
  return (
    <Form
      aria-label="Sign in"
      actions={
        <Button type="submit" color="primary">
          Sign in
        </Button>
      }
    >
      <Input label="Email" type="email" name="email" autoComplete="email" />
    </Form>
  );
}
```

Every component is exported from the package root and from a category subpath, such as `@artisanpack-ui/react/form`. The AI components are the exception: they're only on `@artisanpack-ui/react/ai`. See [Components](Components) for the list, and for how props, `className`, `classes` and refs work.

## Next steps

- [Components](Components): every component, linked to its page.
- [Theming](Theming): `ThemeToggle`, presets and your own brand.
- [TypeScript](Typescript): the exported types.
