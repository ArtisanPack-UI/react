/** @module Editor */

import { forwardRef, useId, type TextareaHTMLAttributes } from 'react';
import { cn } from '@artisanpack-ui/tokens';

/**
 * Props for the {@link Editor} component.
 *
 * Extends native `<textarea>` HTML attributes. Provides a monospace-styled
 * textarea suitable for code or structured text editing.
 */
export interface EditorProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Text label displayed above the editor. */
  label?: string;
  /** Helper text displayed below the editor. Hidden when `error` is present. */
  hint?: string;
  /** Error message displayed below the editor. Replaces `hint` when present and adds `aria-invalid`. */
  error?: string;
}

/**
 * A code/text editor component that renders a monospace-styled textarea with label,
 * hint, and error support. Defaults to 12 rows of height.
 *
 * For a full code editor experience, integrate a third-party library like
 * CodeMirror or Monaco Editor and use this component's prop interface as a base.
 *
 * @example
 * ```tsx
 * <Editor label="HTML Source" placeholder="Enter HTML..." rows={20} />
 * ```
 *
 * @example
 * ```tsx
 * <Editor label="Config" value={config} onChange={handleChange} error={errors.config} />
 * ```
 */
export const Editor = forwardRef<HTMLTextAreaElement, EditorProps>(
  ({ label, hint, error, className, id: providedId, required, ...rest }, ref) => {
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
          className={cn('textarea w-full font-mono text-sm', error && 'textarea-error', className)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          aria-required={required || undefined}
          required={required}
          rows={12}
          {...rest}
        />
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

Editor.displayName = 'Editor';
