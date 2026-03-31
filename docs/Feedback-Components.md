# Feedback Components

## Alert

Dismissible alert message box with color variants.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `'info' \| 'success' \| 'warning' \| 'error'` | — | Color variant |
| `icon` | `ReactNode` | — | Icon before content |
| `dismissible` | `boolean` | — | Show close button |
| `visible` | `boolean` | — | Controlled visibility |
| `onDismiss` | `() => void` | — | Dismiss callback |

```tsx
<Alert color="success" dismissible>
  Operation completed successfully.
</Alert>
```

---

## EmptyState

Placeholder for empty content areas with optional icon and action.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `ReactNode` | — | Illustration or icon |
| `heading` | `string` | — | Heading text |
| `headingAs` | `ElementType` | `'h3'` | Heading element type |
| `description` | `string` | — | Description message |
| `action` | `ReactNode` | — | Action element (e.g. button) |

```tsx
<EmptyState
  heading="No results"
  description="Try adjusting your search filters."
  action={<Button color="primary">Reset Filters</Button>}
/>
```

---

## ErrorDisplay

Error message display with optional retry button.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `'Something went wrong'` | Error title |
| `message` | `string` | — | Error description |
| `icon` | `ReactNode` | — | Icon/illustration |
| `onRetry` | `() => void` | — | Retry callback (shows button) |
| `retryLabel` | `string` | `'Try again'` | Retry button label |

```tsx
<ErrorDisplay
  title="Failed to load data"
  message="Check your connection and try again."
  onRetry={refetch}
/>
```

---

## Loading

Animated loading indicator with multiple variants.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `DaisyColor` | — | Color variant |
| `size` | `Size` | — | Indicator size |
| `variant` | `'spinner' \| 'dots' \| 'ring' \| 'ball' \| 'bars' \| 'infinity'` | `'spinner'` | Animation style |

```tsx
<Loading color="primary" size="lg" variant="dots" />
```

---

## Skeleton

Placeholder skeleton loader with pulse animation.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `string` | — | CSS width (e.g. `'200px'`) |
| `height` | `string` | — | CSS height (e.g. `'1rem'`) |
| `circle` | `boolean` | — | Render as circle |

```tsx
<Skeleton width="100%" height="1rem" />
<Skeleton width="3rem" height="3rem" circle />
```

---

## Toast

Toast notification system with provider, hook, and message components.

### ToastProvider

Wrap your app with `ToastProvider` to enable toast notifications.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultDuration` | `number` | `5000` | Auto-dismiss duration (ms); `0` disables |
| `max` | `number` | `5` | Max simultaneous toasts |
| `position` | `ToastPosition[]` | `['toast-end', 'toast-bottom']` | Position classes |

```tsx
<ToastProvider position={['toast-end', 'toast-top']}>
  <App />
</ToastProvider>
```

### useToast Hook

Access the toast API from any component within a `ToastProvider`.

```tsx
const toast = useToast();

toast.success('Saved!');
toast.error('Something went wrong.');
toast.warning('Disk space low.');
toast.info('New update available.');
toast.show({ message: 'Custom toast', color: 'info', duration: 3000 });
toast.dismiss(id);
toast.dismissAll();
```

### ToastAPI

| Method | Returns | Description |
|--------|---------|-------------|
| `show(options)` | `string` | Show toast with full options; returns ID |
| `success(message, duration?)` | `string` | Success toast |
| `error(message, duration?)` | `string` | Error toast |
| `warning(message, duration?)` | `string` | Warning toast |
| `info(message, duration?)` | `string` | Info toast |
| `dismiss(id)` | `void` | Dismiss by ID |
| `dismissAll()` | `void` | Dismiss all |

### ToastItem

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier |
| `message` | `ReactNode` | Toast content |
| `color` | `'info' \| 'success' \| 'warning' \| 'error'` | Color variant |
| `duration` | `number` | Auto-dismiss duration (ms); `0` disables |
