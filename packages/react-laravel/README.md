# @artisanpack-ui/react-laravel

[![CI](https://github.com/ArtisanPack-UI/react/actions/workflows/ci.yml/badge.svg)](https://github.com/ArtisanPack-UI/react/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@artisanpack-ui/react-laravel)](https://www.npmjs.com/package/@artisanpack-ui/react-laravel)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/ArtisanPack-UI/react/blob/main/LICENSE)

[Inertia.js](https://inertiajs.com/) adapter wrappers for [ArtisanPack UI React](https://www.npmjs.com/package/@artisanpack-ui/react) components. Provides navigation, forms, auth pages, toast integration, and layout helpers for [Laravel](https://laravel.com/) applications.

## Installation

```bash
npm install @artisanpack-ui/react-laravel @artisanpack-ui/react @artisanpack-ui/tokens
```

### Peer Dependencies

```bash
npm install react react-dom @inertiajs/react
```

## Setup

Import the tokens CSS in your Tailwind entry file:

```css
@import "tailwindcss";
@import "@artisanpack-ui/tokens/css";
```

## Usage

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

### Tree-Shakeable Imports

```tsx
import { InertiaLink, InertiaNavbar } from '@artisanpack-ui/react-laravel/navigation';
import { useInertiaForm } from '@artisanpack-ui/react-laravel/form';
import { AppLayout, createLayout } from '@artisanpack-ui/react-laravel/layout';
import { LoginPage, RegisterPage } from '@artisanpack-ui/react-laravel/auth';
import { InertiaToastProvider } from '@artisanpack-ui/react-laravel/feedback';
```

## Features

- **Navigation** - Inertia-aware Link and Navbar components with active state detection
- **Forms** - `useInertiaForm` hook bridging Inertia's form helper with ArtisanPack UI inputs
- **Layouts** - Persistent layouts with `createLayout` and pre-built `AppLayout`
- **Auth** - Ready-made Login, Register, and password reset pages
- **Feedback** - Toast provider that captures Inertia flash messages

## Inertia.js Compatibility

Supports Inertia.js v2 and v3.

## React Compatibility

Supports both React 18 and React 19.

## Documentation

- [Laravel / Inertia Integration](https://github.com/ArtisanPack-UI/react/wiki/Laravel-Inertia-Integration)
- [Getting Started](https://github.com/ArtisanPack-UI/react/wiki/Getting-Started)

## Part of ArtisanPack UI

| Package | Description |
|---------|-------------|
| [`@artisanpack-ui/tokens`](https://www.npmjs.com/package/@artisanpack-ui/tokens) | Design tokens, color resolver, glass helpers |
| [`@artisanpack-ui/react`](https://www.npmjs.com/package/@artisanpack-ui/react) | 56+ React UI components |
| [`@artisanpack-ui/react-laravel`](https://www.npmjs.com/package/@artisanpack-ui/react-laravel) | Inertia.js adapter wrappers |

## License

[MIT](https://github.com/ArtisanPack-UI/react/blob/main/LICENSE) - Jacob Martella
