/**
 * @artisanpack-ui/tokens
 *
 * Shared design tokens, color resolver, and glass helpers for ArtisanPack UI.
 * Framework-agnostic -- works with React, Vue, or any JavaScript project.
 *
 * This package provides:
 * - **Color tokens** -- DaisyUI semantic color palette with CSS variable mapping
 * - **Color resolver** -- Runtime resolution of theme colors from CSS custom properties
 * - **Spacing tokens** -- Consistent spacing scale based on 0.25rem increments
 * - **Typography tokens** -- Font families, sizes, weights, and heading presets
 * - **Border tokens** -- Border radius scale and DaisyUI component radii
 * - **Shadow tokens** -- Elevation shadows, colored shadows, and glow effects
 * - **Animation tokens** -- Duration, easing, and transition property values
 * - **Glass helpers** -- Glassmorphism styles via CSS classes or inline styles
 * - **Tailwind plugin** -- Optional Tailwind CSS plugin for theme integration
 * - **Utility functions** -- `cn()` for merging Tailwind class names
 *
 * @packageDocumentation
 */

// Utilities
export { cn } from './utils/cn';

// Colors
export {
  colors,
  colorsDark,
  colorCssVars,
  daisyColorMap,
  daisyColors,
  type DaisyColor,
} from './colors';

// Color resolver
export { resolveColor, resolveContentColor, resolveAllColors } from './color-resolver';

// Spacing
export { spacing, spacingAliases } from './spacing';

// Typography
export {
  fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
  letterSpacing,
  typographyPresets,
} from './typography';

// Borders
export { borderRadius, daisyRadius } from './borders';

// Shadows
export { shadows, shadowsDark, coloredShadows, glowShadows } from './shadows';

// Animation
export {
  durations,
  easings,
  expressiveEasings,
  daisyAnimation,
  transitionProperties,
} from './animation';

// Glass
export {
  glassTokens,
  glassFrostedTokens,
  glassLiquidTokens,
  glassTransparentTokens,
  glassTokensDark,
  glassStyles,
  glassClassName,
  type GlassPreset,
  type GlassTint,
  type GlassClassOptions,
  type GlassInlineStyleOptions,
  type GlassStyleOptions,
} from './glass';

// Shared types
export {
  type Size,
  type GlassProps,
  type ColorProps,
  type FormFieldProps,
  type CSSProperties,
} from './types';
