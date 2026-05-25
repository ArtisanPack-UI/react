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
  /** When true, renders the label as a floating label using daisyUI's `floating-label` pattern. @defaultValue `false` */
  inline?: boolean;
}

/**
 * A text input component with daisyUI v5 styling, supporting labels, hint/error text,
 * left/right icons, prefix/suffix adornments, a clearable action button, and
 * a floating label mode. Automatically generates accessible IDs and ARIA attributes.
 *
 * Renders the canonical accessible pattern for a single labeled input: a `<label htmlFor>`
 * paired with the `<input id>`. The visible label and helper text use daisyUI v5's
 * `.fieldset`, `.fieldset-legend`, and `.fieldset-label` utility classes on plain
 * elements — `<fieldset>`/`<legend>` HTML elements are reserved for groups of related
 * controls (e.g. radio/checkbox groups) and are intentionally not used here.
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

    const inputBox = (
      <span
        className={cn(
          'input',
          'w-full',
          (icon || iconRight || prefix || suffix || clearable) && 'input-bordered',
          error && 'input-error',
          className,
        )}
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
          // In inline mode, a single-space placeholder triggers :placeholder-shown so daisyUI's
          // floating-label CSS positions/animates the label correctly without showing visible text.
          placeholder={rest.placeholder ?? (inline && label ? ' ' : undefined)}
          {...rest}
        />
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
          >
            ✕
          </button>
        )}
        {iconRight && (
          <span className="opacity-50" aria-hidden="true">
            {iconRight}
          </span>
        )}
      </span>
    );

    if (inline && label) {
      return (
        <div className="fieldset w-full">
          <label htmlFor={id} className="floating-label w-full">
            <span>
              {label}
              {required && <span className="text-error ml-1">*</span>}
            </span>
            {inputBox}
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
        </div>
      );
    }

    return (
      <div className="fieldset w-full">
        {label && (
          <label htmlFor={id} className="fieldset-legend">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        {inputBox}
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
      </div>
    );
  },
);

Input.displayName = 'Input';
