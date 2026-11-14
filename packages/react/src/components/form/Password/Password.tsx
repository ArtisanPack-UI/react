/**
 * @module Password
 *
 * The design-system Password (#53). Renders the `.apui-password` markup
 * contract, styled by `@artisanpack-ui/css`: Input's field anatomy with a
 * reveal toggle, an optional strength meter and live requirements.
 */

import {
  forwardRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

import { FieldError, FieldHelp, FieldLabel, useFieldIds } from '../../../internal/field';
import { IconPart, IconSvg } from '../../../internal/icon';
import { cx, flag, type PartClasses } from '../../../internal/parts';

/** Control height of a {@link Password}. */
export type PasswordSize = 'sm' | 'md' | 'lg';

/** The parts a {@link Password} accepts extra classes for. */
export type PasswordPart =
  | 'root'
  | 'label'
  | 'required'
  | 'box'
  | 'icon'
  | 'control'
  | 'reveal'
  | 'strength'
  | 'segment'
  | 'strengthLabel'
  | 'requirements'
  | 'requirement'
  | 'hint'
  | 'error';

/** A rule the value must match: `pattern` is a regular expression source. */
export interface PasswordRequirement {
  label: ReactNode;
  pattern: string;
}

/** Built-in text for the strength meter and the requirement states. */
export interface PasswordLabels {
  strength: string;
  weak: string;
  fair: string;
  good: string;
  strong: string;
  met: string;
  unmet: string;
}

/** The English defaults for {@link PasswordLabels}. */
export const PASSWORD_LABELS: PasswordLabels = {
  strength: 'Strength',
  weak: 'Weak',
  fair: 'Fair',
  good: 'Good',
  strong: 'Strong',
  met: 'Met',
  unmet: 'Not met',
};

const LEVEL_NAMES = ['', 'weak', 'fair', 'good', 'strong'] as const;

/**
 * The strength level, 0 (empty) to 4, the same in every stack: a point each
 * for 8+ and 12+ characters, mixed case, a digit and a symbol, minus one,
 * kept between 1 and 4.
 */
export function passwordStrength(value: string): 0 | 1 | 2 | 3 | 4 {
  if (value === '') return 0;
  const points =
    Number(value.length >= 8) +
    Number(value.length >= 12) +
    Number(/[a-z]/.test(value) && /[A-Z]/.test(value)) +
    Number(/\d/.test(value)) +
    Number(/[^A-Za-z0-9]/.test(value));
  return Math.min(4, Math.max(1, points - 1)) as 1 | 2 | 3 | 4;
}

/** Whether `value` matches a requirement's pattern. An invalid pattern is unmet. */
export function requirementMet(pattern: string, value: string): boolean {
  try {
    return new RegExp(pattern, 'u').test(value);
  } catch {
    return false;
  }
}

/**
 * Props for the {@link Password} component.
 *
 * `className` goes to the root; every other native attribute (`name`,
 * `aria-*`, `data-*`, `id`, …) goes to the native `<input>`.
 */
export interface PasswordProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'value' | 'defaultValue' | 'prefix'
> {
  /** Control height. Emitted as `data-size`. @defaultValue `'md'` */
  size?: PasswordSize;
  /** The autocomplete hint; `new-password` on sign-up and reset forms. @defaultValue `'current-password'` */
  autocomplete?: 'current-password' | 'new-password';
  /** The visible label, linked to the control. Without it, pass an `aria-label`. */
  label?: ReactNode;
  /** Help text under the box, linked with `aria-describedby`. */
  hint?: ReactNode;
  /** Validation message. Marks the field invalid and is linked with `aria-describedby`. */
  error?: string;
  /** Marks the field invalid without a message. @defaultValue `false` */
  invalid?: boolean;
  /** Disables the control and the reveal button. @defaultValue `false` */
  disabled?: boolean;
  /** Makes the control read-only. It stays focusable. @defaultValue `false` */
  readonly?: boolean;
  /** Marks the field required and shows the required mark. @defaultValue `false` */
  required?: boolean;
  /** Placeholder text. Never a replacement for the label. */
  placeholder?: string;
  /** The value of a controlled password. */
  value?: string;
  /** The initial value of an uncontrolled password. */
  defaultValue?: string;
  /** Icon name before the value, such as `lock`. `icon` overrides it. */
  leadingIcon?: string;
  /** Shows the strength meter and its label under the box. @defaultValue `false` */
  strengthMeter?: boolean;
  /** Rules shown under the box and checked as people type. */
  requirements?: PasswordRequirement[];
  /** The reveal button's name; aria-pressed carries the state. @defaultValue `'Show password'` */
  revealLabel?: string;
  /** Built-in text for the meter and requirement states; missing keys keep their defaults. */
  labels?: Partial<PasswordLabels>;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<PasswordPart>;
  /** Leading icon node; overrides `leadingIcon`. */
  icon?: ReactNode;
  /** Called with the new value whenever it changes. The native `onChange` still fires. */
  onValueChange?: (value: string) => void;
}

/**
 * Password entry with a reveal toggle, an optional strength meter and live
 * requirements. Controlled (`value` + `onValueChange`) or uncontrolled
 * (`defaultValue`). The ref points at the native `<input>`.
 *
 * @example
 * ```tsx
 * <Password label="New password" autocomplete="new-password" strengthMeter
 *   requirements={[{ label: 'At least 12 characters', pattern: '.{12,}' }]} />
 * ```
 */
export const Password = forwardRef<HTMLInputElement, PasswordProps>(
  (
    {
      size = 'md',
      autocomplete,
      autoComplete,
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
      leadingIcon,
      strengthMeter = false,
      requirements,
      revealLabel = 'Show password',
      labels,
      classes = {},
      icon,
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
    const text = { ...PASSWORD_LABELS, ...labels };
    const [revealed, setRevealed] = useState(false);
    const [uncontrolled, setUncontrolled] = useState(defaultValue ?? '');
    const isControlled = value !== undefined;
    const current = isControlled ? value : uncontrolled;
    const hasRequirements = Boolean(requirements && requirements.length > 0);
    const { id, helpId, errorId } = useFieldIds(
      explicitId,
      { suffix: 'hint', content: hint },
      error,
      undefined,
    );
    const requirementsId = hasRequirements ? `${id}-requirements` : undefined;
    const describedBy =
      [helpId, requirementsId, errorId, callerDescribedBy].filter(Boolean).join(' ') || undefined;
    const level = passwordStrength(current);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setUncontrolled(event.target.value);
      onChange?.(event);
      onValueChange?.(event.target.value);
    };

    return (
      <div
        className={cx('apui-password', classes.root, className)}
        data-size={size}
        data-invalid={flag(isInvalid)}
        data-disabled={flag(disabled)}
        data-readonly={flag(isReadonly)}
      >
        <FieldLabel
          scope="password"
          htmlFor={id}
          label={label}
          required={required}
          className={classes.label}
          requiredClassName={classes.required}
        />
        <div className={classes.box} data-scope="password" data-part="box">
          <IconPart
            scope="password"
            part="icon"
            name={leadingIcon}
            node={icon}
            className={classes.icon}
          />
          <input
            {...rest}
            ref={ref}
            className={classes.control}
            data-scope="password"
            data-part="control"
            id={id}
            type={revealed ? 'text' : 'password'}
            autoComplete={autocomplete ?? autoComplete ?? 'current-password'}
            value={isControlled ? value : undefined}
            defaultValue={isControlled ? undefined : defaultValue}
            disabled={disabled || undefined}
            readOnly={isReadonly || undefined}
            required={required || undefined}
            aria-invalid={isInvalid ? true : callerInvalid}
            aria-describedby={describedBy}
            onChange={handleChange}
          />
          <button
            type="button"
            className={classes.reveal}
            data-scope="password"
            data-part="reveal"
            aria-label={revealLabel}
            aria-pressed={revealed}
            aria-controls={id}
            disabled={disabled || undefined}
            onClick={() => setRevealed((shown) => !shown)}
          >
            <IconSvg name="eye" dataIcon="eye" />
            <IconSvg name="eye-off" dataIcon="eye-off" />
          </button>
        </div>
        {strengthMeter ? (
          <>
            <div
              className={classes.strength}
              data-scope="password"
              data-part="strength"
              data-level={level}
              aria-hidden="true"
            >
              {[0, 1, 2, 3].map((index) => (
                <span
                  key={index}
                  className={classes.segment}
                  data-scope="password"
                  data-part="segment"
                />
              ))}
            </div>
            <div className={classes.strengthLabel} data-scope="password" data-part="strengthLabel">
              <span>{text.strength}</span>
              <span aria-live="polite">{level === 0 ? '' : text[LEVEL_NAMES[level]]}</span>
            </div>
          </>
        ) : null}
        {hasRequirements ? (
          <ul
            className={classes.requirements}
            data-scope="password"
            data-part="requirements"
            id={requirementsId}
          >
            {requirements!.map((requirement, index) => {
              const met = requirementMet(requirement.pattern, current);
              return (
                <li
                  key={index}
                  className={classes.requirement}
                  data-scope="password"
                  data-part="requirement"
                  data-met={flag(met)}
                >
                  <IconSvg name="check" dataIcon="check" />
                  <IconSvg name="x" dataIcon="x" />
                  {requirement.label}
                  <span className="apui-sr-only">{` (${met ? text.met : text.unmet})`}</span>
                </li>
              );
            })}
          </ul>
        ) : null}
        <FieldHelp scope="password" part="hint" id={helpId} className={classes.hint}>
          {hint}
        </FieldHelp>
        <FieldError scope="password" id={errorId} message={error} className={classes.error} />
      </div>
    );
  },
);

Password.displayName = 'Password';
