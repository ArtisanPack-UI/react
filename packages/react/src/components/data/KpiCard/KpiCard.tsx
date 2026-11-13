/**
 * @module KpiCard
 *
 * The design-system KpiCard (#61): a headline metric in a Card, built from
 * Stat, with a Sparkline of its trend and a Progress toward a target. It
 * renders the `.apui-card.apui-kpi-card` markup contract styled by
 * `@artisanpack-ui/css`.
 *
 * @packageDocumentation
 */

import { SPARKLINE_LABEL, sparklineValues } from '@artisanpack-ui/behavior';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { IconPart } from '../../../internal/icon';
import { cx, hasContent, type PartClasses } from '../../../internal/parts';
import { Progress } from '../Progress/Progress';
import { Sparkline } from '../Sparkline/Sparkline';
import { StatDeltaPart, statDelta, statTrend, type StatColor, type StatTrend } from '../Stat/Stat';

/** The metric a {@link KpiCard} shows: Stat's props. */
export interface KpiCardStat {
  /** What the metric measures. */
  label?: ReactNode;
  /** The number, already formatted. */
  value?: ReactNode;
  /** A unit after the value. */
  unit?: ReactNode;
  /** The icon tile: a registry name or a node. */
  icon?: string | ReactNode;
  /** Tints the icon tile and the target bar. @defaultValue `'neutral'` */
  color?: StatColor;
  /** The change as text; takes precedence over `change`. */
  delta?: ReactNode;
  /** The change as a percentage; sets `trend` from its sign. */
  change?: number;
  /** The change's direction. */
  trend?: StatTrend;
  /** Context after the delta. */
  description?: ReactNode;
  /** Hidden text before an up delta. @defaultValue `'Increase'` */
  upLabel?: string;
  /** Hidden text before a down delta. @defaultValue `'Decrease'` */
  downLabel?: string;
  /** Hidden text before a flat delta. @defaultValue `'No change'` */
  flatLabel?: string;
}

/** Progress toward a goal. */
export interface KpiCardTarget {
  /** The progress, from 0 to `max`. */
  value: number;
  /** The goal's value. @defaultValue `100` */
  max?: number;
  /** Names the goal and the bar, such as "Goal $25,000". */
  label?: string;
}

/** The parts a {@link KpiCard} accepts extra classes for. */
export type KpiCardPart =
  | 'root'
  | 'top'
  | 'label'
  | 'period'
  | 'icon'
  | 'row'
  | 'summary'
  | 'value'
  | 'unit'
  | 'foot'
  | 'delta'
  | 'description'
  | 'sparkline'
  | 'target'
  | 'targetText';

/** Props for the {@link KpiCard} component. Native `<div>` attributes go to the root. */
export interface KpiCardProps extends HTMLAttributes<HTMLDivElement> {
  /** The metric, with Stat's props. */
  stat?: KpiCardStat;
  /** The recent values, drawn as an area Sparkline beside the value. */
  sparkline?: readonly number[];
  /** The sparkline's accessible label; translate it. @defaultValue `'Trend from {first} to {latest}'` */
  sparklineLabel?: string;
  /** Progress toward a goal. Show it only when one exists. */
  target?: KpiCardTarget;
  /**
   * The end of the target row; `{percent}`, `{value}` and `{max}` are filled
   * in. Translate it. @defaultValue `'{percent}% of goal'`
   */
  targetLabel?: string;
  /** A period control, such as a Select, in the label row. */
  period?: ReactNode;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<KpiCardPart>;
}

/** The target's clamped percentage and end text. @internal */
export function kpiTarget(target: KpiCardTarget | undefined, template: string) {
  if (!target || typeof target.value !== 'number' || !Number.isFinite(target.value)) return null;
  const max =
    typeof target.max === 'number' && Number.isFinite(target.max) && target.max > 0
      ? target.max
      : 100;
  const percent = Math.round(Math.max(0, Math.min(1, target.value / max)) * 100);
  const text = template
    .replace(/\{percent\}/g, String(percent))
    .replace(/\{value\}/g, String(target.value))
    .replace(/\{max\}/g, String(max));
  return { value: target.value, max, percent, label: target.label, text };
}

/**
 * A headline metric in a Card. The ref points at the root `<div>`.
 *
 * @example
 * ```tsx
 * <KpiCard
 *   stat={{ label: 'Profit', value: '$15,708.98', change: 8.1, description: 'vs last month' }}
 *   sparkline={[2, 4, 8, 6, 10]}
 *   target={{ value: 62, label: 'Goal $25,000' }}
 * />
 * ```
 */
export const KpiCard = forwardRef<HTMLDivElement, KpiCardProps>(
  (
    {
      stat = {},
      sparkline,
      sparklineLabel = SPARKLINE_LABEL,
      target,
      targetLabel = '{percent}% of goal',
      period,
      classes = {},
      className,
      ...rest
    },
    ref,
  ) => {
    const color = stat.color ?? 'neutral';
    const delta = statDelta(stat.delta, stat.change);
    const trend = statTrend(stat.trend, stat.change);
    const iconName = typeof stat.icon === 'string' ? stat.icon : undefined;
    const iconNode = typeof stat.icon === 'string' ? undefined : stat.icon;
    const hasIcon = iconName !== undefined || hasContent(iconNode);
    const goal = kpiTarget(target, targetLabel);
    const points = sparklineValues(sparkline);

    return (
      <div
        {...rest}
        ref={ref}
        className={cx('apui-card apui-kpi-card', classes.root, className)}
        data-color={color}
      >
        {hasContent(stat.label) || hasContent(period) || hasIcon ? (
          <div className={classes.top} data-scope="kpi-card" data-part="top">
            {hasContent(stat.label) ? (
              <span className={classes.label} data-scope="kpi-card" data-part="label">
                {stat.label}
              </span>
            ) : null}
            {hasContent(period) ? (
              <div className={classes.period} data-scope="kpi-card" data-part="period">
                {period}
              </div>
            ) : null}
            <IconPart
              scope="kpi-card"
              part="icon"
              name={iconName}
              node={iconNode}
              className={classes.icon}
            />
          </div>
        ) : null}
        <div className={classes.row} data-scope="kpi-card" data-part="row">
          <div className={classes.summary} data-scope="kpi-card" data-part="summary">
            <span className={classes.value} data-scope="kpi-card" data-part="value">
              {stat.value}
              {hasContent(stat.unit) ? (
                <span className={classes.unit} data-scope="kpi-card" data-part="unit">
                  {stat.unit}
                </span>
              ) : null}
            </span>
            {hasContent(delta) || hasContent(stat.description) ? (
              <span className={classes.foot} data-scope="kpi-card" data-part="foot">
                {hasContent(delta) ? (
                  <StatDeltaPart
                    scope="kpi-card"
                    delta={delta}
                    trend={trend}
                    labels={{
                      up: stat.upLabel ?? 'Increase',
                      down: stat.downLabel ?? 'Decrease',
                      flat: stat.flatLabel ?? 'No change',
                    }}
                    className={classes.delta}
                  />
                ) : null}
                {hasContent(stat.description) ? (
                  <span
                    className={classes.description}
                    data-scope="kpi-card"
                    data-part="description"
                  >
                    {stat.description}
                  </span>
                ) : null}
              </span>
            ) : null}
          </div>
          {points.length > 0 ? (
            <Sparkline
              data={points}
              variant="area"
              width={96}
              height={36}
              label={sparklineLabel}
              className={classes.sparkline}
              data-scope="kpi-card"
              data-part="sparkline"
            />
          ) : null}
        </div>
        {goal !== null ? (
          <div className={classes.target} data-scope="kpi-card" data-part="target">
            <Progress
              value={goal.value}
              max={goal.max}
              size="sm"
              color={color === 'neutral' ? undefined : color}
              aria-label={goal.label ?? goal.text}
            />
            <div className={classes.targetText} data-scope="kpi-card" data-part="targetText">
              {hasContent(goal.label) ? <span>{goal.label}</span> : null}
              <span>{goal.text}</span>
            </div>
          </div>
        ) : null}
      </div>
    );
  },
);

KpiCard.displayName = 'KpiCard';
