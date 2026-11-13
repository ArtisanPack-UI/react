/**
 * @module Pagination
 *
 * The design-system Pagination (#56): previous, the pages and next in a nav
 * landmark, rendering the `.apui-pagination` markup contract styled by
 * `@artisanpack-ui/css`.
 *
 * @packageDocumentation
 */

import { forwardRef, type HTMLAttributes } from 'react';

import { IconSvg } from '../../../internal/icon';
import { cx, type PartClasses } from '../../../internal/parts';

/** The parts a {@link Pagination} accepts extra classes for. */
export type PaginationPart = 'root' | 'summary' | 'previous' | 'page' | 'ellipsis' | 'next';

/** Props for the {@link Pagination} component. Native `<nav>` attributes go to the root. */
export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** The current page, from 1. Clamped to the page count. @defaultValue `1` */
  page?: number;
  /** How many pages there are. Without it, `total / perPage`. */
  pageCount?: number;
  /** How many items the whole list has. */
  total?: number;
  /** How many items a page holds. @defaultValue `10` */
  perPage?: number;
  /** Pages shown on each side of the current one. @defaultValue `1` */
  siblings?: number;
  /** Shows the summary before the pages. @defaultValue `false` */
  summary?: boolean;
  /** The nav landmark's accessible name; translate it. @defaultValue `'Pagination'` */
  label?: string;
  /** The previous button's accessible name; translate it. @defaultValue `'Previous page'` */
  previousLabel?: string;
  /** The next button's accessible name; translate it. @defaultValue `'Next page'` */
  nextLabel?: string;
  /** Each page's accessible name, with `{page}`; translate it. @defaultValue `'Page {page}'` */
  pageLabel?: string;
  /**
   * The summary, with `{from}`, `{to}`, `{total}`, `{page}` and `{pageCount}`.
   * @defaultValue `'Showing {from}–{to} of {total}'`, or `'Page {page} of {pageCount}'` without a total
   */
  summaryLabel?: string;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<PaginationPart>;
  /** A page, previous or next was chosen. Setting `page` doesn't call it. */
  onPageChange?: (page: number) => void;
}

/**
 * The pages between previous and next: the first and last pages, `siblings`
 * pages around the current one and `null` for each gap, keeping the count
 * constant as the page moves.
 */
export function paginationRange(page: number, count: number, siblings: number): (number | null)[] {
  const all = (to: number) => Array.from({ length: to }, (_, index) => index + 1);
  if (count <= 2 * siblings + 5) return all(count);
  const start = Math.max(Math.min(page - siblings, count - 2 * siblings - 2), 3);
  const end = Math.min(Math.max(page + siblings, 2 * siblings + 3), count - 2);
  const middle = Array.from({ length: end - start + 1 }, (_, index) => start + index);
  return [1, start > 3 ? null : 2, ...middle, end < count - 2 ? null : count - 1, count];
}

/**
 * Moves between the pages of a long list. The ref points at the `<nav>`.
 *
 * @example
 * ```tsx
 * <Pagination page={page} total={318} perPage={10} onPageChange={setPage} summary />
 * ```
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  (
    {
      page = 1,
      pageCount,
      total,
      perPage = 10,
      siblings = 1,
      summary = false,
      label = 'Pagination',
      previousLabel = 'Previous page',
      nextLabel = 'Next page',
      pageLabel = 'Page {page}',
      summaryLabel,
      classes = {},
      className,
      onPageChange,
      ...rest
    },
    ref,
  ) => {
    const per = Math.max(1, perPage);
    const count = Math.max(1, pageCount ?? (total !== undefined ? Math.ceil(total / per) : 1));
    const current = Math.max(1, Math.min(page, count));

    let summaryText: string | null = null;
    if (summary) {
      const from = total === 0 ? 0 : (current - 1) * per + 1;
      const to = total === undefined ? current * per : Math.min(total, current * per);
      const template =
        summaryLabel ??
        (total === undefined ? 'Page {page} of {pageCount}' : 'Showing {from}–{to} of {total}');
      summaryText = template
        .replaceAll('{from}', String(total === undefined ? from : Math.min(total, from)))
        .replaceAll('{to}', String(to))
        .replaceAll('{total}', total === undefined ? '' : String(total))
        .replaceAll('{pageCount}', String(count))
        .replaceAll('{page}', String(current));
    }

    const edge = (kind: 'previous' | 'next') => {
      const target = kind === 'previous' ? current - 1 : current + 1;
      const disabled = kind === 'previous' ? current <= 1 : current >= count;
      return (
        <button
          type="button"
          className={classes[kind]}
          data-scope="pagination"
          data-part={kind}
          aria-label={kind === 'previous' ? previousLabel : nextLabel}
          aria-disabled={disabled ? 'true' : undefined}
          data-mirror=""
          onClick={disabled ? undefined : () => onPageChange?.(target)}
        >
          <IconSvg name={kind === 'previous' ? 'chevron-left' : 'chevron-right'} />
        </button>
      );
    };

    return (
      <nav
        {...rest}
        ref={ref}
        className={cx('apui-pagination', classes.root, className)}
        aria-label={label}
      >
        {summaryText !== null ? (
          <span className={classes.summary} data-scope="pagination" data-part="summary">
            {summaryText}
          </span>
        ) : null}
        {edge('previous')}
        {paginationRange(current, count, Math.max(0, siblings)).map((item, index) =>
          item === null ? (
            <span
              key={`ellipsis-${index}`}
              className={classes.ellipsis}
              data-scope="pagination"
              data-part="ellipsis"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={classes.page}
              data-scope="pagination"
              data-part="page"
              aria-label={pageLabel.replaceAll('{page}', String(item))}
              aria-current={item === current ? 'page' : undefined}
              onClick={item === current ? undefined : () => onPageChange?.(item)}
            >
              {item}
            </button>
          ),
        )}
        {edge('next')}
      </nav>
    );
  },
);

Pagination.displayName = 'Pagination';
