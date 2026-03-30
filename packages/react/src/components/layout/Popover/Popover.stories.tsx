import type { Meta, StoryObj } from '@storybook/react-vite';
import { Popover } from './Popover';

const meta: Meta<typeof Popover> = {
  title: 'Layout/Popover',
  component: Popover,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  args: {
    trigger: <button className="btn">Hover me</button>,
    triggerMode: 'hover',
    children: <p>This popover appears on hover.</p>,
  },
};

export const ClickTrigger: Story = {
  args: {
    trigger: <button className="btn btn-primary">Click me</button>,
    triggerMode: 'click',
    children: <p>This popover appears on click. Click outside to close.</p>,
  },
};

export const Positions: Story = {
  render: () => (
    <div className="flex items-center justify-center gap-8 py-32">
      <Popover
        trigger={<button className="btn btn-sm">Top</button>}
        triggerMode="click"
        position="top"
      >
        <p>Top popover</p>
      </Popover>
      <Popover
        trigger={<button className="btn btn-sm">Bottom</button>}
        triggerMode="click"
        position="bottom"
      >
        <p>Bottom popover</p>
      </Popover>
      <Popover
        trigger={<button className="btn btn-sm">Left</button>}
        triggerMode="click"
        position="left"
      >
        <p>Left popover</p>
      </Popover>
      <Popover
        trigger={<button className="btn btn-sm">Right</button>}
        triggerMode="click"
        position="right"
      >
        <p>Right popover</p>
      </Popover>
    </div>
  ),
};

export const WithDelay: Story = {
  args: {
    trigger: <button className="btn btn-secondary">Hover (with delay)</button>,
    triggerMode: 'hover',
    showDelay: 200,
    hideDelay: 500,
    children: <p>Shows after 200ms, hides after 500ms.</p>,
  },
};
