import type { Meta, StoryObj, Decorator } from '@storybook/react-vite';
import { Menu } from './Menu';

const widthDecorator: Decorator = (Story) => (
  <div className="w-56">
    <Story />
  </div>
);

const meta: Meta<typeof Menu> = {
  title: 'Navigation/Menu',
  component: Menu,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: [undefined, 'primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info'],
    },
    size: {
      control: 'select',
      options: [undefined, 'xs', 'sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Menu>;

const basicItems = [
  { key: 'home', label: 'Home' },
  { key: 'about', label: 'About' },
  { key: 'services', label: 'Services' },
  { key: 'contact', label: 'Contact' },
];

export const Default: Story = {
  args: {
    items: basicItems,
    activeKey: 'home',
  },
  decorators: [widthDecorator],
};

export const WithTitle: Story = {
  args: {
    title: 'Navigation',
    items: basicItems,
    activeKey: 'home',
  },
  decorators: [widthDecorator],
};

export const WithIcons: Story = {
  args: {
    items: [
      { key: 'home', label: 'Home', icon: <span aria-hidden="true">🏠</span> },
      { key: 'settings', label: 'Settings', icon: <span aria-hidden="true">⚙️</span> },
      { key: 'profile', label: 'Profile', icon: <span aria-hidden="true">👤</span> },
    ],
    activeKey: 'home',
  },
  decorators: [widthDecorator],
};

export const WithDisabled: Story = {
  args: {
    items: [
      ...basicItems,
      { key: 'admin', label: 'Admin', disabled: true },
    ],
    activeKey: 'home',
  },
  decorators: [widthDecorator],
};

export const Nested: Story = {
  args: {
    items: [
      { key: 'dashboard', label: 'Dashboard' },
      {
        key: 'settings',
        label: 'Settings',
        children: [
          { key: 'general', label: 'General' },
          { key: 'security', label: 'Security' },
          { key: 'notifications', label: 'Notifications' },
        ],
      },
      { key: 'help', label: 'Help' },
    ],
    activeKey: 'dashboard',
  },
  decorators: [widthDecorator],
};

export const Horizontal: Story = {
  args: {
    items: basicItems,
    activeKey: 'home',
    horizontal: true,
  },
};

export const Compact: Story = {
  args: {
    items: basicItems,
    activeKey: 'home',
    compact: true,
  },
  decorators: [widthDecorator],
};
