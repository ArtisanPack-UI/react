/** @module Select */

import { forwardRef, useId, type ReactNode, type SelectHTMLAttributes } from 'react';
import { cn } from '@artisanpack-ui/tokens';

/**
 * Represents a single option in a {@link Select} dropdown.
 *
 * Options are generic key-value objects where the keys used for `value` and `label`
 * are configured via `optionValue` and `optionLabel` props on the Select component.
 */
export interface SelectOption {
  /** Allows any additional properties for flexible option data. */
  [key: string]: unknown;
  /** When true, this option is rendered in a disabled state and cannot be selected. */
  disabled?: boolean;
}

/**
 * Props for the {@link Select} component.
 *
 * Extends native `<select>` HTML attributes (excluding `size`).
 * Supports option mapping from data arrays, placeholder option, icons,
 * and inline label display. Children can also be passed as raw `<option>` elements.
 */
export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Text label displayed above the select. Hidden when `inline` is true (shown below as a fieldset label). */
  label?: string;
  /** Helper text displayed below the select. Hidden when `error` is present. */
  hint?: string;
  /** Error message displayed below the select. Replaces `hint` when present and adds `aria-invalid`. */
  error?: string;
  /** Icon element rendered to the left of the select. */
  icon?: ReactNode;
  /** Icon element rendered to the right of the select. */
  iconRight?: ReactNode;
  /** Text for a disabled placeholder `<option>` rendered as the first option. */
  placeholder?: string;
  /** Value attribute for the placeholder option. @defaultValue `''` */
  placeholderValue?: string;
  /** When true, renders the label as an inline fieldset label below the select. @defaultValue `false` */
  inline?: boolean;
  /** Property key on each option object to use as the `<option>` value attribute. @defaultValue `'id'` */
  optionValue?: string;
  /** Property key on each option object to use as the displayed option text. @defaultValue `'name'` */
  optionLabel?: string;
  /** Array of option objects to render as `<option>` elements. Can also pass `<option>` elements as children. */
  options?: SelectOption[] | Record<string, string>[];
}

/**
 * A dropdown select component with DaisyUI styling that maps options from a data array,
 * supports a disabled placeholder option, left/right icons, inline label mode,
 * and accepts additional `<option>` children. Automatically generates accessible IDs and ARIA attributes.
 *
 * @example
 * ```tsx
 * const countries = [
 *   { id: 'us', name: 'United States' },
 *   { id: 'ca', name: 'Canada' },
 * ];
 * <Select label="Country" options={countries} placeholder="Select a country" />
 * ```
 *
 * @example
 * ```tsx
 * <Select label="Status" icon={<FilterIcon />}>
 *   <option value="active">Active</option>
 *   <option value="inactive">Inactive</option>
 * </Select>
 * ```
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
        <label className={cn('select', 'w-full', error && 'select-error', className)} htmlFor={id}>
          {icon && (
            <span className="opacity-50" aria-hidden="true">
              {icon}
            </span>
          )}
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
                <option key={value || index} value={value} disabled={option.disabled === true}>
                  {optLabel}
                </option>
              );
            })}
            {children}
          </select>
          {iconRight && (
            <span className="opacity-50" aria-hidden="true">
              {iconRight}
            </span>
          )}
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
