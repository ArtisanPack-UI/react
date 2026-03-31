/** @module Pin */

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  type ClipboardEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
} from 'react';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor } from '@artisanpack-ui/tokens';

/**
 * Props for the {@link Pin} component.
 *
 * Extends native `<input>` HTML attributes (excluding `size` and `type`).
 * Renders a row of individual single-character inputs for PIN/OTP entry
 * with auto-focus navigation, paste support, and completion callbacks.
 */
export interface PinProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Number of individual PIN input fields to render. This is required. */
  length: number;
  /** When true, restricts input to digits only (0-9) and sets `inputMode="numeric"`. @defaultValue `false` */
  numeric?: boolean;
  /** When true, masks the input characters using `type="password"`. @defaultValue `false` */
  hide?: boolean;
  /** Error message displayed below the PIN inputs. Adds `aria-invalid` to each field. */
  error?: string;
  /** DaisyUI color variant applied to each individual PIN input field. */
  color?: DaisyColor;
  /** Callback fired when all PIN fields are filled. Receives the complete PIN string. */
  onComplete?: (value: string) => void;
  /** Callback fired when the PIN becomes incomplete (e.g., a character is deleted). Receives the current partial value. */
  onIncomplete?: (value: string) => void;
  /** The current PIN value for controlled usage. Each character maps to one input field. */
  value?: string;
  /** Callback fired on every input change with the current concatenated PIN value. */
  onValueChange?: (value: string) => void;
}

const colorMap: Record<string, string> = {
  primary: 'input-primary',
  secondary: 'input-secondary',
  accent: 'input-accent',
  success: 'input-success',
  warning: 'input-warning',
  error: 'input-error',
  info: 'input-info',
  neutral: 'input-neutral',
};

/**
 * A multi-field PIN/OTP entry component with auto-focus navigation between fields,
 * clipboard paste support, arrow key navigation, and completion/incompletion callbacks.
 * Supports both controlled and uncontrolled usage. The forwarded ref points to the
 * first input field.
 *
 * @example
 * ```tsx
 * <Pin length={6} numeric onComplete={(pin) => verifyOTP(pin)} />
 * ```
 *
 * @example
 * ```tsx
 * <Pin length={4} hide color="primary" value={pin} onValueChange={setPin} />
 * ```
 */
export const Pin = forwardRef<HTMLInputElement, PinProps>(
  (
    {
      length,
      numeric = false,
      hide = false,
      error,
      color,
      onComplete,
      onIncomplete,
      value: controlledValue,
      onValueChange,
      className,
      id: providedId,
      ...rest
    },
    ref,
  ) => {
    const autoId = useId();
    const id = providedId ?? autoId;
    const errorId = error ? `${id}-error` : undefined;
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    // Sync controlled value to individual inputs
    useEffect(() => {
      if (controlledValue === undefined) return;
      inputsRef.current.forEach((input, i) => {
        if (input) {
          input.value = controlledValue[i] ?? '';
        }
      });
    }, [controlledValue]);

    const getValue = useCallback(() => {
      return inputsRef.current.map((input) => input?.value ?? '').join('');
    }, []);

    const notifyChange = useCallback(
      (currentValue: string) => {
        onValueChange?.(currentValue);
        if (currentValue.length === length && currentValue.split('').every((c) => c !== '')) {
          onComplete?.(currentValue);
        } else {
          onIncomplete?.(currentValue);
        }
      },
      [length, onComplete, onIncomplete, onValueChange],
    );

    const handleInput = useCallback(
      (index: number, inputValue: string) => {
        if (numeric && !/^\d*$/.test(inputValue)) {
          const input = inputsRef.current[index];
          if (input) input.value = '';
          return;
        }

        if (inputValue.length > 0 && index < length - 1) {
          inputsRef.current[index + 1]?.focus();
        }

        notifyChange(getValue());
      },
      [numeric, length, getValue, notifyChange],
    );

    const handleKeyDown = useCallback(
      (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
          const input = inputsRef.current[index];
          if (input && input.value === '' && index > 0) {
            inputsRef.current[index - 1]?.focus();
          }
        } else if (e.key === 'ArrowLeft' && index > 0) {
          inputsRef.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < length - 1) {
          inputsRef.current[index + 1]?.focus();
        }
      },
      [length],
    );

    const handlePaste = useCallback(
      (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, length);

        if (numeric && !/^\d*$/.test(pastedData)) {
          return;
        }

        for (let i = 0; i < length; i++) {
          const input = inputsRef.current[i];
          if (input) {
            input.value = pastedData[i] ?? '';
          }
        }

        const lastFilledIndex = Math.min(pastedData.length, length) - 1;
        if (lastFilledIndex >= 0 && lastFilledIndex < length - 1) {
          inputsRef.current[lastFilledIndex + 1]?.focus();
        } else if (lastFilledIndex === length - 1) {
          inputsRef.current[lastFilledIndex]?.focus();
        }

        notifyChange(getValue());
      },
      [length, numeric, getValue, notifyChange],
    );

    return (
      <fieldset className="fieldset">
        <div className="flex gap-2" role="group" aria-label="PIN input">
          {Array.from({ length }).map((_, index) => (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el;
                if (index === 0) {
                  if (typeof ref === 'function') {
                    ref(el);
                  } else if (ref && 'current' in ref) {
                    ref.current = el;
                  }
                }
              }}
              id={`${id}-${index}`}
              type={hide ? 'password' : 'text'}
              inputMode={numeric ? 'numeric' : 'text'}
              pattern={numeric ? '[0-9]*' : undefined}
              maxLength={1}
              className={cn(
                'input w-12 h-12 text-center text-lg font-mono',
                color && colorMap[color],
                error && 'input-error',
                className,
              )}
              defaultValue={controlledValue?.[index] ?? ''}
              onInput={(e) => handleInput(index, (e.target as HTMLInputElement).value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              autoComplete="one-time-code"
              aria-label={`PIN digit ${index + 1} of ${length}`}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
              {...rest}
            />
          ))}
        </div>
        {error && (
          <p id={errorId} className="fieldset-label text-error" role="alert">
            {error}
          </p>
        )}
      </fieldset>
    );
  },
);

Pin.displayName = 'Pin';
