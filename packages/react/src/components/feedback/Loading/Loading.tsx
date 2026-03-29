import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor, Size } from '@artisanpack-ui/tokens';

type LoadingVariant = 'spinner' | 'dots' | 'ring' | 'ball' | 'bars' | 'infinity';

export interface LoadingProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** The color variant of the spinner */
  color?: DaisyColor;
  /** The size of the spinner */
  size?: Size;
  /** The visual style of the loading indicator */
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
