/** @module Toggle */

import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor } from '@artisanpack-ui/tokens';

/**
 * Props for the {@link Toggle} component.
 *
 * Extends native `<input>` HTML attributes (excluding `size` and `type`).
 * Renders a switch/toggle using a styled checkbox with `role="switch"`.
 */
export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Text label displayed next to the toggle switch. Includes a required indicator when `required` is true. */
  label?: string;
  /** When true, positions the label to the right of the toggle (reverses flex order). @defaultValue `false` */
  right?: boolean;
  /** Helper text displayed below the toggle. Hidden when `error` is present. */
  hint?: string;
  /** Error message displayed below the toggle. Replaces `hint` when present and adds `aria-invalid`. */
  error?: string;
  /** DaisyUI color variant for the toggle track and thumb. */
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
 * A switch/toggle component rendered as a styled checkbox with `role="switch"` for
 * accessibility. Supports label positioning, DaisyUI color variants, and hint/error text.
 *
 * @example
 * ```tsx
 * <Toggle label="Enable notifications" color="success" />
 * ```
 *
 * @example
 * ```tsx
 * <Toggle label="Dark mode" right hint="Toggle dark mode theme" />
 * ```
 */
export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    { label, right = false, hint, error, color, className, id: providedId, required, ...rest },
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

Toggle.displayName = 'Toggle';
