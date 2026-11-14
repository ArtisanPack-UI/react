---
title: Laravel and Inertia
menu_order: 6
---

# Laravel and Inertia

`@artisanpack-ui/react-laravel` connects the components to a Laravel app built with [Inertia](https://inertiajs.com/): navigation through Inertia's router, form helpers on Inertia's `useForm`, the signed-in user from shared props, and Laravel's flash messages.

## Install

```bash
npm install @artisanpack-ui/react @artisanpack-ui/css @artisanpack-ui/react-laravel @inertiajs/react
```

It supports `@inertiajs/react` 2 and 3, and React 18 and 19.

## Set up

1. Load the CSS once, in your Inertia entry (usually `resources/js/app.tsx`) or your Tailwind stylesheet, as in [Getting Started](Getting-Started).
2. Apply the theme before the first paint. In an Inertia app the `<head>` is your Blade root view, where a React component can't render. Put the script there: if the app also uses Livewire UI Components, the `@apuiThemeScript` directive outputs the same script as `ThemeScript`; otherwise inline the output of `themeScript()` from `@artisanpack-ui/behavior`. See [Themes](https://docs.artisanpackui.dev/documentation/design-system/theming/themes).

Everything is exported from the package root, and from the subpaths `/navigation`, `/form`, `/layout`, `/auth` and `/feedback`.

## Navigation

These wrap the design system components and navigate with Inertia instead of a full page load.

**InertiaMenu** is a [Menu](https://docs.artisanpackui.dev/documentation/design-system/components/menu) whose items take an `href`. Pass the current page's `key` as `activeKey` to mark it with `aria-current="page"`; a sub-menu that holds it opens.

```tsx
import { InertiaMenu } from '@artisanpack-ui/react-laravel';

<InertiaMenu
  label="Main"
  activeKey="users"
  items={[
    { key: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: 'house' },
    { key: 'users', label: 'Users', href: '/users' },
    {
      key: 'settings',
      label: 'Settings',
      children: [{ key: 'profile', label: 'Profile', href: '/settings/profile' }],
    },
  ]}
/>;
```

**InertiaBreadcrumbs** is a [Breadcrumbs](https://docs.artisanpackui.dev/documentation/design-system/components/breadcrumbs) whose items take an `href`:

```tsx
<InertiaBreadcrumbs
  items={[{ label: 'Home', href: '/' }, { label: 'Users', href: '/users' }, { label: 'Jane Doe' }]}
/>
```

**InertiaPagination** is a [Pagination](https://docs.artisanpackui.dev/documentation/design-system/components/pagination) driven by a Laravel paginator (`->paginate()`). It visits the new page with `router.get()`, keeping scroll position and component state by default.

```tsx
<InertiaPagination paginator={users} only={['users']} preserveParams={{ search }} />
```

| Prop                              | Default  | What it does                                                    |
| --------------------------------- | -------- | --------------------------------------------------------------- |
| `paginator`                       |          | The paginator: `current_page`, `last_page` and `path` are read. |
| `pageParam`                       | `'page'` | The query parameter for the page.                               |
| `preserveParams`                  |          | Other query parameters to keep on the URL.                      |
| `preserveScroll`, `preserveState` | `true`   | Passed to the Inertia visit.                                    |
| `only`                            |          | A partial reload of these props.                                |
| `onChange`                        |          | Handle the page change yourself instead of visiting.            |

**InertiaLink** wraps Inertia's `Link` and takes all of its props (`method`, `preserveScroll`, `only`, …). Use it as a plain link. Its `asButton`, `color`, `size` and `loading` props output 1.x DaisyUI class names, which `@artisanpack-ui/css` doesn't style.

## Forms

`useInertiaForm` wraps Inertia's `useForm` and adds helpers that return props for the form components:

```tsx
import { useInertiaForm } from '@artisanpack-ui/react-laravel';
import { Button, Checkbox, Form, Input, ValidationSummary } from '@artisanpack-ui/react';

export default function CreateUser() {
  const { form, field, checkbox, post } = useInertiaForm({ name: '', email: '', active: true });

  return (
    <Form
      aria-label="Create user"
      onSubmit={(event) => {
        event.preventDefault();
        post('/users');
      }}
      actions={
        <Button type="submit" color="primary" loading={form.processing}>
          Create user
        </Button>
      }
    >
      <ValidationSummary errors={form.errors} />
      <Input label="Name" {...field('name')} />
      <Input label="Email" type="email" {...field('email')} />
      <Checkbox label="Active" {...checkbox('active')} />
    </Form>
  );
}
```

| Returns                           | What it is                                                                                  |
| --------------------------------- | ------------------------------------------------------------------------------------------- |
| `form`                            | Inertia's form object: `data`, `errors`, `processing`, `setData` and the rest.              |
| `field(name)`                     | `name`, `value`, `error` and a native `onChange`, for Input, Password, Textarea and Select. |
| `checkbox(name)`                  | `name`, `checked`, `error` and a native `onChange`, for Checkbox and Toggle.                |
| `post`, `put`, `patch`, `destroy` | Submit to a URL, with Inertia's visit options.                                              |

`useInertiaForm('key', data)` takes a remember key first, like `useForm`.

`field()` stores `event.target.value` as it is, so a numeric field (a `Select` of ids, a number `Input`) ends up holding a string even when your form type says `number`. For those fields, bind `onValueChange` and convert the value yourself, as in the DatePicker example below, or convert on submit.

The `error` from a helper is Laravel's validation message for that field, so it shows under the field after a failed submit. `ValidationSummary` takes the same `form.errors` map and links each message to the field with that `name`.

For components without a native `onChange` to bind, such as Combobox, DatePicker or Range, set the value yourself:

```tsx
<DatePicker
  label="Starts on"
  value={form.data.starts_on}
  onValueChange={(value) => form.setData('starts_on', value as string)}
  error={form.errors.starts_on}
/>
```

**InertiaForm** renders a plain `<form>` that submits `form` to a `url` with a `method` (default `post`), and provides the form to its children through `useFormContext()`. `FormContextProvider` provides a form without the `<form>` element. Use the design system [Form](https://docs.artisanpackui.dev/documentation/design-system/components/form), as above, when you want its field spacing and actions row.

## Layouts

`createLayout(Layout, props?)` turns a layout component into an Inertia persistent layout. `AppLayout` is a minimal one: it sets the page title with Inertia's `Head` and renders `header`, a `<main>` with your page, and `footer`.

```tsx
import { AppLayout, createLayout } from '@artisanpack-ui/react-laravel';

function Dashboard() {
  return <h1>Dashboard</h1>;
}

Dashboard.layout = createLayout(AppLayout, { title: 'Dashboard' });
```

For an application frame with a sidebar and a top bar, use [AppShell](https://docs.artisanpackui.dev/documentation/design-system/components/app-shell) in your own layout component.

## Auth

`useAuth()` reads `auth.user` from Inertia's shared props and returns `{ user, isAuthenticated, auth }`. `AuthGuard` renders its children only for a signed-in user, or only for a guest with `guest`, and `fallback` otherwise.

```tsx
function AccountMenu() {
  const { user } = useAuth();

  if (!user) return null;

  return <UserMenu user={{ name: user.name, email: user.email }} />;
}

<AuthGuard fallback={<InertiaLink href="/login">Log in</InertiaLink>}>
  <AccountMenu />
</AuthGuard>;
```

Read the user inside a child component, as above. `useAuth()` returns a `null` user for a guest, and the parent builds `AuthGuard`'s children before the guard decides what to render, so `user.name` in the parent would throw for guests.

Share the user from Laravel's `HandleInertiaRequests` middleware as `auth.user`.

## Flash messages

`InertiaToastProvider` (and the `useFlashMessages` hook under it) shows Laravel's `success`, `error`, `warning` and `info` flash messages as toasts, once per visit. Both are built on the deprecated 1.x `ToastProvider`, whose toasts use DaisyUI class names that `@artisanpack-ui/css` doesn't style. They're being rebuilt on the design system's Toaster for 2.0.

Until then, with the design system's [Toast](https://docs.artisanpackui.dev/documentation/design-system/components/toast), a small component in your layout does the same:

```tsx
import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { Toaster, toast } from '@artisanpack-ui/react';
import type { FlashMessages, SharedPageProps } from '@artisanpack-ui/react-laravel';

const TYPES = ['success', 'error', 'warning', 'info'] as const;

export function FlashToasts() {
  const flash = usePage<SharedPageProps>().props.flash;
  const shown = useRef<FlashMessages | undefined>(undefined);

  useEffect(() => {
    // Each visit brings a new flash object. Remembering the last one we showed means
    // a re-render, or Strict Mode running the effect twice, doesn't toast it again.
    if (!flash || shown.current === flash) return;
    shown.current = flash;

    for (const type of TYPES) {
      const message = flash[type];
      if (message) toast.create({ title: message, color: type });
    }
  }, [flash]);

  return <Toaster />;
}
```

Share the messages from `HandleInertiaRequests` as `flash`.

## Types

| Type                                   | Shape                                                                                       |
| -------------------------------------- | ------------------------------------------------------------------------------------------- |
| `SharedPageProps`                      | `auth`, `flash` and `errors`. Extend it with module augmentation for your own shared props. |
| `AuthProps`, `AuthUser`                | `{ user }`, and a user with `id`, `name` and `email`.                                       |
| `FlashMessages`                        | `success`, `error`, `warning` and `info`.                                                   |
| `LaravelPaginator<T>`, `PaginatorLink` | The JSON of a `->paginate()` result.                                                        |

```ts
declare module '@artisanpack-ui/react-laravel' {
  interface SharedPageProps {
    locale: string;
  }
}
```

Each component's props type is exported too (`InertiaMenuProps`, `InertiaFormHelpers`, …).
