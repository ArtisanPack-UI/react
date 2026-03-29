/**
 * ArtisanPack UI - Color Tokens
 *
 * DaisyUI theme color palette and semantic color definitions.
 * Values derived from the Livewire component library's DaisyUI/Tailwind configuration.
 */

/** DaisyUI semantic theme colors (light mode defaults) */
export const colors = {
  primary: '#3b82f6',
  primaryContent: '#000000',
  secondary: '#64748b',
  secondaryContent: '#ffffff',
  accent: '#f59e0b',
  accentContent: '#000000',
  neutral: '#737373',
  neutralContent: '#ffffff',
  base100: '#ffffff',
  base200: '#f3f4f6',
  base300: '#e5e7eb',
  baseContent: '#1f2937',
  info: '#0ea5e9',
  infoContent: '#ffffff',
  success: '#22c55e',
  successContent: '#ffffff',
  warning: '#f97316',
  warningContent: '#ffffff',
  error: '#ef4444',
  errorContent: '#ffffff',
} as const;

/** Dark mode color overrides */
export const colorsDark = {
  neutral: '#191D24',
  neutralContent: '#A6ADBB',
  base100: '#2A303C',
  base200: '#242933',
  base300: '#20252E',
  baseContent: '#A6ADBB',
} as const;

/** CSS custom property names for DaisyUI theme colors */
export const colorCssVars = {
  primary: '--color-primary',
  primaryContent: '--color-primary-content',
  secondary: '--color-secondary',
  secondaryContent: '--color-secondary-content',
  accent: '--color-accent',
  accentContent: '--color-accent-content',
  neutral: '--color-neutral',
  neutralContent: '--color-neutral-content',
  base100: '--color-base-100',
  base200: '--color-base-200',
  base300: '--color-base-300',
  baseContent: '--color-base-content',
  info: '--color-info',
  infoContent: '--color-info-content',
  success: '--color-success',
  successContent: '--color-success-content',
  warning: '--color-warning',
  warningContent: '--color-warning-content',
  error: '--color-error',
  errorContent: '--color-error-content',
} as const;

/** Mapping of DaisyUI color names to their CSS variable and default hex value */
export const daisyColorMap = {
  primary: { cssVar: colorCssVars.primary, defaultValue: colors.primary },
  secondary: { cssVar: colorCssVars.secondary, defaultValue: colors.secondary },
  accent: { cssVar: colorCssVars.accent, defaultValue: colors.accent },
  neutral: { cssVar: colorCssVars.neutral, defaultValue: colors.neutral },
  info: { cssVar: colorCssVars.info, defaultValue: colors.info },
  success: { cssVar: colorCssVars.success, defaultValue: colors.success },
  warning: { cssVar: colorCssVars.warning, defaultValue: colors.warning },
  error: { cssVar: colorCssVars.error, defaultValue: colors.error },
} as const;

/** All DaisyUI color name literals */
export type DaisyColor = keyof typeof daisyColorMap;

/** Array of all DaisyUI color names */
export const daisyColors: DaisyColor[] = [
  'primary',
  'secondary',
  'accent',
  'neutral',
  'info',
  'success',
  'warning',
  'error',
];
