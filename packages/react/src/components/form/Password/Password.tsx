/** @module Password */

import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@artisanpack-ui/tokens';

/**
 * Props for the {@link Password} component.
 *
 * Extends native `<input>` HTML attributes (excluding `type`, `size`, and `prefix`).
 * Provides a password input with built-in visibility toggle, clearable action,
 * and customizable toggle icons.
 */
export interface PasswordProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size' | 'prefix'
> {
  /** Text label displayed above the password input. Hidden when `inline` is true. */
  label?: string;
  /** Helper text displayed below the input. Hidden when `error` is present. */
  hint?: string;
  /** Error message displayed below the input. Replaces `hint` when present and adds `aria-invalid`. */
  error?: string;
  /** Icon element rendered to the left of the input text. */
  icon?: ReactNode;
  /** When true, renders the label as a floating/inline label inside the input wrapper. @defaultValue `false` */
  inline?: boolean;
  /** When true, shows a clear (X) button inside the input. @defaultValue `false` */
  clearable?: boolean;
  /** Callback fired when the clear button is clicked. */
  onClear?: () => void;
  /** When true, hides the password visibility toggle button. @defaultValue `false` */
  hideToggle?: boolean;
  /** Custom icon shown when the password is hidden (masked). Defaults to an eye-slash SVG. */
  hiddenIcon?: ReactNode;
  /** Custom icon shown when the password is visible (unmasked). Defaults to an eye SVG. */
  visibleIcon?: ReactNode;
}

const EyeIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EyeSlashIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
    />
  </svg>
);

/**
 * A password input with a built-in visibility toggle that switches between masked and
 * plain text display. Includes optional clear button, left icon, and customizable
 * toggle icons. The `type` attribute is managed internally and cannot be overridden.
 *
 * @example
 * ```tsx
 * <Password label="Password" placeholder="Enter password" required />
 * ```
 *
 * @example
 * ```tsx
 * <Password
 *   label="API Key"
 *   icon={<KeyIcon />}
 *   clearable
 *   onClear={() => setValue('')}
 *   hideToggle
 * />
 * ```
 */
export const Password = forwardRef<HTMLInputElement, PasswordProps>(
  (
    {
      label,
      hint,
      error,
      icon,
      inline = false,
      clearable = false,
      onClear,
      hideToggle = false,
      hiddenIcon,
      visibleIcon,
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
    const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

    const [visible, setVisible] = useState(false);

    return (
      <fieldset className="fieldset">
        {label && !inline && (
          <legend className="fieldset-legend">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </legend>
        )}
        <label className={cn('input w-full', error && 'input-error', className)} htmlFor={id}>
          {icon && (
            <span className="opacity-50" aria-hidden="true">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            type={visible ? 'text' : 'password'}
            className="grow"
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            aria-required={required || undefined}
            required={required}
            {...rest}
          />
          {inline && label && <span className="label">{label}</span>}
          {clearable && (
            <button
              type="button"
              className="opacity-50 hover:opacity-100 cursor-pointer"
              onClick={onClear}
              aria-label="Clear password"
              tabIndex={-1}
            >
              ✕
            </button>
          )}
          {!hideToggle && (
            <button
              type="button"
              className="opacity-50 hover:opacity-100 cursor-pointer"
              onClick={() => setVisible((v) => !v)}
              aria-label={visible ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {visible ? (visibleIcon ?? <EyeIcon />) : (hiddenIcon ?? <EyeSlashIcon />)}
            </button>
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

Password.displayName = 'Password';
