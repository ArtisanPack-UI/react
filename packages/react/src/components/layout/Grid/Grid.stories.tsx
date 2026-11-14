import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '../Card/Card';
import { Grid } from './Grid';

const meta: Meta<typeof Grid> = {
  title: 'Layout/Grid',
  component: Grid,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A layout primitive: its children in equal columns, with the gap from the space scale. With minItemWidth the columns drop as the grid narrows. No Tailwind needed.',
      },
    },
  },
  argTypes: {
    gap: { control: 'select', options: ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16'] },
    align: { control: 'select', options: ['start', 'center', 'end', 'stretch'] },
    justify: { control: 'select', options: ['start', 'center', 'end', 'stretch'] },
  },
};

export default meta;
type Story = StoryObj<typeof Grid>;

const cards = ['Revenue', 'Orders', 'Customers', 'Refunds', 'Visitors', 'Conversion'].map(
  (title) => <Card key={title} title={title} />,
);

export const Default: Story = { args: { columns: 3, children: cards } };

export const Responsive: Story = {
  args: { columns: 4, minItemWidth: '14rem', gap: '6', children: cards },
};
