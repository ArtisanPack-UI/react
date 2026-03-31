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
          'Toggle switch input with label, hint, error state, DaisyUI color variants, and disabled mode.',
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
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  args: {
    label: 'Dark mode',
  },
};

export const Checked: Story = {
  args: {
    label: 'Notifications enabled',
    defaultChecked: true,
    color: 'success',
  },
};

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Toggle label="Primary" color="primary" defaultChecked />
      <Toggle label="Secondary" color="secondary" defaultChecked />
      <Toggle label="Accent" color="accent" defaultChecked />
      <Toggle label="Success" color="success" defaultChecked />
      <Toggle label="Warning" color="warning" defaultChecked />
      <Toggle label="Error" color="error" defaultChecked />
      <Toggle label="Info" color="info" defaultChecked />
    </div>
  ),
};

export const WithHint: Story = {
  args: {
    label: 'Auto-save',
    hint: 'Automatically save changes every 30 seconds.',
    color: 'primary',
  },
};

export const WithError: Story = {
  args: {
    label: 'Enable feature',
    error: 'This feature requires a premium plan.',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Maintenance mode',
    disabled: true,
    defaultChecked: true,
  },
};
