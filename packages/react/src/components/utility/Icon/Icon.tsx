/**
 * @module Icon
 *
 * The design-system Icon (#65): `span.apui-icon` around one glyph from the
 * icon registry (`@artisanpack-ui/behavior/icons`, D-017) at four sizes,
 * plain or on a soft-colored tile. Decorative unless it has a `label`;
 * directional icons mirror under RTL. It renders the `.apui-icon` markup
 * contract styled by `@artisanpack-ui/css`.
 *
 * @packageDocumentation
 */

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { IconSvg, isDirectionalIcon } from '../../../internal/icon';
import { cx, flag, hasContent, type PartClasses } from '../../../internal/parts';

/** The look of an {@link Icon}: the bare glyph, or on a soft tile. */
export type IconVariant = 'plain' | 'tile';

/** The glyph size of an {@link Icon}: 14, 16, 20 or 24px. */
export type IconSize = 'sm' | 'md' | 'lg' | 'xl';

/** The tone of an {@link Icon}. */
export type IconColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

/** The parts an {@link Icon} accepts extra classes for. */
export type IconPart = 'root' | 'svg';

/** Props for the {@link Icon} component. Native `<span>` attributes go to the root. */
export interface IconProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** A registered icon name, Lucide's kebab-case (`house`). `children` override it. */
  name?: string;
  /** `plain`, or `tile` for a soft-colored square. @defaultValue `'plain'` */
  variant?: IconVariant;
  /** The glyph size. @defaultValue `'md'` */
  size?: IconSize;
  /** A plain icon's text tone, or a tile's soft fill. Unset: currentColor, and a neutral tile. */
  color?: IconColor;
  /** The accessible name. With it the icon is `role="img"`; without it, decorative. */
  label?: string;
  /** Flips it under RTL. Unset, directional names (arrows, chevrons) mirror. */
  mirror?: boolean;
  /** Your own `<svg>`, drawn in place of the named icon. */
  children?: ReactNode;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<IconPart>;
}

/**
 * One icon from the registry, or your own `<svg>` as children.
 *
 * @example
 * ```tsx
 * <Icon name="house" />
 * <Icon name="circle-alert" color="error" label="Payment failed" />
 * <Icon name="wallet" variant="tile" color="primary" />
 * ```
 */
export const Icon = forwardRef<HTMLSpanElement, IconProps>(
  (
    {
      name,
      variant = 'plain',
      size = 'md',
      color,
      label,
      mirror,
      children,
      classes = {},
      className,
      ...rest
    },
    ref,
  ) => {
    const hasChildren = hasContent(children);
    const labeled = typeof label === 'string' && label !== '';
    const mirrored = mirror ?? (!hasChildren && isDirectionalIcon(name));

    return (
      <span
        {...rest}
        ref={ref}
        className={cx('apui-icon', variant === 'tile' && 'apui-icon-tile', classes.root, className)}
        data-scope="icon"
        data-part="root"
        data-variant={variant}
        data-size={size}
        data-color={color}
        data-mirror={flag(mirrored)}
        role={labeled ? 'img' : undefined}
        aria-label={labeled ? label : undefined}
        aria-hidden={labeled ? undefined : true}
      >
        {hasChildren ? (
          children
        ) : name ? (
          <IconSvg name={name} data-scope="icon" data-part="svg" className={classes.svg} />
        ) : null}
      </span>
    );
  },
);

Icon.displayName = 'Icon';
