import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio } from './Radio';

const defaultOptions = [
  { id: '1', name: 'Option 1' },
  { id: '2', name: 'Option 2' },
  { id: '3', name: 'Option 3' },
];

const meta: Meta<typeof Radio> = {
  title: 'Form/Radio',
  component: Radio,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: [undefined, 'primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  args: {
    label: 'Select an option',
    options: defaultOptions,
  },
};

export const ColorVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Radio label="Primary" color="primary" options={defaultOptions} />
      <Radio label="Secondary" color="secondary" options={defaultOptions} />
      <Radio label="Accent" color="accent" options={defaultOptions} />
      <Radio label="Success" color="success" options={defaultOptions} />
      <Radio label="Warning" color="warning" options={defaultOptions} />
      <Radio label="Error" color="error" options={defaultOptions} />
      <Radio label="Info" color="info" options={defaultOptions} />
    </div>
  ),
};

export const Inline: Story = {
  args: {
    label: 'Layout',
    options: defaultOptions,
    inline: true,
  },
};

export const CardVariant: Story = {
  args: {
    label: 'Plan',
    options: [
      { id: 'free', name: 'Free' },
      { id: 'pro', name: 'Pro' },
      { id: 'enterprise', name: 'Enterprise' },
    ],
    card: true,
  },
};

export const WithHints: Story = {
  args: {
    label: 'Shipping Method',
    options: [
      { id: 'standard', name: 'Standard', hint: 'Delivery in 5-7 business days' },
      { id: 'express', name: 'Express', hint: 'Delivery in 2-3 business days' },
      { id: 'overnight', name: 'Overnight', hint: 'Next business day delivery' },
    ],
  },
};

export const WithDisabledOptions: Story = {
  args: {
    label: 'Subscription',
    options: [
      { id: 'monthly', name: 'Monthly' },
      { id: 'yearly', name: 'Yearly' },
      { id: 'lifetime', name: 'Lifetime', disabled: true },
    ],
  },
};
