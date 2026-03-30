import type { Meta, StoryObj } from '@storybook/react-vite';
import { Steps } from './Steps';

const meta: Meta<typeof Steps> = {
  title: 'Navigation/Steps',
  component: Steps,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: [undefined, 'primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info'],
    },
    size: {
      control: 'select',
      options: [undefined, 'xs', 'sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Steps>;

const checkoutSteps = [
  { label: 'Cart' },
  { label: 'Shipping' },
  { label: 'Payment' },
  { label: 'Confirm' },
];

export const Default: Story = {
  args: {
    steps: checkoutSteps,
    currentStep: 2,
    color: 'primary',
  },
};

export const AllComplete: Story = {
  args: {
    steps: checkoutSteps,
    currentStep: 4,
    color: 'success',
  },
};

export const Vertical: Story = {
  args: {
    steps: checkoutSteps,
    currentStep: 1,
    vertical: true,
    color: 'primary',
  },
};

export const WithCustomContent: Story = {
  args: {
    steps: [
      { label: 'Register', dataContent: '1' },
      { label: 'Verify Email', dataContent: '2' },
      { label: 'Set Password', dataContent: '3' },
      { label: 'Done', dataContent: '✓' },
    ],
    currentStep: 2,
    color: 'accent',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Steps steps={checkoutSteps} currentStep={2} color="primary" size="xs" />
      <Steps steps={checkoutSteps} currentStep={2} color="primary" size="sm" />
      <Steps steps={checkoutSteps} currentStep={2} color="primary" size="md" />
      <Steps steps={checkoutSteps} currentStep={2} color="primary" size="lg" />
    </div>
  ),
};
