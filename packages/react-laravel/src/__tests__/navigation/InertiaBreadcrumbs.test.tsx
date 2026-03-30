import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { InertiaBreadcrumbs } from '../../navigation/InertiaBreadcrumbs';

vi.mock('@inertiajs/react', () => ({
  Link: vi.fn(
    ({
      children,
      href,
      ...rest
    }: {
      children: React.ReactNode;
      href: string;
      [key: string]: unknown;
    }) => (
      <a href={href} data-testid={`inertia-link-${href}`} {...rest}>
        {children}
      </a>
    ),
  ),
}));

describe('InertiaBreadcrumbs', () => {
  it('renders breadcrumb items with Inertia Links', () => {
    render(
      <InertiaBreadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: 'Detail' },
        ]}
      />,
    );

    expect(screen.getByTestId('inertia-link-/')).toHaveTextContent('Home');
    expect(screen.getByTestId('inertia-link-/products')).toHaveTextContent('Products');
    expect(screen.getByText('Detail')).toBeInTheDocument();
  });

  it('renders last item as text without a link', () => {
    render(
      <InertiaBreadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Current Page' }]} />,
    );

    expect(screen.getByText('Current Page')).toBeInTheDocument();
    expect(screen.queryByTestId('inertia-link-current-page')).not.toBeInTheDocument();
  });

  it('has proper navigation aria label', () => {
    render(<InertiaBreadcrumbs items={[{ label: 'Home', href: '/' }]} />);

    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Breadcrumbs');
  });
});
