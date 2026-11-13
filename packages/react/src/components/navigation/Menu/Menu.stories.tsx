import type { Meta, StoryObj } from '@storybook/react-vite';
import { Menu, MenuItem, MenuSeparator, MenuSub, MenuTitle } from './Menu';

const meta: Meta<typeof Menu> = {
  title: 'Navigation/Menu',
  component: Menu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A navigation list in a nav landmark: links with icons and badges, section titles, separators and collapsible sub-menus, with the current page marked. Not for actions; use DropdownMenu.',
      },
    },
  },
  decorators: [(Story) => <div style={{ inlineSize: 260 }}>{Story()}</div>],
};

export default meta;
type Story = StoryObj<typeof Menu>;

export const Default: Story = {
  args: { label: 'Main' },
  render: (args) => (
    <Menu {...args}>
      <MenuItem href="#dashboard" icon="list">
        Dashboard
      </MenuItem>
      <MenuSub label="Properties" icon="settings">
        <MenuItem href="#properties">All properties</MenuItem>
        <MenuItem href="#lakeview" current>
          Lakeview Lofts
        </MenuItem>
        <MenuItem href="#drafts" badge="3">
          Drafts
        </MenuItem>
      </MenuSub>
      <MenuItem href="#inbox" icon="mail" badge="12">
        Inbox
      </MenuItem>
      <MenuTitle>Settings</MenuTitle>
      <MenuItem href="#team" icon="user">
        Team
      </MenuItem>
      <MenuSeparator />
      <MenuItem href="#billing" disabled>
        Billing
      </MenuItem>
    </Menu>
  ),
};

export const FromData: Story = {
  args: {
    label: 'Settings',
    collapsible: false,
    items: [
      {
        label: 'Account',
        items: [
          { label: 'Profile', href: '#profile', current: true },
          { label: 'Security', href: '#security' },
        ],
      },
      { type: 'separator' },
      { label: 'Billing', href: '#billing', icon: 'lock' },
    ],
  },
};
