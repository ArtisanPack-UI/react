import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumbs } from './Breadcrumbs';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Navigation/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {
  args: {
    items: [
      { label: 'Home', href: '/home' },
      { label: 'Products', href: '/products' },
      { label: 'Widget Pro' },
    ],
  },
};

export const WithIcons: Story = {
  args: {
    items: [
      { label: 'Home', href: '/home', icon: <span aria-hidden="true">🏠</span> },
      { label: 'Settings', href: '/settings', icon: <span aria-hidden="true">⚙️</span> },
      { label: 'Profile' },
    ],
  },
};

export const Truncated: Story = {
  args: {
    items: [
      { label: 'Home', href: '/home' },
      { label: 'Category', href: '/category' },
      { label: 'Subcategory', href: '/category/sub' },
      { label: 'Sub-subcategory', href: '/category/sub/deep' },
      { label: 'Current Page' },
    ],
    maxItems: 3,
  },
};
