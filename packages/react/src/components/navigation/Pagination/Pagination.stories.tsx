import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Page navigation control with previous/next buttons, sibling page links, configurable siblings count, size variants, and disabled state.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: [undefined, 'xs', 'sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  args: {
    currentPage: 5,
    totalPages: 20,
  },
};

export const Interactive: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return (
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm">Page {page} of 10</p>
        <Pagination currentPage={page} totalPages={10} onChange={setPage} />
      </div>
    );
  },
};

export const FewPages: Story = {
  args: {
    currentPage: 2,
    totalPages: 3,
  },
};

export const ManyPages: Story = {
  args: {
    currentPage: 50,
    totalPages: 100,
    siblings: 2,
  },
};

export const Disabled: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    disabled: true,
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-center">
      <Pagination currentPage={3} totalPages={10} size="xs" />
      <Pagination currentPage={3} totalPages={10} size="sm" />
      <Pagination currentPage={3} totalPages={10} size="md" />
      <Pagination currentPage={3} totalPages={10} size="lg" />
    </div>
  ),
};
