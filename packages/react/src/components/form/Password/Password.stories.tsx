import type { Meta, StoryObj } from '@storybook/react-vite';
import { Password } from './Password';

const meta: Meta<typeof Password> = {
  title: 'Form/Password',
  component: Password,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Password entry with a reveal toggle (aria-pressed), an optional strength meter and live requirements.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    autocomplete: { control: 'select', options: ['current-password', 'new-password'] },
  },
};

export default meta;
type Story = StoryObj<typeof Password>;

export const Default: Story = {
  args: { label: 'Password', leadingIcon: 'lock', required: true },
};

export const StrengthAndRequirements: Story = {
  args: {
    label: 'New password',
    autocomplete: 'new-password',
    leadingIcon: 'lock',
    strengthMeter: true,
    requirements: [
      { label: 'At least 12 characters', pattern: '.{12,}' },
      { label: 'One number', pattern: '\\d' },
      { label: 'One symbol', pattern: '[^A-Za-z0-9]' },
    ],
  },
};

export const WithError: Story = {
  args: { label: 'Current password', error: 'That password is incorrect.' },
};
