import { createRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import {
  Navbar,
  NavbarItem,
  type NavbarLinkData,
  type NavbarProps,
} from '../../components/navigation/Navbar/Navbar';

const declaredProps: (keyof NavbarProps)[] = [
  'layout',
  'surface',
  'sticky',
  'brand',
  'links',
  'search',
  'actions',
  'label',
  'classes',
];

const LINKS: NavbarLinkData[] = [
  { label: 'Properties', href: '#properties', current: true },
  { label: 'Analytics', href: '#analytics' },
];

describe('Navbar', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Navbar, 'Navbar', { declared: { props: declaredProps, events: [] } });
  });

  it('renders the same markup from links as from composition', () => {
    expect(renderToStaticMarkup(<Navbar brand="Horizon" links={LINKS} />)).toBe(
      renderToStaticMarkup(
        <Navbar brand="Horizon">
          <NavbarItem href="#properties" current>
            Properties
          </NavbarItem>
          <NavbarItem href="#analytics">Analytics</NavbarItem>
        </Navbar>,
      ),
    );
  });

  it('renders the contract anatomy with its defaults', () => {
    const { container } = render(
      <Navbar brand="Horizon" links={LINKS} search="Search" actions={<button>Sign in</button>} />,
    );
    const root = container.querySelector('header.apui-navbar')!;
    expect(root).toHaveAttribute('data-layout', 'bar');
    expect(root).toHaveAttribute('data-surface', 'default');
    expect(root).toHaveAttribute('data-sticky', '');
    for (const part of ['brand', 'links', 'link', 'search', 'actions']) {
      expect(container.querySelector(`[data-scope="navbar"][data-part="${part}"]`)).not.toBeNull();
    }
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Properties' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: 'Analytics' })).not.toHaveAttribute('aria-current');
  });

  it('leaves out empty parts', () => {
    const { container } = render(<Navbar brand="Horizon" />);
    expect(container.querySelector('[data-part="links"]')).toBeNull();
    expect(container.querySelector('[data-part="search"]')).toBeNull();
    expect(container.querySelector('[data-part="actions"]')).toBeNull();
  });

  it('emits layout, surface and sticky, and names the nav', () => {
    const { container } = render(
      <Navbar layout="island" surface="glass" sticky={false} label="Primary" links={LINKS} />,
    );
    const root = container.querySelector('.apui-navbar')!;
    expect(root).toHaveAttribute('data-layout', 'island');
    expect(root).toHaveAttribute('data-surface', 'glass');
    expect(root).not.toHaveAttribute('data-sticky');
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
  });

  it('applies classes per part and className to the root, and forwards the ref', () => {
    const ref = createRef<HTMLElement>();
    render(<Navbar ref={ref} className="mine" classes={{ links: 'l', link: 'k' }} links={LINKS} />);
    expect(ref.current).toHaveClass('apui-navbar', 'mine');
    expect(screen.getByRole('navigation')).toHaveClass('l');
    expect(screen.getByRole('link', { name: 'Properties' })).toHaveClass('k');
  });

  it('throws when an item is rendered outside a navbar', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<NavbarItem href="#">A</NavbarItem>)).toThrow(/inside <Navbar>/);
    spy.mockRestore();
  });
  it('renders a javascript: href as a plain non-link, from data and children', () => {
    const onClick = vi.fn();
    const { container } = render(
      <Navbar links={[{ label: 'A', href: 'javascript:alert(1)' }]}>
        <NavbarItem href="javascript:alert(2)" onClick={onClick}>
          B
        </NavbarItem>
      </Navbar>,
    );
    const links = [...container.querySelectorAll('[data-part="link"]')];
    expect(links).toHaveLength(2);
    expect(links.every((link) => !link.hasAttribute('href'))).toBe(true);
    expect(container.innerHTML).not.toContain('javascript:');
    links[1]!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onClick).not.toHaveBeenCalled();
  });
});
