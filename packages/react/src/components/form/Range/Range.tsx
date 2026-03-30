import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor } from '@artisanpack-ui/tokens';

export interface RangeProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Range label */
  label?: string;
  /** Helper text below the range */
  hint?: string;
  /** Error message */
  error?: string;
  /** DaisyUI color variant */
  color?: DaisyColor;
}

const colorMap: Record<string, string> = {
  primary: 'range-primary',
  secondary: 'range-secondary',
  accent: 'range-accent',
  success: 'range-success',
  warning: 'range-warning',
  error: 'range-error',
  info: 'range-info',
};

/**
 * Slider/range input with label, hint, and color support.
 */
export const Range = forwardRef<HTMLInputElement, RangeProps>(
  (
    { label, hint, error, color, className, id: providedId, min = 0, max = 100, required, ...rest },
    ref,
  ) => {
    const autoId = useId();
    const id = providedId ?? autoId;
    const hintId = hint && !error ? `${id}-hint` : undefined;
    const errorId = error ? `${id}-error` : undefined;

    return (
      <fieldset className="fieldset">
        {label && (
          <legend className="fieldset-legend">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </legend>
        )}
        <input
          ref={ref}
          id={id}
          type="range"
          min={min}
          max={max}
          className={cn('range w-full', color && colorMap[color], className)}
          aria-invalid={error ? true : undefined}
          aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
          aria-required={required || undefined}
          required={required}
          {...rest}
        />
        {hint && !error && (
          <p id={hintId} className="fieldset-label">
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} className="fieldset-label text-error" role="alert">
            {error}
          </p>
        )}
      </fieldset>
    );
  },
);

Range.displayName = 'Range';
