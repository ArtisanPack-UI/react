import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@artisanpack-ui/tokens';

export interface DatePickerProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'prefix'
> {
  /** DatePicker label */
  label?: string;
  /** Helper text below the date picker */
  hint?: string;
  /** Error message */
  error?: string;
  /** Icon element on the left */
  icon?: ReactNode;
  /** Icon element on the right */
  iconRight?: ReactNode;
  /** Display label inline (floating) */
  inline?: boolean;
  /** Input type: date, datetime-local, time, month, week */
  dateType?: 'date' | 'datetime-local' | 'time' | 'month' | 'week';
}

/**
 * Date selection component using native HTML date inputs.
 *
 * For advanced date picking (calendar popups, range selection), integrate
 * a third-party library like react-datepicker or react-day-picker and
 * use this component's styling as a base.
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
