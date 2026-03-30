import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor } from '@artisanpack-ui/tokens';

export interface RadioOption {
  [key: string]: unknown;
  disabled?: boolean;
}

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Radio group label */
  label?: string;
  /** Helper text below the group */
  hint?: string;
  /** Error message */
  error?: string;
  /** DaisyUI color variant */
  color?: DaisyColor;
  /** Key to use as option value */
  optionValue?: string;
  /** Key to use as option label */
  optionLabel?: string;
  /** Key to use as option hint */
  optionHint?: string;
  /** Array of radio options */
  options?: RadioOption[];
  /** Display options horizontally */
  inline?: boolean;
  /** Display options as cards */
  card?: boolean;
  /** Custom card CSS classes */
  cardClass?: string;
}

const colorMap: Record<string, string> = {
  primary: 'radio-primary',
  secondary: 'radio-secondary',
  accent: 'radio-accent',
  success: 'radio-success',
  warning: 'radio-warning',
  error: 'radio-error',
  info: 'radio-info',
  neutral: 'radio-neutral',
};

const cardColorMap: Record<string, string> = {
  primary: 'has-[:checked]:border-primary has-[:checked]:bg-primary/5',
  secondary: 'has-[:checked]:border-secondary has-[:checked]:bg-secondary/5',
  accent: 'has-[:checked]:border-accent has-[:checked]:bg-accent/5',
  success: 'has-[:checked]:border-success has-[:checked]:bg-success/5',
  warning: 'has-[:checked]:border-warning has-[:checked]:bg-warning/5',
  error: 'has-[:checked]:border-error has-[:checked]:bg-error/5',
  info: 'has-[:checked]:border-info has-[:checked]:bg-info/5',
  neutral: 'has-[:checked]:border-neutral has-[:checked]:bg-neutral/5',
};

/**
 * Radio button group with options, card variant, and color support.
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      label,
      hint,
      error,
      color,
      optionValue = 'id',
      optionLabel = 'name',
      optionHint = 'hint',
      options = [],
      inline = false,
      card = false,
      cardClass,
      className,
      name: providedName,
      id: providedId,
      required,
      ...rest
    },
    ref,
  ) => {
    const autoId = useId();
    const id = providedId ?? autoId;
    const groupName = providedName ?? id;
    const errorId = error ? `${id}-error` : undefined;
    const hintId = hint && !error ? `${id}-hint` : undefined;
    const firstEnabledIndex = options.findIndex((opt) => !opt.disabled);

    return (
      <fieldset
        className="fieldset"
        role="radiogroup"
        aria-labelledby={label ? `${id}-legend` : undefined}
        aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
        aria-invalid={error ? true : undefined}
      >
        {label && (
          <legend id={`${id}-legend`} className="fieldset-legend">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </legend>
        )}
        <div className={cn(card ? 'grid gap-2' : 'flex gap-3', !card && !inline && 'flex-col')}>
          {options.map((option, index) => {
            const value = String(option[optionValue] ?? '');
            const optLabel = String(option[optionLabel] ?? '');
            const optHint = option[optionHint] ? String(option[optionHint]) : undefined;
            const optionId = `${id}-${value || index}`;
            const isDisabled = option.disabled === true;

            if (card) {
              return (
                <label
                  key={value || index}
                  htmlFor={optionId}
                  className={cn(
                    'flex items-center gap-3 p-4 border rounded-lg cursor-pointer',
                    'hover:bg-base-200 transition-colors',
                    color && cardColorMap[color] ? cardColorMap[color] : cardColorMap.primary,
                    isDisabled && 'opacity-50 cursor-not-allowed',
                    cardClass,
                  )}
                >
                  <input
                    ref={index === firstEnabledIndex ? ref : undefined}
                    id={optionId}
                    type="radio"
                    name={groupName}
                    value={value}
                    disabled={isDisabled}
                    required={required && index === firstEnabledIndex}
                    className={cn('radio', color && colorMap[color], className)}
                    {...rest}
                  />
                  <div>
                    <span>{optLabel}</span>
                    {optHint && <p className="text-xs opacity-60">{optHint}</p>}
                  </div>
                </label>
              );
            }

            return (
              <label
                key={value || index}
                htmlFor={optionId}
                className={cn(
                  'flex items-center gap-2 cursor-pointer',
                  isDisabled && 'opacity-50 cursor-not-allowed',
                )}
              >
                <input
                  ref={index === firstEnabledIndex ? ref : undefined}
                  id={optionId}
                  type="radio"
                  name={groupName}
                  value={value}
                  disabled={isDisabled}
                  required={required && index === firstEnabledIndex}
                  className={cn('radio', color && colorMap[color], className)}
                  {...rest}
                />
                <div>
                  <span>{optLabel}</span>
                  {optHint && <p className="text-xs opacity-60">{optHint}</p>}
                </div>
              </label>
            );
          })}
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

Radio.displayName = 'Radio';
