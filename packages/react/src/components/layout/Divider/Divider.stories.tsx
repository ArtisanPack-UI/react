import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from './Divider';

const meta: Meta<typeof Divider> = {
  title: 'Layout/Divider',
  component: Divider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Separates content with a muted rule: horizontal, vertical or with a label in the middle. Prefer spacing; add a divider only when groups blur together.',
      },
    },
  },
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    align: { control: 'select', options: ['start', 'center', 'end'] },
    strength: { control: 'select', options: ['subtle', 'strong'] },
  },
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Default: Story = {};

export const Strong: Story = { args: { strength: 'strong' } };

export const Labelled: Story = { args: { label: 'or continue with' } };

export const LabelAtStart: Story = { args: { label: 'Older activity', align: 'start' } };

export const Vertical: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
      <span>Edit</span>
      <Divider {...args} orientation="vertical" />
      <span>Duplicate</span>
    </div>
  ),
};
