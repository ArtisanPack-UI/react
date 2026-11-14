# @artisanpack-ui/react-laravel

[![CI](https://github.com/ArtisanPack-UI/react/actions/workflows/ci.yml/badge.svg)](https://github.com/ArtisanPack-UI/react/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@artisanpack-ui/react-laravel)](https://www.npmjs.com/package/@artisanpack-ui/react-laravel)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/ArtisanPack-UI/react/blob/main/LICENSE)

Connects [`@artisanpack-ui/react`](https://www.npmjs.com/package/@artisanpack-ui/react) to a [Laravel](https://laravel.com/) app built with [Inertia](https://inertiajs.com/): navigation through Inertia's router, form helpers on Inertia's `useForm`, the signed-in user from shared props, and Laravel's flash messages as toasts.

## Install

```bash
npm install @artisanpack-ui/react @artisanpack-ui/css @artisanpack-ui/react-laravel @inertiajs/react
```

It supports `@inertiajs/react` 2 and 3, and React 18 and 19. Load `@artisanpack-ui/css` as in the [Getting Started](https://docs.artisanpackui.dev/documentation/react/getting-started) guide.

## What's in it

| Export                                                                  | What it does                                                                                      |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `InertiaMenu`, `InertiaBreadcrumbs`, `InertiaPagination`, `InertiaLink` | Menu, Breadcrumbs and Pagination that visit with Inertia, and Inertia's Link with Button styling. |
| `useInertiaForm`, `InertiaForm`, `useFormContext`                       | Props for the form components from Inertia's form state.                                          |
| `AppLayout`, `createLayout`                                             | Persistent layouts.                                                                               |
| `useAuth`, `AuthGuard`                                                  | The signed-in user from shared props.                                                             |
| `InertiaToastProvider`, `useFlashMessages`                              | Laravel's flash messages as design-system toasts, once per visit.                                 |

```tsx
import { InertiaToastProvider, useInertiaForm } from '@artisanpack-ui/react-laravel';
import { Button, Form, Input } from '@artisanpack-ui/react';

// In your layout: shows redirect()->with('success', '…') and the rest as toasts.
export function Layout({ children }: { children: React.ReactNode }) {
  return <InertiaToastProvider>{children}</InertiaToastProvider>;
}

export default function CreateUser() {
  const { form, field, post } = useInertiaForm({ name: '', email: '' });

  return (
    <Form
      aria-label="Create user"
      onSubmit={(event) => {
        event.preventDefault();
        post('/users');
      }}
      actions={
        <Button type="submit" loading={form.processing}>
          Create user
        </Button>
      }
    >
      <Input label="Name" {...field('name')} />
      <Input label="Email" type="email" {...field('email')} />
    </Form>
  );
}
```

Everything is exported from the package root, and from the subpaths `/navigation`, `/form`, `/layout`, `/auth` and `/feedback`.

## Documentation

[Laravel and Inertia](https://docs.artisanpackui.dev/documentation/react/laravel-inertia) covers every helper, its props and the shared-props types.

## License

[MIT](https://github.com/ArtisanPack-UI/react/blob/main/LICENSE) — Jacob Martella
