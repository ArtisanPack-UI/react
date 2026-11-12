import type { Meta, StoryObj } from '@storybook/react-vite';
import { Menu } from '../../navigation/Menu/Menu';
import { Navbar } from '../../navigation/Navbar/Navbar';
import { PageHeader } from '../PageHeader/PageHeader';
import { AppShell } from './AppShell';

const meta: Meta<typeof AppShell> = {
  title: 'Layout/AppShell',
  component: AppShell,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The application frame: a sidebar and a main column as islands separated by a gutter. The sidebar holds a brand, the navigation (a Menu) and a footer, and can collapse to icons.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AppShell>;

const nav = (
  <Menu
    label="Main"
    items={[
      { label: 'Dashboard', href: '#', icon: 'house', current: true },
      { label: 'Inbox', href: '#', icon: 'inbox', badge: '4' },
      { label: 'Settings', href: '#', icon: 'settings' },
    ]}
  />
);

export const Default: Story = {
  args: {
    brand: 'Apexify',
    sidebar: nav,
    header: <Navbar layout="island" sticky={false} actions="Olivia Rhye" />,
    footer: 'Olivia Rhye',
    collapsible: true,
    style: { minBlockSize: '560px' },
    children: <PageHeader title="Dashboard" description="Income, profit and transactions." />,
  },
};

export const Collapsed: Story = { args: { ...Default.args, collapsed: true } };
