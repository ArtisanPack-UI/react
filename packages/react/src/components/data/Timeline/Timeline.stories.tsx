import type { Meta, StoryObj } from '@storybook/react-vite';
import { Timeline } from './Timeline';
import type { TimelineItemData } from './Timeline';

const meta: Meta<typeof Timeline> = {
  title: 'Data Display/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Chronological event timeline in vertical or horizontal layout. Items support icons, colored indicators, and a pending-state marker for in-progress events.',
      },
    },
  },
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
      { title: 'Primary', subtitle: 'Step 1', color: 'primary' },
      { title: 'Secondary', subtitle: 'Step 2', color: 'secondary' },
      { title: 'Accent', subtitle: 'Step 3', color: 'accent' },
      { title: 'Neutral', subtitle: 'Step 4', color: 'neutral' },
      { title: 'Info', subtitle: 'Step 5', color: 'info' },
      { title: 'Success', subtitle: 'Step 6', color: 'success' },
      { title: 'Warning', subtitle: 'Step 7', color: 'warning' },
      { title: 'Error', subtitle: 'Step 8', color: 'error' },
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
