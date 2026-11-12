import type { Meta, StoryObj } from '@storybook/react-vite';
import { Kbd } from './Kbd';

const meta: Meta<typeof Kbd> = {
  title: 'Utility/Kbd',
  component: Kbd,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A keyboard key or shortcut as kbd elements. mod shows ⌘ on macOS and Ctrl elsewhere; symbol keys carry their name for screen readers.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md'] },
    platform: { control: 'select', options: ['auto', 'mac', 'other'] },
  },
  args: { keys: ['mod', 'k'] },
};

export default meta;
type Story = StoryObj<typeof Kbd>;

export const Shortcut: Story = {};

export const Keys: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Kbd {...args} keys={['mod', 'k']} />
      <Kbd {...args} keys={['ctrl', 'shift', 'p']} />
      <Kbd {...args} keys={['esc']} />
      <Kbd {...args} keys={['up']} />
      <Kbd {...args} keys={['down']} />
      <Kbd {...args} keys={['enter']} />
      <Kbd {...args} keys={['tab']} />
    </div>
  ),
};

export const Small: Story = { args: { size: 'sm', keys: ['mod', 'd'] } };

export const InText: Story = {
  render: () => (
    <p>
      Press <Kbd keys={['mod', 'k']} /> to search, or <Kbd keys={['?']} /> for all shortcuts.
    </p>
  ),
};
