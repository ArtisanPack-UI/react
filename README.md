# ArtisanPack UI React

[![CI](https://github.com/ArtisanPack-UI/react/actions/workflows/ci.yml/badge.svg)](https://github.com/ArtisanPack-UI/react/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

The React library of the [ArtisanPack UI design system](https://docs.artisanpackui.dev/documentation/design-system/home). It renders the same components as the Livewire and Vue libraries, with the same props, parts, keyboard behavior and markup. Styling comes from `@artisanpack-ui/css` (Tailwind is optional, and nothing depends on DaisyUI), and interaction from the `@artisanpack-ui/behavior` engine.

## Packages

| Package                                                     | What it is                                                                             |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| [`@artisanpack-ui/react`](./packages/react)                 | The components, the theme helpers, and the AI admin components on a separate subpath.  |
| [`@artisanpack-ui/react-laravel`](./packages/react-laravel) | Helpers for Laravel apps built with Inertia: links, menus, pagination, forms and auth. |

## Quick start

```bash
npm install @artisanpack-ui/react @artisanpack-ui/css
```

Load the CSS once, in your app's entry (or your Tailwind stylesheet; see [Getting Started](https://docs.artisanpackui.dev/documentation/react/getting-started)), and render `ThemeScript` first in `<head>`:

```tsx
import '@artisanpack-ui/css';
import { Button, Form, Input, ThemeScript } from '@artisanpack-ui/react';

<head>
  <ThemeScript />
</head>;

export function SignIn() {
  return (
    <Form aria-label="Sign in" actions={<Button type="submit">Sign in</Button>}>
      <Input label="Email" type="email" name="email" />
    </Form>
  );
}
```

React 18 and 19 are supported. The packages ship ES modules marked `'use client'`, so Next.js Server Components can render them.

## Documentation

- [Getting Started](https://docs.artisanpackui.dev/documentation/react/getting-started)
- [Components](https://docs.artisanpackui.dev/documentation/react/components)
- [Theming](https://docs.artisanpackui.dev/documentation/react/theming)
- [Laravel and Inertia](https://docs.artisanpackui.dev/documentation/react/laravel-inertia)
- [AI Components](https://docs.artisanpackui.dev/documentation/react/ai-components)
- [Server Rendering](https://docs.artisanpackui.dev/documentation/react/server-rendering)
- [Upgrading from 1.x](https://docs.artisanpackui.dev/documentation/react/upgrading)

## Development

The design-system packages (`@artisanpack-ui/behavior`, `@artisanpack-ui/css` and the test kit) install from npm:

```bash
git clone https://github.com/ArtisanPack-UI/react.git
cd react
npm ci
npm run build
npm test
npm run storybook   # http://localhost:6006
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full development guide.

## License

[MIT](./LICENSE) — Jacob Martella
