# @artisanpack-ui/react

[![CI](https://github.com/ArtisanPack-UI/react/actions/workflows/ci.yml/badge.svg)](https://github.com/ArtisanPack-UI/react/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@artisanpack-ui/react)](https://www.npmjs.com/package/@artisanpack-ui/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/ArtisanPack-UI/react/blob/main/LICENSE)

56+ React UI components for building modern web applications, styled with [DaisyUI](https://daisyui.com/) and [Tailwind CSS](https://tailwindcss.com/). Part of the [ArtisanPack UI](https://github.com/ArtisanPack-UI/react) ecosystem.

## Installation

```bash
npm install @artisanpack-ui/react @artisanpack-ui/tokens
```

### Peer Dependencies

```bash
npm install react react-dom
```

Optional peers for chart components:

```bash
npm install apexcharts react-apexcharts
```

## Setup

Import the tokens CSS in your Tailwind entry file:

```css
@import "tailwindcss";
@import "@artisanpack-ui/tokens/css";
```

### Design-System CSS

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

## Usage

```tsx
import { Button, Input, Card, ThemeProvider } from '@artisanpack-ui/react';

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

### Tree-Shakeable Imports

Import from specific categories to minimize bundle size:

```tsx
import { Button, Input, Select } from '@artisanpack-ui/react/form';
import { Card, Dialog, Tabs } from '@artisanpack-ui/react/layout';
import { Menu, Breadcrumbs } from '@artisanpack-ui/react/navigation';
import { Table, Badge, Avatar } from '@artisanpack-ui/react/data';
import { Alert, Toast, Loading } from '@artisanpack-ui/react/feedback';
import { Icon, ThemeToggle, Tooltip } from '@artisanpack-ui/react/utility';
```

## Component Categories

- **Form** - Button, Input, Select, Checkbox, Toggle, DatePicker, ColorPicker, RichTextEditor, and more
- **Layout** - Card, Dialog, DropdownMenu, Tabs, Accordion, Drawer, Grid, Stack, Popover
- **Navigation** - Menu, Breadcrumbs, Pagination, Steps, Navbar, Sidebar, SpotlightSearch
- **Data Display** - Table, Chart, Calendar, Avatar, Badge, Progress, Stat, KpiCard, Sparkline, Timeline, Carousel, Code, Diff
- **Feedback** - Alert, Toast and Toaster, Loading, Skeleton, EmptyState, ErrorDisplay
- **Utility** - Icon, ThemeToggle, Tooltip, Clipboard, Markdown

## Theming

All components support DaisyUI's 31 built-in themes plus custom themes:

```tsx
import { ThemeProvider, ThemeToggle } from '@artisanpack-ui/react';

<ThemeProvider defaultColorScheme="system">
  <ThemeToggle />
  {/* your app */}
</ThemeProvider>
```

## React Compatibility

Supports both React 18 and React 19.

## Documentation

- [Getting Started](https://github.com/ArtisanPack-UI/react/wiki/Getting-Started)
- [Component API Reference](https://github.com/ArtisanPack-UI/react/wiki/Component-API-Reference)
- [Theming Guide](https://github.com/ArtisanPack-UI/react/wiki/Theming)

## Part of ArtisanPack UI

| Package | Description |
|---------|-------------|
| [`@artisanpack-ui/tokens`](https://www.npmjs.com/package/@artisanpack-ui/tokens) | Design tokens, color resolver, glass helpers |
| [`@artisanpack-ui/react`](https://www.npmjs.com/package/@artisanpack-ui/react) | 56+ React UI components |
| [`@artisanpack-ui/react-laravel`](https://www.npmjs.com/package/@artisanpack-ui/react-laravel) | Inertia.js adapter wrappers |

## License

[MIT](https://github.com/ArtisanPack-UI/react/blob/main/LICENSE) - Jacob Martella
