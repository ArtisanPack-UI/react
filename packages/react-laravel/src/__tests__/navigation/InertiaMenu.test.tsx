import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { InertiaMenu, type InertiaMenuItemType } from '../../navigation/InertiaMenu';

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
  const NESTED = [
    { key: 'home', label: 'Home', href: '/' },
    {
      key: 'reports',
      label: 'Reports',
      badge: '2',
      children: [{ key: 'all', label: 'All reports', href: '/reports' }],
    },
  ];

  it('toggles a sub-menu on click', () => {
    render(<InertiaMenu items={NESTED} />);
    const toggle = screen.getByRole('button', { name: /Reports/ });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens a sub-menu when its child becomes active in a persistent layout, and can close it', () => {
    const { rerender } = render(<InertiaMenu items={NESTED} activeKey="home" />);
    const toggle = () => screen.getByRole('button', { name: /Reports/ });
    expect(toggle()).toHaveAttribute('aria-expanded', 'false');
    rerender(<InertiaMenu items={NESTED} activeKey="all" />);
    expect(toggle()).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(toggle());
    expect(toggle()).toHaveAttribute('aria-expanded', 'false');
  });

  it('forwards badge and disabled on parent items', () => {
    const parent: InertiaMenuItemType = { ...NESTED[1]!, disabled: true };
    render(<InertiaMenu items={[parent]} />);
    const toggle = screen.getByRole('button', { name: /Reports/ });
    expect(toggle).toBeDisabled();
    expect(toggle.querySelector('[data-part="badge"]')).toHaveTextContent('2');
  });

  it('passes handlers through to the Inertia Link', () => {
    render(<InertiaMenu items={[{ key: 'home', label: 'Home', href: '/home' }]} />);
    expect(screen.getByTestId('inertia-link-/home')).toHaveAttribute('data-part', 'item');
  });
});
