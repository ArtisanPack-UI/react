import { forwardRef, type ProgressHTMLAttributes } from 'react';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor } from '@artisanpack-ui/tokens';

export interface ProgressProps extends Omit<ProgressHTMLAttributes<HTMLProgressElement>, 'color'> {
  value?: number;
  max?: number;
  color?: DaisyColor;
  indeterminate?: boolean;
  label?: string;
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
    const percentage = max > 0 ? Math.round((value / max) * 100) : 0;

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
          aria-label={label}
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
