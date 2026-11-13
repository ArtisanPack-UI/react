import { useState } from 'react';
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
          'Turns one option on or off, with a description, error and the indeterminate (mixed) state.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: { label: 'Send me the monthly newsletter' },
};

export const WithDescription: Story = {
  args: {
    label: 'Email me when a property gets a new offer',
    description: 'Sent at most once a day, as a summary.',
    defaultChecked: true,
  },
};

export const WithError: Story = {
  args: { label: 'I agree to the listing terms', error: 'Required to publish.', required: true },
};

export const Disabled: Story = {
  args: { label: 'Managed by your organization', checked: true, disabled: true },
};

const rows = ['Invoices', 'Receipts', 'Contracts'];

function IndeterminateDemo() {
  const [selected, setSelected] = useState<string[]>(['Invoices']);
  const all = selected.length === rows.length;
  return (
    <div style={{ display: 'grid', gap: '0.5rem' }}>
      <Checkbox
        label="Select all"
        checked={all}
        indeterminate={selected.length > 0 && !all}
        onCheckedChange={(checked) => setSelected(checked ? rows : [])}
      />
      {rows.map((row) => (
        <Checkbox
          key={row}
          label={row}
          checked={selected.includes(row)}
          onCheckedChange={(checked) =>
            setSelected(checked ? [...selected, row] : selected.filter((item) => item !== row))
          }
        />
      ))}
    </div>
  );
}

export const Indeterminate: Story = {
  render: () => <IndeterminateDemo />,
};
