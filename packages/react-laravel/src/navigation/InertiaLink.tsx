import { forwardRef, type ComponentProps, type MouseEvent, type ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import type { ButtonColor, ButtonSize, ButtonVariant } from '@artisanpack-ui/react/form';
import { Loading } from '@artisanpack-ui/react/feedback';

/**
 * The colors {@link InertiaLink} takes with `asButton`: a design-system
 * Button color, or the 1.x `ghost` and `outline`, which map to a neutral
 * ghost or outline button.
 */
export type InertiaLinkColor = ButtonColor | 'ghost' | 'outline';

/**
 * Props for the {@link InertiaLink} component.
 * Extends all Inertia `Link` props with optional design-system Button styling.
 */
export interface InertiaLinkProps extends Omit<ComponentProps<typeof Link>, 'size' | 'color'> {
  /** Styles the link as a design-system Button (the `.apui-button` markup). @defaultValue `false` */
  asButton?: boolean;
  /**
   * The button's color, with `asButton`. `ghost` and `outline` (1.x) are a
   * neutral ghost or outline button. @defaultValue `'primary'`
   */
  color?: InertiaLinkColor;
  /** The button's treatment, with `asButton`. Overrides the variant `ghost` or `outline` imply. @defaultValue `'solid'` */
  variant?: ButtonVariant;
  /** The button's height, with `asButton`. @defaultValue `'md'` */
  size?: ButtonSize;
  /** An icon node before the label. */
  icon?: ReactNode;
  /** An icon node after the label. */
  iconRight?: ReactNode;
  /** Shows a spinner, sets `aria-busy` and `aria-disabled`, and ignores clicks. @defaultValue `false` */
  loading?: boolean;
}

/** The variant and color a 1.x `color` maps to. */
function buttonStyle(
  color: InertiaLinkColor | undefined,
  variant: ButtonVariant | undefined,
): { variant: ButtonVariant; color: ButtonColor } {
  if (color === 'ghost' || color === 'outline') {
    return { variant: variant ?? color, color: 'neutral' };
  }
  return { variant: variant ?? 'solid', color: color ?? 'primary' };
}

/**
 * Inertia-powered link with optional design-system Button styling.
 * Wraps Inertia's `<Link>` for client-side navigation with all visit options
 * (`method`, `preserveScroll`, `preserveState`, `only`, …).
 *
 * With `asButton` it renders the design-system Button markup contract
 * (`.apui-button` with `data-variant`, `data-color` and `data-size`, and its
 * `icon`, `label`, `iconEnd` and `spinner` parts), styled by
 * `@artisanpack-ui/css`. Without it, it's a plain link.
 *
 * @see {@link InertiaLinkProps} for available props
 *
 * @example
 * ```tsx
 * // Plain link
 * <InertiaLink href="/dashboard">Dashboard</InertiaLink>
 *
 * // Button-styled link with color and size
 * <InertiaLink href="/users/create" asButton color="primary" size="sm">
 *   New User
 * </InertiaLink>
 *
 * // An outline button that's navigating
 * <InertiaLink href="/settings" asButton variant="outline" color="neutral" loading={isNavigating}>
 *   Settings
 * </InertiaLink>
 * ```
 */
export const InertiaLink = forwardRef<HTMLAnchorElement, InertiaLinkProps>(
  (
    {
      asButton = false,
      color,
      variant,
      size = 'md',
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
    const handleClick = (event: MouseEvent<Element>) => {
      if (loading) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      userOnClick?.(event);
    };

    const state = {
      'aria-busy': loading || undefined,
      'aria-disabled': loading || undefined,
      tabIndex: loading ? -1 : undefined,
      onClick: handleClick,
    };

    if (!asButton) {
      return (
        <Link ref={ref} className={className} {...state} {...rest}>
          {/* As in 1.x, the spinner takes the icon's place on a plain link. */}
          {loading ? (
            <Loading size="sm" delay={0} aria-hidden="true" />
          ) : icon ? (
            <span aria-hidden="true">{icon}</span>
          ) : null}
          {children}
          {iconRight ? <span aria-hidden="true">{iconRight}</span> : null}
        </Link>
      );
    }

    const style = buttonStyle(color, variant);
    return (
      <Link
        ref={ref}
        className={['apui-button', className].filter(Boolean).join(' ')}
        data-variant={style.variant}
        data-color={style.color}
        data-size={size}
        {...state}
        {...rest}
      >
        {icon ? (
          <span data-scope="button" data-part="icon" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        {children !== undefined && children !== null && children !== false ? (
          <span data-scope="button" data-part="label">
            {children}
          </span>
        ) : null}
        {iconRight ? (
          <span data-scope="button" data-part="iconEnd" aria-hidden="true">
            {iconRight}
          </span>
        ) : null}
        {loading ? <span data-scope="button" data-part="spinner" aria-hidden="true" /> : null}
      </Link>
    );
  },
);

InertiaLink.displayName = 'InertiaLink';
