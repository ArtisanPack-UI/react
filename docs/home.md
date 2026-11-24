---
title: Overview
menu_order: 0
---

# Overview

`@artisanpack-ui/react` 2.0 is the React library of the [ArtisanPack UI design system](https://docs.artisanpackui.dev/documentation/design-system/home). It renders the same components as the Livewire and Vue libraries, with the same props, parts, keyboard behavior and markup.

| Package                         | What it is                                                                             |
| ------------------------------- | -------------------------------------------------------------------------------------- |
| `@artisanpack-ui/react`         | The components, the theme helpers, and the AI admin components on a separate subpath.  |
| `@artisanpack-ui/react-laravel` | Helpers for Laravel apps built with Inertia: links, menus, pagination, forms and auth. |

## Features

- **Styling** comes from `@artisanpack-ui/css`: plain CSS in cascade layers, driven by design tokens. Tailwind is optional, and nothing depends on DaisyUI.
- **Interaction** (focus, keyboard and ARIA for dialogs, menus, comboboxes, tabs and the rest) comes from `@artisanpack-ui/behavior`, built on Zag state machines through `@zag-js/react`.
- **Theming** is attributes and tokens: light, dark and high contrast themes, density and presets, with no props on the components.
- **React conventions**: controlled and uncontrolled state, forwarded refs, slots as props, and `className` and `classes` for styling individual parts.
- **Server rendering**: every module is marked `'use client'`, so the components work in Next.js Server Components and with Inertia's server-side rendering.
- **Translations**: the built-in text ships in nine locales, through `TranslationProvider`.
- **TypeScript** declarations for every entry point, and category subpaths for smaller bundles.
- **Laravel and Inertia** helpers for navigation, forms, auth and flash messages, and AI admin screens for the `artisanpack-ui/ai` package.

## Requirements

React 18 or 19, and a bundler that reads the `exports` field of `package.json` (Vite, webpack 5, Next.js, Rollup or esbuild). `@artisanpack-ui/react-laravel` also needs `@inertiajs/react` 2 or 3. See [Installation](installation.md#requirements).

## Quick install

```bash
npm install @artisanpack-ui/react @artisanpack-ui/css
```

Then load `@artisanpack-ui/css` once in your app's entry and render `ThemeScript` first in `<head>`. See [Getting Started](getting-started.md).

## Next steps

- [Getting Started](getting-started.md): a working component in five minutes.
- [Installation](installation.md): requirements, the CSS with or without Tailwind, and the theme script.
- [Components](components.md): every component, linked to its page, and how props, refs and `classes` work in React.
- [Hooks and Utilities](utilities.md), [Translations](translations.md), [Theming](theming.md) and [TypeScript](typescript.md).
- [Laravel and Inertia](laravel-inertia.md), [AI Components](ai-components.md) and [Server Rendering](server-rendering.md).
- [Upgrading from 1.x](upgrading.md), the [FAQ](faq.md) and [Troubleshooting](troubleshooting.md).

## Design system documentation

These pages cover what is specific to React. The design system documentation covers everything shared by the three stacks:

- [Getting started with React](https://docs.artisanpackui.dev/documentation/design-system/getting-started/react)
- [Foundations](https://docs.artisanpackui.dev/documentation/design-system/foundations): tokens, color, type, spacing, motion and icons
- [Theming](https://docs.artisanpackui.dev/documentation/design-system/theming): themes, presets, brand presets and custom tokens
- [Components](https://docs.artisanpackui.dev/documentation/design-system/components): a page per component with a React tab, live examples and its props, parts and events
- [Accessibility](https://docs.artisanpackui.dev/documentation/design-system/accessibility)

## Getting help

Report bugs and ask questions in [GitHub issues](https://github.com/ArtisanPack-UI/react/issues). Both packages are MIT licensed.
