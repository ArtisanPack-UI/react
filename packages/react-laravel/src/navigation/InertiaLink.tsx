import { forwardRef, type ComponentProps, type ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor, Size } from '@artisanpack-ui/tokens';

const colorMap: Record<DaisyColor | 'ghost' | 'outline', string> = {
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

export interface InertiaLinkProps extends Omit<ComponentProps<typeof Link>, 'size'> {
  /** Render as a DaisyUI button (default: false renders as a plain link) */
  asButton?: boolean;
  /** DaisyUI color variant (only applies when asButton is true) */
  color?: DaisyColor | 'ghost' | 'outline';
  /** Button size (only applies when asButton is true) */
  size?: Size;
  /** Icon element before the label */
  icon?: ReactNode;
  /** Icon element after the label */
  iconRight?: ReactNode;
  /** Show loading spinner */
  loading?: boolean;
}

/**
 * Inertia-powered link with optional DaisyUI button styling.
 * Wraps Inertia's `<Link>` for client-side navigation with all visit options.
 */
export const InertiaLink = forwardRef<HTMLAnchorElement, InertiaLinkProps>(
  (
    {
      asButton = false,
      color,
      size,
      icon,
      iconRight,
      loading = false,
      className,
      children,
      onClick: userOnClick,
      ...rest
    },
    ref,
  ) => {
    const classes = asButton
      ? cn(
          'btn',
          color && colorMap[color],
          size && sizeMap[size],
          loading && 'btn-disabled',
          className,
        )
      : className;

    const handleClick = (e: React.MouseEvent) => {
      if (loading) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      userOnClick?.(e);
    };

    return (
      <Link
        ref={ref}
        className={classes}
        aria-busy={loading || undefined}
        aria-disabled={loading || undefined}
        tabIndex={loading ? -1 : undefined}
        onClick={handleClick}
        {...rest}
      >
        {loading ? (
          <span className="loading loading-spinner loading-sm" aria-hidden="true" />
        ) : (
          icon && <span aria-hidden="true">{icon}</span>
        )}
        {children}
        {iconRight && <span aria-hidden="true">{iconRight}</span>}
      </Link>
    );
  },
);

InertiaLink.displayName = 'InertiaLink';
