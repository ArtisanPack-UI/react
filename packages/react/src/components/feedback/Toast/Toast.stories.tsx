import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToastProvider, useToast } from './Toast';

const meta: Meta<typeof ToastProvider> = {
  title: 'Feedback/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Ephemeral notification system with success, error, warning, and info variants. Wrap your app in ToastProvider and call useToast() to trigger toasts from anywhere.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ToastProvider>;

function ToastDemo() {
  const toast = useToast();
  return (
    <div className="flex flex-wrap gap-2">
      <button
        className="btn btn-success btn-sm"
        onClick={() => toast.success('Operation completed!')}
      >
        Success
      </button>
      <button className="btn btn-error btn-sm" onClick={() => toast.error('Something went wrong!')}>
        Error
      </button>
      <button
        className="btn btn-warning btn-sm"
        onClick={() => toast.warning('Please check your input.')}
      >
        Warning
      </button>
      <button
        className="btn btn-info btn-sm"
        onClick={() => toast.info('Here is some information.')}
      >
        Info
      </button>
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <ToastProvider>
      <ToastDemo />
    </ToastProvider>
  ),
};

export const Positions: Story = {
  render: () => (
    <ToastProvider position={['toast-top', 'toast-center']}>
      <ToastDemo />
    </ToastProvider>
  ),
};

export const CustomDuration: Story = {
  render: () => (
    <ToastProvider defaultDuration={10000}>
      <div className="flex flex-col gap-2">
        <p className="text-sm opacity-60">Toasts will stay for 10 seconds.</p>
        <ToastDemo />
      </div>
    </ToastProvider>
  ),
};
