/**
 * @module Combobox
 *
 * The design-system Combobox (#54): a text input that filters a listbox, on
 * the behavior engine's combobox machine (`useCombobox`). It shares the field
 * anatomy with Input and Select (D-018) and renders the `.apui-combobox`
 * markup contract styled by `@artisanpack-ui/css`. Zag's `control` and
 * `input` parts are the field's `box` and `control`.
 *
 * `multiple` shows the chosen values as removable chips, and `allowCreate`
 * offers “Create …” for typed text that matches nothing: together they are
 * the tags input. `remote` hands the search to the app (`onSearchChange`).
 *
 * @packageDocumentation
 */

import {
  COMBOBOX_LABELS,
  type ComboboxItem,
  formatLabel,
  highlight,
  useCombobox,
} from '@artisanpack-ui/behavior/react';
import {
  forwardRef,
  useId,
  useMemo,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

import { FieldError, FieldHelp } from '../../../internal/field';
import { IconPart, IconSvg } from '../../../internal/icon';
import { mergePartProps } from '../../../internal/merge';
import { cx, flag, hasContent, type PartClasses } from '../../../internal/parts';
import { Portal } from '../../../internal/portal';

/** Control height of a {@link Combobox}. */
export type ComboboxSize = 'sm' | 'md' | 'lg';

/** A combobox value: a string (or null), or an array of strings with `multiple`. */
export type ComboboxValue = string | string[] | null;

/** A chip's color: one of the semantic color names. */
export type ComboboxColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

/** One option: a string (value and label), or an object. */
export type ComboboxOption =
  | string
  | {
      /** The option's value. */
      value: string;
      /** The text shown and filtered by. Defaults to the value. */
      label?: string;
      /** A second line under the label. */
      description?: string;
      /** An icon name, resolved through the icon registry. */
      icon?: string;
      /** Tints the option's chip with `multiple`. */
      color?: ComboboxColor;
      /** Makes the option unselectable. */
      disabled?: boolean;
    };

/** The parts a {@link Combobox} accepts extra classes for. */
export type ComboboxPart =
  | 'root'
  | 'label'
  | 'required'
  | 'box'
  | 'icon'
  | 'chip'
  | 'chipRemove'
  | 'control'
  | 'spinner'
  | 'clearTrigger'
  | 'trigger'
  | 'hint'
  | 'error'
  | 'positioner'
  | 'content'
  | 'item'
  | 'itemText'
  | 'mark'
  | 'itemDescription'
  | 'itemIndicator'
  | 'empty'
  | 'status';

/**
 * Props for the {@link Combobox} component. `className` and other native
 * `<div>` attributes go to the root; the input's text isn't the value, so
 * nothing falls through to it.
 */
export interface ComboboxProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange' | 'placeholder'
> {
  /** Control height. Emitted as `data-size`. @defaultValue `'md'` */
  size?: ComboboxSize;
  /** The options to choose from. */
  options?: ComboboxOption[];
  /** The visible label, linked to the input. */
  label?: ReactNode;
  /** Help text under the control, linked with `aria-describedby`. */
  hint?: ReactNode;
  /** Validation message. Marks the field invalid and is linked with `aria-describedby`. */
  error?: string;
  /** Marks the field invalid without a message. @defaultValue `false` */
  invalid?: boolean;
  /** Disables the input, the buttons and the chips. @defaultValue `false` */
  disabled?: boolean;
  /** Marks the field required and shows the required mark. @defaultValue `false` */
  required?: boolean;
  /** Shown in the empty input. @defaultValue `'Search…'` */
  placeholder?: string;
  /**
   * Submits the value with a native form: a hidden input carrying the value,
   * or one per value with `multiple` (use a name such as `tags[]` if the
   * server expects an array). None while the value is empty.
   */
  name?: string;
  /** The value of a controlled combobox: a string or null, or an array with `multiple`. */
  value?: ComboboxValue;
  /** The initial value of an uncontrolled combobox. */
  defaultValue?: ComboboxValue;
  /** Chooses several values, shown as removable chips. Emitted as `data-multiple`. */
  multiple?: boolean;
  /** With `multiple`, the most values that can be chosen. */
  max?: number;
  /** Offers “Create …” for typed text that matches no option; choosing it calls `onCreate`. */
  allowCreate?: boolean;
  /** The app filters the options: listen to `onSearchChange` and pass the results. */
  remote?: boolean;
  /** The text in the input when it renders: it filters (unless remote) and marks the matches. */
  search?: string;
  /** Shows the spinner and the loading text. Emitted as `data-loading`. */
  loading?: boolean;
  /** Adds a button that clears the value, shown while there is one. */
  clearable?: boolean;
  /** Whether the listbox is open (controlled). Pair it with `onOpenChange`. */
  open?: boolean;
  /** The initial state of an uncontrolled listbox. */
  defaultOpen?: boolean;
  /** Renders the listbox at the end of the body (a React portal). @defaultValue `true` */
  portal?: boolean;
  /** Icon name before the input. `icon` overrides it. */
  leadingIcon?: string;
  /** Leading icon node; overrides `leadingIcon`. */
  icon?: ReactNode;
  /** Shown when nothing matches; `{search}` is the typed text. `empty` overrides it. */
  emptyLabel?: string;
  /** Shown in the listbox while loading. */
  loadingLabel?: string;
  /** The create option's text; `{value}` is the typed text. */
  createLabel?: string;
  /** A chip remove button's accessible name; `{label}` is the chip's label. */
  removeLabel?: string;
  /** Announced when a chip is removed; `{label}` is the chip's label. */
  removedLabel?: string;
  /** The clear button's accessible name. */
  clearLabel?: string;
  /** The chevron button's accessible name. */
  triggerLabel?: string;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<ComboboxPart>;
  /** Overrides the empty text, such as a link to add a record. */
  empty?: ReactNode;
  /** Renders an option's label, given the option. */
  renderItem?: (option: ComboboxItem) => ReactNode;
  /** Called when a choice changes the value. */
  onValueChange?: (value: ComboboxValue) => void;
  /** Called with the text as the person types; with `remote`, the query to filter by. */
  onSearchChange?: (search: string) => void;
  /** Called when the listbox opens or closes itself. */
  onOpenChange?: (open: boolean) => void;
  /** Called with the new value when the create option is chosen. */
  onCreate?: (value: string) => void;
}

/** An option as the machine's item. */
function toItem(option: ComboboxOption): ComboboxItem {
  if (typeof option === 'string') return { value: option, label: option };
  return {
    value: option.value,
    label: option.label ?? option.value,
    description: option.description,
    icon: option.icon,
    color: option.color,
    disabled: option.disabled,
  };
}

/** A value as an array. */
const toArray = (value: ComboboxValue | undefined): string[] =>
  Array.isArray(value) ? value : value == null || value === '' ? [] : [value];

/**
 * A text input that filters a listbox. Controlled (`value` +
 * `onValueChange`) or uncontrolled (`defaultValue`). The ref points at the
 * root.
 *
 * @example
 * ```tsx
 * <Combobox label="Tags" multiple allowCreate options={tags} value={chosen} onValueChange={setChosen} />
 * ```
 */
export const Combobox = forwardRef<HTMLDivElement, ComboboxProps>(
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
      placeholder = COMBOBOX_LABELS.placeholder,
      name,
      value,
      defaultValue,
      multiple = false,
      max,
      allowCreate = false,
      remote = false,
      search,
      loading = false,
      clearable = false,
      open,
      defaultOpen,
      portal = true,
      leadingIcon,
      icon,
      emptyLabel = COMBOBOX_LABELS.empty,
      loadingLabel = COMBOBOX_LABELS.loading,
      createLabel = COMBOBOX_LABELS.create,
      removeLabel = COMBOBOX_LABELS.remove,
      removedLabel = COMBOBOX_LABELS.removed,
      clearLabel = COMBOBOX_LABELS.clear,
      triggerLabel = COMBOBOX_LABELS.trigger,
      classes = {},
      empty,
      renderItem,
      onValueChange,
      onSearchChange,
      onOpenChange,
      onCreate,
      className,
      id: explicitId,
      ...rest
    },
    ref,
  ) => {
    const generated = useId();
    const id = explicitId ?? generated;
    const inputId = `${id}-control`;
    const hintId = hasContent(hint) ? `${id}-hint` : undefined;
    const errorId = error ? `${id}-error` : undefined;
    const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
    const isInvalid = invalid || Boolean(error);

    // The value is always controlled inside, so max can refuse a choice.
    const [own, setOwn] = useState<ComboboxValue>(defaultValue ?? (multiple ? [] : null));
    const current: ComboboxValue = value !== undefined ? value : own;
    const values = toArray(current);
    const [query, setQuery] = useState(search ?? '');
    const [status, setStatus] = useState('');
    // Created values stay listed until the app adds them to its options.
    const [created, setCreated] = useState<ComboboxItem[]>([]);

    const items = useMemo(() => {
      const listed = options.map(toItem);
      const extra = created.filter((item) => !listed.some((entry) => entry.value === item.value));
      return [...listed, ...extra];
    }, [options, created]);
    const known = useMemo(() => new Map(items.map((item) => [item.value, item])), [items]);

    const setValue = (next: ComboboxValue) => {
      if (value === undefined) setOwn(next);
      onValueChange?.(next);
    };

    const selectedLabel = !multiple && values[0] !== undefined ? known.get(values[0])?.label : '';

    const api = useCombobox({
      id,
      ids: { input: inputId, label: `${id}-label` },
      items,
      value: multiple ? values : (values[0] ?? null),
      multiple,
      max,
      allowCreate,
      remote,
      disabled,
      required,
      invalid: isInvalid,
      loading,
      placeholder,
      open,
      defaultOpen,
      defaultInputValue: search ?? selectedLabel ?? '',
      translations: { triggerLabel, clearTriggerLabel: clearLabel },
      onValueChange: ({ value: next }) => setValue(next),
      onCreate: ({ value: text }) => {
        setCreated((list) => [...list, { value: text, label: text }]);
        onCreate?.(text);
      },
      onInputValueChange: ({ inputValue, reason }) => {
        const typed = reason === 'input-change';
        setQuery(typed ? inputValue : '');
        if (typed) onSearchChange?.(inputValue);
      },
      onOpenChange: ({ open: next }) => onOpenChange?.(next),
    });

    const remove = (entry: string) => {
      if (disabled || !values.includes(entry)) return;
      const next = values.filter((item) => item !== entry);
      setValue(multiple ? next : null);
      setStatus(formatLabel(removedLabel, { label: known.get(entry)?.label ?? entry }));
    };

    const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (!multiple || event.key !== 'Backspace' || event.currentTarget.value !== '') return;
      const last = values[values.length - 1];
      if (last !== undefined) remove(last);
    };

    const part = (name: string) => ({ 'data-scope': 'combobox', 'data-part': name });

    const itemLabel = (item: ComboboxItem) =>
      highlight(item.label, query).map((segment, index) =>
        segment.match ? (
          <mark key={index} {...part('mark')} className={classes.mark}>
            {segment.text}
          </mark>
        ) : (
          segment.text
        ),
      );

    const listbox = (
      <div {...api.getPositionerProps()} className={classes.positioner}>
        <div {...api.getContentProps()} className={classes.content}>
          {api.items.map((item) => (
            <div
              key={item.create ? `create:${item.value}` : item.value}
              {...api.getItemProps({ item })}
              className={classes.item}
              data-create={flag(item.create)}
            >
              {multiple && !item.create ? (
                <span {...api.getItemIndicatorProps({ item })} className={classes.itemIndicator}>
                  <IconSvg name="check" />
                </span>
              ) : null}
              <IconPart
                scope="combobox"
                part="icon"
                name={item.create ? 'plus' : item.icon}
                className={classes.icon}
              />
              <span {...api.getItemTextProps({ item })} className={classes.itemText}>
                {item.create ? (
                  formatLabel(createLabel, { value: item.value })
                ) : (
                  <>
                    {renderItem ? renderItem(item) : itemLabel(item)}
                    {item.description ? (
                      <span {...part('item-description')} className={classes.itemDescription}>
                        {item.description}
                      </span>
                    ) : null}
                  </>
                )}
              </span>
            </div>
          ))}
          <div {...api.getEmptyProps()} className={classes.empty}>
            {loading
              ? loadingLabel
              : hasContent(empty)
                ? empty
                : formatLabel(emptyLabel, { search: query })}
          </div>
        </div>
      </div>
    );

    return (
      <div
        {...mergePartProps(rest, api.getRootProps())}
        ref={ref}
        className={cx('apui-combobox', classes.root, className)}
        data-size={size}
        data-multiple={flag(multiple)}
        data-invalid={flag(isInvalid)}
        data-disabled={flag(disabled)}
        data-loading={flag(loading)}
      >
        {name
          ? values.map((entry) => <input key={entry} type="hidden" name={name} value={entry} />)
          : null}
        {hasContent(label) ? (
          <label {...api.getLabelProps()} className={classes.label}>
            {label}
            {required ? (
              <span {...part('required')} aria-hidden="true" className={classes.required}>
                *
              </span>
            ) : null}
          </label>
        ) : null}
        <div {...api.getControlProps()} className={classes.box}>
          <IconPart
            scope="combobox"
            part="icon"
            name={leadingIcon}
            node={icon}
            className={classes.icon}
          />
          {multiple
            ? values.map((entry) => {
                const item = known.get(entry);
                const chipLabel = item?.label ?? entry;
                return (
                  <span
                    key={entry}
                    {...part('chip')}
                    className={classes.chip}
                    data-value={entry}
                    data-color={item?.color}
                  >
                    {chipLabel}
                    <button
                      type="button"
                      {...part('chip-remove')}
                      className={classes.chipRemove}
                      aria-label={formatLabel(removeLabel, { label: chipLabel })}
                      disabled={disabled || undefined}
                      onClick={() => remove(entry)}
                    >
                      <IconSvg name="x" />
                    </button>
                  </span>
                );
              })
            : null}
          <input
            {...mergePartProps({ onKeyDown: onInputKeyDown }, api.getInputProps())}
            className={classes.control}
            aria-describedby={describedBy}
          />
          {loading ? (
            <span {...part('spinner')} aria-hidden="true" className={classes.spinner} />
          ) : null}
          {clearable ? (
            <button {...api.getClearTriggerProps()} className={classes.clearTrigger}>
              <IconSvg name="x" />
            </button>
          ) : null}
          <button {...api.getTriggerProps()} className={classes.trigger}>
            <IconSvg name="chevron-down" />
          </button>
        </div>
        <FieldHelp scope="combobox" part="hint" id={hintId} className={classes.hint}>
          {hint}
        </FieldHelp>
        <FieldError scope="combobox" id={errorId} message={error} className={classes.error} />
        <Portal enabled={portal}>{listbox}</Portal>
        <span {...part('status')} role="status" aria-live="polite" className={classes.status}>
          {status}
        </span>
      </div>
    );
  },
);

Combobox.displayName = 'Combobox';
