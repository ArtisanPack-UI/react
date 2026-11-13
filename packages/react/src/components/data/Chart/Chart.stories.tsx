import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chart } from './Chart';

const meta: Meta<typeof Chart> = {
  title: 'Data Display/Chart',
  component: Chart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A bar, line, area or donut chart in a Card, drawn as inline SVG from tokens. Every mark is focusable and opens its tooltip on hover and focus; tabular adds the data table view.',
      },
    },
  },
  argTypes: {
    type: { control: 'select', options: ['bar', 'line', 'area', 'donut'] },
    notation: { control: 'select', options: ['standard', 'compact'] },
  },
};

export default meta;
type Story = StoryObj<typeof Chart>;

const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'];
const quarters = ['Q1', 'Q2', 'Q3', 'Q4', 'Q1', 'Q2', 'Q3', 'Q4'];
const salesAndTarget = [
  { name: 'Sales', data: [600000, 1800000, 2600000, 3200000, 3600000, 4400000, 6100000, 7400000] },
  {
    name: 'Target',
    data: [3200000, 4400000, 3800000, 5200000, 6100000, 6600000, 7000000, 6400000],
  },
];

export const Bar: Story = {
  args: {
    type: 'bar',
    title: 'Weekly revenue',
    description: 'The Grove at Greenfield · best week labeled',
    labels: weeks,
    series: [
      { name: 'Revenue', data: [4100, 6000, 8200, 10000, 4000, 8000, 4000, 8000, 6000, 4000] },
    ],
    prefix: '$',
    notation: 'compact',
  },
};

export const Area: Story = {
  args: {
    type: 'area',
    title: 'Analytic',
    description: 'Sales estimation vs target',
    labels: quarters,
    series: salesAndTarget,
    prefix: '$',
    notation: 'compact',
    width: 1000,
    height: 260,
  },
};

export const Line: Story = {
  args: { ...Area.args, type: 'line' },
};

export const Donut: Story = {
  args: {
    type: 'donut',
    title: 'Active listings',
    description: 'By country',
    labels: ['United States', 'Mexico', 'Canada', 'Other'],
    series: [1240, 990, 723, 260],
  },
};

export const WithTable: Story = {
  args: { ...Donut.args, tabular: true },
};
