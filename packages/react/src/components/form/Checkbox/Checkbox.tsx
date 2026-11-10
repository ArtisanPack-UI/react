/**
 * @module Checkbox
 *
 * The design-system Checkbox (#47): a native checkbox in the shared field
 * anatomy, rendering the `.apui-checkbox` markup contract styled by
 * `@artisanpack-ui/css`. Supports the indeterminate (mixed) state.
 */

import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

import { FieldError, FieldHelp, FieldLabel, useFieldIds } from '../../../internal/field';
import { IconSvg } from '../../../internal/icon';
import { cx, flag, type PartClasses } from '../../../internal/parts';

/** `useLayoutEffect` in the browser, `useEffect` on the server (no SSR warning on React 18). */
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** The parts a {@link Checkbox} accepts extra classes for. */
export type CheckboxPart =
  | 'root'
  | 'box'
  | 'control'
  | 'indicator'
  | 'label'
  | 'description'
  | 'error';

/**
 * Props for the {@link Checkbox} component.
 *
 * `className` goes to the root; every other native attribute (`name`,
 * `value`, `aria-*`, `data-*`, `id`, …) goes to the native `<input>`.
 */
export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'checked' | 'defaultChecked'
> {
  /** Whether it's checked (controlled). Emitted as `data-state`. */
  checked?: boolean;
  /** The initial state of an uncontrolled checkbox. @defaultValue `false` */
  defaultChecked?: boolean;
  /**
   * Shows the mixed state and sets the native `indeterminate` property.
   * Clearing it after a click is up to the owner. @defaultValue `false`
   */
  indeterminate?: boolean;
  /** The visible label, linked to the control. Without it, pass an `aria-label`. */
  label?: ReactNode;
  /** Supporting text under the label, linked with `aria-describedby`. */
  description?: ReactNode;
  /** Validation message. Marks it invalid and is linked with `aria-describedby`. */
  error?: string;
  /** Marks it invalid without a message. @defaultValue `false` */
  invalid?: boolean;
  /** Disables the control. @defaultValue `false` */
  disabled?: boolean;
  /** Sets `required` on the control (no visual mark). @defaultValue `false` */
  required?: boolean;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<CheckboxPart>;
  /** Called with the new checked state. The native `onChange` still fires. */
  onCheckedChange?: (checked: boolean) => void;
}

/**
 * Turns one option on or off. Controlled (`checked` + `onCheckedChange`) or
 * uncontrolled (`defaultChecked`). The ref points at the native `<input>`.
 *
 * @example
 * ```tsx
 * <Checkbox label="Select all" checked={all} indeterminate={some} onCheckedChange={toggleAll} />
 * ```
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked,
      defaultChecked = false,
      indeterminate = false,
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
    const state = indeterminate ? 'indeterminate' : isChecked ? 'checked' : 'unchecked';
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

    // Only script can set the native property. A click clears it in the browser, so it is
    // re-asserted on every render and right after each change (an owner that keeps its state
    // doesn't re-render).
    useIsomorphicLayoutEffect(() => {
      if (inputRef.current) inputRef.current.indeterminate = indeterminate;
    });

    // An uncontrolled checkbox follows its form's reset, which changes the input without a
    // change event; read the result once the reset has run.
    useEffect(() => {
      const form = inputRef.current?.form;
      if (isControlled || !form) return;
      const handleReset = () => {
        queueMicrotask(() => {
          if (inputRef.current) setUncontrolledChecked(inputRef.current.checked);
        });
      };
      form.addEventListener('reset', handleReset);
      return () => form.removeEventListener('reset', handleReset);
    }, [isControlled]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const nextChecked = event.target.checked;
      if (!isControlled) setUncontrolledChecked(nextChecked);
      onChange?.(event);
      onCheckedChange?.(nextChecked);
      event.target.indeterminate = indeterminate;
    };

    return (
      <div
        className={cx('apui-checkbox', classes.root, className)}
        data-state={state}
        data-invalid={flag(isInvalid)}
        data-disabled={flag(disabled)}
      >
        <span className={classes.box} data-scope="checkbox" data-part="box">
          <input
            {...rest}
            ref={setRefs}
            type="checkbox"
            className={classes.control}
            data-scope="checkbox"
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
            className={classes.indicator}
            data-scope="checkbox"
            data-part="indicator"
            aria-hidden="true"
          >
            <IconSvg name="check" dataIcon="check" />
            <IconSvg name="minus" dataIcon="minus" />
          </span>
        </span>
        <FieldLabel
          scope="checkbox"
          htmlFor={id}
          label={label}
          required={false}
          className={classes.label}
        />
        <FieldHelp scope="checkbox" part="description" id={helpId} className={classes.description}>
          {description}
        </FieldHelp>
        <FieldError scope="checkbox" id={errorId} message={error} className={classes.error} />
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';
