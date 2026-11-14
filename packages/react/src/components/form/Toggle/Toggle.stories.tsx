import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toggle } from './Toggle';

const meta: Meta<typeof Toggle> = {
  title: 'Form/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A switch (role=switch on a native checkbox) for settings that take effect immediately.',
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
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  args: { label: 'Dark mode' },
};

export const Settings: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <Toggle label="Weekly revenue digest" description="Every Monday at 9:00." />
      <Toggle
        label="Two-factor authentication"
        description="Required by your workspace admin."
        checked
        disabled
      />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <Toggle label="Small" size="sm" defaultChecked />
      <Toggle label="Medium" defaultChecked />
      <Toggle label="Large" size="lg" color="success" defaultChecked />
    </div>
  ),
};
