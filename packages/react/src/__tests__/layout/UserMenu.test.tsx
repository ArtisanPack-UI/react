import { renderToStaticMarkup } from 'react-dom/server';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { DropdownMenuItem } from '../../components/layout/DropdownMenu/DropdownMenu';
import { UserMenu, type UserMenuProps } from '../../components/layout/UserMenu/UserMenu';

const declaredProps: (keyof UserMenuProps)[] = [
  'user',
  'workspaces',
  'workspace',
  'hideTheme',
  'theme',
  'items',
  'compact',
  'open',
  'defaultOpen',
  'align',
  'surface',
  'portal',
  'workspaceLabel',
  'themeLabel',
  'themeLabels',
  'logoutLabel',
  'classes',
];

const USER = {
  name: 'Olivia Rhye',
  email: 'olivia@company.com',
  role: 'Admin · Apexify',
  status: 'online' as const,
};
const WORKSPACES = [
  { id: 'apexify', name: 'Apexify' },
  { id: 'horizon', name: 'Horizon Homes' },
];

const interact = (fire: () => void) =>
  act(async () => {
    fire();
  });

describe('UserMenu', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(UserMenu, 'UserMenu', {
      declared: {
        props: declaredProps,
        events: ['onOpenChange', 'onSelect', 'onWorkspaceChange', 'onThemeChange'],
      },
      ignoreDeclared: ['trigger'],
      ignoreEffects: ['defaultOpen'],
    });
  });

  it('renders a menu button trigger with the avatar, name and role', () => {
    const host = document.createElement('div');
    host.innerHTML = renderToStaticMarkup(<UserMenu user={USER} portal={false} />);
    const trigger = host.querySelector('button[data-scope="user-menu"][data-part="trigger"]')!;
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger.querySelector('[data-part="name"]')).toHaveTextContent('Olivia Rhye');
    expect(trigger.querySelector('[data-part="role"]')).toHaveTextContent('Admin · Apexify');
    expect(trigger.querySelector('[data-part="indicator"] svg')).not.toBeNull();
    const avatar = trigger.querySelector('.apui-avatar')!;
    expect(avatar).toHaveAttribute('aria-hidden', 'true');
    expect(avatar).toHaveAttribute('data-part', 'avatar');
    expect(avatar).toHaveTextContent('OR');
  });

  it('names a compact trigger after the person', () => {
    render(<UserMenu user={USER} compact portal={false} />);
    expect(screen.getByRole('button', { name: 'Olivia Rhye' })).toHaveAttribute(
      'data-avatar-only',
      '',
    );
  });

  it('renders the header, workspaces, theme control and log out last', () => {
    render(
      <UserMenu
        user={USER}
        workspaces={WORKSPACES}
        workspace="horizon"
        theme="dark"
        defaultOpen
        portal={false}
        items={[{ value: 'profile', label: 'Profile', icon: 'user' }]}
      >
        <DropdownMenuItem value="billing">Billing</DropdownMenuItem>
      </UserMenu>,
    );
    const panel = document.querySelector('.apui-dropdown-menu.apui-user-menu')!;
    expect(panel).toHaveAttribute('role', 'menu');
    expect(panel.querySelector('[data-part="header"] [data-part="email"]')).toHaveTextContent(
      'olivia@company.com',
    );
    expect(screen.getByRole('menuitemradio', { name: 'Horizon Homes' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(screen.getByRole('menuitemradio', { name: 'Dark' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    const actions = screen.getAllByRole('menuitem').map((item) => item.textContent);
    expect(actions).toEqual(['Profile', 'Billing', 'Log out']);
  });

  it('reports workspace-change, theme-change and select', async () => {
    const onWorkspaceChange = vi.fn();
    const onThemeChange = vi.fn();
    const onSelect = vi.fn();
    const menu = () => (
      <UserMenu
        user={USER}
        workspaces={WORKSPACES}
        workspace="apexify"
        defaultOpen
        portal={false}
        onWorkspaceChange={onWorkspaceChange}
        onThemeChange={onThemeChange}
        onSelect={onSelect}
        logoutLabel="Abmelden"
      />
    );
    const first = render(menu());
    await interact(() =>
      fireEvent.click(screen.getByRole('menuitemradio', { name: 'Horizon Homes' })),
    );
    expect(onWorkspaceChange).toHaveBeenCalledWith('horizon');
    first.unmount();

    const second = render(menu());
    await interact(() => fireEvent.click(screen.getByRole('menuitemradio', { name: 'Light' })));
    expect(onThemeChange).toHaveBeenCalledWith('light');
    expect(onSelect).not.toHaveBeenCalled();
    second.unmount();

    render(menu());
    await interact(() => fireEvent.click(screen.getByRole('menuitem', { name: 'Abmelden' })));
    expect(onSelect).toHaveBeenCalledWith('logout');
  });

  it('leaves out one workspace and a hidden theme control', () => {
    render(
      <UserMenu user={USER} workspaces={[WORKSPACES[0]!]} hideTheme defaultOpen portal={false} />,
    );
    expect(screen.queryAllByRole('menuitemradio')).toHaveLength(0);
    expect(document.querySelector('[data-part="theme"]')).toBeNull();
  });
});
