/**
 * @module Breadcrumbs
 *
 * Breadcrumb navigation component that renders an accessible trail of links
 * showing the user's current location within a site hierarchy. Supports
 * custom link renderers for integration with React Router, Inertia, or
 * other routing libraries, and optional item collapsing with ellipsis.
 */

import { forwardRef, type HTMLAttributes, type ReactNode, type ReactElement } from 'react';
import { cn } from '@artisanpack-ui/tokens';

/**
 * Represents a single item in the breadcrumb trail.
 */
export interface BreadcrumbItem {
  /** Display label for the breadcrumb item. Can be a string or any React node. */
  label: ReactNode;
  /** URL for the link. Omit for the current/last item to render it as plain text. */
  href?: string;
  /** Optional icon element displayed before the label. */
  icon?: ReactNode;
  /**
   * Custom link renderer for integration with React Router, Inertia, or other routing libraries.
   * When provided, this function is called instead of rendering a plain `<a>` tag.
   */
  renderLink?: (props: {
    className?: string;
    children: ReactNode;
    'aria-current'?: 'page';
  }) => ReactElement;
}

/**
 * Props for the {@link Breadcrumbs} component.
 */
export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  /** Array of breadcrumb items to display. The last item is treated as the current page. */
  items: BreadcrumbItem[];
  /**
   * Maximum number of items to display before collapsing intermediate items with an ellipsis.
   * When set, the first item and the last `maxItems - 1` items are shown.
   */
  maxItems?: number;
}

/**
 * Breadcrumb navigation trail with accessible markup and optional item collapsing.
 *
 * Renders a `<nav>` element with `aria-label="Breadcrumbs"` and marks the last
 * item with `aria-current="page"` for screen readers.
 *
 * @example
 * ```tsx
 * <Breadcrumbs
 *   items={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Products', href: '/products' },
 *     { label: 'Widget' },
 *   ]}
 *   maxItems={3}
 * />
 * ```
 */
export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(
  ({ items, maxItems, className, ...rest }, ref) => {
    const renderItems = () => {
      let displayItems = items;

      if (maxItems && maxItems > 1 && items.length > maxItems) {
        const first = items.slice(0, 1);
        const last = items.slice(-(maxItems - 1));
        const ellipsis: BreadcrumbItem = { label: '…' };
        displayItems = [...first, ellipsis, ...last];
      }

      return displayItems.map((item, index) => {
        const isLast = index === displayItems.length - 1;
        const key = item.href ?? (typeof item.label === 'string' ? item.label : index);
        const content = (
          <>
            {item.icon && <span aria-hidden="true">{item.icon}</span>}
            {item.label}
          </>
        );

        return (
          <li key={key}>
            {item.renderLink ? (
              item.renderLink({
                className: undefined,
                children: content,
                ...(isLast ? { 'aria-current': 'page' as const } : {}),
              })
            ) : item.href && !isLast ? (
              <a href={item.href}>{content}</a>
            ) : (
              <span aria-current={isLast ? 'page' : undefined}>{content}</span>
            )}
          </li>
        );
      });
    };

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumbs"
        className={cn('breadcrumbs text-sm', className)}
        {...rest}
      >
        <ul>{renderItems()}</ul>
      </nav>
    );
  },
);

Breadcrumbs.displayName = 'Breadcrumbs';
