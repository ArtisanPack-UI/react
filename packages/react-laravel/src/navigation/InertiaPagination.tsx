import { forwardRef, useCallback } from 'react';
import { router } from '@inertiajs/react';
import { Pagination, type PaginationProps } from '@artisanpack-ui/react';
import type { LaravelPaginator } from '../types';

export interface InertiaPaginationProps extends Omit<
  PaginationProps,
  'currentPage' | 'totalPages' | 'onChange'
> {
  /** Laravel paginator response object */
  paginator: Pick<LaravelPaginator, 'current_page' | 'last_page' | 'path'>;
  /** Query parameter name for the page (default: 'page') */
  pageParam?: string;
  /** Additional query parameters to preserve during navigation */
  preserveParams?: Record<string, string | number>;
  /** Preserve scroll position on navigation (default: true) */
  preserveScroll?: boolean;
  /** Preserve component state on navigation (default: true) */
  preserveState?: boolean;
  /** Only reload these page prop keys */
  only?: string[];
  /** Custom onChange override (bypasses Inertia navigation) */
  onChange?: (page: number) => void;
}

/**
 * Pagination pre-wired with Inertia's router for client-side page navigation.
 * Accepts a Laravel paginator response and handles URL-based page changes.
 */
export const InertiaPagination = forwardRef<HTMLElement, InertiaPaginationProps>(
  (
    {
      paginator,
      pageParam = 'page',
      preserveParams,
      preserveScroll = true,
      preserveState = true,
      only,
      onChange,
      ...rest
    },
    ref,
  ) => {
    const handlePageChange = useCallback(
      (page: number) => {
        if (onChange) {
          onChange(page);
          return;
        }

        const url = new URL(paginator.path, window.location.origin);
        url.searchParams.set(pageParam, String(page));

        if (preserveParams) {
          Object.entries(preserveParams).forEach(([key, value]) => {
            url.searchParams.set(key, String(value));
          });
        }

        router.get(
          url.pathname + url.search,
          {},
          {
            preserveScroll,
            preserveState,
            only,
          },
        );
      },
      [paginator.path, pageParam, preserveParams, preserveScroll, preserveState, only, onChange],
    );

    return (
      <Pagination
        ref={ref}
        currentPage={paginator.current_page}
        totalPages={paginator.last_page}
        onChange={handlePageChange}
        {...rest}
      />
    );
  },
);

InertiaPagination.displayName = 'InertiaPagination';
