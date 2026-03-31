import { forwardRef, useMemo, type ReactElement, type ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import { Breadcrumbs, type BreadcrumbsProps, type BreadcrumbItem } from '@artisanpack-ui/react';

/**
 * Breadcrumb item descriptor with Inertia `href` support.
 * Extends the base `BreadcrumbItem` but replaces `renderLink` with a simple `href` string
 * that is automatically wired to Inertia's `<Link>` for client-side navigation.
 *
 * @see {@link InertiaBreadcrumbsProps}
 */
export interface InertiaBreadcrumbItem extends Omit<BreadcrumbItem, 'renderLink'> {
  /** Inertia route URL for this breadcrumb item */
  href?: string;
}

/**
 * Props for the {@link InertiaBreadcrumbs} component.
 * Extends the base `BreadcrumbsProps` but accepts {@link InertiaBreadcrumbItem} items
 * with Inertia `href` instead of `renderLink`.
 */
export interface InertiaBreadcrumbsProps extends Omit<BreadcrumbsProps, 'items'> {
  /** Breadcrumb items with Inertia href support */
  items: InertiaBreadcrumbItem[];
}

/**
 * Converts InertiaBreadcrumbItem items to BreadcrumbItem by injecting Inertia Link
 * via the `renderLink` prop for items that have an `href`.
 */
function toBreadcrumbItems(items: InertiaBreadcrumbItem[]): BreadcrumbItem[] {
  return items.map((item) => {
    const { href, ...rest } = item;

    if (!href) return rest;

    return {
      ...rest,
      renderLink: (props: {
        className?: string;
        children: ReactNode;
        'aria-current'?: 'page';
      }): ReactElement => (
        <Link href={href} className={props.className} aria-current={props['aria-current']}>
          {props.children}
        </Link>
      ),
    };
  });
}

/**
 * Breadcrumbs pre-wired with Inertia's `<Link>` for client-side navigation.
 * Accepts `href` on each item instead of requiring `renderLink`.
 *
 * @see {@link InertiaBreadcrumbItem} for the item descriptor shape
 *
 * @example
 * ```tsx
 * <InertiaBreadcrumbs
 *   items={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Users', href: '/users' },
 *     { label: 'John Doe' },
 *   ]}
 * />
 * ```
 */
export const InertiaBreadcrumbs = forwardRef<HTMLElement, InertiaBreadcrumbsProps>(
  ({ items, ...rest }, ref) => {
    const breadcrumbItems = useMemo(() => toBreadcrumbItems(items), [items]);

    return <Breadcrumbs ref={ref} items={breadcrumbItems} {...rest} />;
  },
);

InertiaBreadcrumbs.displayName = 'InertiaBreadcrumbs';
