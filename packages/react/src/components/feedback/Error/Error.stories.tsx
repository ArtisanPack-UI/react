import type { Meta, StoryObj } from '@storybook/react-vite';
import { ErrorDisplay } from './Error';

const meta: Meta<typeof ErrorDisplay> = {
  title: 'Feedback/Error',
  component: ErrorDisplay,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ErrorDisplay>;

export const Default: Story = {
  args: {},
};

export const WithMessage: Story = {
  args: {
    message: 'Please try again later.',
  },
};

export const WithIcon: Story = {
  args: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-16 h-16"
      >
        <path
          fillRule="evenodd"
          d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
          clipRule="evenodd"
        />
      </svg>
    ),
    message: 'An unexpected error occurred.',
  },
};

export const WithRetry: Story = {
  args: {
    message: 'Failed to load data from the server.',
    onRetry: () => console.log('Retry clicked'),
  },
};

export const CustomLabels: Story = {
  args: {
    title: '404 Not Found',
    message: 'The page you are looking for does not exist.',
    retryLabel: 'Go Home',
    onRetry: () => console.log('Go Home clicked'),
  },
};
