/** @module Range */

import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor } from '@artisanpack-ui/tokens';

/**
 * Props for the {@link Range} component.
 *
 * Extends native `<input>` HTML attributes (excluding `size` and `type`).
 * Renders a styled range slider with DaisyUI color variants.
 */
export interface RangeProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Text label displayed above the range slider. */
  label?: string;
  /** Helper text displayed below the slider. Hidden when `error` is present. */
  hint?: string;
  /** Error message displayed below the slider. Replaces `hint` when present and adds `aria-invalid`. */
  error?: string;
  /** DaisyUI color variant for the range track and thumb. */
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
 * A range slider input with DaisyUI styling, label, hint/error text, and color variants.
 * Defaults to a 0-100 range.
 *
 * @example
 * ```tsx
 * <Range label="Volume" min={0} max={100} value={volume} onChange={handleChange} color="primary" />
 * ```
 *
 * @example
 * ```tsx
 * <Range label="Brightness" hint="Adjust screen brightness" step={5} />
 * ```
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
