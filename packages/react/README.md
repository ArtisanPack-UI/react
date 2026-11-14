# @artisanpack-ui/react

[![CI](https://github.com/ArtisanPack-UI/react/actions/workflows/ci.yml/badge.svg)](https://github.com/ArtisanPack-UI/react/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@artisanpack-ui/react)](https://www.npmjs.com/package/@artisanpack-ui/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/ArtisanPack-UI/react/blob/main/LICENSE)

The React components of the [ArtisanPack UI design system](https://docs.artisanpackui.dev/documentation/design-system/home): the same components, props and markup as the Livewire and Vue libraries, styled by `@artisanpack-ui/css` and driven by the `@artisanpack-ui/behavior` engine.

## Install

```bash
npm install @artisanpack-ui/react @artisanpack-ui/css
```

`react` and `react-dom` 18 or 19 are peer dependencies.

## Set up

Load the CSS once. Without Tailwind, in your app's entry:

```ts
import '@artisanpack-ui/css';
```

With Tailwind v4, in your Tailwind stylesheet:

```css
@layer theme, base, apui, components, utilities;
@import 'tailwindcss';
@import '@artisanpack-ui/css';
```

Render `ThemeScript` first in `<head>` to apply the stored theme before the first paint, and use the components:

```tsx
import { Button, Input, ThemeScript, ThemeToggle } from '@artisanpack-ui/react';

<head>
  <ThemeScript />
</head>;

<ThemeToggle />
<Input label="Email" type="email" />
<Button color="primary">Save</Button>
```

Every component is exported from the root and from a category subpath: `/form`, `/layout`, `/navigation`, `/data`, `/feedback`, `/utility`, and `/chart` for Chart alone. The AI admin components are only on `/ai`.

## Documentation

- [Getting Started](https://docs.artisanpackui.dev/documentation/react/getting-started)
- [Components](https://docs.artisanpackui.dev/documentation/react/components): every component, linked to its design-system page
- [Hooks and Utilities](https://docs.artisanpackui.dev/documentation/react/utilities)
- [Theming](https://docs.artisanpackui.dev/documentation/react/theming)
- [AI Components](https://docs.artisanpackui.dev/documentation/react/ai-components)
- [Server Rendering](https://docs.artisanpackui.dev/documentation/react/server-rendering)
- [TypeScript](https://docs.artisanpackui.dev/documentation/react/typescript)
- [Upgrading from 1.x](https://docs.artisanpackui.dev/documentation/react/upgrading): the codemod and the deprecated 1.x components

## License

[MIT](https://github.com/ArtisanPack-UI/react/blob/main/LICENSE) — Jacob Martella
