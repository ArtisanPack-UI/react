import type { Meta, StoryObj } from '@storybook/react-vite';
import { RichTextEditor } from './RichTextEditor';

const meta: Meta<typeof RichTextEditor> = {
  title: 'Form/RichTextEditor',
  component: RichTextEditor,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'ContentEditable rich-text editor with optional toolbar, label, hint, error, configurable minimum height, and controlled value via onValueChange callback.',
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
    minHeight: {
      control: 'text',
    },
    required: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof RichTextEditor>;

export const Default: Story = {
  args: {},
};

export const WithLabel: Story = {
  args: {
    label: 'Content',
  },
};

export const WithToolbar: Story = {
  args: {
    label: 'Article Body',
    toolbar: (
      <>
        <button type="button" className="btn btn-ghost btn-xs font-bold" aria-label="Bold">
          B
        </button>
        <button type="button" className="btn btn-ghost btn-xs italic" aria-label="Italic">
          I
        </button>
      </>
    ),
  },
};

export const WithHint: Story = {
  args: {
    label: 'Description',
    hint: 'Use the toolbar to format your text.',
  },
};

export const WithError: Story = {
  args: {
    label: 'Bio',
    error: 'Content is required.',
  },
};

export const CustomHeight: Story = {
  args: {
    label: 'Long Form Content',
    minHeight: '400px',
  },
};
