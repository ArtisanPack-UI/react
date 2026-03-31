import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { InertiaMenu } from '../../navigation/InertiaMenu';

vi.mock('@inertiajs/react', () => ({
  Link: vi.fn(
    ({
      children,
      href,
      className,
      ...rest
    }: {
      children: React.ReactNode;
      href: string;
      className?: string;
      [key: string]: unknown;
    }) => (
      <a href={href} className={className} data-testid={`inertia-link-${href}`} {...rest}>
        {children}
      </a>
    ),
  ),
}));

describe('InertiaMenu', () => {
  it('renders menu items with Inertia Links for href items', () => {
    render(
      <InertiaMenu
        items={[
          { key: 'home', label: 'Home', href: '/home' },
          { key: 'about', label: 'About', href: '/about' },
        ]}
      />,
    );

    expect(screen.getByTestId('inertia-link-/home')).toHaveTextContent('Home');
    expect(screen.getByTestId('inertia-link-/about')).toHaveTextContent('About');
  });

  it('renders items without href as buttons', () => {
    render(<InertiaMenu items={[{ key: 'action', label: 'Do Something' }]} />);

    expect(screen.getByRole('button', { name: /do something/i })).toBeInTheDocument();
  });

  it('renders nested items with Inertia Links', () => {
    render(
      <InertiaMenu
        items={[
          {
            key: 'parent',
            label: 'Parent',
            children: [{ key: 'child', label: 'Child', href: '/child' }],
          },
        ]}
      />,
    );

    expect(screen.getByTestId('inertia-link-/child')).toHaveTextContent('Child');
  });

  it('passes activeKey through to the menu', () => {
    render(
      <InertiaMenu
        items={[
          { key: 'home', label: 'Home', href: '/' },
          { key: 'about', label: 'About', href: '/about' },
        ]}
        activeKey="home"
      />,
    );

    const homeLink = screen.getByTestId('inertia-link-/');
    expect(homeLink).toHaveAttribute('aria-current', 'page');
  });
});
