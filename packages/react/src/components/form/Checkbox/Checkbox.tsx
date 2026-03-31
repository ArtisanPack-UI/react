/** @module Checkbox */

import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor } from '@artisanpack-ui/tokens';

/**
 * Props for the {@link Checkbox} component.
 *
 * Extends native `<input>` HTML attributes (excluding `size` and `type`).
 * Supports both standard and card layout variants.
 */
export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type'
> {
  /** Text label displayed next to the checkbox. Includes a required indicator when `required` is true. */
  label?: string;
  /** When true, positions the label to the right of the checkbox (reverses flex order). @defaultValue `false` */
  right?: boolean;
  /** Helper text displayed below the checkbox. Hidden when `error` is present. */
  hint?: string;
  /** Error message displayed below the checkbox. Replaces `hint` when present and adds `aria-invalid`. */
  error?: string;
  /** DaisyUI color variant for the checkbox indicator. */
  color?: DaisyColor;
  /** When true, renders the checkbox inside a bordered card layout with checked-state highlighting. @defaultValue `false` */
  card?: boolean;
  /** Additional CSS classes applied to the card container when `card` is true. */
  cardClass?: string;
}

const colorMap: Record<string, string> = {
  primary: 'checkbox-primary',
  secondary: 'checkbox-secondary',
  accent: 'checkbox-accent',
  success: 'checkbox-success',
  warning: 'checkbox-warning',
  error: 'checkbox-error',
  info: 'checkbox-info',
  neutral: 'checkbox-neutral',
};

/**
 * A single checkbox input with label, hint text, error state, DaisyUI color variants,
 * and an optional card layout. Automatically generates accessible IDs and ARIA attributes.
 *
 * @example
 * ```tsx
 * <Checkbox label="Accept terms" color="primary" required />
 * ```
 *
 * @example
 * ```tsx
 * <Checkbox label="Premium plan" card hint="Includes all features" />
 * ```
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      right = false,
      hint,
      error,
      color,
      card = false,
      cardClass,
      className,
      id: providedId,
      required,
      ...rest
    },
    ref,
  ) => {
    const autoId = useId();
    const id = providedId ?? autoId;
    const errorId = error ? `${id}-error` : undefined;
    const hintId = hint && !error ? `${id}-hint` : undefined;

    const checkbox = (
      <input
        ref={ref}
        id={id}
        type="checkbox"
        className={cn('checkbox', color && colorMap[color], className)}
        required={required}
        {...rest}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
      />
    );

    if (card) {
      return (
        <fieldset className="fieldset">
          <label
            htmlFor={id}
            className={cn(
              'flex items-center gap-3 p-4 border rounded-lg cursor-pointer',
              'hover:bg-base-200 transition-colors',
              'has-[:checked]:border-primary has-[:checked]:bg-primary/5',
              cardClass,
            )}
          >
            {checkbox}
            {label && (
              <span>
                {label}
                {required && <span className="text-error ml-1">*</span>}
              </span>
            )}
          </label>
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
    }

    return (
      <fieldset className="fieldset">
        <label
          htmlFor={id}
          className={cn('flex items-center gap-2 cursor-pointer', right && 'flex-row-reverse')}
        >
          {checkbox}
          {label && (
            <span>
              {label}
              {required && <span className="text-error ml-1">*</span>}
            </span>
          )}
        </label>
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

Checkbox.displayName = 'Checkbox';
