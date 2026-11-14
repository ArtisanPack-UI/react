---
title: Theming
menu_order: 5
---

# Theming

Everything visual is a design token, and themes, density and presets are attributes (`data-theme`, `data-density`, `data-preset`) on `<html>` or any element. The components read tokens and take no theme props, so there's nothing React-specific about most theming. Start with the design system documentation:

- [Theming overview](https://docs.artisanpackui.dev/documentation/design-system/theming): the levels, from a theme to your own visual layer.
- [Themes](https://docs.artisanpackui.dev/documentation/design-system/theming/themes): light, dark and high contrast, and themed regions.
- [Presets](https://docs.artisanpackui.dev/documentation/design-system/theming/presets) and [Brand Presets](https://docs.artisanpackui.dev/documentation/design-system/theming/brand-presets): a whole look, or one generated from your brand color.
- [Customizing Tokens](https://docs.artisanpackui.dev/documentation/design-system/theming/customizing-tokens): any token, for the app, a region or one component.
- [Headless](https://docs.artisanpackui.dev/documentation/design-system/theming/headless): the markup and behavior without the visual CSS.
- [Design Tokens](https://docs.artisanpackui.dev/documentation/design-system/foundations/design-tokens): every token, and how they're built.

This page covers the React pieces: `ThemeToggle`, `ThemeScript` and the older `ThemeProvider`.

## ThemeToggle

`ThemeToggle` lets people choose **Light**, **Dark**, **High contrast** or **System**. A choice sets `data-theme` on `<html>`, is stored in `localStorage` under `apui-theme`, and stays in sync across toggles and tabs. System follows the operating system live.

```tsx
import { ThemeToggle } from '@artisanpack-ui/react';

<ThemeToggle variant="icon" size="sm" />;
```

| `variant`             | Renders                                    |
| --------------------- | ------------------------------------------ |
| `segmented` (default) | A segmented control with every choice.     |
| `icon`                | One button that switches light and dark.   |
| `menu`                | A button that opens a menu of the choices. |

Uncontrolled, it starts on the stored choice. To control it, pass `value` and `onValueChange`; a pick then only reports the choice, and the toggle applies it once `value` changes to it. `choices` limits the options, `persist={false}` skips storage, and the `…Label` props translate the text. See the [ThemeToggle page](https://docs.artisanpackui.dev/documentation/design-system/components/theme-toggle) for every prop.

## ThemeScript

`ThemeScript` renders the small blocking script that applies the stored theme before the first paint. Put it first in `<head>`, before any stylesheet:

```tsx
import { ThemeScript } from '@artisanpack-ui/react';

<head>
  <ThemeScript />
</head>;
```

| Prop           | Default        | What it does                                                |
| -------------- | -------------- | ----------------------------------------------------------- |
| `storageKey`   | `'apui-theme'` | The `localStorage` key. Pass the same one to `ThemeToggle`. |
| `defaultValue` | `'system'`     | The choice to apply when nothing is stored.                 |
| `nonce`        |                | A Content Security Policy nonce for the inline script.      |

The script only runs when the browser parses it from server-rendered HTML. When React renders it on the client, it doesn't run, so `ThemeScript` then applies the stored choice when it mounts, if `<html>` has no `data-theme` yet. That happens after the first paint, so in a client-rendered app inline the output of `themeScript()` from `@artisanpack-ui/behavior` in `index.html` instead. For Next.js and Inertia, see [Server Rendering](Server-Rendering) and [Laravel and Inertia](Laravel-Inertia).

## Setting the theme from code

The helpers behind `ThemeToggle` are exported from `@artisanpack-ui/behavior`:

```ts
import { applyTheme } from '@artisanpack-ui/behavior';

applyTheme('dark'); // sets data-theme on <html>, stores the choice and updates every toggle
```

For a region with its own theme, density or preset, set the attribute on its element:

```tsx
<Card data-theme="dark" data-density="compact">
  …
</Card>
```

## ThemeProvider and useTheme

`ThemeProvider` and `useTheme` are still exported for apps that used them in 1.x. You don't need them in 2.0: the provider holds a `colorScheme` (`light`, `dark` or `system`) in React context, but doesn't set `data-theme` itself. When a `ThemeToggle` renders inside a `ThemeProvider`, it starts from the provider's `colorScheme` and calls `setColorScheme` on every pick. High contrast reaches the provider as `light`, because the provider has no high contrast value.

## Coming from 1.x

The 1.x DaisyUI themes and the `@artisanpack-ui/tokens` color maps are replaced by token-based presets. The [React upgrade guide](https://docs.artisanpackui.dev/documentation/design-system/upgrade/react) maps the old theme variables to tokens.
