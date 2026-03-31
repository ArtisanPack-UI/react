import type { Meta, StoryObj } from '@storybook/react-vite';
import { Progress } from './Progress';

const meta: Meta<typeof Progress> = {
  title: 'Data Display/Progress',
  component: Progress,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Determinate or indeterminate progress bar with optional label, percentage display, and step-based progression. Supports DaisyUI color variants.',
      },
    },
  },
  argTypes: {
    color: {
      control: 'select',
      options: [undefined, 'primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  args: {
    value: 65,
    max: 100,
    color: 'primary',
  },
};

export const WithLabel: Story = {
  args: {
    value: 75,
    max: 100,
    color: 'success',
    label: 'Upload Progress',
    showValue: true,
  },
};

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <Progress value={20} max={100} color="primary" />
      <Progress value={40} max={100} color="secondary" />
      <Progress value={60} max={100} color="accent" />
      <Progress value={80} max={100} color="success" />
      <Progress value={50} max={100} color="warning" />
      <Progress value={30} max={100} color="error" />
      <Progress value={70} max={100} color="info" />
    </div>
  ),
};

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
    color: 'primary',
    label: 'Loading...',
  },
};

export const Steps: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <Progress value={1} max={5} color="primary" label="Step 1 of 5" showValue />
      <Progress value={3} max={5} color="primary" label="Step 3 of 5" showValue />
      <Progress value={5} max={5} color="success" label="Complete" showValue />
    </div>
  ),
};
