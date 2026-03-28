/**
 * ArtisanPack UI - Tailwind CSS Plugin
 *
 * Optional Tailwind CSS plugin that registers ArtisanPack UI token values
 * as theme extensions. Use this when you want Tailwind utilities to reference
 * the same design tokens.
 *
 * @example
 * ```ts
 * // tailwind.config.ts
 * import plugin from 'tailwindcss/plugin';
 * import { createArtisanPackPlugin } from '@artisanpack-ui/tokens/tailwind';
 *
 * export default {
 *   plugins: [createArtisanPackPlugin(plugin)],
 * };
 * ```
 */

import { colors } from './colors';
import { spacing } from './spacing';
import { fontFamilies, fontSizes, fontWeights, lineHeights, letterSpacing } from './typography';
import { borderRadius } from './borders';
import { shadows, coloredShadows, glowShadows } from './shadows';
import { durations, easings, expressiveEasings } from './animation';

/** Token values structured for Tailwind theme extension */
export const themeTokens = {
  colors: {
    primary: `var(--color-primary, ${colors.primary})`,
    'primary-content': `var(--color-primary-content, ${colors.primaryContent})`,
    secondary: `var(--color-secondary, ${colors.secondary})`,
    'secondary-content': `var(--color-secondary-content, ${colors.secondaryContent})`,
    accent: `var(--color-accent, ${colors.accent})`,
    'accent-content': `var(--color-accent-content, ${colors.accentContent})`,
    neutral: `var(--color-neutral, ${colors.neutral})`,
    'neutral-content': `var(--color-neutral-content, ${colors.neutralContent})`,
    'base-100': `var(--color-base-100, ${colors.base100})`,
    'base-200': `var(--color-base-200, ${colors.base200})`,
    'base-300': `var(--color-base-300, ${colors.base300})`,
    'base-content': `var(--color-base-content, ${colors.baseContent})`,
    info: `var(--color-info, ${colors.info})`,
    'info-content': `var(--color-info-content, ${colors.infoContent})`,
    success: `var(--color-success, ${colors.success})`,
    'success-content': `var(--color-success-content, ${colors.successContent})`,
    warning: `var(--color-warning, ${colors.warning})`,
    'warning-content': `var(--color-warning-content, ${colors.warningContent})`,
    error: `var(--color-error, ${colors.error})`,
    'error-content': `var(--color-error-content, ${colors.errorContent})`,
  },
  spacing,
  fontFamily: {
    sans: fontFamilies.sans,
    serif: fontFamilies.serif,
    mono: fontFamilies.mono,
  },
  fontSize: fontSizes,
  fontWeight: fontWeights,
  lineHeight: lineHeights,
  letterSpacing,
  borderRadius,
  boxShadow: {
    ...shadows,
    'color-primary': coloredShadows.primary,
    'color-success': coloredShadows.success,
    'color-warning': coloredShadows.warning,
    'color-error': coloredShadows.error,
    'color-info': coloredShadows.info,
    'glow-sm': glowShadows.sm,
    'glow-md': glowShadows.md,
    'glow-lg': glowShadows.lg,
  },
  transitionDuration: durations,
  transitionTimingFunction: {
    ...easings,
    ...expressiveEasings,
  },
} as const;

/**
 * Minimal representation of Tailwind's plugin handler API.
 * Avoids a hard dependency on tailwindcss while providing a typed contract.
 */
export interface TailwindPluginAPI {
  addUtilities?: (...args: unknown[]) => void;
  addComponents?: (...args: unknown[]) => void;
  [key: string]: unknown;
}

/** Shape of the Tailwind `plugin(handler, config?)` function */
export type TailwindPluginFn = (
  handler: (api: TailwindPluginAPI) => void,
  config?: Record<string, unknown>,
) => unknown;

/**
 * Tailwind CSS plugin factory.
 *
 * Accepts the `plugin` function from `tailwindcss/plugin` and returns a
 * configured plugin. Matches Tailwind's `plugin(handler, config?)` signature.
 *
 * @example
 * ```ts
 * import plugin from 'tailwindcss/plugin';
 * import { createArtisanPackPlugin } from '@artisanpack-ui/tokens/tailwind';
 *
 * export default {
 *   plugins: [createArtisanPackPlugin(plugin)],
 * };
 * ```
 */
export function createArtisanPackPlugin(plugin: TailwindPluginFn): unknown {
  return plugin(
    () => {
      // No custom utilities needed — all values are theme extensions
    },
    {
      theme: {
        extend: themeTokens,
      },
    },
  );
}
