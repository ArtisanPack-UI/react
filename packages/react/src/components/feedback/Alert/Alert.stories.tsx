import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from './Alert';

const meta: Meta<typeof Alert> = {
  title: 'Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: [undefined, 'info', 'success', 'warning', 'error'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  args: {
    children: 'This is a default alert message.',
  },
};

export const Info: Story = {
  args: {
    color: 'info',
    children: 'A new software update is available.',
  },
};

export const Success: Story = {
  args: {
    color: 'success',
    children: 'Your profile has been updated successfully!',
  },
};

export const Warning: Story = {
  args: {
    color: 'warning',
    children: 'Your trial period expires in 3 days.',
  },
};

export const Error: Story = {
  args: {
    color: 'error',
    children: 'Unable to save changes. Please try again.',
  },
};

export const AllColors: Story = {
  name: 'All Variants',
  render: () => (
    <div className="flex flex-col gap-3">
      <Alert color="info">Informational message.</Alert>
      <Alert color="success">Success message.</Alert>
      <Alert color="warning">Warning message.</Alert>
      <Alert color="error">Error message.</Alert>
    </div>
  ),
};

export const WithIcon: Story = {
  args: {
    color: 'info',
    icon: <span aria-hidden="true">ℹ️</span>,
    children: 'Alert with a custom icon.',
  },
};

export const Dismissible: Story = {
  args: {
    color: 'warning',
    dismissible: true,
    children: 'This alert can be dismissed by clicking the X button.',
  },
};
