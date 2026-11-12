import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressRadial } from './ProgressRadial';

const meta: Meta<typeof ProgressRadial> = {
  title: 'Data/ProgressRadial',
  component: ProgressRadial,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Circular progress with the value in the center, for a single headline percentage. The ring fills in the reading direction.',
      },
    },
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProgressRadial>;

export const Default: Story = { args: { value: 68, size: 80, thickness: 7, label: 'complete' } };

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <ProgressRadial value={68} size={40} thickness={4} hideValue label="Profile complete" />
      <ProgressRadial value={68} size={56} thickness={5} aria-label="Progress" />
      <ProgressRadial value={68} size={112} thickness={9} label="of goal" />
    </div>
  ),
};

export const Indeterminate: Story = {
  args: { indeterminate: true, size: 48, thickness: 5, 'aria-label': 'Calculating' },
};
