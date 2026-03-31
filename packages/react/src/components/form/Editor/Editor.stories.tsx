import type { Meta, StoryObj } from '@storybook/react-vite';
import { Editor } from './Editor';

const meta: Meta<typeof Editor> = {
  title: 'Form/Editor',
  component: Editor,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Plain textarea-based code/text editor with label, hint, error indicator, and required marker. Suitable for simple multi-line text editing.',
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
    },
    hint: {
      control: 'text',
    },
    error: {
      control: 'text',
    },
    required: {
      control: 'boolean',
    },
  },
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
