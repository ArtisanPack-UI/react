import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Step, Steps } from './Steps';

const meta: Meta<typeof Steps> = {
  title: 'Navigation/Steps',
  component: Steps,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Shows progress through a sequence. Compose it from Step children, or pass the same structure as steps.',
      },
    },
  },
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
  },
};

export default meta;
type Story = StoryObj<typeof Steps>;

export const Horizontal: Story = {
  render: (args) => (
    <Steps {...args} value={3} label="Listing progress">
      <Step title="Basics" description="Title and type" />
      <Step title="Location" description="Address and map" />
      <Step title="Pricing" description="Price and rent" />
      <Step title="Photos" description="At least 6" />
      <Step title="Review" description="Publish" />
    </Steps>
  ),
};

export const VerticalWithError: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <Steps value={3} orientation="vertical">
        <Step title="Account created" description="Nov 2 · Olivia Rhye" />
        <Step title="Identity verified" description="Nov 3" />
        <Step
          state="error"
          title="Payout account"
          description="IBAN rejected by the bank. Update it to continue."
        />
        <Step title="Go live" description="Listings become public" />
      </Steps>
    </div>
  ),
};

export const ClickableData: Story = {
  render: function Render() {
    const [step, setStep] = useState(3);
    return (
      <Steps
        value={step}
        onValueChange={setStep}
        clickable
        label="Checkout progress"
        steps={[
          { title: 'Cart' },
          { title: 'Shipping' },
          { title: 'Payment' },
          { title: 'Confirm' },
        ]}
      />
    );
  },
};
