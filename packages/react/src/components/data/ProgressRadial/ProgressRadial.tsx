/**
 * @module ProgressRadial
 *
 * The design-system ProgressRadial (#60): circular progress with the value in
 * the center, built from Progress, rendering the `.apui-progress-radial`
 * markup contract styled by `@artisanpack-ui/css`. The root is the
 * progressbar; the ring fills in the reading direction.
 *
 * @packageDocumentation
 */

import { forwardRef, useId, type CSSProperties, type HTMLAttributes } from 'react';

import { cx, flag, hasContent, type PartClasses } from '../../../internal/parts';
import { progressAmount, type ProgressColor } from '../Progress/Progress';

/** The parts a {@link ProgressRadial} accepts extra classes for. */
export type ProgressRadialPart = 'root' | 'svg' | 'track' | 'bar' | 'value' | 'label';

/** Props for the {@link ProgressRadial} component. Native `<span>` attributes go to the root. */
export interface ProgressRadialProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** The progress, from 0 to max. Clamped. @defaultValue `0` */
  value?: number;
  /** The value at completion. @defaultValue `100` */
  max?: number;
  /** The amount isn't known: a quarter arc spins, and `aria-valuenow` is left out. @defaultValue `false` */
  indeterminate?: boolean;
  /** The ring's diameter in px. @defaultValue `64` */
  size?: number;
  /** The ring's stroke width in px. @defaultValue `6` */
  thickness?: number;
  /** The bar's color. @defaultValue `'primary'` */
  color?: ProgressColor;
  /** A caption under the value that also names the progressbar. Without it, pass `aria-label`. */
  label?: string;
  /** The value in words, shown in the center and read as `aria-valuetext`. */
  valueText?: string;
  /** Leaves the center empty; the label still names the progressbar. @defaultValue `false` */
  hideValue?: boolean;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<ProgressRadialPart>;
}

const fixed = (value: number) => value.toFixed(1);

/**
 * Circular progress for a single headline percentage. The ref points at the
 * root, the progressbar.
 *
 * @example
 * ```tsx
 * <ProgressRadial value={68} size={80} thickness={7} label="complete" />
 * ```
 */
export const ProgressRadial = forwardRef<HTMLSpanElement, ProgressRadialProps>(
  (
    {
      value = 0,
      max = 100,
      indeterminate = false,
      size = 64,
      thickness = 6,
      color = 'primary',
      label,
      valueText,
      hideValue = false,
      classes = {},
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const id = useId();
    const amount = progressAmount(value, max);
    const center = size / 2;
    const radius = (size - thickness) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (indeterminate ? 0.75 : 1 - amount.percent / 100);
    const hasLabel = hasContent(label);
    const hasValueText = hasContent(valueText);
    const text = hasValueText ? valueText : indeterminate ? '' : `${amount.percent}%`;
    const showValue = !hideValue && (text !== '' || hasLabel);
    const labelId = `${id}label`;
    const circle = {
      cx: fixed(center),
      cy: fixed(center),
      r: fixed(radius),
      strokeWidth: thickness,
    };

    return (
      <span
        {...rest}
        ref={ref}
        className={cx('apui-progress-radial', classes.root, className)}
        data-scope="progress-radial"
        data-part="root"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={amount.max}
        aria-valuenow={indeterminate ? undefined : amount.value}
        aria-valuetext={hasValueText ? valueText : undefined}
        aria-labelledby={hasLabel && showValue ? labelId : rest['aria-labelledby']}
        aria-label={hasLabel && !showValue ? label : rest['aria-label']}
        data-color={color}
        data-indeterminate={flag(indeterminate)}
        style={{ '--apui-_s': `${size}px`, ...style } as CSSProperties}
      >
        <svg
          data-scope="progress-radial"
          data-part="svg"
          viewBox={`0 0 ${size} ${size}`}
          aria-hidden="true"
          className={classes.svg}
        >
          <circle
            data-scope="progress-radial"
            data-part="track"
            className={classes.track}
            {...circle}
          />
          <circle
            data-scope="progress-radial"
            data-part="bar"
            className={classes.bar}
            {...circle}
            strokeDasharray={fixed(circumference)}
            strokeDashoffset={fixed(offset)}
          />
        </svg>
        {showValue ? (
          <span data-scope="progress-radial" data-part="value" className={classes.value}>
            {text}
            {hasLabel ? (
              <span
                data-scope="progress-radial"
                data-part="label"
                id={labelId}
                className={classes.label}
              >
                {label}
              </span>
            ) : null}
          </span>
        ) : null}
      </span>
    );
  },
);

ProgressRadial.displayName = 'ProgressRadial';
