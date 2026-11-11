import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pin } from './Pin';

const meta: Meta<typeof Pin> = {
  title: 'Form/Pin',
  component: Pin,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'One-time code entry: one native input with autocomplete=one-time-code drives the cells, so autofill and paste fill every cell.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md'] },
    type: { control: 'select', options: ['numeric', 'alphanumeric'] },
  },
};

export default meta;
type Story = StoryObj<typeof Pin>;

export const Default: Story = {
  args: {
    label: 'Verification code',
    hint: 'Enter the 6-digit code we sent to your phone.',
    groupSize: 3,
  },
};

export const MaskedAndAlphanumeric: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <Pin label="PIN" length={4} mask />
      <Pin label="Recovery code" length={8} type="alphanumeric" groupSize={4} />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <Pin
        label="Verification code"
        groupSize={3}
        defaultValue="991027"
        error="That code has expired. We sent a new one."
      />
      <Pin label="Small" size="sm" groupSize={3} />
      <Pin label="Disabled" value="503186" groupSize={3} disabled />
    </div>
  ),
};
