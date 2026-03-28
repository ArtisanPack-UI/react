import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@artisanpack-ui/tokens';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'size'> {
  /** Input label */
  label?: string;
  /** Helper text below the input */
  hint?: string;
  /** Error message */
  error?: string;
  /** Icon element on the left */
  icon?: ReactNode;
  /** Icon element on the right */
  iconRight?: ReactNode;
  /** Text or element prefix inside the input */
  prefix?: ReactNode;
  /** Text or element suffix inside the input */
  suffix?: ReactNode;
  /** Show clear button */
  clearable?: boolean;
  /** Callback when clear is clicked */
  onClear?: () => void;
  /** Display label inline (floating) */
  inline?: boolean;
}

/**
 * Text input with label, hint, error, icons, prefix/suffix, and clearable support.
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

    return (
      <fieldset className="fieldset">
        {label && !inline && (
          <legend className="fieldset-legend">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </legend>
        )}
        <label
          className={cn(
            'input',
            'w-full',
            (icon || iconRight || prefix || suffix || clearable) && 'input-bordered',
            error && 'input-error',
            className,
          )}
          htmlFor={id}
        >
          {icon && <span className="opacity-50" aria-hidden="true">{icon}</span>}
          {prefix && <span className="opacity-50">{prefix}</span>}
          <input
            ref={ref}
            id={id}
            className="grow"
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            aria-required={required || undefined}
            required={required}
            {...rest}
          />
          {inline && label && (
            <span className="label">{label}</span>
          )}
          {suffix && <span className="opacity-50">{suffix}</span>}
          {clearable && (
            <button
              type="button"
              className="opacity-50 hover:opacity-100 cursor-pointer"
              onClick={onClear}
              aria-label="Clear input"
              tabIndex={-1}
            >
              ✕
            </button>
          )}
          {iconRight && <span className="opacity-50" aria-hidden="true">{iconRight}</span>}
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
      </fieldset>
    );
  },
);

Input.displayName = 'Input';
