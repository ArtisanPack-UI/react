---
title: Installation
menu_order: 20
meta_description: Requirements, the npm packages to install, loading the design system CSS and applying the theme before the first paint.
---

# Installation

Everything you need to add `@artisanpack-ui/react` to a React app. For the shortest path to a working component, see [Getting Started](getting-started.md).

## Requirements

- **React 18 or 19**, with the matching `react-dom`. See [React 18 and 19](react-versions.md).
- **A bundler that reads the `exports` field** of `package.json`: Vite, webpack 5, Next.js, Rollup or esbuild. The packages ship ES modules only, with no CommonJS build.
- **TypeScript 5.4 or later**, if you use TypeScript, with a `moduleResolution` of `bundler`, `node16` or `nodenext`. See [TypeScript](typescript.md).
- **`@inertiajs/react` 2 or 3**, only for `@artisanpack-ui/react-laravel`.

## Install the packages

```bash
npm install @artisanpack-ui/react @artisanpack-ui/css
```

| Package                         | Why you need it                                                                                         |
| ------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `@artisanpack-ui/react`         | The components, the theme helpers, and the AI admin components on the `/ai` subpath.                    |
| `@artisanpack-ui/css`           | The design system's styles. The components ship no CSS of their own.                                    |
| `@artisanpack-ui/behavior`      | The behavior engine (focus, keyboard and ARIA). Installed for you as a dependency.                      |
| `@zag-js/react`                 | The React adapter for the behavior engine's state machines. Installed for you as a dependency.          |
| `@artisanpack-ui/react-laravel` | Optional. Helpers for Laravel apps built with Inertia. See [Laravel and Inertia](#laravel-and-inertia). |

`react` and `react-dom` are peer dependencies, so your app provides them.

## Load the CSS

Load `@artisanpack-ui/css` once for the whole app.

### Without Tailwind

Import it in your app's entry:

```ts
// src/main.tsx
import '@artisanpack-ui/css';
```

### With Tailwind CSS 4

Import it from your Tailwind entry stylesheet instead, after a line that sets the layer order:

```css
/* src/app.css */
@layer theme, base, apui, components, utilities;
@import 'tailwindcss';
@import '@artisanpack-ui/css';
@import '@artisanpack-ui/css/tailwind'; /* optional: utilities generated from the tokens */
```

The `@layer` line has to come first. It keeps Tailwind's Preflight from restyling the components while still letting a utility on a component win. See [With Tailwind](https://docs.artisanpackui.dev/documentation/design-system/getting-started/tailwind).

### Without the visual layer

To keep the markup and behavior but write every visual style yourself, load the [headless](https://docs.artisanpackui.dev/documentation/design-system/theming/headless) build instead of the full CSS.

## Apply the theme before the first paint

A stored dark or high contrast choice has to be applied before the page paints, or the page flashes the light theme first. Where the script goes depends on how the page is rendered:

| Your app                                 | Where the theme script goes                                                                                                                                                        |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Server-rendered (Next.js, Remix, Astro)  | Render `<ThemeScript />` first in `<head>`. In the Next.js App Router, put it in the root layout. See [Server Rendering](server-rendering.md#nextjs-app-router).                   |
| Client-rendered (a Vite single-page app) | Inline the output of `themeScript()` from `@artisanpack-ui/behavior` in `index.html`'s `<head>`. `ThemeScript` still works there, but it applies the choice after the first paint. |
| Laravel with Inertia                     | Put the script in your Blade root view's `<head>`. See [Laravel and Inertia](laravel-inertia.md#set-up).                                                                           |

```tsx
import { ThemeScript } from '@artisanpack-ui/react';

<head>
  <ThemeScript />
</head>;
```

See [Theming](theming.md) for `ThemeScript`'s props and the `ThemeToggle` that stores the choice.

## Laravel and Inertia

For a Laravel app built with Inertia, add the Laravel helpers and Inertia's React adapter:

```bash
npm install @artisanpack-ui/react-laravel @inertiajs/react
```

They add Inertia navigation to Menu, Breadcrumbs, Pagination and Link, form helpers on Inertia's `useForm`, auth helpers and Laravel flash messages as toasts. See [Laravel and Inertia](laravel-inertia.md).

## Upgrading from 1.x

Version 2.0 replaces DaisyUI with `@artisanpack-ui/css` and renames some components and props. A codemod does most of the work. See [Upgrading from 1.x](upgrading.md).
