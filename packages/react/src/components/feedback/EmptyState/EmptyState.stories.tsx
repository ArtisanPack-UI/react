import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../form/Button/Button';
import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'Feedback/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Explains why there's nothing here and what to do next. The variant picks the tile's tint and default icon.",
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['first-use', 'no-results', 'cleared'] },
    size: { control: 'select', options: ['sm', 'md'] },
    align: { control: 'select', options: ['center', 'start'] },
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const FirstUse: Story = {
  args: {
    title: 'No properties yet',
    description: 'Add your first property to start tracking visits, offers and revenue.',
    actions: <Button leadingIcon="plus">Add property</Button>,
  },
};

export const NoResults: Story = {
  args: {
    variant: 'no-results',
    title: 'No results for “Lakw”',
    description: 'Check the spelling, or clear filters to see all 318 properties.',
    actions: (
      <Button variant="outline" color="neutral">
        Clear filters
      </Button>
    ),
  },
};

export const Cleared: Story = {
  args: {
    variant: 'cleared',
    size: 'sm',
    title: 'You’re all caught up',
    description: 'New offers will appear here.',
  },
};
