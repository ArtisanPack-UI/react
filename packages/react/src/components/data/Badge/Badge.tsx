/**
 * @module Badge
 *
 * Inline badge component for displaying short labels, counts, or status indicators.
 * Built on DaisyUI's badge classes with support for color variants, sizes, and outline style.
 */

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor, Size } from '@artisanpack-ui/tokens';

/**
 * Props for the {@link Badge} component.
 */
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Content to display inside the badge. Falls back to `children` if not provided. */
  value?: ReactNode;
  /** DaisyUI color variant, or 'ghost' for a subtle appearance. */
  color?: DaisyColor | 'ghost';
  /** Size of the badge (xs, sm, md, lg). */
  size?: Size;
  /** Whether to render with an outline style instead of a solid fill. */
  outline?: boolean;
}

const colorMap: Record<string, string> = {
  primary: 'badge-primary',
  secondary: 'badge-secondary',
  accent: 'badge-accent',
  success: 'badge-success',
  warning: 'badge-warning',
  error: 'badge-error',
  info: 'badge-info',
  neutral: 'badge-neutral',
  ghost: 'badge-ghost',
};

const sizeMap: Record<Size, string> = {
  xs: 'badge-xs',
  sm: 'badge-sm',
  md: 'badge-md',
  lg: 'badge-lg',
};

/**
 * Inline badge component for displaying labels, counts, or status indicators.
 *
 * Renders a `<span>` with DaisyUI badge classes. Accepts content via the `value`
 * prop or `children`.
 *
 * @example
 * ```tsx
 * <Badge value="NEW" color="primary" size="sm" />
 * <Badge color="error" outline>3</Badge>
 * ```
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ value, color, size, outline = false, className, children, ...rest }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'badge',
          color && colorMap[color],
          size && sizeMap[size],
          outline && 'badge-outline',
          className,
        )}
        {...rest}
      >
        {value ?? children}
      </span>
    );
  },
);

Badge.displayName = 'Badge';
