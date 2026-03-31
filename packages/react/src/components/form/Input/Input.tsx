/** @module Input */

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@artisanpack-ui/tokens';

/**
 * Props for the {@link Input} component.
 *
 * Extends native `<input>` HTML attributes (excluding `prefix` and `size`).
 * Provides a comprehensive text input with label, icons, prefix/suffix adornments,
 * clearable action, and inline label mode.
 */
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'size'> {
  /** Text label displayed above the input. Hidden when `inline` is true (shown as floating label instead). */
  label?: string;
  /** Helper text displayed below the input. Hidden when `error` is present. */
  hint?: string;
  /** Error message displayed below the input. Replaces `hint` when present and adds `aria-invalid`. */
  error?: string;
  /** Icon element rendered to the left of the input text. Wrapped with `aria-hidden="true"`. */
  icon?: ReactNode;
  /** Icon element rendered to the right of the input text. Wrapped with `aria-hidden="true"`. */
  iconRight?: ReactNode;
  /** Text or element rendered as a prefix inside the input, before the text area. */
  prefix?: ReactNode;
  /** Text or element rendered as a suffix inside the input, after the text area. */
  suffix?: ReactNode;
  /** When true, shows a clear (X) button inside the input. @defaultValue `false` */
  clearable?: boolean;
  /** Callback fired when the clear button is clicked. Use this to reset the input value. */
  onClear?: () => void;
  /** When true, renders the label as a floating/inline label inside the input wrapper. @defaultValue `false` */
  inline?: boolean;
}

/**
 * A text input component with DaisyUI styling, supporting labels, hint/error text,
 * left/right icons, prefix/suffix adornments, a clearable action button, and
 * an inline (floating) label mode. Automatically generates accessible IDs and ARIA attributes.
 *
 * @example
 * ```tsx
 * <Input label="Email" type="email" placeholder="you@example.com" required />
 * ```
 *
 * @example
 * ```tsx
 * <Input
 *   label="Price"
 *   prefix="$"
 *   suffix="USD"
 *   clearable
 *   onClear={() => setValue('')}
 *   icon={<CurrencyIcon />}
 * />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hint,
      error,
      icon,
      iconRight,
      prefix,
      suffix,
      clearable = false,
      onClear,
      inline = false,
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

    return (
      <fieldset className="fieldset">
        {label && !inline && (
          <legend className="fieldset-legend">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </legend>
        )}
        <label
          className={cn(
            'input',
            'w-full',
            (icon || iconRight || prefix || suffix || clearable) && 'input-bordered',
            error && 'input-error',
            className,
          )}
          htmlFor={id}
        >
          {icon && (
            <span className="opacity-50" aria-hidden="true">
              {icon}
            </span>
          )}
          {prefix && (
            <span className="opacity-50" aria-hidden="true">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            className="grow"
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            aria-required={required || undefined}
            required={required}
            {...rest}
          />
          {inline && label && <span className="label">{label}</span>}
          {suffix && (
            <span className="opacity-50" aria-hidden="true">
              {suffix}
            </span>
          )}
          {clearable && (
            <button
              type="button"
              className="opacity-50 hover:opacity-100 cursor-pointer"
              onClick={onClear}
              aria-label="Clear input"
              tabIndex={-1}
            >
              ✕
            </button>
          )}
          {iconRight && (
            <span className="opacity-50" aria-hidden="true">
              {iconRight}
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

Input.displayName = 'Input';
