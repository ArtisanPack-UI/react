import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Data Display/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: [
        undefined,
        'primary',
        'secondary',
        'accent',
        'success',
        'warning',
        'error',
        'info',
        'neutral',
        'ghost',
      ],
    },
    size: {
      control: 'select',
      options: [undefined, 'xs', 'sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    value: 'Badge',
  },
};

export const Colors: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge value="Default" />
      <Badge value="Primary" color="primary" />
      <Badge value="Secondary" color="secondary" />
      <Badge value="Accent" color="accent" />
      <Badge value="Success" color="success" />
      <Badge value="Warning" color="warning" />
      <Badge value="Error" color="error" />
      <Badge value="Info" color="info" />
      <Badge value="Neutral" color="neutral" />
      <Badge value="Ghost" color="ghost" />
    </div>
  ),
};

export const Outline: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge value="Primary" color="primary" outline />
      <Badge value="Secondary" color="secondary" outline />
      <Badge value="Accent" color="accent" outline />
      <Badge value="Success" color="success" outline />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge value="XS" color="primary" size="xs" />
      <Badge value="SM" color="primary" size="sm" />
      <Badge value="MD" color="primary" size="md" />
      <Badge value="LG" color="primary" size="lg" />
    </div>
  ),
};

export const WithChildren: Story = {
  args: {
    color: 'primary',
    children: <span>Custom Content</span>,
  },
};

export const InText: Story = {
  render: () => (
    <p className="text-lg">
      Notifications <Badge value="12" color="error" size="sm" /> pending
    </p>
  ),
};
