import type { Meta, StoryObj } from '@storybook/react-vite';
import { ErrorDisplay } from './Error';

const meta: Meta<typeof ErrorDisplay> = {
  title: 'Feedback/ErrorDisplay (deprecated)',
  component: ErrorDisplay,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Deprecated alias of ErrorState: message maps to description, and onRetry with retryLabel to a Try again button.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ErrorDisplay>;

export const Default: Story = {
  args: {
    message: 'Failed to load data. Please check your connection.',
    onRetry: () => {},
  },
};
