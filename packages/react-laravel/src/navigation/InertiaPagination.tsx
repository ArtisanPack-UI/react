import { forwardRef, useCallback, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { Pagination, type PaginationProps } from '@artisanpack-ui/react/navigation';
import type { LaravelPaginator } from '../types';

type PaginatorPageInfo = Pick<LaravelPaginator, 'current_page' | 'last_page' | 'path'>;

/**
 * Props for the {@link InertiaPagination} component.
 * Extends the base `PaginationProps` but replaces page state management
 * with a Laravel paginator object and Inertia router integration.
 *
 * @see {@link LaravelPaginator}
 */
export interface InertiaPaginationProps extends Omit<
  PaginationProps,
  'page' | 'pageCount' | 'onPageChange'
> {
  /**
   * Laravel paginator response object from `->paginate()`, or a paginated
   * API resource collection, whose page details are under `meta`.
   */
  paginator: PaginatorPageInfo | { meta: PaginatorPageInfo };
  /** Query parameter name for the page (default: 'page') */
  pageParam?: string;
  /** Additional query parameters to preserve during navigation */
  preserveParams?: Record<string, string | number>;
  /**
   * Keeps the current URL's query parameters, such as search, filters and
   * sort, when changing page. `preserveParams` wins over them. (default: false)
   */
  preserveQuery?: boolean;
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
 * // A paginated API resource collection (UserResource::collection), keeping the current filters
 * <InertiaPagination paginator={users} preserveQuery />
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
      preserveQuery = false,
      preserveScroll = true,
      preserveState = true,
      only,
      onChange,
      ...rest
    },
    ref,
  ) => {
    const pageInfo = 'meta' in paginator ? paginator.meta : paginator;

    // Stabilize preserveParams to avoid re-creating handlePageChange on every render
    // when consumers pass object literals
    const preserveParamsKey = useMemo(() => JSON.stringify(preserveParams ?? {}), [preserveParams]);

    const handlePageChange = useCallback(
      (page: number) => {
        if (onChange) {
          onChange(page);
          return;
        }

        const url = new URL(pageInfo.path, window.location.origin);
        if (preserveQuery) {
          new URLSearchParams(window.location.search).forEach((value, key) => {
            url.searchParams.append(key, value);
          });
        }
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
      [
        pageInfo.path,
        pageParam,
        preserveParamsKey,
        preserveQuery,
        preserveScroll,
        preserveState,
        only,
        onChange,
      ],
    );

    return (
      <Pagination
        ref={ref}
        page={pageInfo.current_page}
        pageCount={pageInfo.last_page}
        onPageChange={handlePageChange}
        {...rest}
      />
    );
  },
);

InertiaPagination.displayName = 'InertiaPagination';
