/** @module Button */

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor, Size } from '@artisanpack-ui/tokens';

/**
 * Props for the {@link Button} component.
 *
 * Extends native `<button>` HTML attributes. When the `link` prop is provided,
 * the component renders as an `<a>` element styled as a button.
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Text label displayed inside the button. Hidden on small screens when `responsive` is true. */
  label?: string;
  /** DaisyUI color variant applied to the button. Accepts standard theme colors plus `'ghost'` and `'outline'`. */
  color?: DaisyColor | 'ghost' | 'outline';
  /** Controls the button size using DaisyUI size modifiers. */
  size?: Size;
  /** Icon element rendered before the label text. Wrapped with `aria-hidden="true"`. */
  icon?: ReactNode;
  /** Icon element rendered after the label text and children. Wrapped with `aria-hidden="true"`. */
  iconRight?: ReactNode;
  /** When true, disables the button and shows a loading spinner in place of the left icon. */
  loading?: boolean;
  /** When provided, renders the button as an `<a>` element pointing to this URL. */
  link?: string;
  /** When true and `link` is set, opens the link in a new tab with `rel="noopener noreferrer"`. */
  external?: boolean;
  /** Text content for an inline badge rendered after the button label. */
  badge?: string;
  /** Additional CSS classes applied to the badge element. */
  badgeClasses?: string;
  /** When true, hides the label on small screens and only shows it on `sm` breakpoint and above. */
  responsive?: boolean;
  /** Tooltip text displayed on hover. Wraps the button in a DaisyUI tooltip container. */
  tooltip?: string;
  /** Position of the tooltip relative to the button. @defaultValue `'top'` */
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
 * A versatile button component with DaisyUI color variants, size options, icon support,
 * loading state, tooltip, badge, and optional link rendering.
 *
 * Renders a `<button>` by default or an `<a>` element when the `link` prop is provided.
 * Supports `forwardRef` for direct access to the underlying `<button>` element.
 *
 * @example
 * ```tsx
 * <Button color="primary" icon={<PlusIcon />} loading={false}>
 *   Add Item
 * </Button>
 * ```
 *
 * @example
 * ```tsx
 * <Button link="/dashboard" external tooltip="Go to dashboard">
 *   Dashboard
 * </Button>
 * ```
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
        {label && <span className={cn(responsive && 'hidden sm:inline')}>{label}</span>}
        {children}
        {iconRight && <span aria-hidden="true">{iconRight}</span>}
        {badge && <span className={cn('badge', badgeClasses)}>{badge}</span>}
      </>
    );

    const element = link ? (
      <a
        href={link}
        className={buttonClasses}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        role="button"
        aria-busy={loading || undefined}
        aria-disabled={disabled || loading || undefined}
      >
        {content}
      </a>
    ) : (
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
        <div className={cn('tooltip', tooltipPositionMap[tooltipPosition])} data-tip={tooltip}>
          {element}
        </div>
      );
    }

    return element;
  },
);

Button.displayName = 'Button';
