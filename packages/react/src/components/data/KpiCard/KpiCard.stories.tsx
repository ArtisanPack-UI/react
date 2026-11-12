import type { Meta, StoryObj } from '@storybook/react-vite';
import { KpiCard } from './KpiCard';

const meta: Meta<typeof KpiCard> = {
  title: 'Data Display/KpiCard',
  component: KpiCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A headline metric in a Card, built from Stat: its change, a sparkline of the trend and, when there is one, progress toward a target.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof KpiCard>;

export const Default: Story = {
  args: {
    stat: {
      label: 'Profit',
      value: '$15,708.98',
      icon: 'trending-up',
      color: 'success',
      change: 8.1,
      description: 'vs last month',
    },
    sparkline: [2, 4, 2, 6, 8, 6, 10, 12, 14],
    target: { value: 15708.98, max: 25000, label: 'Goal $25,000' },
    style: { maxWidth: 320 },
  },
};

export const WithoutTarget: Story = {
  args: {
    stat: {
      label: 'Total revenue',
      value: '7,415,644',
      icon: 'wallet',
      color: 'info',
      change: -5.4,
      description: 'vs last month',
    },
    sparkline: [14, 16, 12, 10, 12, 8, 6, 8, 4],
    style: { maxWidth: 320 },
  },
};

export const WithPeriod: Story = {
  args: {
    stat: { label: 'Total income', value: '$348,261', change: 10.9, description: 'vs last month' },
    sparkline: [1, 3, 2, 7, 6, 10, 12, 11, 16],
    period: (
      <select aria-label="Period" defaultValue="month">
        <option value="month">This month</option>
        <option value="quarter">This quarter</option>
      </select>
    ),
    style: { maxWidth: 360 },
  },
};
