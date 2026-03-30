import type { Meta, StoryObj } from '@storybook/react-vite';
import { Editor } from './Editor';

const meta: Meta<typeof Editor> = {
  title: 'Form/Editor',
  component: Editor,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Editor>;

export const Default: Story = {
  args: {},
};

export const WithLabel: Story = {
  args: {
    label: 'Code',
  },
};

export const WithHint: Story = {
  args: {
    label: 'Template',
    hint: 'Enter valid HTML or Blade template code.',
  },
};

export const WithError: Story = {
  args: {
    label: 'Configuration',
    error: 'Invalid syntax detected.',
  },
};

export const Required: Story = {
  args: {
    label: 'Source Code',
    required: true,
  },
};
