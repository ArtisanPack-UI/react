/**
 * @module Badge
 *
 * The design-system Badge (#61): a small, non-interactive label for a
 * status, category or count, rendering the `.apui-badge` markup contract
 * styled by `@artisanpack-ui/css`.
 *
 * @packageDocumentation
 */

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { IconPart } from '../../../internal/icon';
import { cx, type PartClasses } from '../../../internal/parts';

/** A {@link Badge}'s visual treatment. Emitted as `data-variant`. */
export type BadgeVariant = 'solid' | 'soft' | 'outline' | 'ghost';

/** A {@link Badge}'s semantic color. Emitted as `data-color`. */
export type BadgeColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

/** A {@link Badge}'s height: 18, 20 or 24px. Emitted as `data-size`. */
export type BadgeSize = 'sm' | 'md' | 'lg';

/** The parts a {@link Badge} accepts extra classes for. */
export type BadgePart = 'root' | 'dot' | 'icon' | 'label';

/** Props for the {@link Badge} component. Native `<span>` attributes go to the root. */
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Visual treatment. @defaultValue `'soft'` */
  variant?: BadgeVariant;
  /** Semantic color; use the same one for the same status everywhere. @defaultValue `'neutral'` */
  color?: BadgeColor;
  /** Height. @defaultValue `'md'` */
  size?: BadgeSize;
  /** A decorative dot before the label, in the badge's color. @defaultValue `false` */
  dot?: boolean;
  /** Icon name before the label, resolved through the icon registry. `icon` overrides it. */
  leadingIcon?: string;
  /** Leading icon node; overrides `leadingIcon`. */
  icon?: ReactNode;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<BadgePart>;
}

/**
 * A small label for a status, category or count. Never interactive: use a
 * Button or a filter chip for that. The ref points at the root.
 *
 * @example
 * ```tsx
 * <Badge color="success" dot>Active</Badge>
 * ```
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'soft',
      color = 'neutral',
      size = 'md',
      dot = false,
      leadingIcon,
      icon,
      classes = {},
      className,
      children,
      ...rest
    },
    ref,
  ) => (
    <span
      {...rest}
      ref={ref}
      className={cx('apui-badge', classes.root, className)}
      data-variant={variant}
      data-color={color}
      data-size={size}
    >
      {dot ? (
        <span className={classes.dot} data-scope="badge" data-part="dot" aria-hidden="true" />
      ) : null}
      <IconPart
        scope="badge"
        part="icon"
        name={leadingIcon}
        node={icon}
        mirror
        className={classes.icon}
      />
      <span className={classes.label} data-scope="badge" data-part="label">
        {children}
      </span>
    </span>
  ),
);

Badge.displayName = 'Badge';
