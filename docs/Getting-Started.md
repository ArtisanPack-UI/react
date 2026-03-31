# Getting Started

This guide walks you through installing the ArtisanPack UI React packages and rendering your first component.

## Prerequisites

- **Node.js** 18+
- **React** 18 or 19
- **Tailwind CSS** v4
- **DaisyUI** v5

## Installation

Install the core packages:

```bash
npm install @artisanpack-ui/react @artisanpack-ui/tokens
```

If you are building a Laravel / Inertia.js application, also install:

```bash
npm install @artisanpack-ui/react-laravel
```

### Peer Dependencies

Make sure you have the required peer dependencies:

```bash
npm install react react-dom tailwindcss daisyui
```

For Laravel integration:

```bash
npm install @inertiajs/react
```

For chart components (optional):

```bash
npm install apexcharts react-apexcharts
```

## Tailwind CSS Setup

Import the tokens CSS in your Tailwind entry file (e.g. `app.css`):

```css
@import "tailwindcss";
@import "@artisanpack-ui/tokens/css";
```

This registers design token CSS custom properties that components rely on.

## Basic Usage

Wrap your application with `ThemeProvider`, then use any component:

```tsx
import { ThemeProvider, Button, Input, Card } from '@artisanpack-ui/react';

function App() {
  return (
    <ThemeProvider>
      <Card>
        <Card.Header>
          <h2>Welcome</h2>
        </Card.Header>
        <Input label="Your name" placeholder="Enter your name" />
        <Button color="primary">Get Started</Button>
      </Card>
    </ThemeProvider>
  );
}
```

## Tree-Shakeable Imports

You can import from category entry points to keep bundles small:

```tsx
// Import only form components
import { Button, Input } from '@artisanpack-ui/react/form';

// Import only layout components
import { Card, Modal } from '@artisanpack-ui/react/layout';

// Import only navigation components
import { Menu, Breadcrumbs } from '@artisanpack-ui/react/navigation';

// Import data display components
import { Table, Badge } from '@artisanpack-ui/react/data';

// Import feedback components
import { Alert, Toast } from '@artisanpack-ui/react/feedback';

// Import utility components
import { Icon, Tooltip } from '@artisanpack-ui/react/utility';
```

## TypeScript

All packages ship with TypeScript declarations. Props types are exported alongside components:

```tsx
import { Button, type ButtonProps } from '@artisanpack-ui/react';
```

## Next Steps

- [[Component API Reference]] — Full props documentation for every component
- [[Design Tokens]] — Colors, spacing, typography, and more
- [[Theming]] — Dark mode, DaisyUI themes, and customization
- [[Laravel Inertia Integration]] — Server-driven React with Inertia.js
