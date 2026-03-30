/**
 * @module Pagination
 *
 * Page navigation component that renders numbered page buttons with previous/next controls.
 * Automatically collapses distant pages into ellipsis indicators and supports
 * configurable sibling count, button sizing, and disabled state.
 */

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@artisanpack-ui/tokens';
import type { Size } from '@artisanpack-ui/tokens';

/**
 * Props for the {@link Pagination} component.
 */
export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Current active page number (1-indexed). */
  currentPage: number;
  /** Total number of pages available. */
  totalPages: number;
  /** Callback fired when the user navigates to a different page. Receives the new page number. */
  onChange?: (page: number) => void;
  /** Number of sibling page buttons to show on each side of the current page. @defaultValue 1 */
  siblings?: number;
  /** Size variant for the page buttons (xs, sm, md, lg). */
  size?: Size;
  /** Custom label for the previous page button. @defaultValue '<<' */
  previousLabel?: ReactNode;
  /** Custom label for the next page button. @defaultValue '>>' */
  nextLabel?: ReactNode;
  /** Whether to disable all page buttons and prevent interaction. */
  disabled?: boolean;
}

const sizeMap: Record<Size, string> = {
  xs: 'btn-xs',
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
};

/**
 * Generates the array of page numbers and ellipsis placeholders to display.
 *
 * @param current - The current active page number.
 * @param total - The total number of pages.
 * @param siblings - Number of sibling pages to show on each side of the current page.
 * @returns An array of page numbers and `'ellipsis'` placeholders.
 */
function getPageRange(current: number, total: number, siblings: number): (number | 'ellipsis')[] {
  if (total <= 0) return [];
  if (total === 1) return [1];

  const pages: (number | 'ellipsis')[] = [];
  const rangeStart = Math.max(2, current - siblings);
  const rangeEnd = Math.min(total - 1, current + siblings);

  // Always show first page
  pages.push(1);
  if (rangeStart > 2) {
    pages.push('ellipsis');
  }

  for (let i = rangeStart; i <= rangeEnd; i++) {
    if (!pages.includes(i)) {
      pages.push(i);
    }
  }

  if (rangeEnd < total - 1) {
    pages.push('ellipsis');
  }
  if (!pages.includes(total)) {
    pages.push(total);
  }

  return pages;
}

/**
 * Page navigation with numbered pages, prev/next buttons, and ellipsis collapsing.
 *
 * Renders a `<nav>` element with `aria-label="Pagination"` containing a DaisyUI join group
 * of page buttons. Safely clamps the current page and disables out-of-range navigation.
 *
 * @example
 * ```tsx
 * <Pagination
 *   currentPage={3}
 *   totalPages={10}
 *   siblings={2}
 *   onChange={(page) => console.log('Navigate to page:', page)}
 *   size="sm"
 * />
 * ```
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  (
    {
      currentPage,
      totalPages,
      onChange,
      siblings = 1,
      size,
      previousLabel = '«',
      nextLabel = '»',
      disabled = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const safePage = Math.max(1, Math.min(currentPage, Math.max(1, totalPages)));
    const pages = getPageRange(safePage, totalPages, siblings);
    const btnSize = size ? sizeMap[size] : '';

    const handlePageClick = (page: number) => {
      if (page !== safePage && page >= 1 && page <= totalPages && !disabled) {
        onChange?.(page);
      }
    };

    return (
      <nav ref={ref} aria-label="Pagination" className={className} {...rest}>
        <div className="join">
          <button
            type="button"
            className={cn('join-item btn', btnSize)}
            disabled={disabled || safePage <= 1}
            aria-label="Previous page"
            onClick={() => handlePageClick(safePage - 1)}
          >
            {previousLabel}
          </button>

          {pages.map((page, index) =>
            page === 'ellipsis' ? (
              <button
                key={`ellipsis-${index}`}
                type="button"
                className={cn('join-item btn btn-disabled', btnSize)}
                disabled
                aria-hidden="true"
              >
                …
              </button>
            ) : (
              <button
                key={page}
                type="button"
                className={cn('join-item btn', btnSize, page === safePage && 'btn-active')}
                aria-current={page === safePage ? 'page' : undefined}
                aria-label={`Page ${page}`}
                disabled={disabled}
                onClick={() => handlePageClick(page)}
              >
                {page}
              </button>
            ),
          )}

          <button
            type="button"
            className={cn('join-item btn', btnSize)}
            disabled={disabled || safePage >= totalPages}
            aria-label="Next page"
            onClick={() => handlePageClick(safePage + 1)}
          >
            {nextLabel}
          </button>
        </div>
      </nav>
    );
  },
);

Pagination.displayName = 'Pagination';
