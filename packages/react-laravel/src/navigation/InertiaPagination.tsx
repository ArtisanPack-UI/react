import { forwardRef, useCallback, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { Pagination, type PaginationProps } from '@artisanpack-ui/react';
import type { LaravelPaginator } from '../types';

/**
 * Props for the {@link InertiaPagination} component.
 * Extends the base `PaginationProps` but replaces page state management
 * with a Laravel paginator object and Inertia router integration.
 *
 * @see {@link LaravelPaginator}
 */
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
 *
 * When a page is selected, the component uses `router.get()` to navigate while
 * preserving scroll position and component state by default.
 *
 * @see {@link InertiaPaginationProps} for available props
 *
 * @example
 * ```tsx
 * // Basic usage with Laravel paginator
 * <InertiaPagination paginator={users} />
 *
 * // With preserved query params and partial reloads
 * <InertiaPagination
 *   paginator={users}
 *   preserveParams={{ search: 'john', sort: 'name' }}
 *   only={['users']}
 * />
 * ```
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
    // Stabilize preserveParams to avoid re-creating handlePageChange on every render
    // when consumers pass object literals
    const preserveParamsKey = useMemo(() => JSON.stringify(preserveParams ?? {}), [preserveParams]);

    const handlePageChange = useCallback(
      (page: number) => {
        if (onChange) {
          onChange(page);
          return;
        }

        const url = new URL(paginator.path, window.location.origin);
        url.searchParams.set(pageParam, String(page));

        const params: Record<string, string | number> = preserveParams ?? {};
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.set(key, String(value));
        });

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
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [paginator.path, pageParam, preserveParamsKey, preserveScroll, preserveState, only, onChange],
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
