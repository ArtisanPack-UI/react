/**
 * ArtisanPack UI - Typography Tokens
 *
 * Font families, sizes, weights, line heights, and letter spacing.
 * Derived from the Livewire component library's design tokens.
 */

/** Font family stacks */
export const fontFamilies = {
  sans: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
} as const;

/** Font sizes in rem (based on 1rem = 16px) */
export const fontSizes = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
  '5xl': '3rem',
  '6xl': '3.75rem',
} as const;

/** Font weights */
export const fontWeights = {
  thin: 100,
  extralight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
} as const;

/** Line height values */
export const lineHeights = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

/** Letter spacing values */
export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const;

/** Typography presets for heading and body text */
export const typographyPresets = {
  h1: {
    fontSize: '2.75rem',
    fontWeight: fontWeights.black,
    lineHeight: 1.15,
    letterSpacing: letterSpacing.tight,
  },
  h2: {
    fontSize: '2.125rem',
    fontWeight: fontWeights.extrabold,
    lineHeight: 1.2,
    letterSpacing: letterSpacing.normal,
  },
  h3: {
    fontSize: '1.625rem',
    fontWeight: fontWeights.bold,
    lineHeight: 1.25,
    letterSpacing: letterSpacing.normal,
  },
  h4: {
    fontSize: '1.375rem',
    fontWeight: fontWeights.semibold,
    lineHeight: 1.3,
    letterSpacing: letterSpacing.normal,
  },
  h5: {
    fontSize: '1.125rem',
    fontWeight: fontWeights.semibold,
    lineHeight: 1.35,
    letterSpacing: letterSpacing.normal,
  },
  h6: {
    fontSize: '1rem',
    fontWeight: fontWeights.semibold,
    lineHeight: 1.4,
    letterSpacing: letterSpacing.normal,
  },
  body: {
    fontSize: '1.0625rem',
    fontWeight: fontWeights.normal,
    lineHeight: 1.7,
    letterSpacing: letterSpacing.normal,
  },
} as const;
