/**
 * @module CheckboxGroup
 *
 * The design-system CheckboxGroup (#53): a fieldset of pilot Checkboxes
 * whose value is the array of checked values, rendering the
 * `.apui-checkbox-group` markup contract styled by `@artisanpack-ui/css`.
 */

import { forwardRef, useId, useState, type FieldsetHTMLAttributes, type ReactNode } from 'react';

import { normalizeChoices, type ChoiceOption, type ChoiceValue } from '../../../internal/choice';
import { IconSvg } from '../../../internal/icon';
import { cx, flag, hasContent, type PartClasses } from '../../../internal/parts';
import { Checkbox } from '../Checkbox/Checkbox';

/** One CheckboxGroup option: a string, or `{ value, label, description, disabled }`. */
export type CheckboxGroupOption<V extends ChoiceValue = ChoiceValue> = ChoiceOption<V>;

/** The parts a {@link CheckboxGroup} accepts extra classes for. */
export type CheckboxGroupPart = 'root' | 'label' | 'selectAll' | 'items' | 'hint' | 'error';

/** The default select-all label. Pass `selectAllLabel` to translate it. */
export const CHECKBOX_GROUP_DEFAULT_SELECT_ALL_LABEL = 'Select all';

/**
 * Props for the {@link CheckboxGroup} component.
 *
 * `className` goes to the fieldset. Pass `name` (such as `topics[]`) to
 * submit with a form; it lands on every option's checkbox.
 */
export interface CheckboxGroupProps extends Omit<
  FieldsetHTMLAttributes<HTMLFieldSetElement>,
  'defaultValue' | 'onChange' | 'disabled'
> {
  /** The options: strings, or `{ value, label, description, disabled }` objects. */
  options?: CheckboxGroupOption[];
  /** The checked values (controlled). Compared with the options as strings. */
  value?: ChoiceValue[];
  /** The initially checked values of an uncontrolled group. */
  defaultValue?: ChoiceValue[];
  /** The group label, rendered as the legend. */
  label?: ReactNode;
  /** Help text under the options, linked to the fieldset. */
  hint?: ReactNode;
  /** Validation message. Marks the group invalid and is linked with `aria-describedby`. */
  error?: string;
  /** Marks every option invalid without a message. @defaultValue `false` */
  invalid?: boolean;
  /** Disables every option and select all. @defaultValue `false` */
  disabled?: boolean;
  /** Stacks the options or wraps them in a row. @defaultValue `'vertical'` */
  orientation?: 'vertical' | 'horizontal';
  /** Plain checkboxes, or cards. @defaultValue `'default'` */
  variant?: 'default' | 'cards';
  /** 1, 2 or 3 columns. @defaultValue `1` */
  columns?: number;
  /** Adds a select-all checkbox with the mixed state. @defaultValue `false` */
  selectAll?: boolean;
  /** The select-all label. @defaultValue `'Select all'` */
  selectAllLabel?: string;
  /** The checkboxes' name, for form submission. */
  name?: string;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<CheckboxGroupPart>;
  /** Called with the checked values, in option order, with their original types. */
  onValueChange?: (value: ChoiceValue[]) => void;
}

/**
 * A labeled set of related checkboxes. Controlled (`value` +
 * `onValueChange`) or uncontrolled (`defaultValue`). The ref points at the
 * fieldset.
 *
 * @example
 * ```tsx
 * <CheckboxGroup label="Notify me about" options={topics} selectAll value={topics} onValueChange={setTopics} />
 * ```
 */
export const CheckboxGroup = forwardRef<HTMLFieldSetElement, CheckboxGroupProps>(
  (
    {
      options = [],
      value,
      defaultValue = [],
      label,
      hint,
      error,
      invalid = false,
      disabled = false,
      orientation = 'vertical',
      variant = 'default',
      columns = 1,
      selectAll = false,
      selectAllLabel = CHECKBOX_GROUP_DEFAULT_SELECT_ALL_LABEL,
      name,
      classes = {},
      className,
      id: explicitId,
      onValueChange,
      'aria-describedby': callerDescribedBy,
      ...rest
    },
    ref,
  ) => {
    const generated = useId();
    const id = explicitId ?? generated;
    const [uncontrolled, setUncontrolled] = useState<ChoiceValue[]>(defaultValue);
    const current = value ?? uncontrolled;
    const checkedKeys = new Set(current.map(String));
    const isInvalid = invalid || Boolean(error);
    const hintId = hasContent(hint) ? `${id}-hint` : undefined;
    const errorId = error ? `${id}-error` : undefined;
    const describedBy = [hintId, errorId, callerDescribedBy].filter(Boolean).join(' ') || undefined;
    const choices = normalizeChoices(options);
    // Select all reflects the options that aren't disabled on their own, also while the group is.
    const enabled = choices.filter((choice) => !choice.disabled);
    const enabledChecked = enabled.filter((choice) => checkedKeys.has(choice.key)).length;

    const commit = (keys: Set<string>) => {
      // Values that no option stands for (set by the owner) are kept, after the options'.
      const known = new Set(choices.map((choice) => choice.key));
      const next = [
        ...choices.filter((choice) => keys.has(choice.key)).map((choice) => choice.value),
        ...current.filter((item) => !known.has(String(item))),
      ];
      if (value === undefined) setUncontrolled(next);
      onValueChange?.(next);
    };

    const toggle = (key: string, on: boolean) => {
      const keys = new Set(checkedKeys);
      if (on) keys.add(key);
      else keys.delete(key);
      commit(keys);
    };

    const toggleAll = (on: boolean) => {
      const keys = new Set(checkedKeys);
      for (const choice of enabled) {
        if (on) keys.add(choice.key);
        else keys.delete(choice.key);
      }
      commit(keys);
    };

    return (
      <fieldset
        {...rest}
        ref={ref}
        id={id}
        className={cx('apui-checkbox-group', classes.root, className)}
        data-orientation={orientation}
        data-variant={variant}
        data-columns={columns}
        data-invalid={flag(isInvalid)}
        data-disabled={flag(disabled)}
        disabled={disabled || undefined}
        aria-describedby={describedBy}
      >
        {hasContent(label) ? (
          <legend className={classes.label} data-scope="checkbox-group" data-part="label">
            {label}
          </legend>
        ) : null}
        {selectAll ? (
          <div className={classes.selectAll} data-scope="checkbox-group" data-part="select-all">
            <Checkbox
              id={`${id}-all`}
              label={selectAllLabel}
              checked={enabled.length > 0 && enabledChecked === enabled.length}
              indeterminate={enabledChecked > 0 && enabledChecked < enabled.length}
              disabled={disabled}
              onCheckedChange={toggleAll}
            />
          </div>
        ) : null}
        <div className={classes.items} data-scope="checkbox-group" data-part="items">
          {choices.map((choice, index) => (
            <Checkbox
              key={choice.key}
              id={`${id}-${index}`}
              name={name}
              value={choice.key}
              label={choice.label}
              description={choice.description}
              checked={checkedKeys.has(choice.key)}
              invalid={isInvalid}
              disabled={disabled || choice.disabled}
              onCheckedChange={(on) => toggle(choice.key, on)}
            />
          ))}
        </div>
        {hintId ? (
          <p className={classes.hint} data-scope="checkbox-group" data-part="hint" id={hintId}>
            {hint}
          </p>
        ) : null}
        {errorId ? (
          <p className={classes.error} data-scope="checkbox-group" data-part="error" id={errorId}>
            <IconSvg name="circle-alert" />
            {error}
          </p>
        ) : null}
      </fieldset>
    );
  },
);

CheckboxGroup.displayName = 'CheckboxGroup';
