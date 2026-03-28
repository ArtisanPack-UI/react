import { forwardRef, useId, type ReactNode, type SelectHTMLAttributes } from 'react';
import { cn } from '@artisanpack-ui/tokens';

export interface SelectOption {
  [key: string]: unknown;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Select label */
  label?: string;
  /** Helper text below the select */
  hint?: string;
  /** Error message */
  error?: string;
  /** Icon element on the left */
  icon?: ReactNode;
  /** Icon element on the right */
  iconRight?: ReactNode;
  /** Placeholder option text */
  placeholder?: string;
  /** Placeholder option value */
  placeholderValue?: string;
  /** Display label inline (floating) */
  inline?: boolean;
  /** Key to use as option value */
  optionValue?: string;
  /** Key to use as option label */
  optionLabel?: string;
  /** Array of options */
  options?: SelectOption[] | Record<string, string>[];
}

/**
 * Dropdown select with option mapping, placeholder, and icon support.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      hint,
      error,
      icon,
      iconRight,
      placeholder,
      placeholderValue = '',
      inline = false,
      optionValue = 'id',
      optionLabel = 'name',
      options = [],
      className,
      id: providedId,
      required,
      children,
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
            'select',
            'w-full',
            error && 'select-error',
            className,
          )}
          htmlFor={id}
        >
          {icon && <span className="opacity-50" aria-hidden="true">{icon}</span>}
          <select
            ref={ref}
            id={id}
            className="grow"
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            aria-required={required || undefined}
            required={required}
            {...rest}
          >
            {placeholder && (
              <option value={placeholderValue} disabled>
                {placeholder}
              </option>
            )}
            {options.map((option, index) => {
              const value = String(option[optionValue] ?? '');
              const optLabel = String(option[optionLabel] ?? '');
              return (
                <option
                  key={value || index}
                  value={value}
                  disabled={option.disabled === true}
                >
                  {optLabel}
                </option>
              );
            })}
            {children}
          </select>
          {iconRight && <span className="opacity-50" aria-hidden="true">{iconRight}</span>}
        </label>
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

Select.displayName = 'Select';
