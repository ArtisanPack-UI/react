import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../form/Button/Button';
import { Alert } from './Alert';

const meta: Meta<typeof Alert> = {
  title: 'Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'An inline message about the state of a page or section. The tint and the status icon carry the meaning; errors are role=alert, everything else role=status. A dismissible alert hides itself.',
      },
    },
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info'],
    },
    variant: { control: 'select', options: ['soft', 'outline', 'solid'] },
    surface: { control: 'select', options: ['default', 'glass'] },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  args: {
    color: 'info',
    title: 'New reporting period',
    description: 'Q4 numbers are now available in Analytics.',
  },
};

export const WithActions: Story = {
  args: {
    color: 'warning',
    title: 'Your monthly traffic is close to the limit',
    description: 'You’ve used 92% of 50,000 visits. Upgrade to avoid throttling.',
    actions: (
      <>
        <Button size="xs" color="warning">
          Upgrade
        </Button>
        <Button size="xs" variant="ghost" color="neutral">
          Learn more
        </Button>
      </>
    ),
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 10 }}>
      <Alert color="success" title="Listing published" dismissible />
      <Alert variant="outline" color="info" title="Outline" description="For dense forms." />
      <Alert variant="solid" color="error" title="Solid" description="For page-level failures." />
    </div>
  ),
};
