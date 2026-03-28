/**
 * ArtisanPack UI - Shared Types
 *
 * Framework-agnostic type definitions shared across all ArtisanPack UI packages.
 */

import type { DaisyColor } from './colors';
import type { GlassPreset } from './glass';

export type { DaisyColor } from './colors';
export type { GlassPreset, GlassTint, GlassStyleOptions } from './glass';

/** Component size scale */
export type Size = 'xs' | 'sm' | 'md' | 'lg';

/** Props for components that support glass effects */
export interface GlassProps {
  glass?: boolean;
  glassPreset?: GlassPreset;
}

/** Props for components that accept a DaisyUI color */
export interface ColorProps {
  color?: DaisyColor;
}

/** Props for form field components */
export interface FormFieldProps {
  label?: string;
  error?: string;
  hint?: string;
}

/**
 * CSS properties type compatible with both React and plain objects.
 * Uses a permissive Record to avoid framework-specific imports.
 */
export type CSSProperties = Record<string, string | number | undefined>;
