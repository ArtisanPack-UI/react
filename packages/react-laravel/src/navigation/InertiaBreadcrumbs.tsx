import { forwardRef, useMemo, type ReactElement } from 'react';
import { Link } from '@inertiajs/react';
import { Breadcrumbs, type BreadcrumbsProps, type BreadcrumbItem } from '@artisanpack-ui/react';

export interface InertiaBreadcrumbItem extends Omit<BreadcrumbItem, 'renderLink'> {
  /** Inertia route URL for this breadcrumb item */
  href?: string;
}

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
      renderLink: (props): ReactElement => {
        const ariaCurrent = (props as Record<string, unknown>)['aria-current'] as
          | 'page'
          | undefined;
        return (
          <Link href={href} className={props.className} aria-current={ariaCurrent}>
            {props.children}
          </Link>
        );
      },
    };
  });
}

/**
 * Breadcrumbs pre-wired with Inertia's `<Link>` for client-side navigation.
 * Accepts `href` on each item instead of requiring `renderLink`.
 */
export const InertiaBreadcrumbs = forwardRef<HTMLElement, InertiaBreadcrumbsProps>(
  ({ items, ...rest }, ref) => {
    const breadcrumbItems = useMemo(() => toBreadcrumbItems(items), [items]);

    return <Breadcrumbs ref={ref} items={breadcrumbItems} {...rest} />;
  },
);

InertiaBreadcrumbs.displayName = 'InertiaBreadcrumbs';
