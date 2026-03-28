/**
 * ArtisanPack UI - Glass Helpers
 *
 * Glassmorphism token values, preset configurations, and style helper functions.
 * Derived from the Livewire component library's glass token system.
 */

import type { CSSProperties } from './types';

/** Base glass token values */
export const glassTokens = {
  blur: '12px',
  opacity: 0.7,
  borderWidth: '1px',
  borderOpacity: 0.2,
  shadowOpacity: 0.1,
  tintColor: 'transparent',
  tintOpacity: 0.15,
} as const;

/** Frosted glass variant tokens */
export const glassFrostedTokens = {
  blur: '16px',
  opacity: 0.8,
  saturation: '180%',
} as const;

/** Liquid glass variant tokens */
export const glassLiquidTokens = {
  blur: '24px',
  opacity: 0.6,
  refraction: 0.5,
  borderGlow: 0.3,
} as const;

/** Transparent glass variant tokens */
export const glassTransparentTokens = {
  blur: '8px',
  opacity: 0.3,
} as const;

/** Dark mode overrides for glass tokens */
export const glassTokensDark = {
  base: {
    opacity: 0.75,
    borderOpacity: 0.25,
    shadowOpacity: 0.25,
    tintOpacity: 0.2,
  },
  frosted: {
    opacity: 0.85,
    blur: '20px',
    saturation: '200%',
  },
  liquid: {
    opacity: 0.65,
    borderGlow: 0.4,
  },
  transparent: {
    blur: '12px',
    opacity: 0.35,
  },
} as const;

/** Glass preset names */
export type GlassPreset = 'base' | 'frosted' | 'liquid' | 'transparent';

/** Glass tint color names (matching DaisyUI semantic colors) */
export type GlassTint =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

/** Options for generating CSS class names for a glass effect */
export interface GlassClassOptions {
  preset?: GlassPreset;
  tint?: GlassTint;
  tintOpacity?: number;
}

/**
 * Options for generating inline glass styles.
 * Includes `dark` for explicit dark mode since inline styles can't respond to
 * `[data-theme="dark"]`. Tint requires CSS pseudo-elements and is only
 * available via {@link glassClassName}.
 */
export interface GlassInlineStyleOptions {
  preset?: GlassPreset;
  dark?: boolean;
}

/**
 * Union of all glass options (used by component props that support both approaches).
 * @deprecated Prefer {@link GlassClassOptions} or {@link GlassInlineStyleOptions} directly.
 */
export type GlassStyleOptions = GlassClassOptions & { dark?: boolean };

/**
 * Generate inline CSS properties for a glass effect.
 *
 * @param options - Configuration for the glass effect
 * @returns A CSSProperties object that can be spread onto a React element's style prop
 * @remarks Tint colors require a CSS pseudo-element overlay and cannot be applied via inline
 * styles. Use {@link glassClassName} for tint support. Dark mode must be passed explicitly
 * since inline styles cannot respond to CSS selectors.
 */
export function glassStyles(options: GlassInlineStyleOptions = {}): CSSProperties {
  const { preset = 'base', dark = false } = options;

  const styles: CSSProperties = {};

  switch (preset) {
    case 'frosted': {
      const blur = dark ? glassTokensDark.frosted.blur : glassFrostedTokens.blur;
      const opacity = dark ? glassTokensDark.frosted.opacity : glassFrostedTokens.opacity;
      const saturation = dark ? glassTokensDark.frosted.saturation : glassFrostedTokens.saturation;
      const bgBase = dark ? '30, 30, 30' : '255, 255, 255';

      styles.background = `rgba(${bgBase}, ${opacity})`;
      styles.backdropFilter = `blur(${blur}) saturate(${saturation})`;
      styles.WebkitBackdropFilter = `blur(${blur}) saturate(${saturation})`;
      break;
    }

    case 'liquid': {
      const blur = glassLiquidTokens.blur;
      const opacity = dark ? glassTokensDark.liquid.opacity : glassLiquidTokens.opacity;
      const borderGlow = dark ? glassTokensDark.liquid.borderGlow : glassLiquidTokens.borderGlow;
      const bgBase = dark ? '30, 30, 30' : '255, 255, 255';
      const borderBase = '255, 255, 255';

      styles.background = `rgba(${bgBase}, ${opacity})`;
      styles.backdropFilter = `blur(${blur})`;
      styles.WebkitBackdropFilter = `blur(${blur})`;
      styles.border = `${glassTokens.borderWidth} solid rgba(${borderBase}, ${borderGlow})`;
      styles.boxShadow = [
        `0 4px 6px -1px rgba(0, 0, 0, ${dark ? glassTokensDark.base.shadowOpacity : glassTokens.shadowOpacity})`,
        `inset 0 1px 0 0 rgba(${borderBase}, ${borderGlow})`,
      ].join(', ');
      break;
    }

    case 'transparent': {
      const blur = dark ? glassTokensDark.transparent.blur : glassTransparentTokens.blur;
      const opacity = dark ? glassTokensDark.transparent.opacity : glassTransparentTokens.opacity;
      const bgBase = dark ? '30, 30, 30' : '255, 255, 255';
      const borderOpacity = dark ? glassTokensDark.base.borderOpacity : glassTokens.borderOpacity;

      styles.background = `rgba(${bgBase}, ${opacity})`;
      styles.backdropFilter = `blur(${blur})`;
      styles.WebkitBackdropFilter = `blur(${blur})`;
      styles.border = `${glassTokens.borderWidth} solid rgba(255, 255, 255, ${borderOpacity})`;
      break;
    }

    default: {
      // 'base' preset
      const opacity = dark ? glassTokensDark.base.opacity : glassTokens.opacity;
      const borderOpacity = dark ? glassTokensDark.base.borderOpacity : glassTokens.borderOpacity;
      const shadowOpacity = dark ? glassTokensDark.base.shadowOpacity : glassTokens.shadowOpacity;
      const bgBase = dark ? '30, 30, 30' : '255, 255, 255';

      styles.background = `rgba(${bgBase}, ${opacity})`;
      styles.backdropFilter = `blur(${glassTokens.blur})`;
      styles.WebkitBackdropFilter = `blur(${glassTokens.blur})`;
      styles.border = `${glassTokens.borderWidth} solid rgba(255, 255, 255, ${borderOpacity})`;
      styles.boxShadow = `0 4px 6px -1px rgba(0, 0, 0, ${shadowOpacity})`;
      break;
    }
  }

  return styles;
}

/**
 * Get the CSS class names for a glass effect (for use with the CSS stylesheet).
 * Dark mode is handled automatically by `[data-theme="dark"]` selectors in the CSS.
 *
 * @param options - Configuration for the glass effect
 * @returns Space-separated class name string
 */
export function glassClassName(options: GlassClassOptions = {}): string {
  const { preset = 'base', tint, tintOpacity } = options;

  const classes: string[] = [];

  switch (preset) {
    case 'frosted':
      classes.push('glass-frosted');
      break;
    case 'liquid':
      classes.push('glass-liquid');
      break;
    case 'transparent':
      classes.push('glass-transparent');
      break;
    default:
      classes.push('glass');
      break;
  }

  if (tint) {
    classes.push(`glass-tint-${tint}`);
  }

  if (tintOpacity !== undefined) {
    const rounded = Math.round((tintOpacity * 100) / 10) * 10;
    const clamped = Math.max(10, Math.min(100, rounded));
    classes.push(`glass-tint-opacity-${clamped}`);
  }

  return classes.join(' ');
}
