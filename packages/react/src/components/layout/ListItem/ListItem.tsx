/**
 * @module ListItem
 *
 * The design-system ListItem (#58) and its {@link List} container, rendering
 * the `.apui-list-item` and `.apui-list` markup contract styled by
 * `@artisanpack-ui/css`. A row's title becomes a link (`href`) or a button
 * (`interactive`) that covers the row.
 *
 * @packageDocumentation
 */

import { createContext, forwardRef, useContext, type HTMLAttributes, type ReactNode } from 'react';

import { IconSvg } from '../../../internal/icon';
import { cx, flag, hasContent, type PartClasses } from '../../../internal/parts';
import { safeHref } from '../../../internal/url';

/** A {@link List}'s frame: plain, bordered (a framed surface) or divided (rules only). */
export type ListVariant = 'plain' | 'bordered' | 'divided';

/** The parts a {@link ListItem} accepts extra classes for. */
export type ListItemPart = 'root' | 'leading' | 'title' | 'description' | 'trailing';

const InListContext = createContext(false);

/** Props for the {@link List} component. Native list attributes go to the ul/ol. */
export interface ListProps extends HTMLAttributes<HTMLUListElement> {
  /** The frame. Emitted as `data-variant`. @defaultValue `'plain'` */
  variant?: ListVariant;
  /** Renders an ol instead of a ul. @defaultValue `false` */
  ordered?: boolean;
}

/**
 * Rows of {@link ListItem}s, which render as li inside it.
 *
 * @example
 * ```tsx
 * <List variant="bordered"><ListItem title="Olivia Rhye" /></List>
 * ```
 */
export const List = forwardRef<HTMLUListElement, ListProps>(
  ({ variant = 'plain', ordered = false, className, children, ...rest }, ref) => {
    const Tag = ordered ? 'ol' : 'ul';
    return (
      <Tag
        {...rest}
        ref={ref as never}
        className={cx('apui-list', className)}
        data-variant={variant}
      >
        <InListContext.Provider value>{children}</InListContext.Provider>
      </Tag>
    );
  },
);

List.displayName = 'List';

/** Props for the {@link ListItem} component. Native attributes go to the row. */
export interface ListItemProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** The main text. */
  title?: ReactNode;
  /** Secondary text under the title. */
  description?: ReactNode;
  /** Makes the title a link covering the row (relative, http, https, mailto, tel, sms). */
  href?: string;
  /** Without `href`, makes the title a button covering the row; the row's `onClick` runs. @defaultValue `false` */
  interactive?: boolean;
  /** The current or chosen row: `data-selected`, and `aria-current` on its control. @defaultValue `false` */
  selected?: boolean;
  /** Dims the row and disables its control. @defaultValue `false` */
  disabled?: boolean;
  /** Icon name in the leading part. `leading` overrides it. */
  leadingIcon?: string;
  /** Leading content, such as an Avatar; overrides `leadingIcon`. */
  leading?: ReactNode;
  /** Short content at the end, such as a time or a Badge. */
  trailing?: ReactNode;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<ListItemPart>;
}

/**
 * A row with leading, title, description and trailing parts. An li inside a
 * {@link List}, a div on its own. The ref points at the row.
 *
 * @example
 * ```tsx
 * <ListItem title="Olivia Rhye" description="olivia@company.com" href="/members/1" />
 * ```
 */
export const ListItem = forwardRef<HTMLElement, ListItemProps>(
  (
    {
      title,
      description,
      href,
      interactive = false,
      selected = false,
      disabled = false,
      leadingIcon,
      leading,
      trailing,
      classes = {},
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const inList = useContext(InListContext);
    const Root = (inList ? 'li' : 'div') as 'div';
    const link = safeHref(href === '' ? undefined : href);
    const isLink = link !== undefined;
    const isButton = !isLink && interactive;
    const titleContent = hasContent(title) ? title : children;
    const current = selected && (isLink || isButton) ? 'true' : undefined;

    let titlePart: ReactNode;
    if (isLink) {
      titlePart = (
        <a
          className={classes.title}
          data-scope="list-item"
          data-part="title"
          href={disabled ? undefined : link}
          role={disabled ? 'link' : undefined}
          aria-disabled={disabled ? 'true' : undefined}
          aria-current={current}
        >
          {titleContent}
        </a>
      );
    } else if (isButton) {
      titlePart = (
        <button
          type="button"
          className={classes.title}
          data-scope="list-item"
          data-part="title"
          disabled={disabled}
          aria-current={current}
        >
          {titleContent}
        </button>
      );
    } else {
      titlePart = (
        <span className={classes.title} data-scope="list-item" data-part="title">
          {titleContent}
        </span>
      );
    }

    return (
      <Root
        {...rest}
        ref={ref as never}
        className={cx('apui-list-item', classes.root, className)}
        data-interactive={flag(isLink || isButton)}
        data-selected={flag(selected)}
        data-disabled={flag(disabled)}
        aria-disabled={disabled ? 'true' : undefined}
      >
        {hasContent(leading) || leadingIcon ? (
          <span className={classes.leading} data-scope="list-item" data-part="leading">
            {hasContent(leading) ? leading : <IconSvg name={leadingIcon!} />}
          </span>
        ) : null}
        {titlePart}
        {hasContent(description) ? (
          <span className={classes.description} data-scope="list-item" data-part="description">
            {description}
          </span>
        ) : null}
        {hasContent(trailing) ? (
          <span className={classes.trailing} data-scope="list-item" data-part="trailing">
            {trailing}
          </span>
        ) : null}
      </Root>
    );
  },
);

ListItem.displayName = 'ListItem';
