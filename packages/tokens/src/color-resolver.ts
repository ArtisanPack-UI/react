/**
 * ArtisanPack UI - Color Resolver
 *
 * Runtime utility to resolve DaisyUI theme colors from CSS custom properties.
 * Works in browser environments where getComputedStyle is available.
 */

import { type DaisyColor, colors, daisyColorMap } from './colors';

/**
 * Resolve a DaisyUI theme color at runtime by reading its CSS custom property value.
 * Falls back to the default hex value when running outside a browser or when the
 * CSS variable is not set.
 *
 * @param color - The DaisyUI color name to resolve (e.g., 'primary', 'success')
 * @param element - Optional element to read computed styles from (defaults to document.documentElement)
 * @returns The resolved color value as a string (hex, oklch, or whatever is set via CSS)
 */
export function resolveColor(color: DaisyColor, element?: HTMLElement): string {
  const entry = daisyColorMap[color];

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return entry.defaultValue;
  }

  const el = element ?? document.documentElement;
  const resolved = getComputedStyle(el).getPropertyValue(entry.cssVar).trim();

  return resolved || entry.defaultValue;
}

/**
 * Resolve the content (text) color for a DaisyUI theme color.
 * For example, `resolveContentColor('primary')` returns the value of `--color-primary-content`.
 *
 * @param color - The DaisyUI color name
 * @param element - Optional element to read computed styles from
 * @returns The resolved content color value
 */
export function resolveContentColor(color: DaisyColor, element?: HTMLElement): string {
  const contentKey = `${color}Content` as keyof typeof colors;
  const cssVar = `--color-${color}-content`;
  const defaultValue = colors[contentKey] ?? '#ffffff';

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return defaultValue;
  }

  const el = element ?? document.documentElement;
  const resolved = getComputedStyle(el).getPropertyValue(cssVar).trim();

  return resolved || defaultValue;
}

/**
 * Resolve all DaisyUI theme colors at once.
 *
 * @param element - Optional element to read computed styles from
 * @returns Record mapping each DaisyUI color name to its resolved value
 */
export function resolveAllColors(element?: HTMLElement): Record<DaisyColor, string> {
  return {
    primary: resolveColor('primary', element),
    secondary: resolveColor('secondary', element),
    accent: resolveColor('accent', element),
    neutral: resolveColor('neutral', element),
    info: resolveColor('info', element),
    success: resolveColor('success', element),
    warning: resolveColor('warning', element),
    error: resolveColor('error', element),
  };
}
