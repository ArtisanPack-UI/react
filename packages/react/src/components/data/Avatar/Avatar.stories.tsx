import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Data Display/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: [undefined, 'primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info', 'neutral'],
    },
    size: {
      control: 'select',
      options: [undefined, 'xs', 'sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    placeholder: 'JM',
    color: 'primary',
  },
};

export const WithImage: Story = {
  args: {
    image:
      'data:image/svg+xml,' +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="96" height="96" fill="#6366f1"/><text x="48" y="54" text-anchor="middle" fill="#fff" font-size="32" font-family="sans-serif">JM</text></svg>',
      ),
    alt: 'User avatar',
  },
};

export const WithTitleSubtitle: Story = {
  args: {
    placeholder: 'JM',
    color: 'primary',
    title: 'Jane Miller',
    subtitle: 'Product Designer',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar placeholder="XS" color="primary" size="xs" />
      <Avatar placeholder="SM" color="secondary" size="sm" />
      <Avatar placeholder="MD" color="accent" size="md" />
      <Avatar placeholder="LG" color="success" size="lg" />
    </div>
  ),
};

export const WithRing: Story = {
  args: {
    placeholder: 'R',
    color: 'primary',
    ring: true,
  },
};

export const OnlineStatus: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar placeholder="ON" color="success" online />
      <Avatar placeholder="OF" color="neutral" offline />
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Avatar placeholder="P" color="primary" />
      <Avatar placeholder="S" color="secondary" />
      <Avatar placeholder="A" color="accent" />
      <Avatar placeholder="Su" color="success" />
      <Avatar placeholder="W" color="warning" />
      <Avatar placeholder="E" color="error" />
      <Avatar placeholder="I" color="info" />
    </div>
  ),
};
