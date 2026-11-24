import { describe, it, expectTypeOf } from 'vitest';
import type { LaravelSimplePaginator, PaginatorLink } from '../../types';

describe('paginator types', () => {
  it('accepts a simple paginator from before Laravel 12.15, without current_page_url', () => {
    const fromLaravel12: LaravelSimplePaginator<{ id: number }> = {
      data: [{ id: 1 }],
      current_page: 1,
      per_page: 15,
      from: 1,
      to: 1,
      first_page_url: '/posts?page=1',
      next_page_url: null,
      prev_page_url: null,
      path: '/posts',
    };
    expectTypeOf(fromLaravel12).toEqualTypeOf<LaravelSimplePaginator<{ id: number }>>();
  });

  it('accepts links from before Laravel 12.23, without page', () => {
    const link: PaginatorLink = { url: '/posts?page=2', label: '2', active: false };
    expectTypeOf(link).toEqualTypeOf<PaginatorLink>();
  });
});
