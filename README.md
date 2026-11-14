# ArtisanPack UI React

[![CI](https://github.com/ArtisanPack-UI/react/actions/workflows/ci.yml/badge.svg)](https://github.com/ArtisanPack-UI/react/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

A comprehensive React UI component ecosystem for building modern web applications. Includes 56+ components styled with [DaisyUI](https://daisyui.com/) and [Tailwind CSS](https://tailwindcss.com/), the shared [`@artisanpack-ui/tokens`](https://github.com/ArtisanPack-UI/design-system/tree/main/packages/tokens) package (now in the design-system repo), and first-class [Laravel](https://laravel.com/) / [Inertia.js](https://inertiajs.com/) integration.

## Packages

| Package | Description |
|---------|-------------|
| [`@artisanpack-ui/react`](./packages/react) | 56+ React UI components (form, layout, navigation, data display, feedback, utility) |
| [`@artisanpack-ui/react-laravel`](./packages/react-laravel) | Inertia.js adapter wrappers for navigation, forms, auth, and toast integration |

## Quick Start

### Install

```bash
# Core components
npm install @artisanpack-ui/react @artisanpack-ui/tokens

# With Laravel/Inertia support
npm install @artisanpack-ui/react-laravel
```

### Peer Dependencies

```bash
npm install react react-dom tailwindcss daisyui
```

`@artisanpack-ui/react-laravel` also requires `@inertiajs/react`.

### Set Up Tailwind CSS

Import the tokens CSS in your Tailwind entry file:

```css
@import "tailwindcss";
@import "@artisanpack-ui/tokens/css";
```

### Load the Design-System CSS

The design-system components (Button, Input, Select, Checkbox, Card, Dialog, DropdownMenu, Toast and Toaster) are styled by `@artisanpack-ui/css`. Install it and load it once, in your app's entry:

```bash
npm install @artisanpack-ui/css
```

```tsx
import '@artisanpack-ui/css';
```

With Tailwind, import it from your Tailwind entry file instead, between Tailwind's base and components layers, so Preflight never overrides a component and Tailwind utilities still win:

```css
@layer theme, base, apui, components, utilities;
@import "tailwindcss";
@import "@artisanpack-ui/css";
@import "@artisanpack-ui/tokens/css";
```

### Use Components

```tsx
import { Button, Input, Card } from '@artisanpack-ui/react';
import { ThemeProvider } from '@artisanpack-ui/react';

function App() {
  return (
    <ThemeProvider>
      <Card>
        <Input label="Email" type="email" />
        <Button color="primary">Submit</Button>
      </Card>
    </ThemeProvider>
  );
}
```

### Laravel / Inertia Usage

```tsx
import { useInertiaForm, AppLayout, createLayout } from '@artisanpack-ui/react-laravel';
import { Input, Button } from '@artisanpack-ui/react';

function LoginPage() {
  const { form, field } = useInertiaForm({ email: '', password: '' });

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.post('/login'); }}>
      <Input label="Email" {...field('email')} />
      <Input label="Password" type="password" {...field('password')} />
      <Button color="primary" loading={form.processing}>Log In</Button>
    </form>
  );
}

LoginPage.layout = createLayout(AppLayout);
```

## Component Categories

- **Form** — Button, Input, Select, Checkbox, Toggle, DatePicker, ColorPicker, RichTextEditor, and more
- **Layout** — Card, Dialog, DropdownMenu, Tabs, Accordion, Drawer, Grid, Stack, Popover
- **Navigation** — Menu, Breadcrumbs, Pagination, Steps, Navbar, Sidebar, SpotlightSearch
- **Data Display** — Table, Chart, Calendar, Avatar, Badge, Progress, Stat, Timeline, Carousel, Code, Diff
- **Feedback** — Alert, Toast and Toaster, Loading, Skeleton, EmptyState, ErrorDisplay
- **Utility** — Icon, ThemeToggle, Tooltip, Clipboard, Markdown

## Theming

All components support DaisyUI's 31 built-in themes plus custom themes. Wrap your app with `ThemeProvider` to enable dark/light/system mode:

```tsx
import { ThemeProvider, ThemeToggle } from '@artisanpack-ui/react';

<ThemeProvider defaultColorScheme="system">
  <ThemeToggle />
  {/* your app */}
</ThemeProvider>
```

## React Compatibility

All packages support both React 18 and React 19.

## Documentation

- [Documentation home](https://docs.artisanpackui.dev/documentation/react/home)
- [Getting Started](https://docs.artisanpackui.dev/documentation/react/getting-started)
- [Components](https://docs.artisanpackui.dev/documentation/react/components)
- [Theming](https://docs.artisanpackui.dev/documentation/react/theming)
- [Laravel and Inertia](https://docs.artisanpackui.dev/documentation/react/laravel-inertia)
- [React 18 and 19](https://docs.artisanpackui.dev/documentation/react/react-versions)
- [Upgrading from 1.x](https://docs.artisanpackui.dev/documentation/react/upgrading)
- [Design system documentation](https://docs.artisanpackui.dev/documentation/design-system/home)
- [Releasing](./RELEASING.md)

## Development

```bash
git clone https://github.com/ArtisanPack-UI/react.git
cd react
npm install
npm run build
npm run storybook   # View components at http://localhost:6006
npm test            # Run test suites
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full development guide.

## License

[MIT](./LICENSE) — Jacob Martella
