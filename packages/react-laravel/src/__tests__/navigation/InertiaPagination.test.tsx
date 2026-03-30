import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InertiaPagination } from '../../navigation/InertiaPagination';

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
});
