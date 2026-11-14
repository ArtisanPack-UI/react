/**
 * @module File
 *
 * The design-system File (#53): a native file input transparent over a
 * drop zone, and the list of chosen files with their size, progress,
 * errors and a remove button. Renders the `.apui-file` markup contract
 * styled by `@artisanpack-ui/css`.
 *
 * `File` shadows the browser global inside modules that import it; import
 * it under another name (`import { File as FileUpload }`) where you also
 * need the global (vocabulary decision 5).
 */

import {
  forwardRef,
  useCallback,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

import { fillTemplate } from '../../../internal/choice';
import { FieldError, FieldLabel, useFieldIds } from '../../../internal/field';
import { IconSvg } from '../../../internal/icon';
import { cx, flag, hasContent, type PartClasses } from '../../../internal/parts';
import { Button } from '../Button/Button';

/** A listed file that isn't a browser `File`: a stored or uploading file. */
export interface FileEntry {
  /** The file name. */
  name: string;
  /** The size in bytes. */
  size?: number;
  /** Upload progress, 0 to 100. Shows a progress bar. */
  progress?: number;
  /** An error for this file. Marks its row and replaces the size. */
  error?: string;
}

/** One listed file: a browser `File` or an entry. */
export type FileItem = globalThis.File | FileEntry;

/** The parts a {@link File} accepts extra classes for. */
export type FilePart =
  | 'root'
  | 'label'
  | 'required'
  | 'dropzone'
  | 'control'
  | 'icon'
  | 'title'
  | 'hint'
  | 'list'
  | 'item'
  | 'thumb'
  | 'name'
  | 'meta'
  | 'progress'
  | 'actions'
  | 'error';

/** The default drop zone title. Pass `title` to translate it. */
export const FILE_DEFAULT_TITLE = 'Drop files here or browse';

/** The default remove label, with `:name`. Pass `removeLabel` to translate it. */
export const FILE_DEFAULT_REMOVE_LABEL = 'Remove :name';

/** A size as text: `2.4 MB`, decimal units, one decimal place. */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unit = 0;
  while (size >= 1000 && unit < units.length - 1) {
    size /= 1000;
    unit += 1;
  }
  const number = unit === 0 ? String(Math.trunc(size)) : String(Math.round(size * 10) / 10);
  return `${number} ${units[unit]}`;
}

/**
 * Props for the {@link File} component.
 *
 * `className` goes to the root; every other native attribute (`name`,
 * `aria-*`, `id`, `capture`, …) goes to the native file input.
 */
export interface FileProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'defaultValue' | 'title' | 'size'
> {
  /** The visible label, for the input. Without it, the title names the input. */
  label?: ReactNode;
  /** The drop zone's main line. @defaultValue `'Drop files here or browse'` */
  title?: string;
  /** The limits under the title, linked with `aria-describedby`. */
  hint?: ReactNode;
  /** Validation message. Marks the field invalid and is linked with `aria-describedby`. */
  error?: string;
  /** Marks the field invalid without a message. @defaultValue `false` */
  invalid?: boolean;
  /** Disables the input. @defaultValue `false` */
  disabled?: boolean;
  /** Marks the field required and shows the required mark. @defaultValue `false` */
  required?: boolean;
  /** The accepted types. */
  accept?: string;
  /** Allows several files. @defaultValue `false` */
  multiple?: boolean;
  /** The largest file in bytes, emitted as `data-max-size`. Validate in `onValueChange`. */
  maxSize?: number;
  /** A large centered drop zone, or a compact row. @defaultValue `'dropzone'` */
  variant?: 'dropzone' | 'compact';
  /** The files to list (controlled). Without it, the chosen files are listed. */
  value?: FileItem[];
  /** The remove buttons' name, with `:name`. @defaultValue `'Remove :name'` */
  removeLabel?: string;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<FilePart>;
  /** Called with the chosen files, or the list after a removal. */
  onValueChange?: (files: FileItem[]) => void;
  /** Called with a file whose remove button was pressed. */
  onRemove?: (file: FileItem, index: number) => void;
}

/**
 * Uploads files by dropping or browsing. The ref points at the native input.
 *
 * @example
 * ```tsx
 * <File label="Photos" multiple accept="image/*" value={photos} onValueChange={setPhotos} />
 * ```
 */
export const File = forwardRef<HTMLInputElement, FileProps>(
  (
    {
      label,
      title = FILE_DEFAULT_TITLE,
      hint,
      error,
      invalid = false,
      disabled = false,
      required = false,
      accept,
      multiple = false,
      maxSize,
      variant = 'dropzone',
      value,
      removeLabel = FILE_DEFAULT_REMOVE_LABEL,
      classes = {},
      className,
      id: explicitId,
      onChange,
      onValueChange,
      onRemove,
      'aria-describedby': callerDescribedBy,
      'aria-invalid': callerInvalid,
      ...rest
    },
    forwardedRef,
  ) => {
    const [chosen, setChosen] = useState<FileItem[]>([]);
    const [dragging, setDragging] = useState(false);
    const depth = useRef(0);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const files = value ?? chosen;
    const isInvalid = invalid || Boolean(error);
    const { id, helpId, errorId, describedBy } = useFieldIds(
      explicitId,
      { suffix: 'hint', content: hint },
      error,
      callerDescribedBy,
    );

    const setRefs = useCallback(
      (element: HTMLInputElement | null) => {
        inputRef.current = element;
        if (typeof forwardedRef === 'function') forwardedRef(element);
        else if (forwardedRef) forwardedRef.current = element;
      },
      [forwardedRef],
    );

    const commit = (next: FileItem[]) => {
      if (value === undefined) setChosen(next);
      onValueChange?.(next);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      commit(Array.from(event.target.files ?? []));
    };

    const remove = (index: number) => {
      const file = files[index]!;
      onRemove?.(file, index);
      const next = files.filter((_, position) => position !== index);
      // Keep the native input's FileList in step, where the browser allows it.
      const input = inputRef.current;
      if (input && typeof DataTransfer !== 'undefined') {
        const transfer = new DataTransfer();
        for (const item of next) {
          if (typeof globalThis.File !== 'undefined' && item instanceof globalThis.File) {
            transfer.items.add(item);
          }
        }
        input.files = transfer.files;
      }
      commit(next);
    };

    return (
      <div
        className={cx('apui-file', classes.root, className)}
        data-variant={variant}
        data-max-size={maxSize}
        data-invalid={flag(isInvalid)}
        data-disabled={flag(disabled)}
      >
        <FieldLabel
          scope="file"
          htmlFor={id}
          label={label}
          required={required}
          className={classes.label}
          requiredClassName={classes.required}
        />
        <div
          className={classes.dropzone}
          data-scope="file"
          data-part="dropzone"
          data-state={dragging ? 'drag' : undefined}
          onDragEnter={() => {
            depth.current += 1;
            setDragging(true);
          }}
          onDragLeave={() => {
            depth.current = Math.max(0, depth.current - 1);
            if (depth.current === 0) setDragging(false);
          }}
          onDrop={() => {
            depth.current = 0;
            setDragging(false);
          }}
        >
          <input
            {...rest}
            ref={setRefs}
            type="file"
            className={classes.control}
            data-scope="file"
            data-part="control"
            id={id}
            accept={accept}
            multiple={multiple || undefined}
            disabled={disabled || undefined}
            required={required || undefined}
            aria-invalid={isInvalid ? true : callerInvalid}
            aria-labelledby={hasContent(label) ? undefined : `${id}-title`}
            aria-describedby={describedBy}
            onChange={handleChange}
          />
          <span className={classes.icon} data-scope="file" data-part="icon" aria-hidden="true">
            <IconSvg name={variant === 'compact' ? 'file-text' : 'cloud-upload'} />
          </span>
          <p className={classes.title} data-scope="file" data-part="title" id={`${id}-title`}>
            {title}
          </p>
          {helpId ? (
            <p className={classes.hint} data-scope="file" data-part="hint" id={helpId}>
              {hint}
            </p>
          ) : null}
        </div>
        {files.length > 0 ? (
          <ul className={classes.list} data-scope="file" data-part="list">
            {files.map((file, index) => {
              const entry = file as FileEntry;
              const fileError = entry.error;
              const progress = entry.progress;
              return (
                <li
                  key={`${file.name}-${index}`}
                  className={classes.item}
                  data-scope="file"
                  data-part="item"
                  data-state={fileError ? 'error' : undefined}
                >
                  <span
                    className={classes.thumb}
                    data-scope="file"
                    data-part="thumb"
                    aria-hidden="true"
                  >
                    <IconSvg name={fileError ? 'circle-alert' : 'file-text'} />
                  </span>
                  <span className={classes.name} data-scope="file" data-part="name">
                    {file.name}
                  </span>
                  <span className={classes.actions} data-scope="file" data-part="actions">
                    <Button
                      variant="ghost"
                      color="neutral"
                      size="sm"
                      iconOnly
                      leadingIcon="x"
                      aria-label={fillTemplate(removeLabel, { name: file.name })}
                      disabled={disabled}
                      onClick={() => remove(index)}
                    />
                  </span>
                  {progress !== undefined && !fileError ? (
                    <progress
                      className={classes.progress}
                      data-scope="file"
                      data-part="progress"
                      max={100}
                      value={progress}
                      aria-label={file.name}
                    >
                      {progress}%
                    </progress>
                  ) : (
                    <span className={classes.meta} data-scope="file" data-part="meta">
                      {fileError ? (
                        <>
                          <IconSvg name="circle-alert" />
                          {fileError}
                        </>
                      ) : file.size !== undefined ? (
                        formatFileSize(file.size)
                      ) : null}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        ) : null}
        <FieldError scope="file" id={errorId} message={error} className={classes.error} />
      </div>
    );
  },
);

File.displayName = 'File';
