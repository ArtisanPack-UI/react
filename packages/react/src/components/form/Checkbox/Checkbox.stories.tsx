import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Form/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Labeled checkbox input with DaisyUI color variants, hint text, error state, right-aligned label option, and card-style variant.',
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
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: 'Accept terms and conditions',
  },
};

export const Checked: Story = {
  args: {
    label: 'Subscribed to newsletter',
    defaultChecked: true,
  },
};

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Checkbox label="Primary" color="primary" defaultChecked />
      <Checkbox label="Secondary" color="secondary" defaultChecked />
      <Checkbox label="Accent" color="accent" defaultChecked />
      <Checkbox label="Success" color="success" defaultChecked />
      <Checkbox label="Warning" color="warning" defaultChecked />
      <Checkbox label="Error" color="error" defaultChecked />
      <Checkbox label="Info" color="info" defaultChecked />
    </div>
  ),
};

export const RightAligned: Story = {
  args: {
    label: 'Label on the left',
    right: true,
  },
};

export const WithHint: Story = {
  args: {
    label: 'Enable notifications',
    hint: 'You will receive email notifications for new updates.',
  },
};

export const WithError: Story = {
  args: {
    label: 'I agree to the terms',
    error: 'You must accept the terms to continue.',
  },
};

export const Card: Story = {
  args: {
    label: 'Premium Plan',
    card: true,
    color: 'primary',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Cannot change',
    disabled: true,
    defaultChecked: true,
  },
};
