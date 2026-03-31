# Design Tokens Guide

The `@artisanpack-ui/tokens` package provides a shared set of design tokens used across all ArtisanPack UI components. Tokens cover colors, spacing, typography, shadows, borders, animations, and glass morphism effects.

## Installation

```bash
npm install @artisanpack-ui/tokens
```

## CSS Custom Properties

Import the CSS file to register all token values as CSS custom properties:

```css
@import "@artisanpack-ui/tokens/css";
```

This makes tokens available as `var(--ap-*)` variables in your stylesheets.

## Colors

### DaisyUI Semantic Colors

The color system is based on DaisyUI's semantic color palette:

```ts
import { colors, colorsDark, daisyColors } from '@artisanpack-ui/tokens';

// Available semantic colors
// 'primary' | 'secondary' | 'accent' | 'neutral' |
// 'info' | 'success' | 'warning' | 'error' |
// 'base-100' | 'base-200' | 'base-300' | 'base-content'
```

### Color Resolver

Resolve DaisyUI colors to their current CSS variable values at runtime:

```ts
import { resolveColor, resolveContentColor, resolveAllColors } from '@artisanpack-ui/tokens';

// Resolve a single color to its hex value
const hex = resolveColor('primary'); // e.g. '#570df8'

// Get the content (text) color for a semantic color
const textHex = resolveContentColor('primary'); // e.g. '#ffffff'

// Resolve multiple colors at once
const all = resolveAllColors(['primary', 'secondary', 'accent']);
```

### Color Type

Use the `DaisyColor` type for type-safe color props:

```ts
import type { DaisyColor } from '@artisanpack-ui/tokens';

function MyComponent({ color }: { color: DaisyColor }) {
  // ...
}
```

## Spacing

A consistent spacing scale based on 0.25rem increments:

```ts
import { spacing, spacingAliases } from '@artisanpack-ui/tokens';

spacing[0];   // '0px'
spacing[1];   // '0.25rem'
spacing[2];   // '0.5rem'
spacing[4];   // '1rem'
spacing[8];   // '2rem'
spacing[16];  // '4rem'
```

## Typography

### Font Families

```ts
import { fontFamilies } from '@artisanpack-ui/tokens';

fontFamilies.sans;  // System sans-serif stack
fontFamilies.serif; // System serif stack
fontFamilies.mono;  // System monospace stack
```

### Font Sizes and Weights

```ts
import { fontSizes, fontWeights, lineHeights } from '@artisanpack-ui/tokens';

fontSizes.sm;   // '0.875rem'
fontSizes.base; // '1rem'
fontSizes.lg;   // '1.125rem'
fontSizes.xl;   // '1.25rem'

fontWeights.normal;   // '400'
fontWeights.medium;   // '500'
fontWeights.semibold; // '600'
fontWeights.bold;     // '700'
```

### Typography Presets

Pre-defined combinations for headings and body text:

```ts
import { typographyPresets } from '@artisanpack-ui/tokens';

// Each preset includes fontSize, fontWeight, lineHeight, letterSpacing
typographyPresets.h1;
typographyPresets.h2;
typographyPresets.body;
typographyPresets.caption;
```

## Borders

```ts
import { borderRadius, daisyRadius } from '@artisanpack-ui/tokens';

borderRadius.sm;   // '0.125rem'
borderRadius.md;   // '0.375rem'
borderRadius.lg;   // '0.5rem'
borderRadius.full; // '9999px'
```

## Shadows

```ts
import { shadows, shadowsDark, coloredShadows, glowShadows } from '@artisanpack-ui/tokens';

shadows.sm;  // Small elevation shadow
shadows.md;  // Medium elevation shadow
shadows.lg;  // Large elevation shadow
shadows.xl;  // Extra-large elevation shadow

// Dark mode variants
shadowsDark.sm;

// Colored shadows (keyed by DaisyUI color)
coloredShadows.primary;

// Glow effects
glowShadows.primary;
```

## Animation

```ts
import { durations, easings, expressiveEasings, transitionProperties } from '@artisanpack-ui/tokens';

durations.fast;    // '150ms'
durations.normal;  // '300ms'
durations.slow;    // '500ms'

easings.ease;      // Standard easing
easings.easeIn;    // Ease-in curve
easings.easeOut;   // Ease-out curve
```

## Glass Morphism

Create glassmorphism effects via CSS classes or inline styles:

```ts
import { glassClassName, glassStyles } from '@artisanpack-ui/tokens';
import type { GlassPreset } from '@artisanpack-ui/tokens';

// Generate a CSS class string for a glass effect
const className = glassClassName({ preset: 'frosted', tint: 'primary' });

// Or get inline style objects
const style = glassStyles({ preset: 'liquid', blur: 12, opacity: 0.3 });
```

### Presets

| Preset | Description |
|--------|-------------|
| `frosted` | Subtle frosted glass appearance |
| `liquid` | Higher blur, more transparency |
| `transparent` | Very light glass effect |

## Utility: `cn()`

A class name merger powered by `clsx` and `tailwind-merge`:

```ts
import { cn } from '@artisanpack-ui/tokens';

cn('btn', 'btn-primary');           // 'btn btn-primary'
cn('p-4', condition && 'p-8');      // 'p-8' if condition is true
cn('text-red-500', 'text-blue-500'); // 'text-blue-500' (Tailwind merge resolves conflicts)
```

## Tailwind Plugin

An optional Tailwind CSS plugin that registers tokens as Tailwind theme values:

```ts
// tailwind.config.ts (or CSS-based for v4)
import { createArtisanPackPlugin } from '@artisanpack-ui/tokens/tailwind';
```

## Shared Types

```ts
import type { Size, GlassProps, ColorProps, FormFieldProps } from '@artisanpack-ui/tokens';

// Size = 'xs' | 'sm' | 'md' | 'lg'
// GlassProps — Props for glass morphism styling
// ColorProps — Props for color-aware components
// FormFieldProps — Common form field props (label, hint, error)
```
