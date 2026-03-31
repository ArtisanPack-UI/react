/**
 * @module Loading
 *
 * Renders an animated loading indicator using DaisyUI's loading
 * component. Supports multiple visual variants (spinner, dots, ring,
 * ball, bars, infinity), DaisyUI color schemes, and four sizes.
 *
 * @packageDocumentation
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor, Size } from '@artisanpack-ui/tokens';

/**
 * Visual variant of the loading indicator animation.
 */
type LoadingVariant = 'spinner' | 'dots' | 'ring' | 'ball' | 'bars' | 'infinity';

/**
 * Props for the {@link Loading} component.
 */
export interface LoadingProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** The DaisyUI color variant applied to the loading indicator. */
  color?: DaisyColor;
  /** The size of the loading indicator. */
  size?: Size;
  /** The visual animation style of the loading indicator. Defaults to `"spinner"`. */
  variant?: LoadingVariant;
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
  xs: 'loading-xs',
  sm: 'loading-sm',
  md: 'loading-md',
  lg: 'loading-lg',
};

const variantMap: Record<LoadingVariant, string> = {
  spinner: 'loading-spinner',
  dots: 'loading-dots',
  ring: 'loading-ring',
  ball: 'loading-ball',
  bars: 'loading-bars',
  infinity: 'loading-infinity',
};

/**
 * Loading indicator component with multiple animation variants.
 *
 * Renders a `<span>` with `role="status"` and an `aria-label` of
 * `"Loading"` for assistive technology support.
 *
 * @example
 * ```tsx
 * // Default spinner
 * <Loading />
 *
 * // Large colored dots
 * <Loading variant="dots" color="primary" size="lg" />
 * ```
 */
export const Loading = forwardRef<HTMLSpanElement, LoadingProps>(
  ({ color, size, variant = 'spinner', className, ...rest }, ref) => {
    return (
      <span
        ref={ref}
        role="status"
        aria-label="Loading"
        className={cn(
          'loading',
          variantMap[variant],
          color && colorMap[color],
          size && sizeMap[size],
          className,
        )}
        {...rest}
      />
    );
  },
);

Loading.displayName = 'Loading';
