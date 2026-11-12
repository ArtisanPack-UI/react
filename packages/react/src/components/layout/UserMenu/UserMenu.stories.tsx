import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { UserMenu, type UserMenuTheme } from './UserMenu';

const meta: Meta<typeof UserMenu> = {
  title: 'Layout/UserMenu',
  component: UserMenu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The account menu, composed from Avatar and DropdownMenu: identity, workspace switcher, theme, your items and Log out, last.',
      },
    },
  },
  args: {
    user: {
      name: 'Olivia Rhye',
      email: 'olivia@company.com',
      role: 'Admin · Apexify',
      status: 'online',
    },
    items: [
      { value: 'profile', label: 'Profile', icon: 'user' },
      { value: 'settings', label: 'Settings', icon: 'settings' },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof UserMenu>;

export const Sidebar: Story = {
  render: (args) => {
    const [workspace, setWorkspace] = useState('apexify');
    const [theme, setTheme] = useState<UserMenuTheme>('system');
    return (
      <UserMenu
        {...args}
        workspaces={[
          { id: 'apexify', name: 'Apexify' },
          { id: 'horizon', name: 'Horizon Homes' },
        ]}
        workspace={workspace}
        onWorkspaceChange={setWorkspace}
        theme={theme}
        onThemeChange={setTheme}
      />
    );
  },
};

export const Compact: Story = {
  args: { compact: true, align: 'end', hideTheme: true },
};

export const Open: Story = {
  args: { open: true, portal: false },
};
