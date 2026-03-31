# Migration from Livewire Components

This guide helps you migrate from the `artisanpack-ui/livewire-ui-components` Blade/Livewire package to the `@artisanpack-ui/react` React package.

## Overview

The React components mirror the Livewire components in naming, props, and behavior. The main differences are:

| Aspect | Livewire | React |
|--------|----------|-------|
| **Prefix** | `<x-artisanpack-*>` | `import { * } from '@artisanpack-ui/react'` |
| **Data binding** | `wire:model` | `value` + `onChange` (or `useInertiaForm`) |
| **Events** | `wire:click` | `onClick` |
| **Slots** | `<x-slot:header>` | `header` prop or children |
| **Styling** | Same DaisyUI classes | Same DaisyUI classes |
| **Server state** | Livewire manages state | Inertia.js + React state |

## Component Mapping

### Form Components

```blade
{{-- Livewire --}}
<x-artisanpack-button color="primary" wire:click="save">Save</x-artisanpack-button>

<x-artisanpack-input label="Name" wire:model="name" />

<x-artisanpack-select label="Role" wire:model="role" :options="$roles" />

<x-artisanpack-checkbox label="Active" wire:model="active" />
```

```tsx
// React
<Button color="primary" onClick={save}>Save</Button>

<Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />

<Select label="Role" value={role} onChange={(e) => setRole(e.target.value)} options={roles} />

<Checkbox label="Active" checked={active} onChange={(e) => setActive(e.target.checked)} />
```

With `useInertiaForm` (recommended for Laravel apps):

```tsx
const { form, field, checkbox } = useInertiaForm({ name: '', role: '', active: true });

<Input label="Name" {...field('name')} />
<Select label="Role" options={roles} {...field('role')} />
<Checkbox label="Active" {...checkbox('active')} />
```

### Layout Components

```blade
{{-- Livewire --}}
<x-artisanpack-card>
  <x-slot:header>Title</x-slot:header>
  Content
  <x-slot:footer>
    <x-artisanpack-button>Action</x-artisanpack-button>
  </x-slot:footer>
</x-artisanpack-card>

<x-artisanpack-modal wire:model="showModal" title="Confirm">
  Are you sure?
</x-artisanpack-modal>
```

```tsx
// React
<Card
  header={<h3>Title</h3>}
  footer={<Button>Action</Button>}
>
  Content
</Card>

<Modal open={showModal} onClose={() => setShowModal(false)} title="Confirm">
  Are you sure?
</Modal>
```

### Navigation Components

```blade
{{-- Livewire --}}
<x-artisanpack-breadcrumbs :items="$breadcrumbs" />

<x-artisanpack-pagination :paginator="$users" />
```

```tsx
// React (with Inertia adapters)
import { InertiaBreadcrumbs, InertiaPagination } from '@artisanpack-ui/react-laravel';

<InertiaBreadcrumbs items={breadcrumbs} />

<InertiaPagination paginator={users} />
```

### Feedback Components

```blade
{{-- Livewire --}}
<x-artisanpack-alert type="success">
  Operation completed.
</x-artisanpack-alert>
```

```tsx
// React
<Alert color="success">
  Operation completed.
</Alert>
```

### Data Display Components

```blade
{{-- Livewire --}}
<x-artisanpack-table :headers="$headers" :rows="$users">
  @scope('cell_name', $user)
    <strong>{{ $user->name }}</strong>
  @endscope
</x-artisanpack-table>
```

```tsx
// React
<Table
  headers={headers}
  rows={users}
  renderCell={{
    name: (user) => <strong>{user.name}</strong>,
  }}
/>
```

## Key Differences

### State Management

In Livewire, the server holds the component state. In React, you manage state client-side:

- Use `useState` for local component state
- Use `useInertiaForm` for form data that submits to Laravel
- Use Inertia's `usePage()` (imported from `@inertiajs/react`) for shared server data

### Reactive Updates

| Livewire | React |
|----------|-------|
| `wire:model.live` | `onChange` handler with state |
| `wire:model` (deferred) | Form submission via `useInertiaForm` |
| `$this->dispatch()` | Custom events or state lifting |
| `wire:loading` | `form.processing` from `useInertiaForm` |

### Server Communication

| Livewire | React + Inertia |
|----------|-----------------|
| Livewire AJAX calls | Inertia visits (`router.visit`, `form.post`) |
| `wire:click="method"` | `onClick` + Inertia form method |
| Flash messages via session | Flash messages via `useFlashMessages` |
| Full-page Livewire components | Inertia page components |

## Step-by-Step Migration

1. **Install the React packages** (see [[Getting Started]])
2. **Set up Inertia.js** in your Laravel application
3. **Create an app layout** using `AppLayout` and `createLayout`
4. **Convert pages one at a time** — Livewire and Inertia pages can coexist in the same Laravel app
5. **Replace Blade components** with their React equivalents using the mapping above
6. **Replace `wire:model`** with `useInertiaForm` field bindings
7. **Replace `wire:click`** with `onClick` handlers that call Inertia form methods
8. **Test each converted page** before moving to the next
