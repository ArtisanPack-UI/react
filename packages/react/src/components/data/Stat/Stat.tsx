import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor } from '@artisanpack-ui/tokens';
import { Sparkline } from '../Sparkline/Sparkline';
import type { SparklineProps } from '../Sparkline/Sparkline';

export interface StatProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  value: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  color?: DaisyColor;
  change?: number;
  changeLabel?: string;
  actions?: ReactNode;
  sparklineData?: number[];
  sparklineType?: SparklineProps['type'];
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
    const isPositive = change !== undefined && change >= 0;
    const changeColor = change !== undefined ? (isPositive ? 'text-success' : 'text-error') : '';
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
              <span aria-label={isPositive ? 'Increased' : 'Decreased'}>
                {isPositive ? '\u2191' : '\u2193'} {formattedChange}
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

export interface StatGroupProps extends HTMLAttributes<HTMLDivElement> {
  horizontal?: boolean;
}

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
