import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Breadcrumbs } from '../../components/navigation/Breadcrumbs/Breadcrumbs';
import type { BreadcrumbItem } from '../../components/navigation/Breadcrumbs/Breadcrumbs';

const sampleItems: BreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Current Page' },
];

describe('Breadcrumbs', () => {
  it('renders all items', () => {
    render(<Breadcrumbs items={sampleItems} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Current Page')).toBeInTheDocument();
  });

  it('renders with aria-label', () => {
    render(<Breadcrumbs items={sampleItems} />);
    expect(screen.getByLabelText('Breadcrumbs')).toBeInTheDocument();
  });

  it('renders links for items with href', () => {
    render(<Breadcrumbs items={sampleItems} />);
    const homeLink = screen.getByText('Home').closest('a');
    expect(homeLink).toHaveAttribute('href', '/');
    const productsLink = screen.getByText('Products').closest('a');
    expect(productsLink).toHaveAttribute('href', '/products');
  });

  it('does not render link for last item', () => {
    render(<Breadcrumbs items={sampleItems} />);
    const current = screen.getByText('Current Page');
    expect(current.closest('a')).toBeNull();
  });

  it('marks last item with aria-current="page"', () => {
    render(<Breadcrumbs items={sampleItems} />);
    const current = screen.getByText('Current Page').closest('span');
    expect(current).toHaveAttribute('aria-current', 'page');
  });

  it('renders icons', () => {
    const items: BreadcrumbItem[] = [
      { label: 'Home', href: '/', icon: <span data-testid="icon">★</span> },
    ];
    render(<Breadcrumbs items={items} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('collapses items with maxItems', () => {
    const items: BreadcrumbItem[] = [
      { label: 'Root', href: '/' },
      { label: 'Level 1', href: '/1' },
      { label: 'Level 2', href: '/2' },
      { label: 'Level 3', href: '/3' },
      { label: 'Current' },
    ];
    render(<Breadcrumbs items={items} maxItems={3} />);
    expect(screen.getByText('Root')).toBeInTheDocument();
    expect(screen.getByText('…')).toBeInTheDocument();
    expect(screen.getByText('Level 3')).toBeInTheDocument();
    expect(screen.getByText('Current')).toBeInTheDocument();
    expect(screen.queryByText('Level 1')).not.toBeInTheDocument();
  });

  it('does not collapse when items <= maxItems', () => {
    render(<Breadcrumbs items={sampleItems} maxItems={5} />);
    expect(screen.queryByText('…')).not.toBeInTheDocument();
  });

  it('supports renderLink for router integration', () => {
    const items: BreadcrumbItem[] = [
      {
        label: 'Custom',
        renderLink: ({ children }) => (
          <a href="/custom" data-testid="custom-link">
            {children}
          </a>
        ),
      },
    ];
    render(<Breadcrumbs items={items} />);
    expect(screen.getByTestId('custom-link')).toHaveAttribute('href', '/custom');
  });

  it('applies custom className', () => {
    render(<Breadcrumbs items={sampleItems} className="custom-class" />);
    expect(screen.getByLabelText('Breadcrumbs')).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Breadcrumbs ref={ref} items={sampleItems} />);
    expect(ref).toHaveBeenCalled();
  });
});
