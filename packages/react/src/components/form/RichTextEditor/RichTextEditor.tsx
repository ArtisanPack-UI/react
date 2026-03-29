import { forwardRef, useCallback, useEffect, useId, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@artisanpack-ui/tokens';

export interface RichTextEditorProps extends HTMLAttributes<HTMLDivElement> {
  /** Editor label */
  label?: string;
  /** Helper text below the editor */
  hint?: string;
  /** Error message */
  error?: string;
  /** The current HTML content */
  value?: string;
  /** Callback when content changes */
  onValueChange?: (value: string) => void;
  /** Toolbar content (custom toolbar elements) */
  toolbar?: ReactNode;
  /** Minimum height for the editable area */
  minHeight?: string;
  /** Whether the field is required */
  required?: boolean;
}

/**
 * Rich text editing component using contentEditable.
 *
 * For a full rich text editor experience, integrate a third-party library
 * like TipTap, Lexical, or Slate and use this component's prop interface
 * as a base. This component provides a basic contentEditable wrapper with
 * consistent styling.
 *
 * **Security warning:** The `value` prop is rendered via `dangerouslySetInnerHTML`.
 * You must ensure the HTML string is sanitized (e.g. with DOMPurify) or comes
 * from a trusted source before passing it to this component. Rendering unsanitized
 * user input will expose your application to XSS attacks.
 */
export const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorProps>(
  (
    {
      label,
      hint,
      error,
      value,
      onValueChange,
      toolbar,
      minHeight = '200px',
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

    const editorRef = useRef<HTMLDivElement | null>(null);
    const isInternalUpdate = useRef(false);

    const setRefs = useCallback(
      (el: HTMLDivElement | null) => {
        editorRef.current = el;
        if (typeof ref === 'function') {
          ref(el);
        } else if (ref) {
          ref.current = el;
        }
      },
      [ref],
    );

    // Sync external value changes without resetting cursor
    useEffect(() => {
      if (isInternalUpdate.current) {
        isInternalUpdate.current = false;
        return;
      }
      if (editorRef.current && value !== undefined && editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value;
      }
    }, [value]);

    return (
      <fieldset className="fieldset">
        {label && (
          <legend className="fieldset-legend">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </legend>
        )}
        <div
          className={cn(
            'border rounded-lg overflow-hidden',
            error && 'border-error',
            className,
          )}
        >
          {toolbar && (
            <div className="flex flex-wrap gap-1 p-2 border-b bg-base-200">
              {toolbar}
            </div>
          )}
          <div
            ref={setRefs}
            id={id}
            contentEditable
            role="textbox"
            aria-multiline="true"
            aria-label={label}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className="p-4 outline-none prose max-w-none"
            style={{ minHeight }}
            onInput={(e) => {
              isInternalUpdate.current = true;
              onValueChange?.((e.target as HTMLDivElement).innerHTML);
            }}
            suppressContentEditableWarning
            {...rest}
          />
        </div>
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

RichTextEditor.displayName = 'RichTextEditor';
