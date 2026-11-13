import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from './Icon';

const meta: Meta<typeof Icon> = {
  title: 'Utility/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'One Lucide icon from the registry at four sizes, plain or on a soft-colored tile. Decorative unless it has a label; directional icons mirror in RTL.',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['plain', 'tile'] },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = { args: { name: 'house' } };

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Icon key={size} name="house" size={size} />
      ))}
    </div>
  ),
};

export const Labeled: Story = {
  args: { name: 'circle-alert', color: 'error', label: 'Payment failed' },
};

export const Tiles: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Icon name="wallet" variant="tile" color="primary" />
      <Icon name="trending-up" variant="tile" color="success" />
      <Icon name="triangle-alert" variant="tile" color="warning" size="lg" />
      <Icon name="file-text" variant="tile" size="sm" />
    </div>
  ),
};

export const Directional: Story = {
  render: () => (
    <div dir="rtl" style={{ display: 'flex', gap: 12 }}>
      <Icon name="arrow-right" />
      <Icon name="chevron-left" />
    </div>
  ),
};
