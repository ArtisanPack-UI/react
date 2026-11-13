/**
 * @module Breadcrumbs
 *
 * The design-system Breadcrumbs (#56): a nav landmark holding the trail to
 * the current page, rendering the `.apui-breadcrumbs` markup contract styled
 * by `@artisanpack-ui/css`. Long trails collapse their middle behind an
 * overflow button that reveals it.
 *
 * @packageDocumentation
 */

import {
  Children,
  forwardRef,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';

import { IconSvg } from '../../../internal/icon';
import { cx, type PartClasses } from '../../../internal/parts';
import { safeHref } from '../../../internal/url';

/** The parts a {@link Breadcrumbs} accepts extra classes for. */
export type BreadcrumbsPart =
  | 'root'
  | 'list'
  | 'item'
  | 'link'
  | 'separator'
  | 'current'
  | 'overflow';

/** One level of the trail. */
export interface BreadcrumbItem {
  /** The level's name. */
  label: ReactNode;
  /** Where it links. Ignored on the last item, the current page. */
  href?: string;
  /** An icon name from the registry, before the label. */
  icon?: string;
  /** Keeps the label for screen readers only, next to the icon (a home icon). */
  hideLabel?: boolean;
  /**
   * Renders a router link (Inertia, React Router) instead of the anchor. It
   * receives the part's props, which the link should spread.
   */
  renderLink?: (props: {
    className?: string;
    children: ReactNode;
    'data-scope': 'breadcrumbs';
    'data-part': 'link';
  }) => ReactElement;
}

/**
 * Props for a {@link BreadcrumbsItem}. Other anchor attributes (`onClick`)
 * go to its link.
 */
export interface BreadcrumbsItemProps
  extends BreadcrumbItem, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  /** The level's name; `children` override it. */
  label: ReactNode;
}

/**
 * One composed level of a {@link Breadcrumbs}, a direct child. The trail
 * renders it in order after `items`; on its own it renders nothing.
 */
export function BreadcrumbsItem(_props: BreadcrumbsItemProps): null {
  return null;
}

BreadcrumbsItem.displayName = 'BreadcrumbsItem';

/** A level with the extra attributes a composed item passes to its link. */
type Level = BreadcrumbItem & { attributes?: AnchorHTMLAttributes<HTMLAnchorElement> };

/** Props for the {@link Breadcrumbs} component. Native `<nav>` attributes go to the root. */
export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  /**
   * The trail, from the section down to the current page. The last level is
   * the current page. `BreadcrumbsItem` children follow it.
   */
  items?: BreadcrumbItem[];
  /**
   * How many entries show before the middle collapses: the first item, an
   * overflow button and the last `maxItems - 2`. `0` never collapses. @defaultValue `4`
   */
  maxItems?: number;
  /** The nav landmark's accessible name; translate it. @defaultValue `'Breadcrumb'` */
  label?: string;
  /** The overflow button's accessible name, with `{count}`; translate it. @defaultValue `'Show {count} more levels'` */
  overflowLabel?: string;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<BreadcrumbsPart>;
}

/** The first and last index that start collapsed, or null when the trail fits. */
function collapsedRange(count: number, maxItems: number): [number, number] | null {
  if (maxItems <= 0 || count <= maxItems) return null;
  const last = count - Math.max(1, maxItems - 2) - 1;
  return last >= 1 ? [1, last] : null;
}

/**
 * Shows where the current page sits in the hierarchy. The ref points at the
 * `<nav>`.
 *
 * @example
 * ```tsx
 * <Breadcrumbs items={[{ label: 'Dashboard', href: '/' }, { label: 'Properties', href: '/properties' }, { label: 'Lakeview Lofts' }]} />
 * ```
 */
export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(
  (
    {
      items = [],
      maxItems = 4,
      label = 'Breadcrumb',
      overflowLabel = 'Show {count} more levels',
      classes = {},
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const composed: Level[] = Children.toArray(children)
      .filter(
        (child): child is ReactElement<BreadcrumbsItemProps> =>
          isValidElement(child) && child.type === BreadcrumbsItem,
      )
      .map(({ props }) => {
        const {
          label,
          href,
          icon,
          hideLabel,
          renderLink,
          children: content,
          ...attributes
        } = props;
        return {
          label: content ?? label,
          href,
          icon,
          hideLabel,
          renderLink,
          attributes,
        };
      });
    const levels: Level[] = [...items, ...composed];
    const [expanded, setExpanded] = useState(false);
    const listRef = useRef<HTMLOListElement>(null);
    const focusRevealed = useRef(false);
    const range = collapsedRange(levels.length, maxItems);
    const collapsed = range !== null && !expanded;
    const hiddenCount = range === null ? 0 : range[1] - range[0] + 1;

    useEffect(() => {
      if (!expanded || !focusRevealed.current) return;
      focusRevealed.current = false;
      listRef.current?.querySelector<HTMLElement>('[data-collapsed] a')?.focus();
    }, [expanded]);

    const separator = (
      <span
        className={classes.separator}
        data-scope="breadcrumbs"
        data-part="separator"
        aria-hidden="true"
        data-mirror=""
      >
        <IconSvg name="chevron-right" />
      </span>
    );

    const entries: ReactNode[] = [];
    levels.forEach((item, index) => {
      const isCurrent = index === levels.length - 1;
      const isCollapsed = range !== null && index >= range[0] && index <= range[1];
      const inner = (
        <>
          {item.icon ? <IconSvg name={item.icon} /> : null}
          {item.hideLabel ? <span className="apui-sr-only">{item.label}</span> : item.label}
        </>
      );
      const href = isCurrent ? undefined : safeHref(item.href);
      let body: ReactNode;
      if (isCurrent) {
        body = (
          <span
            className={classes.current}
            data-scope="breadcrumbs"
            data-part="current"
            aria-current="page"
          >
            {inner}
          </span>
        );
      } else if (item.renderLink) {
        body = item.renderLink({
          className: classes.link,
          children: inner,
          'data-scope': 'breadcrumbs',
          'data-part': 'link',
        });
      } else if (href !== undefined) {
        body = (
          <a
            {...item.attributes}
            className={cx(classes.link, item.attributes?.className)}
            data-scope="breadcrumbs"
            data-part="link"
            href={href}
          >
            {inner}
          </a>
        );
      } else {
        body = <span>{inner}</span>;
      }

      if (range !== null && index === 1) {
        entries.push(
          <li
            key="apui-overflow"
            className={classes.item}
            data-scope="breadcrumbs"
            data-part="item"
            hidden={expanded}
          >
            {separator}
            <button
              type="button"
              className={classes.overflow}
              data-scope="breadcrumbs"
              data-part="overflow"
              aria-label={overflowLabel.replace('{count}', String(hiddenCount))}
              aria-expanded={expanded}
              onClick={() => {
                focusRevealed.current = true;
                setExpanded(true);
              }}
            >
              <IconSvg name="ellipsis" />
            </button>
          </li>,
        );
      }

      entries.push(
        <li
          key={index}
          className={classes.item}
          data-scope="breadcrumbs"
          data-part="item"
          hidden={isCollapsed && collapsed}
          data-collapsed={isCollapsed ? '' : undefined}
        >
          {index > 0 ? separator : null}
          {body}
        </li>,
      );
    });

    return (
      <nav
        {...rest}
        ref={ref}
        className={cx('apui-breadcrumbs', classes.root, className)}
        aria-label={label}
      >
        <ol ref={listRef} className={classes.list} data-scope="breadcrumbs" data-part="list">
          {entries}
        </ol>
      </nav>
    );
  },
);

Breadcrumbs.displayName = 'Breadcrumbs';
