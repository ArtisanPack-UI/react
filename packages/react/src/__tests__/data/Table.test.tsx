import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Table } from '../../components/data/Table/Table';
import type { TableHeader } from '../../components/data/Table/Table';

interface User extends Record<string, unknown> {
  id: number;
  name: string;
  email: string;
  role: string;
}

const headers: TableHeader<User>[] = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
];

const rows: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'User' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'User' },
];

describe('Table', () => {
  it('renders headers', () => {
    render(<Table headers={headers} rows={rows} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
  });

  it('renders row data', () => {
    render(<Table headers={headers} rows={rows} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('bob@example.com')).toBeInTheDocument();
  });

  it('shows empty text when no rows', () => {
    render(<Table headers={headers} rows={[]} />);
    expect(screen.getByText('No data available.')).toBeInTheDocument();
  });

  it('shows custom empty text', () => {
    render(<Table headers={headers} rows={[]} emptyText="Nothing here" />);
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('hides headers when noHeaders is true', () => {
    render(<Table headers={headers} rows={rows} noHeaders />);
    expect(screen.queryByText('Name')).not.toBeInTheDocument();
  });

  it('applies striped class', () => {
    const { container } = render(<Table headers={headers} rows={rows} striped />);
    expect(container.querySelector('.table-zebra')).toBeInTheDocument();
  });

  it('renders custom cell via render prop', () => {
    const customHeaders: TableHeader<User>[] = [
      {
        key: 'name',
        label: 'Name',
        render: (value) => <strong data-testid="custom-cell">{String(value)}</strong>,
      },
    ];
    render(<Table headers={customHeaders} rows={rows} />);
    const cells = screen.getAllByTestId('custom-cell');
    expect(cells).toHaveLength(3);
    expect(cells[0]).toHaveTextContent('Alice');
  });

  it('handles sorting', () => {
    const onSort = vi.fn();
    const sortableHeaders: TableHeader<User>[] = [{ key: 'name', label: 'Name', sortable: true }];
    render(<Table headers={sortableHeaders} rows={rows} onSort={onSort} />);
    fireEvent.click(screen.getByText('Name'));
    expect(onSort).toHaveBeenCalledWith({ key: 'name', direction: 'asc' });
  });

  it('toggles sort direction', () => {
    const onSort = vi.fn();
    const sortableHeaders: TableHeader<User>[] = [{ key: 'name', label: 'Name', sortable: true }];
    render(
      <Table
        headers={sortableHeaders}
        rows={rows}
        sortBy={{ key: 'name', direction: 'asc' }}
        onSort={onSort}
      />,
    );
    fireEvent.click(screen.getByText('Name'));
    expect(onSort).toHaveBeenCalledWith({ key: 'name', direction: 'desc' });
  });

  it('renders selection checkboxes', () => {
    render(
      <Table
        headers={headers}
        rows={rows}
        selectable
        selectedKeys={new Set()}
        onSelectionChange={() => {}}
      />,
    );
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(4); // 1 select-all + 3 rows
  });

  it('handles row selection', () => {
    const onSelectionChange = vi.fn();
    render(
      <Table
        headers={headers}
        rows={rows}
        selectable
        selectedKeys={new Set()}
        onSelectionChange={onSelectionChange}
      />,
    );
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]); // First row checkbox
    expect(onSelectionChange).toHaveBeenCalled();
  });

  it('renders expand buttons when expandable', () => {
    render(
      <Table
        headers={headers}
        rows={rows}
        expandable
        renderExpansion={(row) => <div>Details for {row.name}</div>}
      />,
    );
    const expandButtons = screen.getAllByLabelText('Expand row');
    expect(expandButtons).toHaveLength(3);
  });

  it('expands row on click', () => {
    render(
      <Table
        headers={headers}
        rows={rows}
        expandable
        renderExpansion={(row) => <div>Details for {row.name}</div>}
      />,
    );
    fireEvent.click(screen.getAllByLabelText('Expand row')[0]);
    expect(screen.getByText('Details for Alice')).toBeInTheDocument();
  });

  it('renders actions column', () => {
    render(
      <Table
        headers={headers}
        rows={rows}
        renderActions={(row) => <button>Edit {row.name}</button>}
      />,
    );
    expect(screen.getByText('Edit Alice')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('renders footer', () => {
    render(<Table headers={headers} rows={rows} footer={<span>Total: 3</span>} />);
    expect(screen.getByText('Total: 3')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Table ref={ref} headers={headers} rows={rows} />);
    expect(ref).toHaveBeenCalled();
  });
});
