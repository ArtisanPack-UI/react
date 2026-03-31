import type { Meta, StoryObj, Decorator } from '@storybook/react-vite';
import { Tooltip } from './Tooltip';
import { Button } from '../../form/Button/Button';

const centeredDecorator: Decorator = (Story) => (
  <div className="p-16 flex justify-center">
    <Story />
  </div>
);

const meta: Meta<typeof Tooltip> = {
  title: 'Utility/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Hover tooltip overlay with configurable position (top, bottom, left, right), DaisyUI color variants, and always-open pinned mode.',
      },
    },
  },
  argTypes: {
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    color: {
      control: 'select',
      options: [
        undefined,
        'primary',
        'secondary',
        'accent',
        'success',
        'warning',
        'error',
        'info',
        'neutral',
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    tip: 'Hello, I am a tooltip!',
    children: <Button label="Hover me" color="primary" />,
  },
  decorators: [centeredDecorator],
};

export const Positions: Story = {
  render: () => (
    <div className="flex gap-4 p-16 justify-center">
      <Tooltip tip="Top tooltip" position="top">
        <Button label="Top" />
      </Tooltip>
      <Tooltip tip="Bottom tooltip" position="bottom">
        <Button label="Bottom" />
      </Tooltip>
      <Tooltip tip="Left tooltip" position="left">
        <Button label="Left" />
      </Tooltip>
      <Tooltip tip="Right tooltip" position="right">
        <Button label="Right" />
      </Tooltip>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-12 justify-center">
      <Tooltip tip="Primary" color="primary">
        <Button label="Primary" color="primary" />
      </Tooltip>
      <Tooltip tip="Secondary" color="secondary">
        <Button label="Secondary" color="secondary" />
      </Tooltip>
      <Tooltip tip="Accent" color="accent">
        <Button label="Accent" color="accent" />
      </Tooltip>
      <Tooltip tip="Success" color="success">
        <Button label="Success" color="success" />
      </Tooltip>
      <Tooltip tip="Warning" color="warning">
        <Button label="Warning" color="warning" />
      </Tooltip>
      <Tooltip tip="Error" color="error">
        <Button label="Error" color="error" />
      </Tooltip>
      <Tooltip tip="Info" color="info">
        <Button label="Info" color="info" />
      </Tooltip>
      <Tooltip tip="Neutral" color="neutral">
        <Button label="Neutral" color="neutral" />
      </Tooltip>
    </div>
  ),
};

export const AlwaysOpen: Story = {
  args: {
    tip: 'Always visible',
    open: true,
    children: <Button label="Pinned tooltip" color="primary" />,
  },
  decorators: [centeredDecorator],
};
