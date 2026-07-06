import type { Meta, StoryObj } from '@storybook/react-vite';
import { FeatureToggles } from './FeatureToggles';
import { createStorybookMockClient } from '../mockClient';

const meta: Meta<typeof FeatureToggles> = {
  title: 'AI/FeatureToggles',
  component: FeatureToggles,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Per-feature enable/disable list backed by GET `/features` and POST `/features/{key}/toggle`.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof FeatureToggles>;

export const Default: Story = {
  render: () => <FeatureToggles client={createStorybookMockClient()} heading="AI Features" />,
};
