/**
 * @module internal/choice
 *
 * Option lists for the design-system choice groups (RadioGroup and
 * CheckboxGroup, #53): strings, or `{ value, label, description, meta,
 * disabled }` objects, normalized to string keys while keeping each value's
 * original type for the change callbacks.
 *
 * @internal
 */

import type { ReactNode } from 'react';

/** A value an option can carry. */
export type ChoiceValue = string | number;

/** One option: a string (value and label), or an object. */
export type ChoiceOption<V extends ChoiceValue = ChoiceValue> =
  | string
  | {
      /** The option's value. Compared as a string; the callbacks receive it as given. */
      value: V;
      /** The text shown. Defaults to the value. */
      label?: ReactNode;
      /** Supporting text under the label, linked with `aria-describedby`. */
      description?: ReactNode;
      /** A price or other figure (RadioGroup cards). */
      meta?: ReactNode;
      /** Makes the option unselectable. */
      disabled?: boolean;
    };

/** A normalized option. */
export interface NormalizedChoice {
  key: string;
  value: ChoiceValue;
  label: ReactNode;
  description: ReactNode;
  meta: ReactNode;
  disabled: boolean;
}

/** Normalizes options: string keys, original values. */
export function normalizeChoices(options: readonly ChoiceOption[]): NormalizedChoice[] {
  return options.map((option) =>
    typeof option === 'string'
      ? {
          key: option,
          value: option,
          label: option,
          description: undefined,
          meta: undefined,
          disabled: false,
        }
      : {
          key: String(option.value),
          value: option.value,
          label: option.label ?? String(option.value),
          description: option.description,
          meta: option.meta,
          disabled: option.disabled === true,
        },
  );
}

/** Replaces `:name` placeholders in a label template. */
export function fillTemplate(template: string, values: Record<string, string | number>): string {
  return template.replace(/:([a-z]+)/gi, (match, name: string) =>
    name in values ? String(values[name]) : match,
  );
}
