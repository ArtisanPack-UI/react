import type { Meta, StoryObj } from '@storybook/react-vite';
import { Clipboard } from './Clipboard';

const meta: Meta<typeof Clipboard> = {
  title: 'Utility/Clipboard',
  component: Clipboard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Copies a value with clear confirmation: the label reads Copied for the timeout and the result is announced in a live region. A failure is announced too.',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['button', 'icon', 'field'] },
    size: { control: 'select', options: ['xs', 'sm', 'md'] },
  },
  args: { value: 'https://horizonhomes.com/l/grove-greenfield' },
};

export default meta;
type Story = StoryObj<typeof Clipboard>;

export const Button: Story = {};

export const Icon: Story = { args: { variant: 'icon', label: 'Copy share link' } };

export const Field: Story = {
  args: { variant: 'field', size: 'md', label: 'Copy share link' },
  decorators: [
    (Story) => (
      <div style={{ maxInlineSize: 420 }}>
        <Story />
      </div>
    ),
  ],
};
