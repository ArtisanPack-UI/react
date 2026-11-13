/**
 * @module Progress
 *
 * The design-system Progress (#60): linear progress, determinate,
 * indeterminate or segmented, rendering the `.apui-progress` markup contract
 * styled by `@artisanpack-ui/css`. The root is the progressbar.
 *
 * @packageDocumentation
 */

import { forwardRef, useId, type CSSProperties, type HTMLAttributes } from 'react';

import { cx, flag, hasContent, type PartClasses } from '../../../internal/parts';

/** The track height of a {@link Progress}. */
export type ProgressSize = 'sm' | 'md' | 'lg';

/** The bar color of a {@link Progress} or ProgressRadial. */
export type ProgressColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

/** The parts a {@link Progress} accepts extra classes for. */
export type ProgressPart = 'root' | 'head' | 'label' | 'value' | 'track' | 'bar';

/** Props for the {@link Progress} component. Native `<div>` attributes go to the root. */
export interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  /** The progress, from 0 to max. Clamped. @defaultValue `0` */
  value?: number;
  /** The value at completion; with `segmented`, the number of segments. @defaultValue `100` */
  max?: number;
  /** The amount isn't known: a short bar slides, and `aria-valuenow` is left out. @defaultValue `false` */
  indeterminate?: boolean;
  /** Splits the track into `max` segments, `value` of them done. @defaultValue `false` */
  segmented?: boolean;
  /** The track's height. @defaultValue `'md'` */
  size?: ProgressSize;
  /** The bar's color. @defaultValue `'primary'` */
  color?: ProgressColor;
  /** What's progressing; names the progressbar. Without it, pass `aria-label`. */
  label?: string;
  /** The value in words, such as `8 of 12`, read as `aria-valuetext`. */
  valueText?: string;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<ProgressPart>;
}

/** The clamped value, the max and the rounded percentage. @internal */
export function progressAmount(value: number, max: number) {
  const top = max > 0 ? max : 100;
  const clamped = Math.min(Math.max(Number.isFinite(value) ? value : 0, 0), top);
  return { value: clamped, max: top, percent: Math.round((clamped / top) * 100) };
}

/**
 * Linear progress. The ref points at the root, the progressbar.
 *
 * @example
 * ```tsx
 * <Progress value={64} label="Uploading 12 photos" valueText="8 of 12" />
 * ```
 */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value = 0,
      max = 100,
      indeterminate = false,
      segmented = false,
      size = 'md',
      color = 'primary',
      label,
      valueText,
      classes = {},
      className,
      ...rest
    },
    ref,
  ) => {
    const id = useId();
    const amount = progressAmount(value, max);
    const hasLabel = hasContent(label);
    const hasValueText = hasContent(valueText);
    const shownValue = hasValueText
      ? valueText
      : hasLabel && !indeterminate
        ? `${amount.percent}%`
        : undefined;
    const labelId = `${id}label`;

    let bars;
    if (segmented) {
      const count = Math.max(1, Math.round(amount.max));
      const done = Math.round(amount.value);
      bars = Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          data-scope="progress"
          data-part="bar"
          data-done={flag(index < done)}
          className={classes.bar}
        />
      ));
    } else {
      bars = (
        <div
          data-scope="progress"
          data-part="bar"
          className={classes.bar}
          style={
            indeterminate ? undefined : ({ '--apui-_v': `${amount.percent}%` } as CSSProperties)
          }
        />
      );
    }

    return (
      <div
        {...rest}
        ref={ref}
        className={cx('apui-progress', classes.root, className)}
        data-scope="progress"
        data-part="root"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={amount.max}
        aria-valuenow={indeterminate ? undefined : amount.value}
        aria-valuetext={hasValueText ? valueText : undefined}
        aria-labelledby={hasLabel ? labelId : rest['aria-labelledby']}
        data-size={size}
        data-color={color}
        data-indeterminate={flag(indeterminate)}
        data-segmented={flag(segmented)}
      >
        {hasLabel || shownValue !== undefined ? (
          <div data-scope="progress" data-part="head" className={classes.head}>
            {hasLabel ? (
              <span data-scope="progress" data-part="label" id={labelId} className={classes.label}>
                {label}
              </span>
            ) : null}
            {shownValue !== undefined ? (
              <span data-scope="progress" data-part="value" className={classes.value}>
                {shownValue}
              </span>
            ) : null}
          </div>
        ) : null}
        <div data-scope="progress" data-part="track" className={classes.track}>
          {bars}
        </div>
      </div>
    );
  },
);

Progress.displayName = 'Progress';
