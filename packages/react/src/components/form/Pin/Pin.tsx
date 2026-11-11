/**
 * @module Pin
 *
 * The design-system Pin (#53). Renders the `.apui-pin` markup contract,
 * styled by `@artisanpack-ui/css`: one native input with
 * `autocomplete="one-time-code"` lies over a row of cells that mirror its
 * value, so SMS autofill, paste and screen readers see one field.
 */

import {
  forwardRef,
  Fragment,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

import { FieldError, FieldHelp, FieldLabel, useFieldIds } from '../../../internal/field';
import { useFormReset } from '../../../internal/form-reset';
import { cx, flag, type PartClasses } from '../../../internal/parts';

/** Cell size of a {@link Pin}. */
export type PinSize = 'sm' | 'md';

/** The characters a {@link Pin} accepts. */
export type PinType = 'numeric' | 'alphanumeric';

/** The parts a {@link Pin} accepts extra classes for. */
export type PinPart =
  | 'root'
  | 'label'
  | 'required'
  | 'cells'
  | 'control'
  | 'cell'
  | 'separator'
  | 'hint'
  | 'error';

/** Drops the characters a type doesn't allow and cuts the code to `length`. */
export function sanitizePin(raw: string, type: PinType, length: number): string {
  const allowed = type === 'numeric' ? raw.replace(/\D/g, '') : raw.replace(/[^A-Za-z0-9]/g, '');
  return allowed.slice(0, length);
}

/**
 * Props for the {@link Pin} component.
 *
 * `className` goes to the root; every other native attribute (`name`,
 * `aria-*`, `data-*`, `id`, …) goes to the native `<input>`.
 */
export interface PinProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'value' | 'defaultValue' | 'maxLength'
> {
  /** The number of cells. @defaultValue `6` */
  length?: number;
  /** The characters allowed. @defaultValue `'numeric'` */
  type?: PinType;
  /** Shows a dot for each character and makes the control a password input. @defaultValue `false` */
  mask?: boolean;
  /** Draws a separator after every `groupSize` cells. */
  groupSize?: number;
  /** Cell size. Emitted as `data-size`. @defaultValue `'md'` */
  size?: PinSize;
  /** The visible label, linked to the control. Without it, pass an `aria-label`. */
  label?: ReactNode;
  /** Help text under the cells, linked with `aria-describedby`. */
  hint?: ReactNode;
  /** Validation message. Marks the code invalid and is linked with `aria-describedby`. */
  error?: string;
  /** Marks the code invalid without a message. @defaultValue `false` */
  invalid?: boolean;
  /** Disables the control. @defaultValue `false` */
  disabled?: boolean;
  /** Marks the code required and shows the required mark. @defaultValue `false` */
  required?: boolean;
  /** The code of a controlled pin. */
  value?: string;
  /** The initial code of an uncontrolled pin. */
  defaultValue?: string;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<PinPart>;
  /** Called with the new code whenever it changes. The native `onChange` still fires. */
  onValueChange?: (value: string) => void;
  /** Called with the code once every cell is filled. */
  onComplete?: (value: string) => void;
}

/**
 * A row of single-character cells for one-time codes. Controlled (`value` +
 * `onValueChange`) or uncontrolled (`defaultValue`); `onComplete` fires when
 * the last cell is filled. The ref points at the native `<input>`.
 *
 * @example
 * ```tsx
 * <Pin label="Verification code" groupSize={3} onComplete={verify} />
 * ```
 */
export const Pin = forwardRef<HTMLInputElement, PinProps>(
  (
    {
      length = 6,
      type = 'numeric',
      mask = false,
      groupSize,
      size = 'md',
      label,
      hint,
      error,
      invalid = false,
      disabled = false,
      required = false,
      value,
      defaultValue,
      classes = {},
      className,
      id: explicitId,
      onChange,
      onPaste,
      onValueChange,
      onComplete,
      'aria-describedby': callerDescribedBy,
      'aria-invalid': callerInvalid,
      ...rest
    },
    ref,
  ) => {
    const isInvalid = invalid || Boolean(error);
    const [uncontrolled, setUncontrolled] = useState(defaultValue ?? '');
    const isControlled = value !== undefined;
    const current = isControlled ? value : uncontrolled;
    // An uncontrolled pin follows its form's reset, so the cells don't keep the old code.
    const controlRef = useRef<HTMLInputElement | null>(null);
    useImperativeHandle(ref, () => controlRef.current as HTMLInputElement);
    useFormReset(controlRef, !isControlled, (control) => setUncontrolled(control.value));
    const { id, helpId, errorId, describedBy } = useFieldIds(
      explicitId,
      { suffix: 'hint', content: hint },
      error,
      callerDescribedBy,
    );

    const commit = (next: string) => {
      if (!isControlled) setUncontrolled(next);
      onValueChange?.(next);
      if (next.length === length) onComplete?.(next);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const next = sanitizePin(event.target.value, type, length);
      if (next !== event.target.value) event.target.value = next;
      onChange?.(event);
      commit(next);
    };

    const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
      onPaste?.(event);
      if (event.defaultPrevented) return;
      event.preventDefault();
      const input = event.currentTarget;
      const pasted = event.clipboardData.getData('text');
      const start = input.selectionStart ?? current.length;
      const end = input.selectionEnd ?? current.length;
      const next = sanitizePin(current.slice(0, start) + pasted + current.slice(end), type, length);
      input.value = next;
      commit(next);
    };

    const active = Math.min(current.length, length - 1);
    const cells = Array.from({ length }, (_, index) => {
      const char = current[index];
      const cell = (
        <span
          className={classes.cell}
          data-scope="pin"
          data-part="cell"
          aria-hidden="true"
          data-filled={flag(char !== undefined)}
          data-active={flag(index === active)}
        >
          {char === undefined ? null : mask ? '•' : char}
        </span>
      );
      const separated =
        groupSize !== undefined &&
        groupSize > 0 &&
        (index + 1) % groupSize === 0 &&
        index < length - 1;
      return (
        <Fragment key={index}>
          {cell}
          {separated ? (
            <span
              className={classes.separator}
              data-scope="pin"
              data-part="separator"
              aria-hidden="true"
            />
          ) : null}
        </Fragment>
      );
    });

    return (
      <div
        className={cx('apui-pin', classes.root, className)}
        data-size={size}
        data-invalid={flag(isInvalid)}
        data-disabled={flag(disabled)}
      >
        <FieldLabel
          scope="pin"
          htmlFor={id}
          label={label}
          required={required}
          className={classes.label}
          requiredClassName={classes.required}
        />
        <div className={classes.cells} data-scope="pin" data-part="cells">
          <input
            autoCapitalize="off"
            spellCheck={false}
            {...rest}
            ref={controlRef}
            className={classes.control}
            data-scope="pin"
            data-part="control"
            id={id}
            type={mask ? 'password' : 'text'}
            inputMode={type === 'numeric' ? 'numeric' : 'text'}
            pattern={type === 'numeric' ? '[0-9]*' : undefined}
            autoComplete="one-time-code"
            maxLength={length}
            value={isControlled ? value : undefined}
            defaultValue={isControlled ? undefined : defaultValue}
            disabled={disabled || undefined}
            required={required || undefined}
            aria-invalid={isInvalid ? true : callerInvalid}
            aria-describedby={describedBy}
            onChange={handleChange}
            onPaste={handlePaste}
          />
          {cells}
        </div>
        <FieldHelp scope="pin" part="hint" id={helpId} className={classes.hint}>
          {hint}
        </FieldHelp>
        <FieldError scope="pin" id={errorId} message={error} className={classes.error} />
      </div>
    );
  },
);

Pin.displayName = 'Pin';
