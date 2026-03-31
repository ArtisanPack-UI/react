/**
 * @module animation
 *
 * Animation tokens: duration values, standard and expressive easing functions,
 * DaisyUI component animation settings, and transition property lists.
 *
 * @packageDocumentation
 */

/** Duration values in milliseconds */
export const durations = {
  0: '0ms',
  75: '75ms',
  100: '100ms',
  150: '150ms',
  200: '200ms',
  300: '300ms',
  500: '500ms',
  700: '700ms',
  1000: '1000ms',
} as const;

/** Standard CSS easing functions */
export const easings = {
  linear: 'linear',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

/** Expressive easing functions for playful interactions */
export const expressiveEasings = {
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  elastic: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
} as const;

/** DaisyUI component animation settings */
export const daisyAnimation = {
  btn: '0.25s',
  input: '0.2s',
  btnFocusScale: 0.95,
} as const;

/** Pre-built transition property lists */
export const transitionProperties = {
  all: 'all',
  default:
    'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter',
  colors: 'color, background-color, border-color, text-decoration-color, fill, stroke',
  opacity: 'opacity',
  shadow: 'box-shadow',
  transform: 'transform',
} as const;
