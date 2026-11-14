import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../form/Button/Button';
import { Menu } from '../Menu/Menu';
import { Sidebar } from './Sidebar';

const meta: Meta<typeof Sidebar> = {
  title: 'Navigation/Sidebar (deprecated)',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Deprecated alias of AppShell: sidebarContent maps to sidebar, open to collapsed and a Tailwind width class to sidebarWidth; side and overlay are ignored.',
      },
    },
  },
  argTypes: {
    open: {
      control: 'boolean',
    },
    side: {
      control: 'select',
      options: ['left', 'right'],
    },
    width: {
      control: 'text',
    },
    overlay: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

const sampleMenu = (
  <Menu
    label="Main"
    items={[
      { key: 'home', label: 'Home', href: '#home', current: true },
      { key: 'dashboard', label: 'Dashboard', href: '#dashboard' },
      { key: 'settings', label: 'Settings', href: '#settings' },
      { key: 'profile', label: 'Profile', href: '#profile' },
    ]}
  />
);

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <Sidebar open={open} onOpenChange={setOpen} sidebarContent={sampleMenu}>
        <Button onClick={() => setOpen(!open)}>{open ? 'Collapse' : 'Expand'} sidebar</Button>
        <p>Main content area. Sidebar renders an AppShell; open maps to its collapsed state.</p>
      </Sidebar>
    );
  },
};

export const Width: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <Sidebar open={open} onOpenChange={setOpen} width="w-64" sidebarContent={sampleMenu}>
        <p>The 1.x Tailwind width class w-64 becomes a 16rem sidebar.</p>
      </Sidebar>
    );
  },
};
