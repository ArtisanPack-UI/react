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
    children: <Button color="primary">Hover me</Button>,
  },
  decorators: [centeredDecorator],
};

export const Positions: Story = {
  render: () => (
    <div className="flex gap-4 p-16 justify-center">
      <Tooltip tip="Top tooltip" position="top">
        <Button>Top</Button>
      </Tooltip>
      <Tooltip tip="Bottom tooltip" position="bottom">
        <Button>Bottom</Button>
      </Tooltip>
      <Tooltip tip="Left tooltip" position="left">
        <Button>Left</Button>
      </Tooltip>
      <Tooltip tip="Right tooltip" position="right">
        <Button>Right</Button>
      </Tooltip>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-12 justify-center">
      <Tooltip tip="Primary" color="primary">
        <Button color="primary">Primary</Button>
      </Tooltip>
      <Tooltip tip="Secondary" color="secondary">
        <Button color="secondary">Secondary</Button>
      </Tooltip>
      <Tooltip tip="Accent" color="accent">
        <Button color="accent">Accent</Button>
      </Tooltip>
      <Tooltip tip="Success" color="success">
        <Button color="success">Success</Button>
      </Tooltip>
      <Tooltip tip="Warning" color="warning">
        <Button color="warning">Warning</Button>
      </Tooltip>
      <Tooltip tip="Error" color="error">
        <Button color="error">Error</Button>
      </Tooltip>
      <Tooltip tip="Info" color="info">
        <Button color="info">Info</Button>
      </Tooltip>
      <Tooltip tip="Neutral" color="neutral">
        <Button color="neutral">Neutral</Button>
      </Tooltip>
    </div>
  ),
};

export const AlwaysOpen: Story = {
  args: {
    tip: 'Always visible',
    open: true,
    children: <Button color="primary">Pinned tooltip</Button>,
  },
  decorators: [centeredDecorator],
};
