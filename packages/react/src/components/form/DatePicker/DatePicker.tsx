/** @module DatePicker */

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@artisanpack-ui/tokens';

/**
 * Props for the {@link DatePicker} component.
 *
 * Extends native `<input>` HTML attributes (excluding `size`, `type`, and `prefix`).
 * Uses native HTML date inputs for cross-browser date selection.
 */
export interface DatePickerProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'prefix'
> {
  /** Text label displayed above the date picker. Hidden when `inline` is true (shown as floating label instead). */
  label?: string;
  /** Helper text displayed below the date picker. Hidden when `error` is present. */
  hint?: string;
  /** Error message displayed below the picker. Replaces `hint` when present and adds `aria-invalid`. */
  error?: string;
  /** Icon element rendered to the left of the input. */
  icon?: ReactNode;
  /** Icon element rendered to the right of the input. */
  iconRight?: ReactNode;
  /** When true, renders the label as a floating/inline label inside the input wrapper. @defaultValue `false` */
  inline?: boolean;
  /** The native HTML input type for date/time selection. @defaultValue `'date'` */
  dateType?: 'date' | 'datetime-local' | 'time' | 'month' | 'week';
}

/**
 * A date/time selection component using native HTML date inputs with DaisyUI styling.
 * Supports multiple date types (date, datetime-local, time, month, week), optional icons,
 * and inline (floating) label display.
 *
 * For advanced date picking (calendar popups, range selection), integrate
 * a third-party library like react-datepicker or react-day-picker and
 * use this component's styling as a base.
 *
 * @example
 * ```tsx
 * <DatePicker label="Start Date" dateType="date" required />
 * ```
 *
 * @example
 * ```tsx
 * <DatePicker label="Meeting Time" dateType="datetime-local" inline icon={<CalendarIcon />} />
 * ```
 */
export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      label,
      hint,
      error,
      icon,
      iconRight,
      inline = false,
      dateType = 'date',
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

    const hasAdornments = icon || iconRight || inline;

    return (
      <fieldset className="fieldset">
        {label && !inline && (
          <legend className="fieldset-legend">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </legend>
        )}
        {hasAdornments ? (
          <label className={cn('input w-full', error && 'input-error', className)} htmlFor={id}>
            {icon && (
              <span className="opacity-50" aria-hidden="true">
                {icon}
              </span>
            )}
            <input
              ref={ref}
              id={id}
              type={dateType}
              className="grow"
              style={{ height: 'auto' }}
              aria-invalid={error ? true : undefined}
              aria-describedby={describedBy}
              aria-required={required || undefined}
              required={required}
              {...rest}
            />
            {inline && label && <span className="label">{label}</span>}
            {iconRight && (
              <span className="opacity-50" aria-hidden="true">
                {iconRight}
              </span>
            )}
          </label>
        ) : (
          <input
            ref={ref}
            id={id}
            type={dateType}
            className={cn('input w-full', error && 'input-error', className)}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            aria-required={required || undefined}
            required={required}
            {...rest}
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

DatePicker.displayName = 'DatePicker';
