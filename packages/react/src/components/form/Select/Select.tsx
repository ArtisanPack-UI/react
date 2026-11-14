/**
 * @module Select
 *
 * The design-system Select (#46): the native `<select>` in the shared field
 * anatomy, rendering the `.apui-select` markup contract styled by
 * `@artisanpack-ui/css`. Searchable and rich options belong to Combobox.
 */

import {
  forwardRef,
  type ChangeEvent,
  type ReactElement,
  type ReactNode,
  type RefAttributes,
  type SelectHTMLAttributes,
} from 'react';

import { FieldError, FieldHelp, FieldLabel, useFieldIds } from '../../../internal/field';
import { IconPart, IconSvg } from '../../../internal/icon';
import { cx, flag, type PartClasses } from '../../../internal/parts';

/** Control height of a {@link Select}. */
export type SelectSize = 'sm' | 'md' | 'lg';

/** A value an option can carry. */
export type SelectValue = string | number;

/** One option: a string (value and label), or a `{ value, label, disabled }` object. */
export type SelectOption<V extends SelectValue = SelectValue> =
  | string
  | {
      /** The option's value. Compared as a string; `onValueChange` receives it as given. */
      value: V;
      /** The text shown. Defaults to the value. */
      label?: string;
      /** Makes the option unselectable. */
      disabled?: boolean;
    };

/**
 * A group of options, rendered as a native `<optgroup>` (#53; replaces
 * Livewire's `select-group`).
 */
export interface SelectOptionGroup<V extends SelectValue = SelectValue> {
  /** The group's label. */
  label: string;
  /** The options in the group. */
  options: SelectOption<V>[];
}

/** The parts a {@link Select} accepts extra classes for. */
export type SelectPart =
  | 'root'
  | 'label'
  | 'required'
  | 'box'
  | 'icon'
  | 'control'
  | 'indicator'
  | 'hint'
  | 'error';

/** The default placeholder option text. Pass `placeholder` to translate it. */
export const SELECT_DEFAULT_PLACEHOLDER = 'Select…';

/**
 * Props for the {@link Select} component.
 *
 * `className` goes to the root; every other native attribute (`name`,
 * `aria-*`, `data-*`, `id`, …) goes to the native `<select>`.
 */
export interface SelectProps<V extends SelectValue = string> extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'size' | 'value' | 'defaultValue' | 'multiple'
> {
  /** Control height. Emitted as `data-size`. @defaultValue `'md'` */
  size?: SelectSize;
  /**
   * The options, and `{ label, options }` groups rendered as native optgroups.
   * `<option>` children render as well, after them.
   */
  options?: (SelectOption<V> | SelectOptionGroup<V>)[];
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
  /** Marks the field required, shows the required mark and makes the placeholder unselectable. */
  required?: boolean;
  /** The empty first option. An empty string renders no placeholder option. @defaultValue `'Select…'` */
  placeholder?: string;
  /** The selected value of a controlled select. Compared with the options as a string. */
  value?: SelectValue;
  /** The initial value of an uncontrolled select. */
  defaultValue?: SelectValue;
  /** Icon name before the value, resolved through the icon registry. `icon` overrides it. */
  leadingIcon?: string;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<SelectPart>;
  /** Leading icon node; overrides `leadingIcon`. */
  icon?: ReactNode;
  /**
   * Called with the new value whenever it changes: the matching `options` entry's
   * value with its original type (a number stays a number), or the string value of
   * an `<option>` child or the placeholder. The native `onChange` still fires.
   */
  onValueChange?: (value: NoInfer<V> | string) => void;
}

const isGroup = (entry: SelectOption | SelectOptionGroup): entry is SelectOptionGroup =>
  typeof entry !== 'string' && Array.isArray((entry as SelectOptionGroup).options);

/** The options with the groups' options in place, for matching a chosen value. */
const flatOptions = (entries: (SelectOption | SelectOptionGroup)[]): SelectOption[] =>
  entries.flatMap((entry) => (isGroup(entry) ? entry.options : [entry]));

const renderOption = (option: { value: string; label: string; disabled: boolean }) => (
  <option key={option.value} value={option.value} disabled={option.disabled || undefined}>
    {option.label}
  </option>
);

const normalizeOption = (option: SelectOption) =>
  typeof option === 'string'
    ? { value: option, label: option, disabled: false }
    : {
        value: String(option.value),
        label: option.label ?? String(option.value),
        disabled: option.disabled === true,
      };

/**
 * Chooses one value from a short list with the native `<select>`. Controlled
 * (`value` + `onValueChange`) or uncontrolled (`defaultValue`). The ref points
 * at the native `<select>`.
 *
 * @example
 * ```tsx
 * <Select
 *   label="Country"
 *   options={[{ value: 'us', label: 'United States' }, { value: 'ca', label: 'Canada' }]}
 *   value={country}
 *   onValueChange={setCountry}
 * />
 * ```
 */
const SelectBase = forwardRef<HTMLSelectElement, SelectProps<SelectValue>>(
  (
    {
      size = 'md',
      options = [],
      label,
      hint,
      error,
      invalid = false,
      disabled = false,
      required = false,
      placeholder = SELECT_DEFAULT_PLACEHOLDER,
      leadingIcon,
      classes = {},
      icon,
      className,
      children,
      id: explicitId,
      onChange,
      onValueChange,
      value,
      defaultValue,
      'aria-describedby': callerDescribedBy,
      'aria-invalid': callerInvalid,
      ...rest
    },
    ref,
  ) => {
    const hasPlaceholder = placeholder !== '';
    // Without a value, start on the placeholder. Browsers would otherwise
    // select the first enabled option, skipping a required (disabled) placeholder.
    const initialValue =
      value === undefined && defaultValue === undefined && hasPlaceholder ? '' : defaultValue;
    const isInvalid = invalid || Boolean(error);
    const { id, helpId, errorId, describedBy } = useFieldIds(
      explicitId,
      { suffix: 'hint', content: hint },
      error,
      callerDescribedBy,
    );

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
      onChange?.(event);
      const selected = event.target.value;
      const match = flatOptions(options).find(
        (option) => typeof option !== 'string' && String(option.value) === selected,
      );
      onValueChange?.(match !== undefined && typeof match !== 'string' ? match.value : selected);
    };

    return (
      <div
        className={cx('apui-select', classes.root, className)}
        data-size={size}
        data-invalid={flag(isInvalid)}
        data-disabled={flag(disabled)}
      >
        <FieldLabel
          scope="select"
          htmlFor={id}
          label={label}
          required={required}
          className={classes.label}
          requiredClassName={classes.required}
        />
        <div className={classes.box} data-scope="select" data-part="box">
          <IconPart
            scope="select"
            part="icon"
            name={leadingIcon}
            node={icon}
            className={classes.icon}
          />
          <select
            {...rest}
            ref={ref}
            className={classes.control}
            data-scope="select"
            data-part="control"
            id={id}
            value={value}
            defaultValue={initialValue}
            disabled={disabled || undefined}
            required={required || undefined}
            aria-invalid={isInvalid ? true : callerInvalid}
            aria-describedby={describedBy}
            onChange={handleChange}
          >
            {hasPlaceholder ? (
              <option value="" disabled={required || undefined}>
                {placeholder}
              </option>
            ) : null}
            {options.map((entry, index) =>
              isGroup(entry) ? (
                <optgroup key={`group-${index}`} label={entry.label}>
                  {entry.options.map(normalizeOption).map(renderOption)}
                </optgroup>
              ) : (
                renderOption(normalizeOption(entry))
              ),
            )}
            {children}
          </select>
          <span
            className={classes.indicator}
            data-scope="select"
            data-part="indicator"
            aria-hidden="true"
          >
            <IconSvg name="chevron-down" />
          </span>
        </div>
        <FieldHelp scope="select" part="hint" id={helpId} className={classes.hint}>
          {hint}
        </FieldHelp>
        <FieldError scope="select" id={errorId} message={error} className={classes.error} />
      </div>
    );
  },
);

SelectBase.displayName = 'Select';

/** {@inheritDoc SelectBase} Generic over the options' value type. */
export const Select = SelectBase as (<V extends SelectValue = string>(
  props: SelectProps<V> & RefAttributes<HTMLSelectElement>,
) => ReactElement | null) & { displayName?: string };
