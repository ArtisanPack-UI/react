import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from './Divider';

const meta: Meta<typeof Divider> = {
  title: 'Layout/Divider',
  component: Divider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Horizontal or vertical divider line with optional label text and configurable label position. Supports DaisyUI color variants.',
      },
    },
  },
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
    vertical: {
      control: 'boolean',
    },
    label: {
      control: 'text',
    },
    labelPosition: {
      control: 'select',
      options: ['start', 'center', 'end'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Default: Story = {
  render: () => (
    <div>
      <p>Content above</p>
      <Divider />
      <p>Content below</p>
    </div>
  ),
};

export const WithLabel: Story = {
  args: {
    label: 'OR',
  },
  render: (args) => (
    <div>
      <p>Content above</p>
      <Divider {...args} />
      <p>Content below</p>
    </div>
  ),
};

export const Vertical: Story = {
  args: {
    vertical: true,
  },
  render: (args) => (
    <div className="flex items-center h-24">
      <span>Left</span>
      <Divider {...args} />
      <span>Right</span>
    </div>
  ),
};

export const ColorVariants: Story = {
  render: () => (
    <div className="space-y-2">
      <Divider color="primary" label="Primary" />
      <Divider color="secondary" label="Secondary" />
      <Divider color="accent" label="Accent" />
      <Divider color="success" label="Success" />
      <Divider color="warning" label="Warning" />
      <Divider color="error" label="Error" />
      <Divider color="info" label="Info" />
      <Divider color="neutral" label="Neutral" />
    </div>
  ),
};

export const LabelPositions: Story = {
  render: () => (
    <div className="space-y-2">
      <Divider label="Start" labelPosition="start" />
      <Divider label="Center" labelPosition="center" />
      <Divider label="End" labelPosition="end" />
    </div>
  ),
};
