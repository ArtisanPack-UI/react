/** @module File */

import {
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
  type DragEvent,
  type InputHTMLAttributes,
} from 'react';
import { cn } from '@artisanpack-ui/tokens';

/**
 * Props for the {@link File} component.
 *
 * Extends native `<input>` HTML attributes (excluding `size`, `type`, `value`, and `defaultValue`).
 * Supports both standard file input and drag-and-drop zone rendering modes.
 */
export interface FileProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'value' | 'defaultValue'
> {
  /** Text label displayed above the file input. */
  label?: string;
  /** Helper text displayed below the file input. Hidden when `error` is present. */
  hint?: string;
  /** Error message displayed below the input. Replaces `hint` when present and adds `aria-invalid`. */
  error?: string;
  /** When true, renders a drag-and-drop zone instead of the standard file input. @defaultValue `false` */
  withDragDrop?: boolean;
  /** Custom text displayed inside the drag-and-drop zone. @defaultValue `'Drop files here or click to browse'` */
  dragDropText?: string;
  /** Additional CSS classes applied to the drag-and-drop zone container. */
  dragDropClass?: string;
  /** Upload progress percentage (0-100). When greater than 0, a progress bar is displayed. */
  progress?: number;
  /** When true, hides the upload progress bar even when `progress` is set. @defaultValue `false` */
  hideProgress?: boolean;
  /** Callback fired when files are selected, either via input change or drag-and-drop. Receives the `FileList` or `null`. */
  onFilesSelected?: (files: FileList | null) => void;
}

/**
 * A file upload component with two rendering modes: a standard styled file input and
 * a drag-and-drop zone. Supports upload progress display, accessible keyboard interaction,
 * and a unified `onFilesSelected` callback for both modes.
 *
 * @example
 * ```tsx
 * <File label="Upload Resume" accept=".pdf,.doc" onFilesSelected={handleFiles} />
 * ```
 *
 * @example
 * ```tsx
 * <File label="Images" withDragDrop multiple progress={uploadProgress} accept="image/*" />
 * ```
 */
export const File = forwardRef<HTMLInputElement, FileProps>(
  (
    {
      label,
      hint,
      error,
      withDragDrop = false,
      dragDropText = 'Drop files here or click to browse',
      dragDropClass,
      progress,
      hideProgress = false,
      onFilesSelected,
      className,
      id: providedId,
      required,
      onChange,
      ...rest
    },
    ref,
  ) => {
    const autoId = useId();
    const id = providedId ?? autoId;
    const hintId = hint && !error ? `${id}-hint` : undefined;
    const errorId = error ? `${id}-error` : undefined;
    const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const setRefs = useCallback(
      (el: HTMLInputElement | null) => {
        inputRef.current = el;
        if (typeof ref === 'function') {
          ref(el);
        } else if (ref) {
          ref.current = el;
        }
      },
      [ref],
    );

    const handleDragOver = useCallback((e: DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback(() => {
      setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
      (e: DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length > 0 && inputRef.current) {
          inputRef.current.files = e.dataTransfer.files;
          onFilesSelected?.(e.dataTransfer.files);
          inputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
        }
      },
      [onFilesSelected],
    );

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e);
        onFilesSelected?.(e.target.files);
      },
      [onChange, onFilesSelected],
    );

    if (withDragDrop) {
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
              'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
              isDragging ? 'border-primary bg-primary/5' : 'border-base-300 hover:border-primary',
              error && 'border-error',
              dragDropClass,
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                inputRef.current?.click();
              }
            }}
            aria-label={label ?? 'File upload'}
          >
            <input
              ref={setRefs}
              id={id}
              type="file"
              className="hidden"
              required={required}
              onChange={handleChange}
              aria-invalid={error ? true : undefined}
              aria-describedby={describedBy}
              {...rest}
            />
            <p className="opacity-60">{dragDropText}</p>
          </div>
          {!hideProgress && progress !== undefined && progress > 0 && (
            <progress
              className="progress progress-primary w-full mt-2"
              value={progress}
              max={100}
              aria-label="Upload progress"
            />
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
    }

    return (
      <fieldset className="fieldset">
        {label && (
          <legend className="fieldset-legend">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </legend>
        )}
        <input
          ref={setRefs}
          id={id}
          type="file"
          className={cn('file-input w-full', error && 'file-input-error', className)}
          required={required}
          onChange={handleChange}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...rest}
        />
        {!hideProgress && progress !== undefined && progress > 0 && (
          <progress
            className="progress progress-primary w-full mt-2"
            value={progress}
            max={100}
            aria-label="Upload progress"
          />
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

File.displayName = 'File';
