/**
 * @module Radio
 *
 * Deprecated alias of {@link RadioGroup}, kept for 1.x code. It maps the old
 * props onto RadioGroup: `options` read through `optionValue`, `optionLabel`
 * and `optionHint` → `{ value, label, description, disabled }` options,
 * `inline` → `orientation="horizontal"`, `card` → `variant="cards"` and
 * `cardClass` → `classes.item`. A native `onChange` still fires, from the
 * chosen radio. `color` has no RadioGroup equivalent and is ignored.
 *
 * @deprecated Use `RadioGroup`.
 * @packageDocumentation
 */

import { forwardRef, type ChangeEventHandler, type FormEventHandler } from 'react';

import { cx, devWarnOnce } from '../../../internal/parts';
import { RadioGroup, type RadioGroupOption, type RadioGroupProps } from '../RadioGroup/RadioGroup';

/**
 * One option of a deprecated {@link Radio}: any object, read through the
 * `optionValue`, `optionLabel` and `optionHint` keys.
 *
 * @deprecated Use `RadioGroupOption`.
 */
export interface RadioOption {
  /** Allows any additional properties for flexible option data. */
  [key: string]: unknown;
  /** Makes the option unselectable. */
  disabled?: boolean;
}

/**
 * Props for the deprecated {@link Radio}.
 *
 * @deprecated Use `RadioGroupProps`.
 */
export interface RadioProps extends Omit<RadioGroupProps, 'options'> {
  /** The options, read through `optionValue`, `optionLabel` and `optionHint`. */
  options?: RadioOption[];
  /** The option key holding the value. @defaultValue `'id'` */
  optionValue?: string;
  /** The option key holding the label. @defaultValue `'name'` */
  optionLabel?: string;
  /** The option key holding the hint, shown as the option's description. @defaultValue `'hint'` */
  optionHint?: string;
  /** Lays the options in a row. Use RadioGroup's `orientation="horizontal"`. */
  inline?: boolean;
  /** Renders each option as a card. Use RadioGroup's `variant="cards"`. */
  card?: boolean;
  /** Extra classes on each card. Use RadioGroup's `classes={{ item }}`. */
  cardClass?: string;
  /** Ignored: RadioGroup has no color prop. */
  color?: string;
  /** Fires with the chosen radio's change event. Use RadioGroup's `onValueChange`. */
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

/** Reads a 1.x option through its key props into a RadioGroup option. */
function toOption(
  option: RadioOption,
  valueKey: string,
  labelKey: string,
  hintKey: string,
): RadioGroupOption {
  const raw = option[valueKey];
  const value = typeof raw === 'number' || typeof raw === 'string' ? raw : String(raw ?? '');
  const hint = option[hintKey];
  return {
    value,
    label: String(option[labelKey] ?? ''),
    description: hint ? String(hint) : undefined,
    disabled: option.disabled === true,
  };
}

/**
 * Deprecated: renders a {@link RadioGroup}. The ref points at the fieldset.
 *
 * @deprecated Use `RadioGroup`.
 */
export const Radio = forwardRef<HTMLFieldSetElement, RadioProps>(
  (
    {
      options = [],
      optionValue = 'id',
      optionLabel = 'name',
      optionHint = 'hint',
      inline = false,
      card = false,
      cardClass,
      color: _color,
      onChange,
      orientation,
      variant,
      classes,
      ...rest
    },
    ref,
  ) => {
    devWarnOnce('Radio', 'Radio is deprecated; use RadioGroup.');
    return (
      <RadioGroup
        {...rest}
        ref={ref}
        options={options.map((option) => toOption(option, optionValue, optionLabel, optionHint))}
        orientation={inline ? 'horizontal' : orientation}
        variant={card ? 'cards' : variant}
        classes={cardClass ? { ...classes, item: cx(classes?.item, cardClass) } : classes}
        // The radios' change event bubbles to the fieldset.
        {...(onChange
          ? { onChange: onChange as unknown as FormEventHandler<HTMLFieldSetElement> }
          : {})}
      />
    );
  },
);

Radio.displayName = 'Radio';
