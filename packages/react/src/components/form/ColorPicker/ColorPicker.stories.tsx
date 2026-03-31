import type { Meta, StoryObj } from '@storybook/react-vite';
import { ColorPicker } from './ColorPicker';

const meta: Meta<typeof ColorPicker> = {
  title: 'Form/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Native color input with label, hint, error, clearable value, random color generator, and left/right icon slots.',
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
    clearable: {
      control: 'boolean',
    },
    random: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ColorPicker>;

export const Default: Story = {
  args: {},
};

export const WithLabel: Story = {
  args: {
    label: 'Brand Color',
  },
};

export const WithHint: Story = {
  args: {
    label: 'Background Color',
    hint: 'Choose a color for the page background.',
  },
};

export const WithError: Story = {
  args: {
    label: 'Theme Color',
    error: 'Please select a valid color.',
  },
};

export const Clearable: Story = {
  args: {
    label: 'Accent Color',
    clearable: true,
  },
};

export const Random: Story = {
  args: {
    label: 'Random Color',
    random: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Color',
    disabled: true,
  },
};

export const WithIcons: Story = {
  args: {
    label: 'Color',
    icon: <span aria-hidden="true">🎨</span>,
    iconRight: <span aria-hidden="true">🖌️</span>,
  },
};
