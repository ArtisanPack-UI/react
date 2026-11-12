import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sparkline } from './Sparkline';

const meta: Meta<typeof Sparkline> = {
  title: 'Data Display/Sparkline',
  component: Sparkline,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A word-sized trend with no axes, drawn as inline SVG. Its label states the first and latest values; keep the values themselves in a table or tooltip nearby.',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['line', 'area', 'bar'] },
  },
};

export default meta;
type Story = StoryObj<typeof Sparkline>;

export const Line: Story = { args: { data: [2, 4, 3, 7, 6, 9, 12, 11, 14] } };

export const Area: Story = { args: { data: [2, 6, 4, 7, 5, 8, 10, 7, 12], variant: 'area' } };

export const Bar: Story = { args: { data: [2, 6, 4, 7, 5, 8, 10, 7, 12], variant: 'bar' } };

export const Large: Story = {
  args: { data: [2, 4, 3, 7, 6, 9, 12, 11, 14], variant: 'area', width: 160, height: 40 },
};

export const CrossingZero: Story = {
  args: { data: [-4, -2, 1, 3, -1, 2, 5, 4, 6], variant: 'bar' },
};
