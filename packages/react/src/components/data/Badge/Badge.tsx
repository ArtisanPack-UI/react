import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor, Size } from '@artisanpack-ui/tokens';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  value?: ReactNode;
  color?: DaisyColor | 'ghost';
  size?: Size;
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
