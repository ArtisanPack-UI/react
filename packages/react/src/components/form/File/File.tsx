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

export interface FileProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'value' | 'defaultValue'> {
  /** File input label */
  label?: string;
  /** Helper text below the file input */
  hint?: string;
  /** Error message */
  error?: string;
  /** Enable drag-and-drop zone */
  withDragDrop?: boolean;
  /** Text for drag-drop area */
  dragDropText?: string;
  /** Additional CSS classes for drag-drop area */
  dragDropClass?: string;
  /** Show upload progress */
  progress?: number;
  /** Hide upload progress bar */
  hideProgress?: boolean;
  /** Callback with selected files */
  onFilesSelected?: (files: FileList | null) => void;
}

/**
 * File upload component with drag-and-drop support and progress display.
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
          onChange?.({ target: inputRef.current } as React.ChangeEvent<HTMLInputElement>);
        }
      },
      [onChange, onFilesSelected],
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
            <p id={hintId} className="fieldset-label">{hint}</p>
          )}
          {error && (
            <p id={errorId} className="fieldset-label text-error" role="alert">{error}</p>
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
          <p id={hintId} className="fieldset-label">{hint}</p>
        )}
        {error && (
          <p id={errorId} className="fieldset-label text-error" role="alert">{error}</p>
        )}
      </fieldset>
    );
  },
);

File.displayName = 'File';
