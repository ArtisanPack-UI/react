import type { Meta, StoryObj } from '@storybook/react-vite';
import { Clipboard } from './Clipboard';

const meta: Meta<typeof Clipboard> = {
  title: 'Utility/Clipboard',
  component: Clipboard,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: [undefined, 'primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info', 'ghost'],
    },
    size: {
      control: 'select',
      options: [undefined, 'xs', 'sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Clipboard>;

export const Default: Story = {
  args: {
    text: 'npm install @artisanpack-ui/react',
    label: 'Copy',
  },
};

export const WithSuccessLabel: Story = {
  args: {
    text: 'Hello, World!',
    label: 'Copy text',
    successLabel: 'Copied!',
    color: 'primary',
  },
};

export const Colors: Story = {
  render: () => (
    <div className="flex gap-2">
      <Clipboard text="text" label="Primary" color="primary" />
      <Clipboard text="text" label="Secondary" color="secondary" />
      <Clipboard text="text" label="Ghost" color="ghost" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Clipboard text="text" label="XS" color="primary" size="xs" />
      <Clipboard text="text" label="SM" color="primary" size="sm" />
      <Clipboard text="text" label="MD" color="primary" size="md" />
      <Clipboard text="text" label="LG" color="primary" size="lg" />
    </div>
  ),
};
