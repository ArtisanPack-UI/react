# Laravel / Inertia Integration

The `@artisanpack-ui/react-laravel` package provides Inertia.js adapter wrappers that connect ArtisanPack UI React components to your Laravel backend.

## Installation

```bash
npm install @artisanpack-ui/react-laravel @artisanpack-ui/react @artisanpack-ui/tokens @inertiajs/react
```

## App Layout

Use `AppLayout` and `createLayout` to set up a persistent layout for your Inertia pages:

```tsx
// layouts/AppLayout.tsx
import { AppLayout } from '@artisanpack-ui/react-laravel';
import { Navbar, Sidebar } from '@artisanpack-ui/react';

export default function Layout({ children }) {
  return (
    <AppLayout
      navbar={<Navbar brand="My App" />}
      sidebar={<Sidebar items={[...]} />}
    >
      {children}
    </AppLayout>
  );
}
```

Apply the layout to a page using `createLayout`:

```tsx
import { createLayout } from '@artisanpack-ui/react-laravel';
import Layout from '../layouts/AppLayout';

function DashboardPage({ stats }) {
  return <div>...</div>;
}

DashboardPage.layout = createLayout(Layout);
export default DashboardPage;
```

## Forms with useInertiaForm

The `useInertiaForm` hook wraps Inertia's `useForm` and returns field-binding helpers that plug directly into ArtisanPack UI form components:

```tsx
import { useInertiaForm } from '@artisanpack-ui/react-laravel';
import { Input, Button, Select } from '@artisanpack-ui/react';

function CreateUserPage() {
  const { form, field, checkbox } = useInertiaForm({
    name: '',
    email: '',
    role: 'user',
    active: true,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    form.post('/users');
  };

  return (
    <form onSubmit={submit}>
      <Input label="Name" {...field('name')} />
      <Input label="Email" type="email" {...field('email')} />
      <Select label="Role" options={roles} {...field('role')} />
      <Checkbox label="Active" {...checkbox('active')} />
      <Button color="primary" loading={form.processing}>
        Create User
      </Button>
    </form>
  );
}
```

### Field Helpers

| Helper | Returns | Use with |
|--------|---------|----------|
| `field(name)` | `{ value, onChange, onBlur, error }` | Input, Select, Textarea, etc. |
| `checkbox(name)` | `{ checked, onChange, error }` | Checkbox, Toggle |

### Form Methods

| Method | Description |
|--------|-------------|
| `form.post(url, options?)` | Submit as POST |
| `form.put(url, options?)` | Submit as PUT |
| `form.patch(url, options?)` | Submit as PATCH |
| `form.destroy(url, options?)` | Submit as DELETE |

## InertiaForm Component

Alternatively, use the declarative `InertiaForm` component:

```tsx
import { InertiaForm } from '@artisanpack-ui/react-laravel';
import { Input, Button } from '@artisanpack-ui/react';

function LoginPage() {
  return (
    <InertiaForm
      initialValues={{ email: '', password: '' }}
      action="/login"
      method="post"
    >
      {({ field, form }) => (
        <>
          <Input label="Email" {...field('email')} />
          <Input label="Password" type="password" {...field('password')} />
          <Button color="primary" loading={form.processing}>Log In</Button>
        </>
      )}
    </InertiaForm>
  );
}
```

## Navigation

### InertiaLink

A styled link component that uses Inertia's client-side router:

```tsx
import { InertiaLink } from '@artisanpack-ui/react-laravel';

<InertiaLink href="/dashboard" className="text-primary">
  Dashboard
</InertiaLink>
```

### InertiaMenu

A menu with Inertia-powered navigation items:

```tsx
import { InertiaMenu } from '@artisanpack-ui/react-laravel';

<InertiaMenu
  items={[
    { label: 'Dashboard', href: '/dashboard', icon: '...' },
    { label: 'Users', href: '/users' },
    { label: 'Settings', href: '/settings' },
  ]}
/>
```

### InertiaBreadcrumbs

```tsx
import { InertiaBreadcrumbs } from '@artisanpack-ui/react-laravel';

<InertiaBreadcrumbs
  items={[
    { label: 'Home', href: '/' },
    { label: 'Users', href: '/users' },
    { label: 'Edit User' },
  ]}
/>
```

### InertiaPagination

Renders pagination controls from a Laravel paginator response:

```tsx
import { InertiaPagination } from '@artisanpack-ui/react-laravel';

// In your Inertia page component
function UsersPage({ users }) {
  return (
    <>
      <Table headers={headers} rows={users.data} />
      <InertiaPagination paginator={users} />
    </>
  );
}
```

## Authentication

### useAuth Hook

Access the authenticated user from Inertia's shared data:

```tsx
import { useAuth } from '@artisanpack-ui/react-laravel';

function ProfileButton() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;
  return <span>Hello, {user.name}</span>;
}
```

### AuthGuard

Protect components that require authentication:

```tsx
import { AuthGuard } from '@artisanpack-ui/react-laravel';

<AuthGuard fallback={<p>Please log in.</p>}>
  <AdminPanel />
</AuthGuard>
```

## Flash Messages / Toast

### InertiaToastProvider

Wraps `ToastProvider` and automatically converts Laravel flash messages into toast notifications:

```tsx
import { InertiaToastProvider } from '@artisanpack-ui/react-laravel';
import { ThemeProvider } from '@artisanpack-ui/react';

function App({ children }) {
  return (
    <ThemeProvider>
      <InertiaToastProvider>
        {children}
      </InertiaToastProvider>
    </ThemeProvider>
  );
}
```

On the Laravel side, flash messages are passed automatically:

```php
return redirect()->back()->with('success', 'User created successfully.');
```

### useFlashMessages

Access raw flash messages if you need custom handling:

```tsx
import { useFlashMessages } from '@artisanpack-ui/react-laravel';

function MyComponent() {
  const flash = useFlashMessages();

  if (flash.success) {
    // ...
  }
}
```

## Shared Types

The package exports useful TypeScript types for Laravel data structures:

```tsx
import type {
  SharedPageProps,   // Inertia shared page props (auth, flash, errors)
  AuthUser,          // Authenticated user object
  AuthProps,         // Auth data wrapper
  FlashMessages,     // Flash message shape
  LaravelPaginator,  // Paginator response shape
  PaginatorLink,     // Pagination link item
} from '@artisanpack-ui/react-laravel';
```
