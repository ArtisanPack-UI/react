/** @module ColorPicker */

import {
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '@artisanpack-ui/tokens';

/**
 * Props for the {@link ColorPicker} component.
 *
 * Extends native `<input>` HTML attributes (excluding `size`, `type`, and `prefix`).
 * Combines a native color input with a hex value display, optional icons,
 * and action buttons for clearing and generating random colors.
 */
export interface ColorPickerProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'prefix'
> {
  /** Text label displayed above the color picker. */
  label?: string;
  /** Helper text displayed below the color picker. Hidden when `error` is present. */
  hint?: string;
  /** Error message displayed below the picker. Replaces `hint` when present and adds `aria-invalid`. */
  error?: string;
  /** Icon element rendered to the left of the hex value display. */
  icon?: ReactNode;
  /** Icon element rendered to the right of the action buttons. */
  iconRight?: ReactNode;
  /** When true, shows a clear button that resets the color to `defaultValue` or `#000000`. @defaultValue `false` */
  clearable?: boolean;
  /** Callback fired when the clear button is clicked. */
  onClear?: () => void;
  /** When true, shows a button to generate a random hex color. @defaultValue `false` */
  random?: boolean;
  /** Callback fired when a random color is generated, receiving the new hex string. */
  onRandomColor?: (color: string) => void;
  /** Custom icon element for the random color button. Defaults to a refresh/shuffle SVG. */
  randomIcon?: ReactNode;
}

function generateRandomHex(): string {
  return (
    '#' +
    Math.floor(Math.random() * 16777216)
      .toString(16)
      .padStart(6, '0')
  );
}

/**
 * A color picker that combines a native `<input type="color">` swatch with a hex value display.
 * Supports controlled and uncontrolled usage, optional clear and random color buttons,
 * and icon adornments. Fires native `input` events for form compatibility.
 *
 * @example
 * ```tsx
 * <ColorPicker label="Brand Color" value="#3b82f6" onChange={handleChange} />
 * ```
 *
 * @example
 * ```tsx
 * <ColorPicker label="Theme" random clearable onRandomColor={(c) => console.log(c)} />
 * ```
 */
export const ColorPicker = forwardRef<HTMLInputElement, ColorPickerProps>(
  (
    {
      label,
      hint,
      error,
      icon,
      iconRight,
      clearable = false,
      onClear,
      random = false,
      onRandomColor,
      randomIcon,
      className,
      id: providedId,
      value,
      defaultValue,
      onChange,
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

    const [internalValue, setInternalValue] = useState((defaultValue as string) ?? '#000000');
    const currentValue = (value as string) ?? internalValue;

    const inputRefInternal = useRef<HTMLInputElement | null>(null);

    const setRefs = useCallback(
      (el: HTMLInputElement | null) => {
        inputRefInternal.current = el;
        if (typeof ref === 'function') {
          ref(el);
        } else if (ref) {
          ref.current = el;
        }
      },
      [ref],
    );

    const handleRandomClick = useCallback(() => {
      const color = generateRandomHex();
      setInternalValue(color);
      if (inputRefInternal.current) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value',
        )?.set;
        nativeInputValueSetter?.call(inputRefInternal.current, color);
        inputRefInternal.current.dispatchEvent(new Event('input', { bubbles: true }));
      }
      onRandomColor?.(color);
    }, [onRandomColor]);

    return (
      <fieldset className="fieldset">
        {label && (
          <legend className="fieldset-legend">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </legend>
        )}
        <label
          className={cn('input w-full', error && 'input-error', className)}
          htmlFor={id}
          style={{ paddingInlineStart: 0, overflow: 'hidden' }}
        >
          <input
            ref={setRefs}
            id={id}
            type="color"
            className="cursor-pointer shrink-0"
            style={{
              WebkitAppearance: 'none',
              appearance: 'none',
              width: '2.5rem',
              height: 'calc(100% + var(--border) * 2)',
              border: 'none',
              padding: 0,
              marginBlock: 'calc(var(--border) * -1)',
              marginInlineStart: 'calc(var(--border) * -1)',
              borderStartStartRadius: 'calc(var(--radius-field) - var(--border))',
              borderEndStartRadius: 'calc(var(--radius-field) - var(--border))',
              backgroundColor: currentValue,
            }}
            value={currentValue}
            onChange={(e) => {
              setInternalValue(e.target.value);
              onChange?.(e);
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            aria-label={label ?? 'Color picker'}
            {...rest}
          />
          {icon && (
            <span className="opacity-50" aria-hidden="true">
              {icon}
            </span>
          )}
          <span className="grow font-mono text-sm">{currentValue}</span>
          {random && (
            <button
              type="button"
              className="opacity-50 hover:opacity-100 cursor-pointer"
              onClick={handleRandomClick}
              aria-label="Generate random color"
            >
              {randomIcon ?? (
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 512 512"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160 352 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l111.5 0c0 0 .1 0 .1 0l.4 0c17.7 0 32-14.3 32-32l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 35.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1L16 432c0 17.7 14.3 32 32 32s32-14.3 32-32l0-35.1l17.6 17.5c0 0 0 0 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352l34.4 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-111.5 0c-.1 0-.3 0-.4 0c-5.8-.1-11.9 1.6-17.1 4.3z" />
                </svg>
              )}
            </button>
          )}
          {clearable && (
            <button
              type="button"
              className="opacity-50 hover:opacity-100 cursor-pointer"
              onClick={() => {
                const resetValue = (defaultValue as string) ?? '#000000';
                setInternalValue(resetValue);
                if (inputRefInternal.current) {
                  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLInputElement.prototype,
                    'value',
                  )?.set;
                  nativeInputValueSetter?.call(inputRefInternal.current, resetValue);
                  inputRefInternal.current.dispatchEvent(new Event('input', { bubbles: true }));
                }
                onClear?.();
              }}
              aria-label="Clear color"
            >
              ✕
            </button>
          )}
          {iconRight && (
            <span className="opacity-50" aria-hidden="true">
              {iconRight}
            </span>
          )}
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

ColorPicker.displayName = 'ColorPicker';
