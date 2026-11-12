import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../form/Button/Button';
import { Stack } from './Stack';

const meta: Meta<typeof Stack> = {
  title: 'Layout/Stack',
  component: Stack,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A layout primitive: its children in a column or a row, with the gap from the space scale, alignment and optional wrapping. No Tailwind needed.',
      },
    },
  },
  argTypes: {
    orientation: { control: 'select', options: ['vertical', 'horizontal'] },
    gap: { control: 'select', options: ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16'] },
    align: { control: 'select', options: ['start', 'center', 'end', 'stretch', 'baseline'] },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Stack>;

const buttons = ['Save', 'Preview', 'Publish'].map((label) => <Button key={label}>{label}</Button>);

export const Vertical: Story = { args: { children: buttons } };

export const Horizontal: Story = {
  args: { orientation: 'horizontal', gap: '3', align: 'center', wrap: true, children: buttons },
};
