import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pin } from './Pin';

const meta: Meta<typeof Pin> = {
  title: 'Form/Pin',
  component: Pin,
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
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Pin>;

export const Default: Story = {
  args: {
    length: 4,
  },
};

export const SixDigit: Story = {
  args: {
    length: 6,
  },
};

export const NumericOnly: Story = {
  args: {
    length: 4,
    numeric: true,
  },
};

export const Hidden: Story = {
  args: {
    length: 4,
    hide: true,
  },
};

export const ColorVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Pin length={4} color="primary" />
      <Pin length={4} color="secondary" />
      <Pin length={4} color="accent" />
      <Pin length={4} color="success" />
      <Pin length={4} color="warning" />
      <Pin length={4} color="error" />
      <Pin length={4} color="info" />
      <Pin length={4} color="neutral" />
    </div>
  ),
};

export const WithError: Story = {
  args: {
    length: 4,
    error: 'Invalid verification code.',
  },
};
