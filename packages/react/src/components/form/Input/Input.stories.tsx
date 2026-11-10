import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Form/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Single-line text entry with a visible label, hint and error, named icons, and prefix/suffix add-ons.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { label: 'Name', placeholder: 'Enter your name' },
};

export const WithHint: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'you@example.com',
    hint: 'We never share it.',
    required: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'Username',
    defaultValue: 'ab',
    error: 'Username must be at least 3 characters.',
  },
};

export const WithAddons: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <Input type="search" label="Search" leadingIcon="search" />
      <Input type="number" label="Price" prefix="USD" suffix="/mo" />
      <Input type="url" label="Website" prefix="https://" trailingIcon="arrow-right" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <Input size="sm" label="Small" />
      <Input size="md" label="Medium" />
      <Input size="lg" label="Large" />
    </div>
  ),
};

export const ReadonlyAndDisabled: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <Input label="Account ID" defaultValue="AP-20931" readonly />
      <Input label="Team" defaultValue="Design" disabled />
    </div>
  ),
};
