import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor, Size } from '@artisanpack-ui/tokens';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button text label */
  label?: string;
  /** DaisyUI color variant */
  color?: DaisyColor | 'ghost' | 'outline';
  /** Button size */
  size?: Size;
  /** Icon element to display before the label */
  icon?: ReactNode;
  /** Icon element to display after the label */
  iconRight?: ReactNode;
  /** Show loading spinner */
  loading?: boolean;
  /** Render as a link */
  link?: string;
  /** Open link in new tab */
  external?: boolean;
  /** Display badge text */
  badge?: string;
  /** Custom badge CSS classes */
  badgeClasses?: string;
  /** Hide label on small screens */
  responsive?: boolean;
  /** Tooltip text */
  tooltip?: string;
  /** Tooltip position */
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
}

const colorMap: Record<string, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  accent: 'btn-accent',
  success: 'btn-success',
  warning: 'btn-warning',
  error: 'btn-error',
  info: 'btn-info',
  neutral: 'btn-neutral',
  ghost: 'btn-ghost',
  outline: 'btn-outline',
};

const sizeMap: Record<Size, string> = {
  xs: 'btn-xs',
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
};

const tooltipPositionMap: Record<string, string> = {
  top: 'tooltip-top',
  bottom: 'tooltip-bottom',
  left: 'tooltip-left',
  right: 'tooltip-right',
};

/**
 * Button component with color variants, sizes, icons, and loading state.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      label,
      color,
      size,
      icon,
      iconRight,
      loading = false,
      link,
      external,
      badge,
      badgeClasses,
      responsive = false,
      tooltip,
      tooltipPosition = 'top',
      disabled,
      className,
      children,
      type = 'button',
      ...rest
    },
    ref,
  ) => {
    const buttonClasses = cn(
      'btn',
      color && colorMap[color],
      size && sizeMap[size],
      loading && 'btn-disabled',
      className,
    );

    const content = (
      <>
        {loading ? (
          <span className="loading loading-spinner loading-sm" aria-hidden="true" />
        ) : (
          icon && <span aria-hidden="true">{icon}</span>
        )}
        {label && (
          <span className={cn(responsive && 'hidden sm:inline')}>{label}</span>
        )}
        {children}
        {iconRight && <span aria-hidden="true">{iconRight}</span>}
        {badge && (
          <span className={cn('badge', badgeClasses)}>{badge}</span>
        )}
      </>
    );

    if (link) {
      return (
        <a
          href={link}
          className={buttonClasses}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          role="button"
        >
          {content}
        </a>
      );
    }

    const wrapperClasses = tooltip
      ? cn('tooltip', tooltipPositionMap[tooltipPosition])
      : undefined;

    const button = (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={buttonClasses}
        aria-busy={loading || undefined}
        {...rest}
      >
        {content}
      </button>
    );

    if (tooltip) {
      return (
        <div className={wrapperClasses} data-tip={tooltip}>
          {button}
        </div>
      );
    }

    return button;
  },
);

Button.displayName = 'Button';
