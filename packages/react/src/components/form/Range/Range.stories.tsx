import type { Meta, StoryObj } from '@storybook/react-vite';
import { Range } from './Range';

const meta: Meta<typeof Range> = {
  title: 'Form/Range',
  component: Range,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: [undefined, 'primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Range>;

export const Default: Story = {
  args: {},
};

export const WithLabel: Story = {
  args: {
    label: 'Volume',
  },
};

export const ColorVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Range label="Primary" color="primary" />
      <Range label="Secondary" color="secondary" />
      <Range label="Accent" color="accent" />
      <Range label="Success" color="success" />
      <Range label="Warning" color="warning" />
      <Range label="Error" color="error" />
      <Range label="Info" color="info" />
    </div>
  ),
};

export const WithHint: Story = {
  args: {
    label: 'Brightness',
    hint: 'Adjust the screen brightness level.',
  },
};

export const WithError: Story = {
  args: {
    label: 'Budget',
    error: 'Value must be between 100 and 500.',
  },
};

export const CustomMinMax: Story = {
  args: {
    label: 'Price Range',
    min: 0,
    max: 1000,
    step: 100,
  },
};
