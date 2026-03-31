/** @module Textarea */

import { forwardRef, useId, type TextareaHTMLAttributes } from 'react';
import { cn } from '@artisanpack-ui/tokens';

/**
 * Props for the {@link Textarea} component.
 *
 * Extends native `<textarea>` HTML attributes. Provides a multi-line text input
 * with label, hint/error, inline label mode, and read-only styling.
 */
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Text label displayed above the textarea. Hidden when `inline` is true (shown as a fieldset label below). */
  label?: string;
  /** Helper text displayed below the textarea. Hidden when `error` is present. */
  hint?: string;
  /** Error message displayed below the textarea. Replaces `hint` when present and adds `aria-invalid`. */
  error?: string;
  /** When true, renders the label as an inline fieldset label below the textarea. @defaultValue `false` */
  inline?: boolean;
}

/**
 * A multi-line text input with DaisyUI styling, label, hint/error text, inline label mode,
 * and dashed border styling for read-only state. Automatically generates accessible IDs
 * and ARIA attributes.
 *
 * @example
 * ```tsx
 * <Textarea label="Comments" placeholder="Enter your comments..." rows={5} />
 * ```
 *
 * @example
 * ```tsx
 * <Textarea label="Notes" inline readOnly value={notes} hint="This field is read-only" />
 * ```
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { label, hint, error, inline = false, className, id: providedId, required, readOnly, ...rest },
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
        <textarea
          ref={ref}
          id={id}
          className={cn(
            'textarea w-full',
            error && 'textarea-error',
            readOnly && 'border-dashed',
            className,
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          aria-required={required || undefined}
          required={required}
          readOnly={readOnly}
          {...rest}
        />
        {inline && label && (
          <label className="fieldset-label" htmlFor={id}>
            {label}
          </label>
        )}
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

Textarea.displayName = 'Textarea';
