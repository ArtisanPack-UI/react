---
title: ArtisanPack UI React Documentation Home
menu_order: 1
---

# ArtisanPack UI React

`@artisanpack-ui/react` 2.0 is the React library of the [ArtisanPack UI design system](https://docs.artisanpackui.dev/documentation/design-system/home). It renders the same components as the Livewire and Vue libraries, with the same props, parts, keyboard behavior and markup:

- **Styling** comes from `@artisanpack-ui/css`: plain CSS in cascade layers, driven by design tokens. Tailwind is optional, and nothing depends on DaisyUI.
- **Interaction** (focus, keyboard and ARIA for dialogs, menus, comboboxes, tabs and the rest) comes from `@artisanpack-ui/behavior`, built on Zag state machines through `@zag-js/react`.
- **Theming** is attributes and tokens: light, dark and high contrast themes, density and presets, with no props on the components.

| Package                         | What it is                                                                             |
| ------------------------------- | -------------------------------------------------------------------------------------- |
| `@artisanpack-ui/react`         | The components, the theme helpers, and the AI admin components on a separate subpath.  |
| `@artisanpack-ui/react-laravel` | Helpers for Laravel apps built with Inertia: links, menus, pagination, forms and auth. |

## Requirements

- React 18 or 19, with the matching `react-dom`.
- A bundler that reads the `exports` field of `package.json` (Vite, webpack 5, Next.js, Rollup, esbuild). The packages ship ES modules only.
- For `@artisanpack-ui/react-laravel`: `@inertiajs/react` 2 or 3.

## Table of Contents

- [Getting Started](Getting-Started)
- [Components](Components)
- [Hooks and Utilities](Utilities)
- [Theming](Theming)
- [Laravel and Inertia](Laravel-Inertia)
- [AI Components](Ai-Components)
- [Server Rendering](Server-Rendering)
- [TypeScript](Typescript)
- [Bundle Size](Bundle-Size)
- [React 18 and 19](React-Versions)
- [Upgrading from 1.x](Upgrading)

## Design system documentation

These pages cover what is specific to React. The design system documentation covers everything shared by the three stacks:

- [Getting started with React](https://docs.artisanpackui.dev/documentation/design-system/getting-started/react)
- [Foundations](https://docs.artisanpackui.dev/documentation/design-system/foundations): tokens, color, type, spacing, motion and icons
- [Theming](https://docs.artisanpackui.dev/documentation/design-system/theming): themes, presets, brand presets and custom tokens
- [Components](https://docs.artisanpackui.dev/documentation/design-system/components): a page per component with a React tab, live examples and its props, parts and events
- [Accessibility](https://docs.artisanpackui.dev/documentation/design-system/accessibility)

## Getting help

- **Issues:** [GitHub](https://github.com/ArtisanPack-UI/react/issues)
- **Source:** [ArtisanPack-UI/react](https://github.com/ArtisanPack-UI/react)

Both packages are MIT licensed.
