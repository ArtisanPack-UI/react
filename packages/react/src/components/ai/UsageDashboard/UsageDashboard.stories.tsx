import type { Meta, StoryObj } from '@storybook/react-vite';
import { UsageDashboard } from './UsageDashboard';
import { createStorybookMockClient } from '../mockClient';

const meta: Meta<typeof UsageDashboard> = {
  title: 'AI/UsageDashboard',
  component: UsageDashboard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Aggregated usage dashboard backed by GET `/usage`. Set `refreshInterval` (ms) to enable polling for live updates.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof UsageDashboard>;

export const Default: Story = {
  render: () => <UsageDashboard client={createStorybookMockClient()} heading="AI Usage" />,
};

export const Live: Story = {
  name: 'Live (polling)',
  render: () => (
    <UsageDashboard
      client={createStorybookMockClient()}
      refreshInterval={5000}
      heading="AI Usage"
    />
  ),
};
