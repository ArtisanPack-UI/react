import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stat } from './Stat';

const meta: Meta<typeof Stat> = {
  title: 'Data Display/Stat',
  component: Stat,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A single headline number with its label, change and context. The change is an arrow and text, never color alone. Lay stats out with Grid and emphasize at most one.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    trend: { control: 'select', options: [undefined, 'up', 'down', 'flat'] },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Stat>;

export const Default: Story = {
  args: {
    label: 'Total revenue',
    value: '7,415,644',
    icon: 'wallet',
    color: 'info',
    change: -5.4,
    description: 'vs last month',
  },
};

export const Row: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
      <Stat
        label="Total income"
        value="$348,261"
        icon="wallet"
        color="primary"
        change={10.9}
        description="vs last month"
        emphasis
      />
      <Stat
        label="Profit"
        value="$15,708.98"
        icon="trending-up"
        color="success"
        change={8.1}
        description="vs last month"
      />
      <Stat label="Conversion" value="10.87" unit="%" change={2.5} description="vs last month" />
    </div>
  ),
};

export const SizesAndBare: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'start' }}>
      <Stat size="sm" label="Properties visits" value="721K" change={11} />
      <Stat label="Deals completed" value="1,156" change={11} />
      <Stat size="lg" label="Amount invested" value="367K" change={11} />
      <Stat
        size="sm"
        bare
        label="Hours listened"
        value="34.6"
        delta="6.2 hrs"
        trend="up"
        description="this week"
      />
    </div>
  ),
};
