/**
 * @module RadioGroup
 *
 * The design-system RadioGroup (#53): native radios in a fieldset,
 * rendering the `.apui-radio-group` markup contract styled by
 * `@artisanpack-ui/css`. Replaces the deprecated `Radio`.
 */

import {
  forwardRef,
  useId,
  useState,
  type ChangeEvent,
  type FieldsetHTMLAttributes,
  type ReactNode,
} from 'react';

import { normalizeChoices, type ChoiceOption, type ChoiceValue } from '../../../internal/choice';
import { IconSvg } from '../../../internal/icon';
import { cx, flag, hasContent, type PartClasses } from '../../../internal/parts';

/** One RadioGroup option: a string, or `{ value, label, description, meta, disabled }`. */
export type RadioGroupOption<V extends ChoiceValue = ChoiceValue> = ChoiceOption<V>;

/** The layout of a {@link RadioGroup}. */
export type RadioGroupVariant = 'default' | 'cards' | 'segmented';

/** The direction of a {@link RadioGroup}'s options. */
export type RadioGroupOrientation = 'vertical' | 'horizontal';

/** The parts a {@link RadioGroup} accepts extra classes for. */
export type RadioGroupPart =
  | 'root'
  | 'label'
  | 'required'
  | 'items'
  | 'item'
  | 'box'
  | 'control'
  | 'indicator'
  | 'itemText'
  | 'itemDescription'
  | 'itemMeta'
  | 'hint'
  | 'error';

/**
 * Props for the {@link RadioGroup} component.
 *
 * `className` goes to the fieldset. `name` and the other native input
 * attributes aren't spread: pass `name` to submit with a form.
 */
export interface RadioGroupProps extends Omit<
  FieldsetHTMLAttributes<HTMLFieldSetElement>,
  'defaultValue' | 'onChange' | 'disabled'
> {
  /** The options: strings, or `{ value, label, description, meta, disabled }` objects. */
  options?: RadioGroupOption[];
  /** The selected value (controlled). Compared with the options as a string. */
  value?: ChoiceValue | null;
  /** The initial value of an uncontrolled group. */
  defaultValue?: ChoiceValue;
  /** The group label, rendered as the legend. */
  label?: ReactNode;
  /** Help text under the options, linked to the fieldset. */
  hint?: ReactNode;
  /** Validation message. Marks the group invalid and is linked with `aria-describedby`. */
  error?: string;
  /** Marks the group invalid without a message. @defaultValue `false` */
  invalid?: boolean;
  /** Disables every option. @defaultValue `false` */
  disabled?: boolean;
  /** Sets `required` on the radios and shows the required mark. @defaultValue `false` */
  required?: boolean;
  /** Stacks the options or lays them in a row. @defaultValue `'vertical'` */
  orientation?: RadioGroupOrientation;
  /** Plain radios, cards, or joined segments. @defaultValue `'default'` */
  variant?: RadioGroupVariant;
  /** The radios' shared name. Defaults to a generated one. */
  name?: string;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<RadioGroupPart>;
  /** Called with the chosen option's value, with its original type. */
  onValueChange?: (value: ChoiceValue) => void;
}

/**
 * Chooses exactly one option from a small set. Controlled (`value` +
 * `onValueChange`) or uncontrolled (`defaultValue`). The radios share one
 * name, so the platform supplies roving focus and arrow keys, which follow
 * the text direction. The ref points at the fieldset.
 *
 * @example
 * ```tsx
 * <RadioGroup label="Plan" variant="cards" options={plans} value={plan} onValueChange={setPlan} />
 * ```
 */
export const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  (
    {
      options = [],
      value,
      defaultValue,
      label,
      hint,
      error,
      invalid = false,
      disabled = false,
      required = false,
      orientation = 'vertical',
      variant = 'default',
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
    const groupName = name ?? id;
    const [uncontrolled, setUncontrolled] = useState<ChoiceValue | undefined>(defaultValue);
    const current = value !== undefined ? value : uncontrolled;
    const isInvalid = invalid || Boolean(error);
    const hintId = hasContent(hint) ? `${id}-hint` : undefined;
    const errorId = error ? `${id}-error` : undefined;
    const describedBy = [hintId, errorId, callerDescribedBy].filter(Boolean).join(' ') || undefined;
    const choices = normalizeChoices(options);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const choice = choices.find((option) => option.key === event.target.value);
      if (!choice) return;
      if (value === undefined) setUncontrolled(choice.value);
      onValueChange?.(choice.value);
    };

    return (
      <fieldset
        {...rest}
        ref={ref}
        id={id}
        className={cx('apui-radio-group', classes.root, className)}
        data-orientation={orientation}
        data-variant={variant}
        data-invalid={flag(isInvalid)}
        data-disabled={flag(disabled)}
        disabled={disabled || undefined}
        aria-describedby={describedBy}
      >
        {hasContent(label) ? (
          <legend className={classes.label} data-scope="radio-group" data-part="label">
            {label}
            {required ? (
              <span
                className={classes.required}
                data-scope="radio-group"
                data-part="required"
                aria-hidden="true"
              >
                *
              </span>
            ) : null}
          </legend>
        ) : null}
        <div className={classes.items} data-scope="radio-group" data-part="items">
          {choices.map((choice, index) => {
            const itemId = `${id}-${index}`;
            const itemDisabled = disabled || choice.disabled;
            // Segments are label-only: no description or meta.
            const segmented = variant === 'segmented';
            const hasDescription = !segmented && hasContent(choice.description);
            return (
              <label
                key={choice.key}
                className={classes.item}
                data-scope="radio-group"
                data-part="item"
                data-disabled={flag(itemDisabled)}
              >
                <span className={classes.box} data-scope="radio-group" data-part="box">
                  <input
                    type="radio"
                    className={classes.control}
                    data-scope="radio-group"
                    data-part="control"
                    id={itemId}
                    name={groupName}
                    value={choice.key}
                    checked={
                      current !== undefined && current !== null
                        ? String(current) === choice.key
                        : false
                    }
                    disabled={itemDisabled || undefined}
                    required={required || undefined}
                    aria-invalid={isInvalid ? true : undefined}
                    aria-describedby={hasDescription ? `${itemId}-description` : undefined}
                    onChange={handleChange}
                  />
                  <span
                    className={classes.indicator}
                    data-scope="radio-group"
                    data-part="indicator"
                    aria-hidden="true"
                  />
                </span>
                <span className={classes.itemText} data-scope="radio-group" data-part="item-text">
                  {choice.label}
                </span>
                {hasDescription ? (
                  <span
                    className={classes.itemDescription}
                    data-scope="radio-group"
                    data-part="item-description"
                    id={`${itemId}-description`}
                  >
                    {choice.description}
                  </span>
                ) : null}
                {!segmented && hasContent(choice.meta) ? (
                  <span className={classes.itemMeta} data-scope="radio-group" data-part="item-meta">
                    {choice.meta}
                  </span>
                ) : null}
              </label>
            );
          })}
        </div>
        {hintId ? (
          <p className={classes.hint} data-scope="radio-group" data-part="hint" id={hintId}>
            {hint}
          </p>
        ) : null}
        {errorId ? (
          <p className={classes.error} data-scope="radio-group" data-part="error" id={errorId}>
            <IconSvg name="circle-alert" />
            {error}
          </p>
        ) : null}
      </fieldset>
    );
  },
);

RadioGroup.displayName = 'RadioGroup';
