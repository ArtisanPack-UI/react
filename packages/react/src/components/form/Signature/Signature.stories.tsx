import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Signature } from './Signature';

const meta: Meta<typeof Signature> = {
  title: 'Form/Signature',
  component: Signature,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Draw, type or upload a signature. Every mode gives a PNG data URL; Type is always offered as the keyboard path.',
      },
    },
  },
  argTypes: {
    mode: { control: 'select', options: ['draw', 'type', 'upload'] },
    penColor: {
      control: 'select',
      options: [
        'default',
        'primary',
        'secondary',
        'accent',
        'neutral',
        'success',
        'warning',
        'error',
        'info',
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Signature>;

export const Default: Story = {
  args: { label: 'Signature', hint: 'Olivia Rhye · Nov 7, 2026' },
};

export const TypeFirst: Story = {
  args: { label: 'Signature', mode: 'type', modes: ['draw', 'type'], penColor: 'primary' },
};

export const Controlled: Story = {
  render: () => {
    const [signature, setSignature] = useState('');
    return (
      <div style={{ display: 'grid', gap: '1rem' }}>
        <Signature
          label="Signature"
          required
          error={signature === '' ? 'Sign to accept the lease.' : undefined}
          value={signature}
          onValueChange={setSignature}
        />
        {signature ? <img src={signature} alt="Your signature" style={{ maxWidth: 300 }} /> : null}
      </div>
    );
  },
};

export const Disabled: Story = {
  args: { label: 'Signature', disabled: true },
};
