import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import {
  Pagination,
  paginationRange,
  type PaginationProps,
} from '../../components/navigation/Pagination/Pagination';

const declaredProps: (keyof PaginationProps)[] = [
  'page',
  'pageCount',
  'total',
  'perPage',
  'siblings',
  'summary',
  'label',
  'previousLabel',
  'nextLabel',
  'pageLabel',
  'summaryLabel',
  'classes',
];

const sequence = (container: HTMLElement) =>
  [...container.querySelector('nav')!.children].map(
    (el) => `${el.getAttribute('data-part')}:${el.textContent}`,
  );

describe('Pagination', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Pagination, 'Pagination', {
      declared: { props: declaredProps, events: ['onPageChange'] },
    });
  });

  it('renders a named nav with previous, the pages and next', () => {
    const { container } = render(<Pagination page={3} total={318} perPage={10} />);
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toHaveClass('apui-pagination');
    expect(sequence(container)).toEqual([
      'previous:',
      'page:1',
      'page:2',
      'page:3',
      'page:4',
      'page:5',
      'ellipsis:…',
      'page:32',
      'next:',
    ]);
  });

  it('marks the current page and names every control', () => {
    render(<Pagination page={3} total={318} />);
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Previous page' })).toHaveAttribute('data-mirror');
    expect(screen.getByRole('button', { name: 'Next page' })).toBeInTheDocument();
  });

  it('reports page-change from pages, previous and next', async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={3} pageCount={10} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Page 4' }));
    await userEvent.click(screen.getByRole('button', { name: 'Previous page' }));
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    await userEvent.click(screen.getByRole('button', { name: 'Page 3' }));
    expect(onPageChange.mock.calls).toEqual([[4], [2], [4]]);
  });

  it('keeps previous and next focusable but inert at the ends', async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={1} pageCount={1} onPageChange={onPageChange} />);
    const previous = screen.getByRole('button', { name: 'Previous page' });
    expect(previous).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('button', { name: 'Next page' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    await userEvent.click(previous);
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('prefers pageCount and clamps the page', () => {
    render(<Pagination page={9} pageCount={3} total={1000} />);
    expect(screen.getAllByRole('button', { name: /^Page / })).toHaveLength(3);
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page');
  });

  it('keeps one width as the page moves', () => {
    expect(paginationRange(1, 20, 1)).toEqual([1, 2, 3, 4, 5, null, 20]);
    expect(paginationRange(10, 20, 1)).toEqual([1, null, 9, 10, 11, null, 20]);
    expect(paginationRange(20, 20, 1)).toEqual([1, null, 16, 17, 18, 19, 20]);
    expect(paginationRange(2, 6, 1)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('shows a translatable summary', () => {
    const { container, rerender } = render(<Pagination page={32} total={318} summary />);
    const summary = () => container.querySelector('[data-part="summary"]')!.textContent;
    expect(summary()).toBe('Showing 311–318 of 318');
    rerender(<Pagination page={2} pageCount={32} summary />);
    expect(summary()).toBe('Page 2 of 32');
    rerender(
      <Pagination page={2} pageCount={32} summary summaryLabel="Seite {page} von {pageCount}" />,
    );
    expect(summary()).toBe('Seite 2 von 32');
  });

  it('takes translated labels', () => {
    render(
      <Pagination
        pageCount={2}
        label="Seiten"
        previousLabel="Zurück"
        nextLabel="Weiter"
        pageLabel="Seite {page}"
      />,
    );
    expect(screen.getByRole('navigation', { name: 'Seiten' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Zurück' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Seite 2' })).toBeInTheDocument();
  });

  it('forwards the ref to the nav', () => {
    const ref = createRef<HTMLElement>();
    render(<Pagination ref={ref} pageCount={2} />);
    expect(ref.current?.tagName).toBe('NAV');
  });
});
