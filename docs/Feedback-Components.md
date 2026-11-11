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

A brief, non-blocking message about something that just happened, built on the design system (`.apui-toast`, styled by `@artisanpack-ui/css`). Rendered on its own, a `Toast` is static: it shows until you hide it. For toasts that stack, time out and pause on hover and focus, render one `Toaster` and create toasts from data with `toast.create({ … })`.

### Toast Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `ReactNode` | — | The message, linked with `aria-labelledby` |
| `description` | `ReactNode` | — | Supporting text, linked with `aria-describedby` |
| `color` | semantic color | `'neutral'` | Tints the icon (`data-color`). `error` makes the toast an alert |
| `variant` | `'default' \| 'inverse'` | `'default'` | `inverse` uses the inverse surface (`data-variant`) |
| `surface` | `'overlay' \| 'glass'` | `'overlay'` | The toast's surface (`data-surface`) |
| `icon` | `string \| ReactNode` | the color's status icon | `circle-check`, `triangle-alert`, `circle-alert` or `info` by default |
| `actions` | `ReactNode` | — | Buttons under the text, such as Undo |
| `hideClose` | `boolean` | `false` | Hides the close button |
| `closeLabel` | `string` | `'Dismiss notification'` | The close button's accessible name; translate it |
| `onOpenChange` | `(open: boolean) => void` | — | Called with `false` when the close button is pressed; hiding the toast is your job |
| `classes` | `Partial<Record<ToastPart, string>>` | — | Extra classes per part: `root`, `icon`, `title`, `description`, `actions`, `closeTrigger` |

```tsx
import { Button, Toast } from '@artisanpack-ui/react';

export default function StaticExample() {
  return (
    <>
      <Toast color="success" title="Listing saved" description="Cedarwood Estates is live now." />
      <Toast color="error" title="Upload failed" description="The file is larger than 10 MB." />
      <Toast
        variant="inverse"
        title="Listing archived"
        actions={
          <Button size="sm" variant="outline" color="neutral">
            Undo
          </Button>
        }
      />
    </>
  );
}
```

### Toaster Props

The region: a labelled landmark (`aria-live="polite"`) portalled to the end of the body. Alt+T moves focus to it; Escape dismisses the focused toast.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placement` | `'top-start' \| 'top' \| 'top-end' \| 'bottom-start' \| 'bottom' \| 'bottom-end'` | `'bottom-end'` | Where the region sits; follows the text direction |
| `max` | `number` | `5` | At most this many show at once; the rest queue |
| `gap` | `number` | `8` | Space between toasts, in px |
| `duration` | `number` | `5000` | Milliseconds before a toast of the default `toast` dismisses itself; `0` keeps it. A custom toaster takes it from `createToaster()` |
| `offsets` | `string` | `'16px'` | Distance from the viewport edge |
| `toaster` | `ToasterInstance` | the default `toast` | A toaster from `createToaster()` |
| `label` | `string` | `'Notifications'` | The region's accessible name |
| `closeLabel` | `string` | `'Dismiss notification'` | Each toast's close button's accessible name; translate it |
| `classes` | `Partial<Record<ToastPart, string>>` | — | Extra classes for each toast's parts |

Render one `Toaster` per toaster. A second `Toaster` for the same toaster renders nothing (with a development warning) while the first is mounted, and takes over when it unmounts. A Toaster's `placement`, `max`, `gap`, `offsets` and `duration` apply while it's mounted and are restored when it unmounts; options it doesn't set are left alone. To show toasts in two places, create a second toaster with `createToaster()` and give it a different `placement`: the region is keyed by its placement, so two toasters at one placement collide.

### toast

`toast` is the default toaster. Its options are the same in every stack: `title`, `description`, `color` (`error` is an alert), `variant`, `surface`, `icon`, `duration` (`0` keeps it), `action: { label, onClick }` (also keeps it, WCAG 2.2.1) and `hideClose`.

| Method | Returns | Description |
|--------|---------|-------------|
| `create(options)` | `string` | Shows a toast, or patches the shown one with the same `id` (like `update`); returns its id |
| `update(id, options)` | `string` | Patches a toast in place: only the options given change, and it keeps its duration |
| `dismiss(id?)` | `void` | Dismisses one toast, or all |
| `remove(id?)` | `void` | Removes one toast, or all, without the exit transition |

```tsx
import { Button, Toaster, toast } from '@artisanpack-ui/react';

export default function ToasterExample() {
  return (
    <>
      <Toaster />
      <Button
        onClick={() =>
          toast.create({
            title: 'Listing archived',
            description: 'Cedarwood Estates is hidden from search.',
            action: { label: 'Undo', onClick: () => console.log('restored') },
          })
        }
      >
        Archive listing
      </Button>
    </>
  );
}
```

A toast is never the only place an error is reported: blocking errors use [Alert](#alert).

---

## ToastProvider (deprecated)

> **Deprecated.** Use [Toast, Toaster and `toast`](#toast). `ToastProvider`, `ToastMessage` and `useToast` will be removed in a later major release.

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
