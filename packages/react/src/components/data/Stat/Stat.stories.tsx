import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stat, StatGroup } from './Stat';

const meta: Meta<typeof Stat> = {
  title: 'Data Display/Stat',
  component: Stat,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: [undefined, 'primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Stat>;

export const Default: Story = {
  args: {
    title: 'Total Revenue',
    value: '$45,231',
    description: 'Jan 1 - Dec 31',
  },
};

export const WithChange: Story = {
  args: {
    title: 'Monthly Users',
    value: '12,450',
    change: 12.5,
    changeLabel: 'vs last month',
    color: 'success',
  },
};

export const NegativeChange: Story = {
  args: {
    title: 'Bounce Rate',
    value: '42%',
    change: -3.2,
    changeLabel: 'vs last week',
    color: 'error',
  },
};

export const WithIcon: Story = {
  args: {
    title: 'Downloads',
    value: '31K',
    icon: <span className="text-2xl">📥</span>,
    description: 'Last 30 days',
  },
};

export const Group: Story = {
  render: () => (
    <StatGroup>
      <Stat title="Total Users" value="31,200" change={5.4} />
      <Stat title="Revenue" value="$72,400" change={12.1} color="success" />
      <Stat title="Orders" value="1,240" change={-2.3} color="error" />
    </StatGroup>
  ),
};

export const HorizontalGroup: Story = {
  render: () => (
    <StatGroup horizontal>
      <Stat title="Downloads" value="31K" icon={<span className="text-2xl">📥</span>} />
      <Stat title="Active Users" value="4,200" icon={<span className="text-2xl">👥</span>} />
      <Stat title="Revenue" value="$12.4K" icon={<span className="text-2xl">💰</span>} />
    </StatGroup>
  ),
};
