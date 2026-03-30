import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from './Tooltip';
import { Button } from '../../form/Button/Button';

const meta: Meta<typeof Tooltip> = {
  title: 'Utility/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    color: {
      control: 'select',
      options: [undefined, 'primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info'],
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
  decorators: [(Story) => <div className="p-16 flex justify-center"><Story /></div>],
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
    </div>
  ),
};

export const AlwaysOpen: Story = {
  args: {
    tip: 'Always visible',
    open: true,
    children: <Button label="Pinned tooltip" color="primary" />,
  },
  decorators: [(Story) => <div className="p-16 flex justify-center"><Story /></div>],
};
