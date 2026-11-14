/**
 * @module Sparkline
 *
 * The design-system Sparkline (#61): a word-sized trend drawn as inline SVG,
 * rendering the `svg.apui-sparkline` markup contract styled by
 * `@artisanpack-ui/css`. The coordinates come from the behavior package's
 * `sparklineGeometry`, the same ones Blade and Vue draw: no chart library.
 *
 * @packageDocumentation
 */

import {
  SPARKLINE_HEIGHT,
  SPARKLINE_LABEL,
  SPARKLINE_WIDTH,
  sparklineGeometry,
  sparklineLabel,
  type SparklineVariant,
} from '@artisanpack-ui/behavior';
import { forwardRef, type SVGAttributes } from 'react';

import { cx, type PartClasses } from '../../../internal/parts';

export type { SparklineVariant };

/** The parts a {@link Sparkline} accepts extra classes for. */
export type SparklinePart = 'root' | 'area' | 'line' | 'dot' | 'bar' | 'baseline';

/** Props for the {@link Sparkline} component. Native `<svg>` attributes go to the root. */
export interface SparklineProps extends Omit<SVGAttributes<SVGSVGElement>, 'width' | 'height'> {
  /** The values, oldest first. Anything that isn't a finite number is skipped. */
  data: readonly number[];
  /** A line with a dot on the latest value, the same with a fill, or bars. @defaultValue `'line'` */
  variant?: SparklineVariant;
  /** The width in px. @defaultValue `96` */
  width?: number;
  /** The height in px. @defaultValue `28` */
  height?: number;
  /**
   * The accessible label; `{first}`, `{latest}`, `{min}`, `{max}` and `{count}`
   * are filled in. Translate it. @defaultValue `'Trend from {first} to {latest}'`
   */
  label?: string;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<SparklinePart>;
}

const VARIANTS: readonly SparklineVariant[] = ['line', 'area', 'bar'];

/**
 * A word-sized trend with no axes. The ref points at the `<svg>`.
 *
 * @example
 * ```tsx
 * <Sparkline data={[8, 12, 10, 16, 15, 19, 23]} variant="area" />
 * ```
 */
export const Sparkline = forwardRef<SVGSVGElement, SparklineProps>(
  (
    {
      data,
      variant = 'line',
      width = SPARKLINE_WIDTH,
      height = SPARKLINE_HEIGHT,
      label = SPARKLINE_LABEL,
      classes = {},
      className,
      ...rest
    },
    ref,
  ) => {
    const shown: SparklineVariant = VARIANTS.includes(variant) ? variant : 'line';
    const geometry = sparklineGeometry(data, shown, width, height);

    return (
      <svg
        {...rest}
        ref={ref}
        className={cx('apui-sparkline', classes.root, className)}
        data-variant={shown}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={sparklineLabel(label, data)}
      >
        {geometry.baseline !== null ? (
          <line
            className={classes.baseline}
            data-scope="sparkline"
            data-part="baseline"
            x1="0"
            x2={width}
            y1={geometry.baseline}
            y2={geometry.baseline}
          />
        ) : null}
        {geometry.area !== '' ? (
          <path
            className={classes.area}
            data-scope="sparkline"
            data-part="area"
            d={geometry.area}
          />
        ) : null}
        {geometry.line !== '' ? (
          <path
            className={classes.line}
            data-scope="sparkline"
            data-part="line"
            d={geometry.line}
          />
        ) : null}
        {geometry.dot !== null ? (
          <circle
            className={classes.dot}
            data-scope="sparkline"
            data-part="dot"
            cx={geometry.dot.cx}
            cy={geometry.dot.cy}
            r="2.5"
          />
        ) : null}
        {geometry.bars.map((bar, index) => (
          <rect
            key={index}
            className={classes.bar}
            data-scope="sparkline"
            data-part="bar"
            x={bar.x}
            y={bar.y}
            width={bar.width}
            height={bar.height}
            rx="1"
          />
        ))}
      </svg>
    );
  },
);

Sparkline.displayName = 'Sparkline';
