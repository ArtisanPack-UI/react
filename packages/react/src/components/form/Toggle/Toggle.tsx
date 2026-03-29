import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor } from '@artisanpack-ui/tokens';

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Toggle label */
  label?: string;
  /** Position label on the right */
  right?: boolean;
  /** Helper text below the toggle */
  hint?: string;
  /** Error message */
  error?: string;
  /** DaisyUI color variant */
  color?: DaisyColor;
}

const colorMap: Record<string, string> = {
  primary: 'toggle-primary',
  secondary: 'toggle-secondary',
  accent: 'toggle-accent',
  success: 'toggle-success',
  warning: 'toggle-warning',
  error: 'toggle-error',
  info: 'toggle-info',
  neutral: 'toggle-neutral',
};

/**
 * Switch/toggle component with label, hint, and color support.
 */
export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      label,
      right = false,
      hint,
      error,
      color,
      className,
      id: providedId,
      required,
      ...rest
    },
    ref,
  ) => {
    const autoId = useId();
    const id = providedId ?? autoId;
    const hintId = hint && !error ? `${id}-hint` : undefined;
    const errorId = error ? `${id}-error` : undefined;

    return (
      <fieldset className="fieldset" role="group" aria-label={label}>
        <label
          htmlFor={id}
          className={cn('flex items-center gap-2 cursor-pointer', right && 'flex-row-reverse')}
        >
          <input
            ref={ref}
            id={id}
            type="checkbox"
            className={cn('toggle', color && colorMap[color], className)}
            role="switch"
            aria-invalid={error ? true : undefined}
            aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
            required={required}
            {...rest}
          />
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

Toggle.displayName = 'Toggle';
