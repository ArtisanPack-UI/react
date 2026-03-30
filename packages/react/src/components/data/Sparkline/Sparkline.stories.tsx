import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sparkline } from './Sparkline';

const meta: Meta<typeof Sparkline> = {
  title: 'Data Display/Sparkline',
  component: Sparkline,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['line', 'area', 'bar'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info', 'neutral'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Sparkline>;

const sampleData = [5, 10, 5, 20, 8, 15, 12, 18];

export const Default: Story = {
  args: {
    data: sampleData,
  },
};

export const AreaType: Story = {
  args: {
    data: sampleData,
    type: 'area',
  },
};

export const BarType: Story = {
  args: {
    data: sampleData,
    type: 'bar',
  },
};

export const ColorVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="w-20 text-sm">Primary</span>
        <Sparkline data={sampleData} color="primary" />
      </div>
      <div className="flex items-center gap-3">
        <span className="w-20 text-sm">Success</span>
        <Sparkline data={sampleData} color="success" />
      </div>
      <div className="flex items-center gap-3">
        <span className="w-20 text-sm">Warning</span>
        <Sparkline data={sampleData} color="warning" />
      </div>
      <div className="flex items-center gap-3">
        <span className="w-20 text-sm">Error</span>
        <Sparkline data={sampleData} color="error" />
      </div>
      <div className="flex items-center gap-3">
        <span className="w-20 text-sm">Info</span>
        <Sparkline data={sampleData} color="info" />
      </div>
      <div className="flex items-center gap-3">
        <span className="w-20 text-sm">Secondary</span>
        <Sparkline data={sampleData} color="secondary" />
      </div>
      <div className="flex items-center gap-3">
        <span className="w-20 text-sm">Accent</span>
        <Sparkline data={sampleData} color="accent" />
      </div>
      <div className="flex items-center gap-3">
        <span className="w-20 text-sm">Neutral</span>
        <Sparkline data={sampleData} color="neutral" />
      </div>
    </div>
  ),
};

export const CustomSize: Story = {
  args: {
    data: sampleData,
    height: 60,
    width: 200,
    color: 'accent',
  },
};
