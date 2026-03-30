import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Form/Textarea',
  component: Textarea,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter a description...',
  },
};

export const WithHint: Story = {
  args: {
    label: 'Bio',
    placeholder: 'Tell us about yourself...',
    hint: 'Maximum 500 characters.',
  },
};

export const WithError: Story = {
  args: {
    label: 'Comment',
    value: '',
    error: 'Comment is required.',
  },
};

export const Inline: Story = {
  args: {
    label: 'Notes',
    placeholder: 'Add notes...',
    inline: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Read-only content',
    value: 'This content cannot be edited.',
    disabled: true,
  },
};
