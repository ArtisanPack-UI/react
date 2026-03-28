/**
 * @artisanpack-ui/tokens
 *
 * Shared design tokens, color resolver, and glass helpers for ArtisanPack UI.
 * Framework-agnostic — works with React, Vue, or any JavaScript project.
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
