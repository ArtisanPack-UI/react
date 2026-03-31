/**
 * @module shadows
 *
 * Shadow tokens: elevation shadows (light and dark mode), semantic colored shadows,
 * and glow effects for interactive states.
 *
 * @packageDocumentation
 */

/** Standard elevation shadow scale */
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
} as const;

/** Dark mode shadow overrides (increased opacity for visibility) */
export const shadowsDark = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.2)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.5)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.2)',
} as const;

/** Semantic colored shadows for feedback states */
export const coloredShadows = {
  primary: '0 4px 14px 0 rgb(59 130 246 / 0.3)',
  success: '0 4px 14px 0 rgb(34 197 94 / 0.3)',
  warning: '0 4px 14px 0 rgb(249 115 22 / 0.3)',
  error: '0 4px 14px 0 rgb(239 68 68 / 0.3)',
  info: '0 4px 14px 0 rgb(14 165 233 / 0.3)',
} as const;

/** Glow effects for interactive states */
export const glowShadows = {
  sm: '0 0 8px 0 rgb(59 130 246 / 0.4)',
  md: '0 0 16px 0 rgb(59 130 246 / 0.4)',
  lg: '0 0 24px 0 rgb(59 130 246 / 0.4)',
} as const;
