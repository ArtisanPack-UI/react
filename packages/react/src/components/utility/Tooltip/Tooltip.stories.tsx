import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../form/Button/Button';
import { Tooltip } from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Utility/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A short label on hover and keyboard focus. The child is the trigger; the tooltip describes it with aria-describedby. Hoverable, and Escape hides it. Never the only name of an icon button.',
      },
    },
  },
  argTypes: {
    placement: { control: 'select', options: ['top', 'bottom', 'start', 'end'] },
    size: { control: 'select', options: ['md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    content: 'Edit',
    shortcut: 'E',
    children: (
      <Button
        variant="outline"
        color="neutral"
        size="sm"
        iconOnly
        leadingIcon="pencil"
        aria-label="Edit"
      />
    ),
  },
};

export const LongText: Story = {
  args: {
    size: 'lg',
    placement: 'end',
    content: 'Conversion is completed deals divided by unique visits in the period.',
    children: (
      <Button
        variant="ghost"
        color="neutral"
        size="sm"
        iconOnly
        leadingIcon="info"
        aria-label="About conversion"
      />
    ),
  },
};

export const Forced: Story = {
  args: { ...Default.args, open: true, placement: 'bottom' },
};
