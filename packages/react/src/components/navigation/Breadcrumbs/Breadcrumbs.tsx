import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  type ReactElement,
} from 'react';
import { cn } from '@artisanpack-ui/tokens';

export interface BreadcrumbItem {
  /** Display label */
  label: ReactNode;
  /** URL for the link (omit for current/last item) */
  href?: string;
  /** Icon element */
  icon?: ReactNode;
  /** Custom link element (for React Router / Inertia) */
  renderLink?: (props: { className?: string; children: ReactNode; 'aria-current'?: 'page' }) => ReactElement;
}

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  /** Breadcrumb items (last item is treated as current page) */
  items: BreadcrumbItem[];
  /** Maximum items to display before collapsing with ellipsis */
  maxItems?: number;
}

/**
 * Breadcrumb navigation trail with accessible markup and optional item collapsing.
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
        <ul>
          {renderItems()}
        </ul>
      </nav>
    );
  },
);

Breadcrumbs.displayName = 'Breadcrumbs';
