/**
 * @module EmptyState
 *
 * The design-system EmptyState (#60): explains why there's nothing here and
 * what to do next, rendering the `.apui-empty-state` markup contract styled
 * by `@artisanpack-ui/css`.
 *
 * @packageDocumentation
 */

import { createElement, forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { IconSvg } from '../../../internal/icon';
import { cx, hasContent, type PartClasses } from '../../../internal/parts';

/** Why an {@link EmptyState} is empty. */
export type EmptyStateVariant = 'first-use' | 'no-results' | 'cleared';

/** The size of an {@link EmptyState} or ErrorState. */
export type EmptyStateSize = 'sm' | 'md';

/** The alignment of an {@link EmptyState} or ErrorState. */
export type EmptyStateAlign = 'center' | 'start';

/** The parts an {@link EmptyState} accepts extra classes for. */
export type EmptyStatePart = 'root' | 'icon' | 'title' | 'description' | 'actions';

const VARIANT_ICONS: Record<EmptyStateVariant, string> = {
  'first-use': 'inbox',
  'no-results': 'search-x',
  cleared: 'circle-check',
};

/** Props for the {@link EmptyState} component. Native `<div>` attributes go to the root. */
export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Why it's empty; picks the tile's tint and default icon. @defaultValue `'first-use'` */
  variant?: EmptyStateVariant;
  /** `md` for a page or card, `sm` for a panel. @defaultValue `'md'` */
  size?: EmptyStateSize;
  /** Centered, or aligned to the start. @defaultValue `'center'` */
  align?: EmptyStateAlign;
  /** An icon name from the registry, or a node. Defaults to the variant's. */
  icon?: ReactNode;
  /** Why it's empty, as a heading. */
  title?: ReactNode;
  /** What to do next. `children` override it. */
  description?: ReactNode;
  /** The buttons: one primary action, maybe a secondary one. */
  actions?: ReactNode;
  /** The title's heading level, 2 to 6. @defaultValue `3` */
  headingLevel?: number;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<EmptyStatePart>;
}

/** A heading tag for a level, clamped to `[min, 6]`. @internal */
export function headingTag(level: number, min: number): 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' {
  const clamped = Math.min(Math.max(Math.round(Number.isFinite(level) ? level : 3), min), 6);
  return `h${clamped}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

/** The icon part's content: a node, or the named icon. @internal */
export function iconContent(icon: ReactNode, fallback: string | undefined): ReactNode {
  if (hasContent(icon) && typeof icon !== 'string') return icon;
  const name = typeof icon === 'string' && icon !== '' ? icon : fallback;
  return name ? <IconSvg name={name} /> : null;
}

/**
 * Explains why there's nothing here and what to do next. The ref points at
 * the root.
 *
 * @example
 * ```tsx
 * <EmptyState title="No properties yet" actions={<Button>Add property</Button>} />
 * ```
 */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      variant = 'first-use',
      size = 'md',
      align = 'center',
      icon,
      title,
      description,
      actions,
      headingLevel = 3,
      classes = {},
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const heading = headingTag(headingLevel, 2);
    const body = hasContent(children) ? children : description;
    const iconNode = iconContent(icon, VARIANT_ICONS[variant]);
    return (
      <div
        {...rest}
        ref={ref}
        className={cx('apui-empty-state', classes.root, className)}
        data-scope="empty-state"
        data-part="root"
        data-variant={variant}
        data-size={size}
        data-align={align}
      >
        {iconNode ? (
          <span
            data-scope="empty-state"
            data-part="icon"
            aria-hidden="true"
            className={classes.icon}
          >
            {iconNode}
          </span>
        ) : null}
        {hasContent(title)
          ? createElement(
              heading,
              { 'data-scope': 'empty-state', 'data-part': 'title', className: classes.title },
              title,
            )
          : null}
        {hasContent(body) ? (
          <div data-scope="empty-state" data-part="description" className={classes.description}>
            {body}
          </div>
        ) : null}
        {hasContent(actions) ? (
          <div data-scope="empty-state" data-part="actions" className={classes.actions}>
            {actions}
          </div>
        ) : null}
      </div>
    );
  },
);

EmptyState.displayName = 'EmptyState';
