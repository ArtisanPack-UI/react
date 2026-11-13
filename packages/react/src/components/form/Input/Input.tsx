/**
 * @module Input
 *
 * The design-system Input (#45). Renders the shared `.apui-input` markup
 * contract, styled by `@artisanpack-ui/css`. It anchors the field anatomy
 * (label, box, hint, error) that Select and Checkbox reuse.
 */

import { forwardRef, type ChangeEvent, type InputHTMLAttributes, type ReactNode } from 'react';

import { FieldError, FieldHelp, FieldLabel, useFieldIds } from '../../../internal/field';
import { IconPart } from '../../../internal/icon';
import { cx, flag, hasContent, type PartClasses } from '../../../internal/parts';

/** Control height of an {@link Input}. */
export type InputSize = 'sm' | 'md' | 'lg';

/** The parts an {@link Input} accepts extra classes for. */
export type InputPart =
  | 'root'
  | 'label'
  | 'required'
  | 'box'
  | 'icon'
  | 'prefix'
  | 'control'
  | 'suffix'
  | 'iconEnd'
  | 'hint'
  | 'error';

/**
 * Props for the {@link Input} component.
 *
 * `className` goes to the root; every other native attribute (`name`,
 * `autoComplete`, `aria-*`, `data-*`, `id`, …) goes to the native `<input>`.
 */
export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'prefix' | 'value' | 'defaultValue'
> {
  /** Control height. Emitted as `data-size`. @defaultValue `'md'` */
  size?: InputSize;
  /** The native input type, such as `email`, `url`, `search` or `number`. @defaultValue `'text'` */
  type?: InputHTMLAttributes<HTMLInputElement>['type'];
  /** The visible label, linked to the control. Without it, pass an `aria-label`. */
  label?: ReactNode;
  /** Help text under the control, linked with `aria-describedby`. */
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
  /** The value of a controlled input. */
  value?: string;
  /** The initial value of an uncontrolled input. */
  defaultValue?: string;
  /** Content inside the box before the value, such as a currency or `https://`. */
  prefix?: ReactNode;
  /** Content inside the box after the value, such as a unit. */
  suffix?: ReactNode;
  /** Icon name before the value, resolved through the icon registry. `icon` overrides it. */
  leadingIcon?: string;
  /** Icon name after the value, resolved through the icon registry. `iconEnd` overrides it. */
  trailingIcon?: string;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<InputPart>;
  /** Leading icon node; overrides `leadingIcon`. */
  icon?: ReactNode;
  /** Trailing icon node; overrides `trailingIcon`. */
  iconEnd?: ReactNode;
  /** Called with the new value whenever it changes. The native `onChange` still fires. */
  onValueChange?: (value: string) => void;
}

/**
 * Single-line text entry with a visible label, hint and error. Controlled
 * (`value` + `onValueChange`) or uncontrolled (`defaultValue`). The ref points
 * at the native `<input>`.
 *
 * @example
 * ```tsx
 * const [email, setEmail] = useState('');
 * <Input type="email" label="Email" hint="We never share it." value={email} onValueChange={setEmail} />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      type = 'text',
      label,
      hint,
      error,
      invalid = false,
      disabled = false,
      readonly,
      readOnly,
      required = false,
      prefix,
      suffix,
      leadingIcon,
      trailingIcon,
      classes = {},
      icon,
      iconEnd,
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
    const { id, helpId, errorId, describedBy } = useFieldIds(
      explicitId,
      { suffix: 'hint', content: hint },
      error,
      callerDescribedBy,
    );

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      onValueChange?.(event.target.value);
    };

    return (
      <div
        className={cx('apui-input', classes.root, className)}
        data-size={size}
        data-invalid={flag(isInvalid)}
        data-disabled={flag(disabled)}
        data-readonly={flag(isReadonly)}
      >
        <FieldLabel
          scope="input"
          htmlFor={id}
          label={label}
          required={required}
          className={classes.label}
          requiredClassName={classes.required}
        />
        <div className={classes.box} data-scope="input" data-part="box">
          <IconPart
            scope="input"
            part="icon"
            name={leadingIcon}
            node={icon}
            className={classes.icon}
          />
          {hasContent(prefix) ? (
            <span className={classes.prefix} data-scope="input" data-part="prefix">
              {prefix}
            </span>
          ) : null}
          <input
            {...rest}
            ref={ref}
            className={classes.control}
            data-scope="input"
            data-part="control"
            id={id}
            type={type}
            disabled={disabled || undefined}
            readOnly={isReadonly || undefined}
            required={required || undefined}
            aria-invalid={isInvalid ? true : callerInvalid}
            aria-describedby={describedBy}
            onChange={handleChange}
          />
          {hasContent(suffix) ? (
            <span className={classes.suffix} data-scope="input" data-part="suffix">
              {suffix}
            </span>
          ) : null}
          <IconPart
            scope="input"
            part="iconEnd"
            name={trailingIcon}
            node={iconEnd}
            className={classes.iconEnd}
          />
        </div>
        <FieldHelp scope="input" part="hint" id={helpId} className={classes.hint}>
          {hint}
        </FieldHelp>
        <FieldError scope="input" id={errorId} message={error} className={classes.error} />
      </div>
    );
  },
);

Input.displayName = 'Input';
