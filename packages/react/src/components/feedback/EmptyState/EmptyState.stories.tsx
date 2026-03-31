import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState } from './EmptyState';
import { Button } from '../../form/Button/Button';

const meta: Meta<typeof EmptyState> = {
  title: 'Feedback/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Placeholder shown when a list, table, or section has no content. Accepts an icon, heading, description, and action slot to guide the user.',
      },
    },
  },
  argTypes: {
    heading: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
    headingAs: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    heading: 'No results found',
    description: 'Try adjusting your search or filter to find what you are looking for.',
  },
};

export const WithIcon: Story = {
  args: {
    icon: <span className="text-4xl">📭</span>,
    heading: 'Your inbox is empty',
    description: 'Messages you receive will appear here.',
  },
};

export const WithAction: Story = {
  args: {
    icon: <span className="text-4xl">📝</span>,
    heading: 'No posts yet',
    description: 'Get started by creating your first post.',
    action: <Button label="Create Post" color="primary" />,
  },
};

export const NoData: Story = {
  args: {
    icon: <span className="text-4xl">📊</span>,
    heading: 'No data available',
    description: 'Data will appear here once records are added to the system.',
    action: <Button label="Import Data" color="secondary" />,
  },
};
