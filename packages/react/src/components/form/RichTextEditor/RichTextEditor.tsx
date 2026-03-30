/** @module RichTextEditor */

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '@artisanpack-ui/tokens';

/**
 * Props for the {@link RichTextEditor} component.
 *
 * Extends native `<div>` HTML attributes. Provides a `contentEditable` wrapper
 * with toolbar support, controlled HTML value, and consistent form field styling.
 */
export interface RichTextEditorProps extends HTMLAttributes<HTMLDivElement> {
  /** Text label displayed above the editor. */
  label?: string;
  /** Helper text displayed below the editor. Hidden when `error` is present. */
  hint?: string;
  /** Error message displayed below the editor. Replaces `hint` when present and adds `aria-invalid`. */
  error?: string;
  /**
   * The current HTML content for the editable area. Rendered via `dangerouslySetInnerHTML`.
   *
   * **Security warning:** Always sanitize this value (e.g., with DOMPurify) before passing
   * user-generated content to prevent XSS attacks.
   */
  value?: string;
  /** Callback fired on every input event with the current `innerHTML` of the editable area. */
  onValueChange?: (value: string) => void;
  /** Custom toolbar content rendered above the editable area inside a styled toolbar bar. */
  toolbar?: ReactNode;
  /** CSS min-height for the editable content area. @defaultValue `'200px'` */
  minHeight?: string;
  /** Whether the field is required. Shows a required indicator on the label. */
  required?: boolean;
}

/**
 * A rich text editor using `contentEditable` with an optional toolbar, controlled HTML
 * value management, and consistent DaisyUI form field styling. Syncs external value
 * changes without resetting the cursor position.
 *
 * For a full rich text editor experience, integrate a third-party library
 * like TipTap, Lexical, or Slate and use this component's prop interface
 * as a base. This component provides a basic contentEditable wrapper with
 * consistent styling.
 *
 * **Security warning:** The `value` prop is rendered via `dangerouslySetInnerHTML`.
 * Always sanitize HTML (e.g., with DOMPurify) before passing user-generated content.
 *
 * @example
 * ```tsx
 * <RichTextEditor label="Description" value={html} onValueChange={setHtml} />
 * ```
 *
 * @example
 * ```tsx
 * <RichTextEditor
 *   label="Content"
 *   toolbar={<><button onClick={handleBold}>B</button><button onClick={handleItalic}>I</button></>}
 *   minHeight="300px"
 * />
 * ```
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
          className={cn('border rounded-lg overflow-hidden', error && 'border-error', className)}
        >
          {toolbar && (
            <div className="flex flex-wrap gap-1 p-2 border-b bg-base-200">{toolbar}</div>
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

RichTextEditor.displayName = 'RichTextEditor';
