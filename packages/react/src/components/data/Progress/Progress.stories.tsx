import type { Meta, StoryObj } from '@storybook/react-vite';
import { Progress } from './Progress';

const meta: Meta<typeof Progress> = {
  title: 'Data/Progress',
  component: Progress,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Linear progress: determinate, indeterminate or segmented. The root is the progressbar, named by its label or aria-label.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Labeled: Story = {
  args: { value: 64, label: 'Uploading 12 photos', valueText: '8 of 12' },
};

export const Indeterminate: Story = {
  args: { indeterminate: true, label: 'Preparing export', valueText: 'Estimating…' },
};

export const Segmented: Story = {
  args: { segmented: true, value: 3, max: 5, label: 'Listing setup', valueText: '3 of 5' },
};

export const ColorsAndSizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Progress value={40} size="sm" aria-label="Small" />
      <Progress value={70} color="success" aria-label="Success" />
      <Progress value={25} color="error" size="lg" aria-label="Error" />
    </div>
  ),
};
