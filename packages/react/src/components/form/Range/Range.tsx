/**
 * @module Range
 *
 * The design-system Range (#53). Renders the `.apui-range` markup contract,
 * styled by `@artisanpack-ui/css`: a native `<input type="range">` per thumb,
 * transparent over the drawn track, fill and thumbs, with an optional value
 * bubble and marks. `dual` gives two thumbs for a from–to range.
 */

import {
  forwardRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

import { FieldError, FieldHelp, useFieldIds } from '../../../internal/field';
import { cx, flag, hasContent, type PartClasses } from '../../../internal/parts';

/** Thumb size of a {@link Range}. */
export type RangeSize = 'sm' | 'md';

/** The fill color of a {@link Range}. */
export type RangeColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

/** When a {@link Range} shows its value bubble. */
export type RangeShowValue = 'never' | 'focus' | 'always';

/** The value of a {@link Range}: a number, or `[from, to]` with `dual`. */
export type RangeValue = number | [number, number];

/** A label under the track. */
export interface RangeMark {
  value: number;
  label: ReactNode;
}

/** The parts a {@link Range} accepts extra classes for. */
export type RangePart =
  | 'root'
  | 'label'
  | 'track'
  | 'fill'
  | 'control'
  | 'thumb'
  | 'bubble'
  | 'marks'
  | 'mark'
  | 'hint'
  | 'error';

/** The thumb names added to the label with `dual`. */
export interface RangeThumbLabels {
  start: string;
  end: string;
}

/** Formats a value with a `{value}` template. */
export function formatRangeValue(value: number, format?: string): string {
  return format ? format.replaceAll('{value}', String(value)) : String(value);
}

const percent = (value: number, min: number, max: number) =>
  max === min ? 0 : Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

/**
 * Props for the {@link Range} component.
 *
 * `className` goes to the root; every other native attribute (`name`,
 * `aria-*`, `data-*`) goes to the native input. With `dual`, both inputs post
 * into `name[]`, an `aria-label` joins each thumb's name, other `aria-*` go
 * on the start thumb and everything else goes on both.
 */
export interface RangeProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'value' | 'defaultValue' | 'min' | 'max' | 'step' | 'color'
> {
  /** The lowest value. @defaultValue `0` */
  min?: number;
  /** The highest value. @defaultValue `100` */
  max?: number;
  /** The step between values. @defaultValue `1` */
  step?: number;
  /** The value of a controlled range: a number, or `[from, to]` with `dual`. */
  value?: RangeValue;
  /** The initial value of an uncontrolled range. */
  defaultValue?: RangeValue;
  /** Two thumbs for a from–to range; the thumbs can't cross. @defaultValue `false` */
  dual?: boolean;
  /** When the value bubble shows. Emitted as `data-show-value`. @defaultValue `'focus'` */
  showValue?: RangeShowValue;
  /** A template for the bubble, the marks and aria-valuetext, where `{value}` is the number. */
  format?: string;
  /** Labels under the track, placed at their values. */
  marks?: RangeMark[];
  /** The fill and thumb edge. Emitted as `data-color`. @defaultValue `'primary'` */
  color?: RangeColor;
  /** Thumb size. Emitted as `data-size`. @defaultValue `'md'` */
  size?: RangeSize;
  /** The visible label, linked to the (first) thumb. Without it, pass an `aria-label`. */
  label?: ReactNode;
  /** Help text under the track, linked with `aria-describedby`. */
  hint?: ReactNode;
  /** Validation message. Marks the field invalid and is linked with `aria-describedby`. */
  error?: string;
  /** Marks the field invalid without a message. @defaultValue `false` */
  invalid?: boolean;
  /** Disables the thumbs. @defaultValue `false` */
  disabled?: boolean;
  /** With `dual`, the names added to the label for each thumb. @defaultValue `{ start: 'Minimum', end: 'Maximum' }` */
  thumbLabels?: Partial<RangeThumbLabels>;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<RangePart>;
  /** Called with the new value: a number, or `[from, to]` with `dual`. */
  onValueChange?: (value: RangeValue) => void;
}

/**
 * A slider for one value, or two thumbs for a range. Controlled (`value` +
 * `onValueChange`) or uncontrolled (`defaultValue`). The ref points at the
 * (end) native input.
 *
 * @example
 * ```tsx
 * <Range label="Price" dual min={100} max={700} format="${value}k" value={price} onValueChange={setPrice} />
 * ```
 */
export const Range = forwardRef<HTMLInputElement, RangeProps>(
  (
    {
      min = 0,
      max = 100,
      step = 1,
      value,
      defaultValue,
      dual = false,
      showValue = 'focus',
      format,
      marks,
      color = 'primary',
      size = 'md',
      label,
      hint,
      error,
      invalid = false,
      disabled = false,
      thumbLabels,
      classes = {},
      className,
      style,
      id: explicitId,
      onChange,
      onValueChange,
      'aria-describedby': callerDescribedBy,
      'aria-invalid': callerInvalid,
      ...rest
    },
    ref,
  ) => {
    const isInvalid = invalid || Boolean(error);
    const names = { start: 'Minimum', end: 'Maximum', ...thumbLabels };
    const midpoint = min + (max - min) / 2;
    const [uncontrolled, setUncontrolled] = useState<RangeValue | undefined>(defaultValue);
    const isControlled = value !== undefined;
    const raw = isControlled ? value : uncontrolled;
    const { id, helpId, errorId, describedBy } = useFieldIds(
      explicitId,
      { suffix: 'hint', content: hint },
      error,
      callerDescribedBy,
    );

    const pair: [number, number] = dual
      ? Array.isArray(raw)
        ? [Number(raw[0]), Number(raw[1])]
        : [min, max]
      : [min, raw === undefined || Array.isArray(raw) ? midpoint : Number(raw)];
    const [from, to] = pair;

    const update = (next: RangeValue) => {
      if (!isControlled) setUncontrolled(next);
      onValueChange?.(next);
    };

    const handle = (thumb: 'start' | 'end') => (event: ChangeEvent<HTMLInputElement>) => {
      let next = Number(event.target.value);
      onChange?.(event);
      if (!dual) {
        update(next);
        return;
      }
      if (thumb === 'start') next = Math.min(next, to);
      else next = Math.max(next, from);
      if (String(next) !== event.target.value) event.target.value = String(next);
      update(thumb === 'start' ? [next, to] : [from, next]);
    };

    const hasLabel = hasContent(label);
    const labelId = `${id}-label`;
    const endId = dual ? `${id}-end` : id;
    const showBubble = showValue !== 'never';

    const thumb = (which: 'start' | 'end', current: number) => (
      <span
        className={classes.thumb}
        data-scope="range"
        data-part="thumb"
        data-thumb={which}
        aria-hidden="true"
      >
        {showBubble ? (
          <span className={classes.bubble} data-scope="range" data-part="bubble">
            {formatRangeValue(current, format)}
          </span>
        ) : null}
      </span>
    );

    // With dual, each thumb posts into one array (`name[]`), and the caller's naming
    // attributes compose each thumb's name instead of repeating on both inputs: an
    // aria-label stands in for the visible label, and other aria-* go on the start
    // thumb only. Livewire and Vue do the same.
    const {
      name,
      'aria-label': callerLabel,
      'aria-labelledby': callerLabelledBy,
      ...others
    } = rest;
    const ownAria = Object.fromEntries(
      Object.entries(others).filter(([key]) => key.startsWith('aria-')),
    );
    const shared = Object.fromEntries(
      Object.entries(others).filter(([key]) => !key.startsWith('aria-')),
    );
    const dualName = name ? (name.endsWith('[]') ? name : `${name}[]`) : undefined;
    const nameLabelId = hasLabel
      ? labelId
      : (callerLabelledBy ?? (callerLabel ? `${id}-aria-label` : undefined));

    const control = (which: 'start' | 'end', current: number) => (
      <input
        {...(dual ? shared : rest)}
        {...(dual && which === 'start' ? ownAria : {})}
        name={dual ? dualName : name}
        ref={which === 'end' ? ref : undefined}
        type="range"
        className={classes.control}
        data-scope="range"
        data-part="control"
        data-thumb={which}
        id={which === 'start' ? id : endId}
        min={min}
        max={max}
        step={step}
        value={current}
        aria-valuetext={format ? formatRangeValue(current, format) : undefined}
        aria-labelledby={dual ? cx(nameLabelId, `${id}-${which}-label`) : callerLabelledBy}
        disabled={disabled || undefined}
        aria-invalid={isInvalid ? true : callerInvalid}
        aria-describedby={describedBy}
        onChange={handle(which)}
      />
    );

    const rootStyle = {
      ...style,
      '--apui-_from': `${dual ? percent(from, min, max) : 0}%`,
      '--apui-_to': `${percent(to, min, max)}%`,
    } as CSSProperties;

    return (
      <div
        className={cx('apui-range', classes.root, className)}
        data-size={size}
        data-color={color}
        data-show-value={showValue}
        data-dual={flag(dual)}
        data-invalid={flag(isInvalid)}
        data-disabled={flag(disabled)}
        style={rootStyle}
      >
        {hasLabel ? (
          <label
            className={classes.label}
            data-scope="range"
            data-part="label"
            htmlFor={id}
            id={labelId}
          >
            {label}
          </label>
        ) : null}
        <div className={classes.track} data-scope="range" data-part="track">
          <div className={classes.fill} data-scope="range" data-part="fill" />
          {dual ? (
            <>
              {!hasLabel && !callerLabelledBy && callerLabel ? (
                <span className="apui-sr-only" id={`${id}-aria-label`}>
                  {callerLabel}
                </span>
              ) : null}
              <span className="apui-sr-only" id={`${id}-start-label`}>
                {names.start}
              </span>
              <span className="apui-sr-only" id={`${id}-end-label`}>
                {names.end}
              </span>
              {control('start', from)}
              {thumb('start', from)}
            </>
          ) : null}
          {control('end', to)}
          {thumb('end', to)}
        </div>
        {marks && marks.length > 0 ? (
          <div className={classes.marks} data-scope="range" data-part="marks" aria-hidden="true">
            {marks.map((mark) => (
              <span
                key={mark.value}
                className={classes.mark}
                data-scope="range"
                data-part="mark"
                style={{ '--apui-_at': `${percent(mark.value, min, max)}%` } as CSSProperties}
              >
                {mark.label}
              </span>
            ))}
          </div>
        ) : null}
        <FieldHelp scope="range" part="hint" id={helpId} className={classes.hint}>
          {hint}
        </FieldHelp>
        <FieldError scope="range" id={errorId} message={error} className={classes.error} />
      </div>
    );
  },
);

Range.displayName = 'Range';
