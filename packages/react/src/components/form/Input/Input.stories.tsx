import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Form/Input',
  component: Input,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: 'Name',
    placeholder: 'Enter your name',
  },
};

export const WithHint: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'you@example.com',
    hint: 'We will never share your email.',
  },
};

export const WithError: Story = {
  args: {
    label: 'Username',
    defaultValue: 'ab',
    error: 'Username must be at least 3 characters.',
  },
};

export const WithIcons: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search...',
    icon: <span aria-hidden="true">🔍</span>,
  },
};

export const Clearable: Story = {
  args: {
    label: 'Search',
    placeholder: 'Type to search...',
    clearable: true,
    defaultValue: 'Hello',
  },
};

export const WithPrefixSuffix: Story = {
  args: {
    label: 'Price',
    prefix: <span>$</span>,
    suffix: <span>.00</span>,
    placeholder: '0',
  },
};

export const Inline: Story = {
  args: {
    label: 'Inline Label',
    placeholder: 'Value',
    inline: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled',
    value: 'Cannot edit',
    disabled: true,
  },
};
