import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: {
    width: '100%',
    height: '1rem',
  },
};

export const Circle: Story = {
  args: {
    circle: true,
    width: '48px',
    height: '48px',
  },
};

export const CardSkeleton: Story = {
  name: 'Card Loading State',
  render: () => (
    <div className="card bg-base-100 shadow-xl w-80 p-4">
      <Skeleton width="100%" height="160px" />
      <div className="mt-4 flex flex-col gap-2">
        <Skeleton width="60%" height="1.25rem" />
        <Skeleton width="100%" height="0.875rem" />
        <Skeleton width="80%" height="0.875rem" />
      </div>
      <div className="mt-4 flex gap-2">
        <Skeleton width="80px" height="2rem" />
        <Skeleton width="80px" height="2rem" />
      </div>
    </div>
  ),
};

export const ProfileSkeleton: Story = {
  name: 'Profile Loading State',
  render: () => (
    <div className="flex items-center gap-4">
      <Skeleton circle width="64px" height="64px" />
      <div className="flex flex-col gap-2">
        <Skeleton width="150px" height="1rem" />
        <Skeleton width="100px" height="0.75rem" />
      </div>
    </div>
  ),
};

export const TableSkeleton: Story = {
  name: 'Table Loading State',
  render: () => (
    <div className="flex flex-col gap-3 w-full max-w-lg">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton width="30%" height="1rem" />
          <Skeleton width="40%" height="1rem" />
          <Skeleton width="20%" height="1rem" />
        </div>
      ))}
    </div>
  ),
};
