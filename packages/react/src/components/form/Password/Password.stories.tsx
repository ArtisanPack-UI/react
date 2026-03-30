import type { Meta, StoryObj } from '@storybook/react-vite';
import { Password } from './Password';

const meta: Meta<typeof Password> = {
  title: 'Form/Password',
  component: Password,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Password>;

export const Default: Story = {
  args: {},
};

export const WithLabel: Story = {
  args: {
    label: 'Password',
  },
};

export const WithIcon: Story = {
  args: {
    label: 'Password',
    icon: <span aria-hidden="true">🔒</span>,
  },
};

export const Clearable: Story = {
  args: {
    label: 'Password',
    clearable: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'Password',
    error: 'Password must be at least 8 characters.',
  },
};

export const HiddenToggle: Story = {
  args: {
    label: 'Secret Key',
    hideToggle: true,
    hint: 'The visibility toggle is hidden for this field.',
  },
};

export const InlineLabel: Story = {
  args: {
    label: 'Password',
    inline: true,
  },
};
