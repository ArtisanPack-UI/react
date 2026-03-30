/**
 * @module Stat
 *
 * Statistics display components built on DaisyUI's stat pattern. Includes the
 * `Stat` component for individual metric cards with optional change indicators,
 * sparklines, icons, and actions, and the `StatGroup` container for horizontal
 * or vertical stat layouts.
 */

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor } from '@artisanpack-ui/tokens';
import { Sparkline } from '../Sparkline/Sparkline';
import type { SparklineProps } from '../Sparkline/Sparkline';

/**
 * Props for the {@link Stat} component.
 */
export interface StatProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Title label displayed above the value (e.g., "Total Revenue"). */
  title?: ReactNode;
  /** The primary metric value to display (e.g., "1,200" or "$4.5M"). */
  value: ReactNode;
  /** Description text displayed below the value. */
  description?: ReactNode;
  /** Icon element displayed in the stat figure area. Hidden when sparkline data is provided. */
  icon?: ReactNode;
  /** DaisyUI color for the value text. */
  color?: DaisyColor;
  /** Percentage change value. Positive values show green with an up arrow, negative show red with a down arrow. */
  change?: number;
  /** Additional label appended after the change percentage (e.g., "since last month"). */
  changeLabel?: string;
  /** Custom action elements displayed in the stat figure area. */
  actions?: ReactNode;
  /** Data points for an inline sparkline chart in the stat figure area. */
  sparklineData?: number[];
  /** Chart type for the sparkline. @defaultValue 'line' */
  sparklineType?: SparklineProps['type'];
  /** Color for the sparkline. Falls back to `color` then 'primary'. */
  sparklineColor?: SparklineProps['color'];
}

const colorMap: Record<string, string> = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  accent: 'text-accent',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
  info: 'text-info',
  neutral: 'text-neutral',
};

/**
 * Individual stat card for displaying a key metric with optional change indicator and sparkline.
 *
 * Uses DaisyUI's `stat` classes. The change value is formatted with one decimal place
 * and displayed with a directional arrow icon and green/red coloring.
 *
 * @example
 * ```tsx
 * <Stat
 *   title="Total Users"
 *   value="12,450"
 *   change={5.2}
 *   changeLabel="since last month"
 *   color="primary"
 *   sparklineData={[10, 20, 15, 30, 25]}
 * />
 * ```
 */
export const Stat = forwardRef<HTMLDivElement, StatProps>(
  (
    {
      title,
      value,
      description,
      icon,
      color,
      change,
      changeLabel,
      actions,
      sparklineData,
      sparklineType = 'line',
      sparklineColor,
      className,
      ...rest
    },
    ref,
  ) => {
    const isPositive = change !== undefined && change > 0;
    const isNegative = change !== undefined && change < 0;
    const changeColor =
      change !== undefined ? (isPositive ? 'text-success' : isNegative ? 'text-error' : '') : '';
    const formattedChange =
      change !== undefined ? `${isPositive ? '+' : ''}${change.toFixed(1)}%` : null;

    const hasSparkline = sparklineData && sparklineData.length > 0;

    return (
      <div ref={ref} className={cn('stat', className)} {...rest}>
        {icon && !hasSparkline && (
          <div className="stat-figure" aria-hidden="true">
            {icon}
          </div>
        )}
        {hasSparkline && (
          <div className="stat-figure">
            <Sparkline
              data={sparklineData}
              type={sparklineType}
              color={sparklineColor ?? color ?? 'primary'}
              height={40}
              showTooltip={false}
            />
          </div>
        )}
        {actions && <div className="stat-figure">{actions}</div>}
        {title && <div className="stat-title">{title}</div>}
        <div className={cn('stat-value', color && colorMap[color])}>{value}</div>
        {(description || formattedChange) && (
          <div className={cn('stat-desc', formattedChange && changeColor)}>
            {formattedChange && (
              <span aria-label={isPositive ? 'Increased' : isNegative ? 'Decreased' : 'No change'}>
                {isPositive ? '\u2191' : isNegative ? '\u2193' : ''} {formattedChange}
              </span>
            )}
            {formattedChange && description && ' '}
            {description}
            {changeLabel && ` ${changeLabel}`}
          </div>
        )}
      </div>
    );
  },
);

Stat.displayName = 'Stat';

/**
 * Props for the {@link StatGroup} component.
 */
export interface StatGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether to lay out stats horizontally (side by side). @defaultValue false */
  horizontal?: boolean;
}

/**
 * Container component for grouping multiple {@link Stat} components together.
 *
 * Renders a DaisyUI `stats` container with optional horizontal layout.
 *
 * @example
 * ```tsx
 * <StatGroup horizontal>
 *   <Stat title="Users" value="1,200" color="primary" />
 *   <Stat title="Revenue" value="$45K" color="success" />
 * </StatGroup>
 * ```
 */
export const StatGroup = forwardRef<HTMLDivElement, StatGroupProps>(
  ({ horizontal = false, className, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('stats shadow', horizontal && 'stats-horizontal', className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

StatGroup.displayName = 'StatGroup';
