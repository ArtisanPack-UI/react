import type { Meta, StoryObj } from '@storybook/react-vite';
import { Timeline } from './Timeline';
import type { TimelineItemData } from './Timeline';

const meta: Meta<typeof Timeline> = {
  title: 'Data Display/Timeline',
  component: Timeline,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Timeline>;

const defaultItems: TimelineItemData[] = [
  { title: 'Order Placed', subtitle: 'March 25, 2026' },
  { title: 'Processing', subtitle: 'March 26, 2026' },
  { title: 'Shipped', subtitle: 'March 27, 2026' },
  { title: 'Delivered', subtitle: 'March 30, 2026' },
];

export const Default: Story = {
  args: {
    items: defaultItems,
  },
};

export const Horizontal: Story = {
  args: {
    items: defaultItems,
    vertical: false,
  },
};

export const Compact: Story = {
  args: {
    items: defaultItems,
    compact: true,
  },
};

export const WithColors: Story = {
  args: {
    items: [
      { title: 'Step 1', subtitle: 'Completed', color: 'success' },
      { title: 'Step 2', subtitle: 'In Progress', color: 'primary' },
      { title: 'Step 3', subtitle: 'Warning', color: 'warning' },
      { title: 'Step 4', subtitle: 'Error', color: 'error' },
    ],
  },
};

export const WithPending: Story = {
  args: {
    items: [
      { title: 'Step 1', subtitle: 'Completed', color: 'success' },
      { title: 'Step 2', subtitle: 'In Progress', color: 'primary' },
      { title: 'Step 3', subtitle: 'Pending', pending: true },
    ],
  },
};
