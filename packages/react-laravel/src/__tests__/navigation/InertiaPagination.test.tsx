import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { InertiaPagination } from '../../navigation/InertiaPagination';
import type { LaravelResourcePaginator } from '../../types';

const mockRouterGet = vi.fn();

vi.mock('@inertiajs/react', () => ({
  router: {
    get: (...args: unknown[]) => mockRouterGet(...args),
  },
}));

describe('InertiaPagination', () => {
  beforeEach(() => {
    mockRouterGet.mockClear();
  });

  const paginator = {
    current_page: 2,
    last_page: 5,
    path: '/posts',
  };

  it('renders pagination with correct current page and total', () => {
    render(<InertiaPagination paginator={paginator} />);

    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
  });

  it('calls router.get when clicking a page button', () => {
    render(<InertiaPagination paginator={paginator} />);

    fireEvent.click(screen.getByRole('button', { name: 'Page 3' }));

    expect(mockRouterGet).toHaveBeenCalledWith(
      expect.stringContaining('/posts'),
      {},
      expect.objectContaining({
        preserveScroll: true,
        preserveState: true,
      }),
    );
  });

  it('includes page param in URL', () => {
    render(<InertiaPagination paginator={paginator} />);

    fireEvent.click(screen.getByRole('button', { name: 'Page 3' }));

    const url = mockRouterGet.mock.calls[0][0] as string;
    expect(url).toContain('page=3');
  });

  it('uses custom pageParam name', () => {
    render(<InertiaPagination paginator={paginator} pageParam="p" />);

    fireEvent.click(screen.getByRole('button', { name: 'Page 3' }));

    const url = mockRouterGet.mock.calls[0][0] as string;
    expect(url).toContain('p=3');
  });

  it('preserves additional params', () => {
    render(
      <InertiaPagination
        paginator={paginator}
        preserveParams={{ search: 'hello', sort: 'name' }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Page 3' }));

    const url = mockRouterGet.mock.calls[0][0] as string;
    expect(url).toContain('search=hello');
    expect(url).toContain('sort=name');
  });

  it('calls custom onChange instead of router when provided', () => {
    const onChange = vi.fn();
    render(<InertiaPagination paginator={paginator} onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Page 3' }));

    expect(onChange).toHaveBeenCalledWith(3);
    expect(mockRouterGet).not.toHaveBeenCalled();
  });

  it('passes only prop to router options', () => {
    render(<InertiaPagination paginator={paginator} only={['posts']} />);

    fireEvent.click(screen.getByRole('button', { name: 'Page 3' }));

    expect(mockRouterGet).toHaveBeenCalledWith(
      expect.any(String),
      {},
      expect.objectContaining({ only: ['posts'] }),
    );
  });

  it('reads the page details from a paginated API resource collection', () => {
    const orders: LaravelResourcePaginator<{ id: number }> = {
      data: [{ id: 1 }],
      links: {
        first: '/orders?page=1',
        last: '/orders?page=6',
        prev: '/orders?page=3',
        next: '/orders?page=5',
      },
      meta: {
        current_page: 4,
        last_page: 6,
        per_page: 25,
        total: 150,
        from: 76,
        to: 100,
        path: '/orders',
        links: [{ url: '/orders?page=3', label: 'Previous', page: 3, active: false }],
      },
    };
    render(<InertiaPagination paginator={orders} />);

    expect(screen.getByRole('button', { name: 'Page 4' })).toHaveAttribute('aria-current', 'page');

    fireEvent.click(screen.getByRole('button', { name: 'Page 5' }));

    const url = mockRouterGet.mock.calls[0][0] as string;
    expect(url).toBe('/orders?page=5');
  });

  it('uses top-level page details over an unrelated meta field', () => {
    const orders = {
      current_page: 4,
      last_page: 6,
      path: '/orders',
      meta: { description: 'Orders' },
    };
    render(<InertiaPagination paginator={orders} />);

    expect(screen.getByRole('button', { name: 'Page 4' })).toHaveAttribute('aria-current', 'page');
  });

  describe('preserveQuery', () => {
    beforeEach(() => {
      window.history.replaceState(
        {},
        '',
        '/posts?q=shoes&filters%5Bstatus%5D%5B%5D=paid&filters%5Bstatus%5D%5B%5D=open&page=2&sort=total',
      );
    });

    afterEach(() => {
      window.history.replaceState({}, '', '/');
    });

    it('drops the current query by default', () => {
      render(<InertiaPagination paginator={paginator} />);

      fireEvent.click(screen.getByRole('button', { name: 'Page 3' }));

      expect(mockRouterGet.mock.calls[0][0]).toBe('/posts?page=3');
    });

    it('keeps the current query, including repeated keys, and replaces the page', () => {
      render(<InertiaPagination paginator={paginator} preserveQuery />);

      fireEvent.click(screen.getByRole('button', { name: 'Page 3' }));

      const url = new URL(mockRouterGet.mock.calls[0][0] as string, 'http://localhost');
      expect(url.pathname).toBe('/posts');
      expect(url.searchParams.get('q')).toBe('shoes');
      expect(url.searchParams.getAll('filters[status][]')).toEqual(['paid', 'open']);
      expect(url.searchParams.getAll('page')).toEqual(['3']);
      expect(url.searchParams.get('sort')).toBe('total');
    });

    it('replaces path values for keys in the current query and keeps the rest', () => {
      render(
        <InertiaPagination
          paginator={{ ...paginator, path: '/posts?sort=stale&scope=mine' }}
          preserveQuery
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Page 3' }));

      const url = new URL(mockRouterGet.mock.calls[0][0] as string, 'http://localhost');
      expect(url.searchParams.getAll('sort')).toEqual(['total']);
      expect(url.searchParams.get('scope')).toBe('mine');
      expect(url.searchParams.getAll('filters[status][]')).toEqual(['paid', 'open']);
    });

    it('lets preserveParams win over the current query', () => {
      render(
        <InertiaPagination paginator={paginator} preserveQuery preserveParams={{ sort: 'date' }} />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Page 3' }));

      const url = new URL(mockRouterGet.mock.calls[0][0] as string, 'http://localhost');
      expect(url.searchParams.getAll('sort')).toEqual(['date']);
    });
  });
});
