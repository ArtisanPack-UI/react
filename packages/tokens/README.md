# @artisanpack-ui/tokens

[![CI](https://github.com/ArtisanPack-UI/react/actions/workflows/ci.yml/badge.svg)](https://github.com/ArtisanPack-UI/react/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@artisanpack-ui/tokens)](https://www.npmjs.com/package/@artisanpack-ui/tokens)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/ArtisanPack-UI/react/blob/main/LICENSE)

Shared design tokens, color resolver, and glass helpers for [ArtisanPack UI](https://github.com/ArtisanPack-UI/react). Provides colors, spacing, typography, shadows, animations, and glass morphism presets as CSS custom properties and a Tailwind CSS plugin.

## Installation

```bash
npm install @artisanpack-ui/tokens
```

### Peer Dependencies

```bash
npm install clsx tailwind-merge
```

`tailwindcss` (v4+) is an optional peer dependency for the Tailwind plugin.

## Setup

Import the tokens CSS in your Tailwind entry file:

```css
@import "tailwindcss";
@import "@artisanpack-ui/tokens/css";
```

### Tailwind Plugin (Optional)

```ts
// tailwind.config.ts
import artisanpackPlugin from '@artisanpack-ui/tokens/tailwind';

export default {
  plugins: [artisanpackPlugin],
};
```

## Usage

```tsx
import { resolveColor, cn, glass } from '@artisanpack-ui/tokens';

// Resolve DaisyUI/theme-aware colors
const color = resolveColor('primary');

// Merge Tailwind classes without conflicts
const classes = cn('px-4 py-2', 'px-6'); // => 'py-2 px-6'

// Glass morphism presets
const glassClasses = glass('md'); // => glass effect classes
```

## What's Included

- **Color tokens** - DaisyUI-compatible color variables
- **Spacing scale** - Consistent spacing values
- **Typography** - Font families, sizes, and weights
- **Shadows** - Elevation-based shadow tokens
- **Animations** - Transition and animation presets
- **Glass morphism** - Frosted glass effect helpers
- **Utilities** - `cn()` class merger, `resolveColor()`, and more

## Part of ArtisanPack UI

This package is part of the [ArtisanPack UI React](https://github.com/ArtisanPack-UI/react) ecosystem:

| Package | Description |
|---------|-------------|
| [`@artisanpack-ui/tokens`](https://www.npmjs.com/package/@artisanpack-ui/tokens) | Design tokens, color resolver, glass helpers |
| [`@artisanpack-ui/react`](https://www.npmjs.com/package/@artisanpack-ui/react) | 56+ React UI components |
| [`@artisanpack-ui/react-laravel`](https://www.npmjs.com/package/@artisanpack-ui/react-laravel) | Inertia.js adapter wrappers |

## License

[MIT](https://github.com/ArtisanPack-UI/react/blob/main/LICENSE) - Jacob Martella
