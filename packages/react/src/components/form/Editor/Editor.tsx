import { forwardRef, useId, type TextareaHTMLAttributes } from 'react';
import { cn } from '@artisanpack-ui/tokens';

export interface EditorProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Editor label */
  label?: string;
  /** Helper text below the editor */
  hint?: string;
  /** Error message */
  error?: string;
}

/**
 * Code/text editor component.
 *
 * Renders a styled textarea by default. For a full code editor experience,
 * integrate a third-party library like CodeMirror or Monaco Editor and use
 * this component's prop interface as a base.
 */
export const Editor = forwardRef<HTMLTextAreaElement, EditorProps>(
  (
    {
      label,
      hint,
      error,
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
        {label && (
          <legend className="fieldset-legend">
            <label htmlFor={id}>
              {label}
              {required && <span className="text-error ml-1">*</span>}
            </label>
          </legend>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            'textarea w-full font-mono text-sm',
            error && 'textarea-error',
            className,
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          aria-required={required || undefined}
          required={required}
          rows={12}
          {...rest}
        />
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

Editor.displayName = 'Editor';
