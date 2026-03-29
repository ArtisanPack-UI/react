import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '@artisanpack-ui/tokens';
import type { Size } from '@artisanpack-ui/tokens';

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Current page (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback when page changes */
  onChange?: (page: number) => void;
  /** Number of sibling pages to show on each side of current */
  siblings?: number;
  /** Show first/last page buttons */
  showEdges?: boolean;
  /** Button size */
  size?: Size;
  /** Previous button label */
  previousLabel?: ReactNode;
  /** Next button label */
  nextLabel?: ReactNode;
  /** Disable all interaction */
  disabled?: boolean;
}

const sizeMap: Record<Size, string> = {
  xs: 'btn-xs',
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
};

/**
 * Generate the array of page numbers/ellipses to display.
 */
function getPageRange(
  current: number,
  total: number,
  siblings: number,
  showEdges: boolean,
): (number | 'ellipsis')[] {
  if (total <= 1) return [1];

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
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  (
    {
      currentPage,
      totalPages,
      onChange,
      siblings = 1,
      showEdges = true,
      size,
      previousLabel = '«',
      nextLabel = '»',
      disabled = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const pages = getPageRange(currentPage, totalPages, siblings, showEdges);
    const btnSize = size ? sizeMap[size] : '';

    const handlePageClick = (page: number) => {
      if (page !== currentPage && page >= 1 && page <= totalPages && !disabled) {
        onChange?.(page);
      }
    };

    return (
      <nav
        ref={ref}
        aria-label="Pagination"
        className={className}
        {...rest}
      >
        <div className="join">
          <button
            type="button"
            className={cn('join-item btn', btnSize)}
            disabled={disabled || currentPage <= 1}
            aria-label="Previous page"
            onClick={() => handlePageClick(currentPage - 1)}
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
                className={cn(
                  'join-item btn',
                  btnSize,
                  page === currentPage && 'btn-active',
                )}
                aria-current={page === currentPage ? 'page' : undefined}
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
            disabled={disabled || currentPage >= totalPages}
            aria-label="Next page"
            onClick={() => handlePageClick(currentPage + 1)}
          >
            {nextLabel}
          </button>
        </div>
      </nav>
    );
  },
);

Pagination.displayName = 'Pagination';
