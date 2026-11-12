import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Placeholder shapes that match the layout while content loads. Skeletons are hidden from assistive technology; the loading container sets aria-busy.',
      },
    },
  },
  argTypes: {
    shape: { control: 'select', options: ['block', 'text', 'circle'] },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = { args: { width: 240, height: 24 } };

export const List: Story = {
  render: () => (
    <div aria-busy="true" style={{ display: 'grid', gap: 14 }}>
      {[1, 2, 3].map((row) => (
        <div key={row} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Skeleton shape="circle" width={40} height={40} />
          <div style={{ flex: 1 }}>
            <Skeleton shape="text" width="50%" />
            <Skeleton shape="text" width="80%" />
          </div>
        </div>
      ))}
    </div>
  ),
};
