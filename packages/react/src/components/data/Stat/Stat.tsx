/**
 * @module Stat
 *
 * The design-system Stat (#61): a headline number with its label, change and
 * context, rendering the `.apui-stat` markup contract styled by
 * `@artisanpack-ui/css`. The change is an arrow and text, never color alone.
 *
 * @packageDocumentation
 */

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { IconPart, IconSvg } from '../../../internal/icon';
import { cx, flag, hasContent, type PartClasses } from '../../../internal/parts';

/** A Stat's size: the value's type style. Emitted as `data-size`. */
export type StatSize = 'sm' | 'md' | 'lg';

/** A Stat's color: tints the icon tile and the emphasis fill. Emitted as `data-color`. */
export type StatColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

/** The change's direction. Emitted as `data-trend` on the delta. */
export type StatTrend = 'up' | 'down' | 'flat';

/** The parts a {@link Stat} accepts extra classes for. */
export type StatPart =
  | 'root'
  | 'top'
  | 'label'
  | 'icon'
  | 'value'
  | 'unit'
  | 'foot'
  | 'delta'
  | 'description';

/** Props for the {@link Stat} component. Native `<div>` attributes go to the root. */
export interface StatProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  /** What the number measures. */
  label?: ReactNode;
  /** The number, already formatted. `children` replace it. */
  value?: ReactNode;
  /** A unit after the value, smaller and muted. */
  unit?: ReactNode;
  /** The icon tile at the end of the label row: a registry name or a node. Decorative. */
  icon?: string | ReactNode;
  /** The change as text; takes precedence over `change`. */
  delta?: ReactNode;
  /** The change as a percentage, shown with one decimal; sets `trend` from its sign. */
  change?: number;
  /** The change's direction: an arrow and hidden text. */
  trend?: StatTrend;
  /** Context after the delta, such as "vs last month". */
  description?: ReactNode;
  /** The value's type style. @defaultValue `'md'` */
  size?: StatSize;
  /** Tints the icon tile and the emphasis fill. @defaultValue `'neutral'` */
  color?: StatColor;
  /** A soft fill in `color`, for the one stat that matters in a row. @defaultValue `false` */
  emphasis?: boolean;
  /** No container, for a stat inside a Card. @defaultValue `false` */
  bare?: boolean;
  /** Hidden text before an up delta; translate it. @defaultValue `'Increase'` */
  upLabel?: string;
  /** Hidden text before a down delta; translate it. @defaultValue `'Decrease'` */
  downLabel?: string;
  /** Hidden text before a flat delta; translate it. @defaultValue `'No change'` */
  flatLabel?: string;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<StatPart>;
}

const TRENDS: readonly StatTrend[] = ['up', 'down', 'flat'];

/** The trend's arrow: it shows the direction, not only the color. */
export const TREND_ICONS: Record<StatTrend, string> = {
  up: 'arrow-up-right',
  down: 'arrow-down-right',
  flat: 'minus',
};

/** The delta's text: `delta`, or `change` as a percentage with one decimal. @internal */
export function statDelta(delta: ReactNode, change: number | undefined): ReactNode {
  if (hasContent(delta)) return delta;
  return typeof change === 'number' && Number.isFinite(change)
    ? `${Math.abs(change).toFixed(1)}%`
    : null;
}

/** The trend: `trend`, or the sign of `change`. @internal */
export function statTrend(
  trend: StatTrend | undefined,
  change: number | undefined,
): StatTrend | undefined {
  if (trend !== undefined && TRENDS.includes(trend)) return trend;
  if (typeof change !== 'number' || !Number.isFinite(change)) return undefined;
  return change > 0 ? 'up' : change < 0 ? 'down' : 'flat';
}

interface StatDeltaProps {
  scope: string;
  delta: ReactNode;
  trend: StatTrend | undefined;
  labels: Record<StatTrend, string>;
  className?: string;
}

/** The delta part, shared with KpiCard: hidden direction text, an arrow and the change. @internal */
export function StatDeltaPart({ scope, delta, trend, labels, className }: StatDeltaProps) {
  return (
    <span className={className} data-scope={scope} data-part="delta" data-trend={trend}>
      {trend !== undefined ? <span className="apui-sr-only">{`${labels[trend]} `}</span> : null}
      {trend !== undefined ? <IconSvg name={TREND_ICONS[trend]} /> : null}
      {delta}
    </span>
  );
}

/**
 * A single headline number with its label, change and context. The ref
 * points at the root `<div>`.
 *
 * @example
 * ```tsx
 * <Stat label="Total revenue" value="7,415,644" icon="wallet" change={-5.4} description="vs last month" />
 * ```
 */
export const Stat = forwardRef<HTMLDivElement, StatProps>(
  (
    {
      label,
      value,
      unit,
      icon,
      delta,
      change,
      trend,
      description,
      size = 'md',
      color = 'neutral',
      emphasis = false,
      bare = false,
      upLabel = 'Increase',
      downLabel = 'Decrease',
      flatLabel = 'No change',
      classes = {},
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const shownDelta = statDelta(delta, change);
    const shownTrend = statTrend(trend, change);
    const iconName = typeof icon === 'string' ? icon : undefined;
    const iconNode = typeof icon === 'string' ? undefined : icon;
    const hasIcon = iconName !== undefined || hasContent(iconNode);

    return (
      <div
        {...rest}
        ref={ref}
        className={cx('apui-stat', classes.root, className)}
        data-size={size}
        data-color={color}
        data-emphasis={flag(emphasis)}
        data-bare={flag(bare)}
      >
        {hasContent(label) || hasIcon ? (
          <div className={classes.top} data-scope="stat" data-part="top">
            {hasContent(label) ? (
              <span className={classes.label} data-scope="stat" data-part="label">
                {label}
              </span>
            ) : null}
            <IconPart
              scope="stat"
              part="icon"
              name={iconName}
              node={iconNode}
              className={classes.icon}
            />
          </div>
        ) : null}
        <span className={classes.value} data-scope="stat" data-part="value">
          {hasContent(children) ? children : value}
          {hasContent(unit) ? (
            <span className={classes.unit} data-scope="stat" data-part="unit">
              {unit}
            </span>
          ) : null}
        </span>
        {hasContent(shownDelta) || hasContent(description) ? (
          <span className={classes.foot} data-scope="stat" data-part="foot">
            {hasContent(shownDelta) ? (
              <StatDeltaPart
                scope="stat"
                delta={shownDelta}
                trend={shownTrend}
                labels={{ up: upLabel, down: downLabel, flat: flatLabel }}
                className={classes.delta}
              />
            ) : null}
            {hasContent(description) ? (
              <span className={classes.description} data-scope="stat" data-part="description">
                {description}
              </span>
            ) : null}
          </span>
        ) : null}
      </div>
    );
  },
);

Stat.displayName = 'Stat';
