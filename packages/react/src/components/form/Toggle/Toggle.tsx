/**
 * @module Toggle
 *
 * The design-system Toggle (#53): a native checkbox with `role="switch"` in
 * Checkbox's field anatomy, rendering the `.apui-toggle` markup contract
 * styled by `@artisanpack-ui/css`. For settings that take effect immediately.
 */

import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

import { FieldError, FieldHelp, FieldLabel, useFieldIds } from '../../../internal/field';
import { cx, flag, type PartClasses } from '../../../internal/parts';

/** Track size of a {@link Toggle}. */
export type ToggleSize = 'sm' | 'md' | 'lg';

/** The on color of a {@link Toggle}. */
export type ToggleColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

/** The parts a {@link Toggle} accepts extra classes for. */
export type TogglePart = 'root' | 'track' | 'control' | 'thumb' | 'label' | 'description' | 'error';

/**
 * Props for the {@link Toggle} component.
 *
 * `className` goes to the root; every other native attribute (`name`,
 * `value`, `aria-*`, `data-*`, `id`, …) goes to the native `<input>`.
 */
export interface ToggleProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'checked' | 'defaultChecked' | 'color'
> {
  /** Whether it's on (controlled). Emitted as `data-state`. */
  checked?: boolean;
  /** The initial state of an uncontrolled toggle. @defaultValue `false` */
  defaultChecked?: boolean;
  /** Track size. Emitted as `data-size`. @defaultValue `'md'` */
  size?: ToggleSize;
  /** The track color when on. Emitted as `data-color`. @defaultValue `'primary'` */
  color?: ToggleColor;
  /** The visible label. Name the setting, not the state. Without it, pass an `aria-label`. */
  label?: ReactNode;
  /** Supporting text under the label, linked with `aria-describedby`. */
  description?: ReactNode;
  /** Validation message. Marks it invalid and is linked with `aria-describedby`. */
  error?: string;
  /** Marks it invalid without a message. @defaultValue `false` */
  invalid?: boolean;
  /** Disables the control. @defaultValue `false` */
  disabled?: boolean;
  /** Sets `required` on the control. @defaultValue `false` */
  required?: boolean;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<TogglePart>;
  /** Called with the new state. The native `onChange` still fires. */
  onCheckedChange?: (checked: boolean) => void;
}

/**
 * A switch for settings that take effect immediately. Controlled
 * (`checked` + `onCheckedChange`) or uncontrolled (`defaultChecked`). The
 * ref points at the native `<input>`.
 *
 * @example
 * ```tsx
 * <Toggle label="Dark mode" checked={dark} onCheckedChange={setDark} />
 * ```
 */
export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      checked,
      defaultChecked = false,
      size = 'md',
      color = 'primary',
      label,
      description,
      error,
      invalid = false,
      disabled = false,
      required = false,
      classes = {},
      className,
      id: explicitId,
      onChange,
      onCheckedChange,
      'aria-describedby': callerDescribedBy,
      'aria-invalid': callerInvalid,
      ...rest
    },
    forwardedRef,
  ) => {
    const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked);
    const isControlled = checked !== undefined;
    const isChecked = isControlled ? checked : uncontrolledChecked;
    const isInvalid = invalid || Boolean(error);
    const { id, helpId, errorId, describedBy } = useFieldIds(
      explicitId,
      { suffix: 'description', content: description },
      error,
      callerDescribedBy,
    );

    const inputRef = useRef<HTMLInputElement | null>(null);
    const setRefs = useCallback(
      (element: HTMLInputElement | null) => {
        inputRef.current = element;
        if (typeof forwardedRef === 'function') forwardedRef(element);
        else if (forwardedRef) forwardedRef.current = element;
      },
      [forwardedRef],
    );

    // An uncontrolled toggle follows its form's reset (see Checkbox).
    useEffect(() => {
      const form = inputRef.current?.form;
      if (isControlled || !form) return;
      const handleReset = () => {
        setTimeout(() => {
          if (inputRef.current) setUncontrolledChecked(inputRef.current.checked);
        }, 0);
      };
      form.addEventListener('reset', handleReset);
      return () => form.removeEventListener('reset', handleReset);
    }, [isControlled]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const next = event.target.checked;
      if (!isControlled) setUncontrolledChecked(next);
      onChange?.(event);
      onCheckedChange?.(next);
    };

    return (
      <div
        className={cx('apui-toggle', classes.root, className)}
        data-size={size}
        data-color={color}
        data-state={isChecked ? 'checked' : 'unchecked'}
        data-invalid={flag(isInvalid)}
        data-disabled={flag(disabled)}
      >
        <span className={classes.track} data-scope="toggle" data-part="track">
          <input
            {...rest}
            ref={setRefs}
            type="checkbox"
            role="switch"
            className={classes.control}
            data-scope="toggle"
            data-part="control"
            id={id}
            checked={isChecked}
            disabled={disabled || undefined}
            required={required || undefined}
            aria-invalid={isInvalid ? true : callerInvalid}
            aria-describedby={describedBy}
            onChange={handleChange}
          />
          <span
            className={classes.thumb}
            data-scope="toggle"
            data-part="thumb"
            aria-hidden="true"
          />
        </span>
        <FieldLabel
          scope="toggle"
          htmlFor={id}
          label={label}
          required={false}
          className={classes.label}
        />
        <FieldHelp scope="toggle" part="description" id={helpId} className={classes.description}>
          {description}
        </FieldHelp>
        <FieldError scope="toggle" id={errorId} message={error} className={classes.error} />
      </div>
    );
  },
);

Toggle.displayName = 'Toggle';
