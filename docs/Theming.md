# Theming Guide

ArtisanPack UI React components are styled with [DaisyUI](https://daisyui.com/) and [Tailwind CSS](https://tailwindcss.com/), giving you access to 31 built-in themes plus the ability to create custom themes.

## ThemeProvider

Wrap your application with `ThemeProvider` to enable theme management:

```tsx
import { ThemeProvider } from '@artisanpack-ui/react';

function App() {
  return (
    <ThemeProvider defaultColorScheme="system">
      {/* your app */}
    </ThemeProvider>
  );
}
```

### Color Scheme Options

| Value | Behavior |
|-------|----------|
| `'light'` | Always use light mode |
| `'dark'` | Always use dark mode |
| `'system'` | Follow the user's OS preference (default) |

## useTheme Hook

Access and control the current theme from any component:

```tsx
import { useTheme } from '@artisanpack-ui/react';

function MyComponent() {
  const { colorScheme, resolvedColorScheme, setColorScheme } = useTheme();

  return (
    <div>
      <p>Preference: {colorScheme}</p>
      <p>Active: {resolvedColorScheme}</p>
      <button onClick={() => setColorScheme('dark')}>Dark Mode</button>
    </div>
  );
}
```

### Return Value

| Property | Type | Description |
|----------|------|-------------|
| `colorScheme` | `'light' \| 'dark' \| 'system'` | The current preference |
| `resolvedColorScheme` | `'light' \| 'dark'` | The resolved mode after evaluating `'system'` |
| `setColorScheme` | `(scheme: ColorScheme) => void` | Update the preference |

## ThemeToggle Component

A ready-made toggle button for switching between light, dark, and system modes:

```tsx
import { ThemeToggle } from '@artisanpack-ui/react';

<ThemeToggle />
```

## DaisyUI Themes

All components automatically adapt to the active DaisyUI theme. Set the theme on your root element:

```html
<html data-theme="cupcake">
```

### Available Themes

light, dark, cupcake, bumblebee, emerald, corporate, synthwave, retro, cyberpunk, valentine, halloween, garden, forest, aqua, lofi, pastel, fantasy, wireframe, black, luxury, dracula, cmyk, autumn, business, acid, lemonade, night, coffee, winter, dim, nord, sunset

### Switching Themes at Runtime

```tsx
function ThemeSwitcher() {
  const setTheme = (theme: string) => {
    document.documentElement.setAttribute('data-theme', theme);
  };

  return (
    <select onChange={(e) => setTheme(e.target.value)}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="cupcake">Cupcake</option>
      <option value="dracula">Dracula</option>
    </select>
  );
}
```

## Color Props

Many components accept a `color` prop that maps to DaisyUI semantic colors:

```tsx
<Button color="primary">Primary</Button>
<Button color="secondary">Secondary</Button>
<Button color="accent">Accent</Button>
<Button color="success">Success</Button>
<Button color="warning">Warning</Button>
<Button color="error">Error</Button>
<Button color="info">Info</Button>
<Button color="neutral">Neutral</Button>
```

These colors automatically adapt when you change the DaisyUI theme.

## Custom Themes

Create a custom DaisyUI theme in your CSS:

```css
@plugin "daisyui" {
  themes: light --default, dark,
  mytheme {
    primary: oklch(0.65 0.24 260);
    secondary: oklch(0.70 0.18 180);
    accent: oklch(0.75 0.15 60);
    neutral: oklch(0.30 0.02 260);
    base-100: oklch(0.98 0.01 260);
  }
}
```

Then apply it:

```html
<html data-theme="mytheme">
```

All ArtisanPack UI components will automatically use your custom color values.

## Dark Mode Support

Components handle dark mode automatically when you use DaisyUI themes. No extra configuration is needed — just ensure your application switches between a light and dark theme (either via `ThemeProvider` or by setting `data-theme` on the root element).
