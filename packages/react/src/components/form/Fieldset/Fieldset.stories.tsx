import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from '../Checkbox/Checkbox';
import { Input } from '../Input/Input';
import { Fieldset } from './Fieldset';

const meta: Meta<typeof Fieldset> = {
  title: 'Form/Fieldset',
  component: Fieldset,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Groups related fields under a native legend (title and description), as a panel, a divided section or plain.',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['panel', 'divided', 'plain'] },
  },
};

export default meta;
type Story = StoryObj<typeof Fieldset>;

export const Panel: Story = {
  render: () => (
    <Fieldset title="Contact" description="Who buyers and renters should reach.">
      <div data-scope="fieldset" data-part="row">
        <Input label="Full name" />
        <Input label="Email" type="email" leadingIcon="mail" />
      </div>
      <Input label="Phone" type="tel" />
    </Fieldset>
  ),
};

export const DividedAndPlain: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <Fieldset variant="divided" title="Billing address">
        <Checkbox label="Same as property address" />
      </Fieldset>
      <Fieldset
        variant="plain"
        title="Payout account"
        description="Locked while a payout is processing."
        disabled
      >
        <Input label="IBAN" value="ES91 •••• •••• 1332" readOnly />
      </Fieldset>
    </div>
  ),
};
