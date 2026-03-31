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
import { Card, Modal, Tabs } from '@artisanpack-ui/react/layout';
import { Menu, Breadcrumbs } from '@artisanpack-ui/react/navigation';
import { Table, Badge, Avatar } from '@artisanpack-ui/react/data';
import { Alert, Toast, Loading } from '@artisanpack-ui/react/feedback';
import { Icon, ThemeToggle, Tooltip } from '@artisanpack-ui/react/utility';
```

## Component Categories

- **Form** - Button, Input, Select, Checkbox, Toggle, DatePicker, ColorPicker, RichTextEditor, and more
- **Layout** - Card, Modal, Tabs, Accordion, Drawer, Dropdown, Grid, Stack, Popover
- **Navigation** - Menu, Breadcrumbs, Pagination, Steps, Navbar, Sidebar, SpotlightSearch
- **Data Display** - Table, Chart, Calendar, Avatar, Badge, Progress, Stat, Timeline, Carousel, Code, Diff
- **Feedback** - Alert, Toast, Loading, Skeleton, EmptyState, ErrorDisplay
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
