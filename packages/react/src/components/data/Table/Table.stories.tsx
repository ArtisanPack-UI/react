import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Table } from './Table';
import type { TableSortConfig } from './Table';
import { Badge } from '../Badge/Badge';
import { Button } from '../../form/Button/Button';

const meta: Meta<typeof Table> = {
  title: 'Data Display/Table',
  component: Table,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Table>;

const users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active' },
  { id: 3, name: 'Carol Davis', email: 'carol@example.com', role: 'Viewer', status: 'Inactive' },
  { id: 4, name: 'Dan Wilson', email: 'dan@example.com', role: 'Editor', status: 'Active' },
  { id: 5, name: 'Eve Brown', email: 'eve@example.com', role: 'Admin', status: 'Active' },
];

const headers = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role' },
  {
    key: 'status',
    label: 'Status',
    render: (value: unknown) => (
      <Badge value={value as string} color={value === 'Active' ? 'success' : 'neutral'} size="sm" />
    ),
  },
];

export const Default: Story = {
  args: {
    headers,
    rows: users,
    keyBy: 'id',
  },
};

export const Striped: Story = {
  args: {
    headers,
    rows: users,
    keyBy: 'id',
    striped: true,
  },
};

export const Hoverable: Story = {
  args: {
    headers,
    rows: users,
    keyBy: 'id',
    hoverable: true,
  },
};

export const Compact: Story = {
  args: {
    headers,
    rows: users,
    keyBy: 'id',
    compact: true,
  },
};

export const WithActions: Story = {
  args: {
    headers,
    rows: users,
    keyBy: 'id',
    renderActions: (_row: Record<string, unknown>) => (
      <div className="flex gap-1">
        <Button label="Edit" size="xs" color="ghost" />
        <Button label="Delete" size="xs" color="error" />
      </div>
    ),
  },
};

export const Sortable: Story = {
  render: () => {
    const [sort, setSort] = useState<TableSortConfig>({ key: 'name', direction: 'asc' });
    const sorted = [...users].sort((a, b) => {
      const aVal = a[sort.key as keyof typeof a];
      const bVal = b[sort.key as keyof typeof b];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sort.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sort.direction === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    return (
      <Table headers={headers} rows={sorted} keyBy="id" sortBy={sort} onSort={setSort} hoverable />
    );
  },
};

export const Selectable: Story = {
  render: () => {
    const [selected, setSelected] = useState<Set<string | number>>(new Set());
    return (
      <div>
        <p className="mb-2 text-sm">Selected: {selected.size} rows</p>
        <Table
          headers={headers}
          rows={users}
          keyBy="id"
          selectable
          selectableKey="id"
          selectedKeys={selected}
          onSelectionChange={setSelected}
          hoverable
        />
      </div>
    );
  },
};

export const Empty: Story = {
  args: {
    headers,
    rows: [],
    keyBy: 'id',
    emptyText: 'No users found.',
  },
};
