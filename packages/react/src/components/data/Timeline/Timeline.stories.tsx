import type { Meta, StoryObj } from '@storybook/react-vite';
import { Timeline, TimelineItem } from './Timeline';

const meta: Meta<typeof Timeline> = {
  title: 'Data Display/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Events in order, each with an icon or dot marker. Compose it from TimelineItem children, or pass the same events as items. For steps still to come, use Steps.',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['icon', 'dot'] },
  },
};

export default meta;
type Story = StoryObj<typeof Timeline>;

export const ActivityFeed: Story = {
  render: (args) => (
    <div style={{ maxWidth: 460 }}>
      <Timeline {...args} label="Activity">
        <TimelineItem
          icon="circle-check"
          color="success"
          time="2h ago"
          datetime="2026-11-12T08:00"
          description="Phoenix Baker accepted $248,000."
        >
          <strong>Offer accepted</strong> on Lakeview Lofts
        </TimelineItem>
        <TimelineItem
          icon="message-square"
          time="5h ago"
          card="Can we move the viewing to Thursday at 11:00? The tenant is out until then."
        >
          <strong>Olivia Rhye</strong> commented
        </TimelineItem>
        <TimelineItem
          icon="circle-alert"
          color="error"
          time="Dec 28"
          description="Card ending 4242"
        >
          <strong>Payment declined</strong> for ARKG
        </TimelineItem>
        <TimelineItem icon="house" color="primary" time="Dec 13" title="Listing published" />
      </Timeline>
    </div>
  ),
};

export const DotsFromData: Story = {
  args: {
    variant: 'dot',
    label: 'Shipping history',
    items: [
      { title: 'Delivered', time: 'Nov 7, 14:02', color: 'success' },
      { title: 'Out for delivery', time: 'Nov 7, 08:15', color: 'primary' },
      { title: 'Arrived at Barcelona hub', time: 'Nov 6, 22:40' },
      { title: 'Shipped from Madrid', time: 'Nov 6, 09:10' },
    ],
    style: { maxWidth: 360 },
  },
};
