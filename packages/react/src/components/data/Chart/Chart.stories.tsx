import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chart } from './Chart';

const meta: Meta<typeof Chart> = {
  title: 'Data Display/Chart',
  component: Chart,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Chart>;

export const BarChart: Story = {
  args: {
    type: 'bar',
    series: [{ name: 'Sales', data: [30, 40, 35, 50, 49, 60] }],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    title: 'Monthly Sales',
  },
};

export const LineChart: Story = {
  args: {
    type: 'line',
    series: [
      { name: 'Revenue', data: [30, 40, 35, 50, 49, 60] },
      { name: 'Expenses', data: [20, 30, 25, 40, 35, 45] },
    ],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    title: 'Revenue vs Expenses',
  },
};

export const AreaChart: Story = {
  args: {
    type: 'area',
    series: [{ name: 'Visitors', data: [120, 200, 150, 300, 250, 400] }],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    title: 'Website Visitors',
  },
};

export const DonutChart: Story = {
  args: {
    type: 'donut',
    data: [
      { label: 'Desktop', value: 55 },
      { label: 'Mobile', value: 30 },
      { label: 'Tablet', value: 15 },
    ],
    title: 'Traffic by Device',
  },
};

export const PieChart: Story = {
  args: {
    type: 'pie',
    data: [
      { label: 'Desktop', value: 55 },
      { label: 'Mobile', value: 30 },
      { label: 'Tablet', value: 15 },
    ],
    title: 'Device Distribution',
  },
};
