import type { Meta, StoryObj } from '@storybook/react-vite';
import { SettingsPage } from './SettingsPage';
import { createStorybookMockClient } from '../mockClient';

const meta: Meta<typeof SettingsPage> = {
  title: 'AI/SettingsPage',
  component: SettingsPage,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Admin form backed by the artisanpack-ui/ai settings JSON API. Handles provider credentials, per-feature overrides, and a `test-connection` probe.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof SettingsPage>;

export const Default: Story = {
  render: () => <SettingsPage client={createStorybookMockClient()} heading="AI Settings" />,
};
