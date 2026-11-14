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

**InertiaLink** wraps Inertia's `Link` and takes all of its props (`method`, `preserveScroll`, `only`, …). On its own it's a plain link. With `asButton` it renders the design system's [Button](https://docs.artisanpackui.dev/documentation/design-system/components/button) markup on the link, so it looks like a Button but still makes an Inertia visit:

```tsx
<InertiaLink href="/users/create" asButton color="primary" icon={<Icon name="plus" />}>
  New user
</InertiaLink>
<InertiaLink href="/settings" asButton variant="outline" color="neutral" loading={isNavigating}>
  Settings
</InertiaLink>
```

| Prop                | Default     | What it does                                                                                                                   |
| ------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `asButton`          | `false`     | Styles the link as a Button.                                                                                                   |
| `color`             | `'primary'` | The Button color, with `asButton`. The 1.x `ghost` and `outline` still work: a neutral ghost or outline button.                |
| `variant`           | `'solid'`   | The Button treatment, with `asButton`. Overrides the variant `ghost` or `outline` imply.                                       |
| `size`              | `'md'`      | The Button height, with `asButton`.                                                                                            |
| `icon`, `iconRight` |             | Icons before and after the label.                                                                                              |
| `loading`           | `false`     | Shows a spinner, sets `aria-busy` and `aria-disabled`, and ignores clicks. On a plain link the spinner takes the icon's place. |

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

| Returns                           | What it is                                                                                                                    |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `form`                            | Inertia's form object: `data`, `errors`, `processing`, `setData` and the rest.                                                |
| `field(name)`                     | `name`, `value`, `error` and a native `onChange` (plus `onBlur` with Precognition), for Input, Password, Textarea and Select. |
| `checkbox(name)`                  | `name`, `checked`, `error` and a native `onChange`, for Checkbox and Toggle.                                                  |
| `post`, `put`, `patch`, `destroy` | Submit to a URL, with Inertia's visit options.                                                                                |

`useInertiaForm('key', data)` takes a remember key first, like `useForm`.

`field()` keeps a number field a number: when the field's current value is a number, its `onChange` converts the control's text. An empty control stores `''`, so the field can be cleared, and text that isn't a number is stored as typed. The conversion follows the current value, so a field that starts as `''` or `null`, or has just been cleared, stores strings. Give number fields a numeric starting value, or convert on submit.

Once the form uses [Laravel Precognition](https://laravel.com/docs/precognition) (`form.withPrecognition(method, url)`), `field()` also returns an `onBlur` that validates the field on the server with `form.validate(name)`. Without Precognition there's no `onBlur`.

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

`InertiaToastProvider` renders its children and a design-system [Toaster](https://docs.artisanpackui.dev/documentation/design-system/components/toast), and shows Laravel's `success`, `error`, `warning` and `info` flash messages in it as toasts, each in the toast color of the same name. Put it in your layout:

```tsx
import { InertiaToastProvider } from '@artisanpack-ui/react-laravel';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <InertiaToastProvider placement="top-end" duration={5000}>
      <main>{children}</main>
    </InertiaToastProvider>
  );
}
```

```php
return redirect()->route('dashboard')->with('success', 'Profile updated.');
```

It takes the `Toaster`'s props (`placement`, `duration`, `max`, `toaster`, …). Toasts you create with `toast.create()` show in the same region. The 1.x `position` classes and `defaultDuration` still work, but they're deprecated: use `placement` and `duration`.

Each message shows once per Inertia visit. A re-render with the same messages, React Strict Mode running effects twice, or a remount doesn't repeat it; the same message after another visit shows again.

Without the provider, call `useFlashMessages()` in a component and render a `Toaster` yourself:

```tsx
import { Toaster } from '@artisanpack-ui/react';
import { useFlashMessages } from '@artisanpack-ui/react-laravel';

export function FlashToasts() {
  useFlashMessages({ duration: 5000 });
  return <Toaster />;
}
```

`useFlashMessages` takes `duration` and a `toaster` from `createToaster()`, for apps that keep flash toasts in their own region. `FLASH_TYPES` lists the four keys it reads.

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
