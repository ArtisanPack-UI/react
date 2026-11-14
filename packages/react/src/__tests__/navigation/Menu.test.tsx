import { createRef, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import {
  Menu,
  MenuItem,
  MenuSeparator,
  MenuSub,
  MenuTitle,
  type MenuItemData,
  type MenuProps,
} from '../../components/navigation/Menu/Menu';

const declaredProps: (keyof MenuProps)[] = ['items', 'collapsible', 'label', 'classes'];

const ITEMS: MenuItemData[] = [
  { label: 'Dashboard', href: '#dashboard', icon: 'list' },
  {
    label: 'Properties',
    icon: 'settings',
    items: [
      { label: 'All properties', href: '#properties' },
      { label: 'Lakeview Lofts', href: '#lakeview', current: true },
    ],
  },
  { label: 'Analytics', items: [{ label: 'Reports', href: '#reports' }] },
  { label: 'Inbox', href: '#inbox', icon: 'mail', badge: '12' },
  { type: 'title', label: 'Settings' },
  { type: 'separator' },
  { label: 'Billing', href: '#billing', disabled: true },
];

function Composed(props: Omit<MenuProps, 'items'>) {
  return (
    <Menu {...props}>
      <MenuItem href="#dashboard" icon="list">
        Dashboard
      </MenuItem>
      <MenuSub label="Properties" icon="settings">
        <MenuItem href="#properties">All properties</MenuItem>
        <MenuItem href="#lakeview" current>
          Lakeview Lofts
        </MenuItem>
      </MenuSub>
      <MenuSub label="Analytics">
        <MenuItem href="#reports">Reports</MenuItem>
      </MenuSub>
      <MenuItem href="#inbox" icon="mail" badge="12">
        Inbox
      </MenuItem>
      <MenuTitle>Settings</MenuTitle>
      <MenuSeparator />
      <MenuItem href="#billing" disabled>
        Billing
      </MenuItem>
    </Menu>
  );
}

const withoutIds = (html: string) => html.replace(/_R_[0-9a-zA-Z]+_/g, '#');
const toggle = (name: string) => screen.getByRole('button', { name });

describe('Menu', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Menu, 'Menu', { declared: { props: declaredProps, events: [] } });
  });

  it('renders the same markup from items as from composition', () => {
    expect(withoutIds(renderToStaticMarkup(<Menu items={ITEMS} label="Main" />))).toBe(
      withoutIds(renderToStaticMarkup(<Composed label="Main" />)),
    );
  });

  it('renders a labelled nav landmark with the contract parts', () => {
    const { container } = render(<Composed label="Main" />);
    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(nav).toHaveClass('apui-menu');
    expect(nav).toHaveAttribute('data-collapsible', '');
    for (const part of [
      'list',
      'item',
      'icon',
      'item-text',
      'badge',
      'chevron',
      'sub',
      'title',
      'separator',
    ]) {
      expect(container.querySelector(`[data-scope="menu"][data-part="${part}"]`)).not.toBeNull();
    }
    expect(screen.getByRole('link', { name: 'Lakeview Lofts' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(container.querySelector('[data-part="separator"]')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('opens a sub-menu holding the current page and keeps the others closed', () => {
    render(<Composed />);
    expect(toggle('Properties')).toHaveAttribute('aria-expanded', 'true');
    expect(toggle('Analytics')).toHaveAttribute('aria-expanded', 'false');
    const sub = document.getElementById(toggle('Analytics').getAttribute('aria-controls')!)!;
    expect(sub).toHaveAttribute('hidden');
  });

  it('toggles a sub-menu from its button and reports it', () => {
    const onOpenChange = vi.fn();
    render(
      <Menu>
        <MenuSub label="Analytics" onOpenChange={onOpenChange}>
          <MenuItem href="#reports">Reports</MenuItem>
        </MenuSub>
      </Menu>,
    );
    fireEvent.click(toggle('Analytics'));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(toggle('Analytics')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'Reports' })).toBeVisible();
    fireEvent.click(toggle('Analytics'));
    expect(toggle('Analytics')).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows every sub-menu with a plain heading when not collapsible', () => {
    const { container } = render(<Composed collapsible={false} />);
    expect(screen.queryByRole('button')).toBeNull();
    expect(container.querySelector('nav')).not.toHaveAttribute('data-collapsible');
    for (const sub of container.querySelectorAll('[data-part="sub"]')) {
      expect(sub).not.toHaveAttribute('hidden');
    }
    expect(container.querySelector('[data-part="chevron"]')).toBeNull();
  });

  it('disables a link: no href, aria-disabled and out of the Tab order', () => {
    const { container } = render(<Composed />);
    const billing = container.querySelector('[aria-disabled="true"]')!;
    expect(billing).not.toHaveAttribute('href');
    expect(billing).toHaveAttribute('tabindex', '-1');
  });

  it('renders an item without href as a button', () => {
    const onClick = vi.fn();
    render(
      <Menu>
        <MenuItem onClick={onClick}>Sign out</MenuItem>
      </Menu>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));
    expect(onClick).toHaveBeenCalled();
  });

  it('renders a link through renderLink with the same parts, from data and composition', () => {
    const renderLink = vi.fn((props: { href: string; children: ReactNode }) => (
      <a {...props} data-router="" />
    ));
    const { container } = render(
      <Menu items={[{ label: 'Team', href: '/team', current: true, renderLink }]}>
        <MenuItem href="/billing" renderLink={renderLink}>
          Billing
        </MenuItem>
        <MenuItem href="/off" disabled renderLink={renderLink}>
          Off
        </MenuItem>
      </Menu>,
    );
    const links = container.querySelectorAll('[data-router]');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '/team');
    expect(links[0]).toHaveAttribute('data-part', 'item');
    expect(links[0]).toHaveAttribute('aria-current', 'page');
    expect(links[1]).toHaveAttribute('href', '/billing');
    // A disabled item never routes: it stays the plain disabled link.
    expect(screen.getByText('Off').closest('a')).toHaveAttribute('aria-disabled', 'true');
    expect(renderLink).toHaveBeenCalledTimes(2);
  });

  it('applies classes per part and className to the root, and forwards the ref', () => {
    const ref = createRef<HTMLElement>();
    render(
      <Menu
        items={ITEMS}
        ref={ref}
        className="mine"
        classes={{ list: 'l', item: 'i', sub: 's' }}
      />,
    );
    expect(ref.current).toHaveClass('apui-menu', 'mine');
    expect(ref.current!.querySelector('[data-part="list"]')).toHaveClass('l');
    expect(ref.current!.querySelector('[data-part="item"]')).toHaveClass('i');
    expect(ref.current!.querySelector('[data-part="sub"]')).toHaveClass('s');
  });

  it('throws when an item is rendered outside a menu', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<MenuItem href="#">A</MenuItem>)).toThrow(/inside <Menu>/);
    spy.mockRestore();
  });
  it('renders a javascript: href as a plain non-link, without its handlers', () => {
    const onClick = vi.fn();
    const { container } = render(
      <Menu>
        <MenuItem href="javascript:alert(1)" onClick={onClick}>
          Bad
        </MenuItem>
      </Menu>,
    );
    const item = container.querySelector('[data-part="item"]')!;
    expect(item.tagName).toBe('A');
    expect(item.hasAttribute('href')).toBe(false);
    expect(container.innerHTML).not.toContain('javascript:');
    fireEvent.click(item);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('drops a javascript: href from items data, renderLink included', () => {
    const renderLink = vi.fn((props: { href: string; children: ReactNode }) => (
      <a href={props.href}>{props.children}</a>
    ));
    const html = renderToStaticMarkup(
      <Menu items={[{ label: 'Bad', href: 'javascript:alert(1)', renderLink }]} />,
    );
    expect(html).not.toContain('javascript:');
    expect(renderLink).not.toHaveBeenCalled();
  });

  it('ignores clicks on a disabled item', () => {
    const onClick = vi.fn();
    render(
      <Menu>
        <MenuItem href="/billing" disabled onClick={onClick}>
          Billing
        </MenuItem>
        <MenuItem disabled onClick={onClick}>
          Action
        </MenuItem>
      </Menu>,
    );
    for (const name of ['Billing', 'Action']) fireEvent.click(screen.getByText(name));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('passes attributes, handlers and the ref through renderLink', () => {
    const onClick = vi.fn();
    const ref = createRef<HTMLElement>();
    render(
      <Menu>
        <MenuItem
          ref={ref}
          href="/inbox"
          title="Inbox link"
          onClick={onClick}
          renderLink={({ ref: linkRef, ...props }) => (
            <a {...props} ref={linkRef as never} data-router="" />
          )}
        >
          Inbox
        </MenuItem>
      </Menu>,
    );
    const link = screen.getByTitle('Inbox link');
    expect(link).toHaveAttribute('data-router');
    expect(ref.current).toBe(link);
    fireEvent.click(link);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('toggles a sub-menu on click', () => {
    render(
      <Menu>
        <MenuSub label="Reports">
          <MenuItem href="/r">All</MenuItem>
        </MenuSub>
      </Menu>,
    );
    const toggle = screen.getByRole('button', { name: 'Reports' });
    const list = document.getElementById(toggle.getAttribute('aria-controls')!)!;
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(list.hidden).toBe(true);
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(list.hidden).toBe(false);
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens a sub-menu when its child becomes current, as in a persistent layout', () => {
    const items = (current: boolean): MenuItemData[] => [
      { key: 'reports', label: 'Reports', items: [{ label: 'All', href: '/r', current }] },
    ];
    const { rerender } = render(<Menu items={items(false)} />);
    const toggle = screen.getByRole('button', { name: 'Reports' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    rerender(<Menu items={items(true)} />);
    expect(screen.getByRole('button', { name: 'Reports' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('forwards a sub-menu badge and disables its toggle', () => {
    render(<Menu items={[{ label: 'Reports', badge: '2', disabled: true, items: [] }]} />);
    const toggle = screen.getByRole('button', { name: /Reports/ });
    expect(toggle).toBeDisabled();
    expect(toggle.querySelector('[data-part="badge"]')).toHaveTextContent('2');
  });
});
