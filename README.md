# ArtisanPack UI React

[![CI](https://github.com/ArtisanPack-UI/react/actions/workflows/ci.yml/badge.svg)](https://github.com/ArtisanPack-UI/react/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

A comprehensive React UI component ecosystem for building modern web applications. Includes 56+ components styled with [DaisyUI](https://daisyui.com/) and [Tailwind CSS](https://tailwindcss.com/), a shared design tokens package, and first-class [Laravel](https://laravel.com/) / [Inertia.js](https://inertiajs.com/) integration.

## Packages

| Package | Description |
|---------|-------------|
| [`@artisanpack-ui/tokens`](./packages/tokens) | Design tokens — colors, spacing, typography, shadows, animations, glass morphism presets |
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
- **Layout** — Card, Modal, Tabs, Accordion, Drawer, Dropdown, Grid, Stack, Popover
- **Navigation** — Menu, Breadcrumbs, Pagination, Steps, Navbar, Sidebar, SpotlightSearch
- **Data Display** — Table, Chart, Calendar, Avatar, Badge, Progress, Stat, Timeline, Carousel, Code, Diff
- **Feedback** — Alert, Toast, Loading, Skeleton, EmptyState, ErrorDisplay
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

- [Getting Started](https://github.com/ArtisanPack-UI/react/wiki/Getting-Started)
- [Component API Reference](https://github.com/ArtisanPack-UI/react/wiki/Component-API-Reference)
- [Design Tokens Guide](https://github.com/ArtisanPack-UI/react/wiki/Design-Tokens)
- [Theming Guide](https://github.com/ArtisanPack-UI/react/wiki/Theming)
- [Laravel / Inertia Integration](https://github.com/ArtisanPack-UI/react/wiki/Laravel-Inertia-Integration)
- [Migration from Livewire](https://github.com/ArtisanPack-UI/react/wiki/Migration-from-Livewire)
- [React 18 vs 19 Compatibility](https://github.com/ArtisanPack-UI/react/wiki/React-18-vs-19-Compatibility)
- [Releasing](https://github.com/ArtisanPack-UI/react/wiki/Releasing)

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
