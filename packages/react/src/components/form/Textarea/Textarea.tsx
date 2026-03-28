import { forwardRef, useId, type TextareaHTMLAttributes } from 'react';
import { cn } from '@artisanpack-ui/tokens';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Textarea label */
  label?: string;
  /** Helper text below the textarea */
  hint?: string;
  /** Error message */
  error?: string;
  /** Display label inline (floating) */
  inline?: boolean;
}

/**
 * Multi-line text input with label, hint, and error support.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      hint,
      error,
      inline = false,
      className,
      id: providedId,
      required,
      readOnly,
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
