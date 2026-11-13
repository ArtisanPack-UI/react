import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '../Icon/Icon';
import { Swap } from './Swap';

const meta: Meta<typeof Swap> = {
  title: 'Utility/Swap',
  component: Swap,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A checkbox that swaps its on and off content, such as a sun and a moon. label names the setting for screen readers.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    transition: { control: 'select', options: ['fade', 'rotate', 'none'] },
  },
};

export default meta;
type Story = StoryObj<typeof Swap>;

export const Default: Story = { args: { label: 'Dark mode' } };

export const Rotate: Story = {
  args: { label: 'Menu', transition: 'rotate', onIcon: 'x', offIcon: 'list', size: 'lg' },
};

export const CustomContent: Story = {
  args: {
    label: 'Starred',
    transition: 'none',
    on: <Icon name="star" color="warning" />,
    off: <Icon name="star" />,
  },
};

export const Disabled: Story = {
  args: { label: 'Dark mode', disabled: true, defaultChecked: true },
};
