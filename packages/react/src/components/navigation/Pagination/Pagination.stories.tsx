import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Moves between pages of a long list. The first and last pages always show, with siblings pages around the current one.',
      },
    },
  },
  args: { page: 3, total: 318, perPage: 10 },
  render: function Render(args) {
    const [page, setPage] = useState(args.page ?? 1);
    return <Pagination {...args} page={page} onPageChange={setPage} />;
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {};

export const WithSummary: Story = {
  args: { summary: true, summaryLabel: 'Showing {from}–{to} of {total} properties' },
};

export const MoreSiblings: Story = {
  args: { page: 16, siblings: 2 },
};

export const FewPages: Story = {
  args: { page: 1, pageCount: 4, total: undefined },
};
