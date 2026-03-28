import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor } from '@artisanpack-ui/tokens';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Checkbox label */
  label?: string;
  /** Position label on the right */
  right?: boolean;
  /** Helper text below the checkbox */
  hint?: string;
  /** Error message */
  error?: string;
  /** DaisyUI color variant */
  color?: DaisyColor;
  /** Display as card variant */
  card?: boolean;
  /** Custom card CSS classes */
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
};

/**
 * Single checkbox with label, hint, card variant, and color support.
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
    const hintId = hint ? `${id}-hint` : undefined;

    const checkbox = (
      <input
        ref={ref}
        id={id}
        type="checkbox"
        className={cn(
          'checkbox',
          color && colorMap[color],
          className,
        )}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
        {...rest}
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
            <p id={hintId} className="fieldset-label">{hint}</p>
          )}
          {error && (
            <p id={errorId} className="fieldset-label text-error" role="alert">{error}</p>
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
          <p id={hintId} className="fieldset-label">{hint}</p>
        )}
        {error && (
          <p id={errorId} className="fieldset-label text-error" role="alert">{error}</p>
        )}
      </fieldset>
    );
  },
);

Checkbox.displayName = 'Checkbox';
