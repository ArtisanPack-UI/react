import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Table } from './Table';
import type { TableKey, TableSort } from './Table';

const meta: Meta<typeof Table> = {
  title: 'Data Display/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The design-system Table (#62): sortable headers with aria-sort, row selection with a mixed select-all box, expandable rows, loading and empty states, and Pagination in the footer. Renders the `.apui-table` markup contract.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

const headers = [
  { key: 'symbol', label: 'Product name', secondary: 'company', sortable: true },
  { key: 'amount', label: 'Order amount', numeric: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'status', label: 'Status' },
  { key: 'owner', label: 'Executed by' },
];

const rows = [
  {
    id: 1,
    symbol: 'TSLA',
    company: 'Tesla, Inc.',
    amount: '$30,021.23',
    date: 'Dec 13, 2023',
    status: 'Processing',
    owner: 'Olivia Rhye',
  },
  {
    id: 2,
    symbol: 'MTCH',
    company: 'Match Group, Inc.',
    amount: '$10,045.00',
    date: 'Dec 13, 2023',
    status: 'Success',
    owner: 'Phoenix Baker',
  },
  {
    id: 3,
    symbol: 'DDOG',
    company: 'Datadog Inc.',
    amount: '$40,132.16',
    date: 'Dec 13, 2023',
    status: 'Success',
    owner: 'Lana Steiner',
  },
  {
    id: 4,
    symbol: 'ARKG',
    company: 'ARK Genomic Revolution ETF',
    amount: '$22,665.12',
    date: 'Dec 28, 2023',
    status: 'Declined',
    owner: 'Demi Wilkinson',
  },
];

export const Default: Story = {
  args: { title: 'Transaction history', headers, rows },
};

export const Interactive: Story = {
  render: () => {
    const [selected, setSelected] = useState<TableKey[]>([2]);
    const [sort, setSort] = useState<TableSort>({ column: 'date', direction: 'desc' });
    const [page, setPage] = useState(3);
    return (
      <Table
        title="Transaction history"
        headers={headers}
        rows={rows}
        selectable
        value={selected}
        onValueChange={setSelected}
        sortBy={sort}
        onSortChange={setSort}
        expandable
        renderExpansion={(row) => `${String(row.company)} — order details`}
        footer={`${selected.length} selected · 4 of 128 transactions`}
        pagination={{ page, total: 128, perPage: 4, onPageChange: setPage }}
      />
    );
  },
};

export const Compact: Story = {
  args: { title: 'Transaction history', headers, rows, density: 'compact' },
};

export const Loading: Story = {
  args: { title: 'Transaction history', headers, rows, loading: true },
};

export const Empty: Story = {
  args: { title: 'Transaction history', headers, rows: [] },
};

export const Glass: Story = {
  args: { title: 'Transaction history', headers, rows, surface: 'glass' },
};
