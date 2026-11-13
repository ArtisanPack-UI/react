/**
 * @module Textarea
 *
 * The design-system Textarea (#53). Renders the `.apui-textarea` markup
 * contract, styled by `@artisanpack-ui/css`: Input's field anatomy (label,
 * box, hint, error) around a native `<textarea>`, plus an optional counter.
 */

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react';

import { FieldError, FieldHelp, FieldLabel, useFieldIds } from '../../../internal/field';
import { useFormReset } from '../../../internal/form-reset';
import { cx, flag, type PartClasses } from '../../../internal/parts';

/** The parts a {@link Textarea} accepts extra classes for. */
export type TextareaPart =
  | 'root'
  | 'label'
  | 'required'
  | 'box'
  | 'control'
  | 'count'
  | 'hint'
  | 'error';

/** The default announcement near the limit; `{count}` is the characters left. */
export const TEXTAREA_REMAINING_LABEL = 'Characters left: {count}';

/**
 * The live-region text for a counter: empty until the characters left are
 * within 10% of the limit (at least 10), then `remainingLabel` with `{count}`.
 */
export function textareaAnnouncement(
  length: number,
  maxLength: number,
  remainingLabel: string = TEXTAREA_REMAINING_LABEL,
): string {
  const remaining = Math.max(0, maxLength - length);
  const threshold = Math.max(10, Math.ceil(maxLength * 0.1));
  return remaining <= threshold ? remainingLabel.replaceAll('{count}', String(remaining)) : '';
}

/**
 * Props for the {@link Textarea} component.
 *
 * `className` goes to the root; every other native attribute (`name`,
 * `aria-*`, `data-*`, `id`, …) goes to the native `<textarea>`.
 */
export interface TextareaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'value' | 'defaultValue' | 'maxLength'
> {
  /** Visible lines of text; with `autoResize`, the minimum. @defaultValue `4` */
  rows?: number;
  /** The most characters allowed. Sets `maxlength` and shows the counter. */
  maxLength?: number;
  /** Grows the box with its content. Emitted as `data-auto-resize`. @defaultValue `false` */
  autoResize?: boolean;
  /** The visible label, linked to the control. Without it, pass an `aria-label`. */
  label?: ReactNode;
  /** Help text under the box, linked with `aria-describedby`. */
  hint?: ReactNode;
  /** Validation message. Marks the field invalid and is linked with `aria-describedby`. */
  error?: string;
  /** Marks the field invalid without a message. @defaultValue `false` */
  invalid?: boolean;
  /** Disables the control. @defaultValue `false` */
  disabled?: boolean;
  /** Makes the control read-only. It stays focusable. @defaultValue `false` */
  readonly?: boolean;
  /** Marks the field required and shows the required mark. @defaultValue `false` */
  required?: boolean;
  /** Placeholder text. Never a replacement for the label. */
  placeholder?: string;
  /** The value of a controlled textarea. */
  value?: string;
  /** The initial value of an uncontrolled textarea. */
  defaultValue?: string;
  /** The counter's announcement near the limit; `{count}` is the characters left. @defaultValue `'Characters left: {count}'` */
  remainingLabel?: string;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<TextareaPart>;
  /** Called with the new value whenever it changes. The native `onChange` still fires. */
  onValueChange?: (value: string) => void;
}

/**
 * Multi-line text entry with a visible label, hint, error and optional
 * counter. Controlled (`value` + `onValueChange`) or uncontrolled
 * (`defaultValue`). The ref points at the native `<textarea>`.
 *
 * @example
 * ```tsx
 * <Textarea label="Description" maxLength={500} value={text} onValueChange={setText} />
 * ```
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      rows = 4,
      maxLength,
      autoResize = false,
      label,
      hint,
      error,
      invalid = false,
      disabled = false,
      readonly,
      readOnly,
      required = false,
      value,
      defaultValue,
      remainingLabel = TEXTAREA_REMAINING_LABEL,
      classes = {},
      className,
      id: explicitId,
      onChange,
      onValueChange,
      'aria-describedby': callerDescribedBy,
      'aria-invalid': callerInvalid,
      ...rest
    },
    ref,
  ) => {
    const isReadonly = readonly ?? readOnly ?? false;
    const isInvalid = invalid || Boolean(error);
    const [uncontrolled, setUncontrolled] = useState(defaultValue ?? '');
    const isControlled = value !== undefined;
    const current = isControlled ? value : uncontrolled;
    // An uncontrolled textarea follows its form's reset, so the counter doesn't keep the old length.
    const controlRef = useRef<HTMLTextAreaElement | null>(null);
    useImperativeHandle(ref, () => controlRef.current as HTMLTextAreaElement);
    useFormReset(controlRef, !isControlled, (control) => setUncontrolled(control.value));
    const { id, helpId, errorId, describedBy } = useFieldIds(
      explicitId,
      { suffix: 'hint', content: hint },
      error,
      callerDescribedBy,
    );

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
      if (!isControlled) setUncontrolled(event.target.value);
      onChange?.(event);
      onValueChange?.(event.target.value);
    };

    const hasCounter = typeof maxLength === 'number' && maxLength > 0;

    return (
      <div
        className={cx('apui-textarea', classes.root, className)}
        data-invalid={flag(isInvalid)}
        data-disabled={flag(disabled)}
        data-readonly={flag(isReadonly)}
        data-auto-resize={flag(autoResize)}
      >
        <FieldLabel
          scope="textarea"
          htmlFor={id}
          label={label}
          required={required}
          className={classes.label}
          requiredClassName={classes.required}
        />
        <div className={classes.box} data-scope="textarea" data-part="box">
          <textarea
            {...rest}
            ref={controlRef}
            className={classes.control}
            data-scope="textarea"
            data-part="control"
            id={id}
            rows={rows}
            maxLength={hasCounter ? maxLength : undefined}
            value={isControlled ? value : undefined}
            defaultValue={isControlled ? undefined : defaultValue}
            disabled={disabled || undefined}
            readOnly={isReadonly || undefined}
            required={required || undefined}
            aria-invalid={isInvalid ? true : callerInvalid}
            aria-describedby={describedBy}
            onChange={handleChange}
          />
          {hasCounter ? (
            <>
              <span
                className={classes.count}
                data-scope="textarea"
                data-part="count"
                aria-hidden="true"
              >
                {`${current.length} / ${maxLength}`}
              </span>
              <span className="apui-sr-only" aria-live="polite">
                {textareaAnnouncement(current.length, maxLength, remainingLabel)}
              </span>
            </>
          ) : null}
        </div>
        <FieldHelp scope="textarea" part="hint" id={helpId} className={classes.hint}>
          {hint}
        </FieldHelp>
        <FieldError scope="textarea" id={errorId} message={error} className={classes.error} />
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
