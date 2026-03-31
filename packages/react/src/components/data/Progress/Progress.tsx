/**
 * @module Progress
 *
 * Progress bar component built on the native `<progress>` element with DaisyUI styling.
 * Supports determinate and indeterminate states, color variants, and optional label/value display.
 */

import { forwardRef, type ProgressHTMLAttributes } from 'react';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor } from '@artisanpack-ui/tokens';

/**
 * Props for the {@link Progress} component.
 */
export interface ProgressProps extends Omit<ProgressHTMLAttributes<HTMLProgressElement>, 'color'> {
  /** Current progress value. @defaultValue 0 */
  value?: number;
  /** Maximum progress value (used to calculate percentage). @defaultValue 100 */
  max?: number;
  /** DaisyUI color variant for the progress bar fill. */
  color?: DaisyColor;
  /** Whether to show an indeterminate (loading) animation instead of a fixed value. @defaultValue false */
  indeterminate?: boolean;
  /** Label text displayed above the progress bar. Also used as the accessible aria-label. */
  label?: string;
  /** Whether to display the percentage value above the progress bar. @defaultValue false */
  showValue?: boolean;
}

const colorMap: Record<string, string> = {
  primary: 'progress-primary',
  secondary: 'progress-secondary',
  accent: 'progress-accent',
  success: 'progress-success',
  warning: 'progress-warning',
  error: 'progress-error',
  info: 'progress-info',
  neutral: 'progress-neutral',
};

/**
 * Progress bar component with DaisyUI styling and accessible ARIA attributes.
 *
 * Renders a native `<progress>` element with optional label and percentage display.
 * In indeterminate mode, the value and percentage are omitted.
 *
 * @example
 * ```tsx
 * <Progress value={65} max={100} color="primary" label="Upload" showValue />
 * <Progress indeterminate color="info" label="Loading..." />
 * ```
 */
export const Progress = forwardRef<HTMLProgressElement, ProgressProps>(
  (
    {
      value = 0,
      max = 100,
      color,
      indeterminate = false,
      label,
      showValue = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const percentage = max > 0 ? Math.max(0, Math.min(100, Math.round((value / max) * 100))) : 0;

    return (
      <div className="w-full">
        {(label || showValue) && (
          <div className="flex justify-between mb-1 text-sm">
            {label && <span>{label}</span>}
            {showValue && !indeterminate && <span>{percentage}%</span>}
          </div>
        )}
        <progress
          ref={ref}
          className={cn('progress w-full', color && colorMap[color], className)}
          aria-label={label ?? 'Progress'}
          aria-valuenow={indeterminate ? undefined : value}
          aria-valuemin={0}
          aria-valuemax={max}
          {...(indeterminate ? {} : { value, max })}
          {...rest}
        />
      </div>
    );
  },
);

Progress.displayName = 'Progress';
