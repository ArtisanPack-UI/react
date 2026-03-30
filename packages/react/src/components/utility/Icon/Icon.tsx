/**
 * @module Icon
 *
 * A lightweight SVG icon wrapper that supports DaisyUI color tokens,
 * predefined sizes, and accessible labeling. Pass a single `path`
 * string for simple icons or use `children` for multi-path SVGs.
 *
 * @packageDocumentation
 */

import { forwardRef, type SVGAttributes } from 'react';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor, Size } from '@artisanpack-ui/tokens';

/**
 * Props for the {@link Icon} component.
 */
export interface IconProps extends SVGAttributes<SVGSVGElement> {
  /** SVG path `d` attribute for single-path icons. Mutually exclusive with `children`. */
  path?: string;
  /** DaisyUI color variant applied as a text color class. */
  color?: DaisyColor;
  /** Predefined size preset. Defaults to `"md"`. */
  size?: Size;
  /**
   * Accessible label for the icon. When provided, the SVG is given
   * `role="img"` and `aria-label`. When omitted, the icon is treated
   * as decorative and hidden from assistive technologies.
   */
  label?: string;
  /** SVG `viewBox` attribute. Defaults to `"0 0 24 24"`. */
  viewBox?: string;
}

const colorMap: Record<DaisyColor, string> = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  accent: 'text-accent',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
  info: 'text-info',
  neutral: 'text-neutral',
};

const sizeMap: Record<Size, string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

/**
 * SVG icon component with DaisyUI color and size support.
 *
 * Accepts either a `path` prop for a single-path icon or `children`
 * for complex multi-path SVGs. When no `label` is provided, the icon
 * is marked as decorative via `aria-hidden="true"`.
 *
 * @example
 * ```tsx
 * // Single-path icon
 * <Icon path="M12 2L2 22h20L12 2z" color="warning" size="lg" label="Warning" />
 *
 * // Multi-path icon via children
 * <Icon size="md">
 *   <path d="M12 2L2 22h20L12 2z" />
 *   <circle cx="12" cy="16" r="1" />
 * </Icon>
 * ```
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(
  (
    { path, color, size = 'md', label, viewBox = '0 0 24 24', className, children, ...rest },
    ref,
  ) => {
    const isDecorative = !label;

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
        fill="currentColor"
        aria-hidden={isDecorative || undefined}
        aria-label={label}
        role={label ? 'img' : undefined}
        className={cn(sizeMap[size], color && colorMap[color], className)}
        {...rest}
      >
        {path ? <path d={path} /> : children}
      </svg>
    );
  },
);

Icon.displayName = 'Icon';
