/**
 * @module borders
 *
 * Border radius tokens: a general-purpose scale and DaisyUI component-specific values.
 *
 * @packageDocumentation
 */

/** Border radius scale */
export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  base: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
} as const;

/** DaisyUI component-specific border radius values */
export const daisyRadius = {
  box: '1rem',
  btn: '0.5rem',
  badge: '1.9rem',
  tab: '0.5rem',
} as const;
