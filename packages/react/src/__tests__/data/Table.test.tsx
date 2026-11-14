import { createRef, useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import {
  Table,
  tableValue,
  type TableKey,
  type TableProps,
} from '../../components/data/Table/Table';

type Row = {
  id: number;
  symbol: string;
  company: string;
  amount: string;
  date: string;
  owner: { name: string };
};

const declaredProps: (keyof TableProps)[] = [
  'headers',
  'rows',
  'keyBy',
  'title',
  'label',
  'density',
  'surface',
  'stickyHeader',
  'hideHeaders',
  'selectable',
  'value',
  'expandable',
  'expanded',
  'sortBy',
  'loading',
  'emptyText',
  'toolbar',
  'footer',
  'pagination',
  'selectAllLabel',
  'selectRowLabel',
  'sortLabel',
  'expandLabel',
  'actionsLabel',
  'classes',
];

const headers = [
  { key: 'symbol', label: 'Product name', secondary: 'company', sortable: true },
  { key: 'amount', label: 'Order amount', numeric: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'owner.name', label: 'Executed by' },
];

const rows: Row[] = [
  {
    id: 1,
    symbol: 'TSLA',
    company: 'Tesla, Inc.',
    amount: '$30,021.23',
    date: 'Dec 13, 2023',
    owner: { name: 'Olivia Rhye' },
  },
  {
    id: 2,
    symbol: 'MTCH',
    company: 'Match Group, Inc.',
    amount: '$10,045.00',
    date: 'Dec 13, 2023',
    owner: { name: 'Phoenix Baker' },
  },
  {
    id: 3,
    symbol: 'DDOG',
    company: 'Datadog Inc.',
    amount: '$40,132.16',
    date: 'Dec 13, 2023',
    owner: { name: 'Lana Steiner' },
  },
];

const root = (container: HTMLElement) => container.querySelector('.apui-table') as HTMLElement;
const bodyRows = (container: HTMLElement) =>
  [...container.querySelectorAll('tbody > tr[data-part="row"]')] as HTMLElement[];

describe('Table', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Table, 'Table', {
      declared: {
        props: declaredProps,
        events: ['onValueChange', 'onSortChange', 'onExpandedChange', 'onRowClick'],
      },
      // emptyText shows only without rows, actionsLabel only with renderActions.
      ignoreEffects: ['emptyText', 'actionsLabel'],
    });
  });

  it('renders the frame, the scroll part and a real table', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<Table ref={ref} headers={headers} rows={rows} />);
    const table = root(container);

    expect(ref.current).toBe(table);
    expect(table).toHaveAttribute('data-surface', 'default');
    expect(table).toHaveAttribute('data-sticky-header');
    expect(table).not.toHaveAttribute('data-density');
    expect(container.querySelectorAll('thead th[data-part="head-cell"][scope="col"]')).toHaveLength(
      4,
    );
    expect(bodyRows(container)).toHaveLength(3);
    expect(container.querySelector('[data-part="toolbar"], [data-part="footer"]')).toBeNull();
  });

  it('names the table by its title, or by label', () => {
    const { rerender } = render(<Table title="Transactions" headers={headers} rows={rows} />);
    expect(screen.getByRole('table', { name: 'Transactions' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Transactions' })).toHaveAttribute(
      'data-part',
      'title',
    );
    rerender(<Table title="Transactions" label="Orders" headers={headers} rows={rows} />);
    expect(screen.getByRole('table', { name: 'Orders' })).not.toHaveAttribute('aria-labelledby');
  });

  it('renders two-line cells, numeric columns and dotted keys', () => {
    const { container } = render(<Table headers={headers} rows={rows} />);
    const first = bodyRows(container)[0]!;
    expect(first.querySelector('[data-part="primary"]')).toHaveTextContent('TSLA');
    expect(first.querySelector('[data-part="secondary"]')).toHaveTextContent('Tesla, Inc.');
    expect(first.children[1]).toHaveAttribute('data-numeric');
    expect(first.children[3]).toHaveTextContent('Olivia Rhye');
  });

  it('marks the sorted header and asks for the next sort', async () => {
    const onSortChange = vi.fn();
    render(
      <Table
        headers={headers}
        rows={rows}
        sortBy={{ column: 'date', direction: 'desc' }}
        onSortChange={onSortChange}
      />,
    );
    const date = screen.getByRole('columnheader', { name: /Date/ });
    expect(date).toHaveAttribute('aria-sort', 'descending');
    expect(screen.getByRole('columnheader', { name: /Product name/ })).toHaveAttribute(
      'aria-sort',
      'none',
    );
    expect(screen.getByRole('columnheader', { name: 'Order amount' })).not.toHaveAttribute(
      'aria-sort',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Sort by Date' }));
    expect(onSortChange).toHaveBeenLastCalledWith({ column: 'date', direction: 'asc' });
    await userEvent.click(screen.getByRole('button', { name: 'Sort by Product name' }));
    expect(onSortChange).toHaveBeenLastCalledWith({ column: 'symbol', direction: 'asc' });
  });

  it('selects rows, with a mixed select-all box', async () => {
    const onValueChange = vi.fn();
    function Harness() {
      const [value, setValue] = useState<TableKey[]>([2]);
      return (
        <Table
          headers={headers}
          rows={rows}
          selectable
          value={value}
          onValueChange={(next) => {
            setValue(next);
            onValueChange(next);
          }}
        />
      );
    }
    const { container } = render(<Harness />);
    const all = screen.getByRole('checkbox', { name: 'Select all' });
    expect(all.closest('.apui-checkbox')).toHaveAttribute('data-state', 'indeterminate');
    expect(bodyRows(container)[1]).toHaveAttribute('aria-selected', 'true');
    expect(bodyRows(container)[0]).toHaveAttribute('aria-selected', 'false');

    await userEvent.click(screen.getByRole('checkbox', { name: 'Select TSLA' }));
    expect(onValueChange).toHaveBeenLastCalledWith([2, 1]);

    await userEvent.click(all);
    expect(onValueChange).toHaveBeenLastCalledWith([1, 2, 3]);
    expect(all.closest('.apui-checkbox')).toHaveAttribute('data-state', 'checked');

    await userEvent.click(all);
    expect(onValueChange).toHaveBeenLastCalledWith([]);
  });

  it('keeps selection internally when uncontrolled', async () => {
    const { container } = render(<Table headers={headers} rows={rows} selectable />);
    await userEvent.click(screen.getByRole('checkbox', { name: 'Select DDOG' }));
    expect(bodyRows(container)[2]).toHaveAttribute('aria-selected', 'true');
  });

  it('expands rows with a named button', async () => {
    const onExpandedChange = vi.fn();
    const { container } = render(
      <Table
        headers={headers}
        rows={rows}
        expandable
        onExpandedChange={onExpandedChange}
        renderExpansion={(row: Row) => `Details for ${row.symbol}`}
      />,
    );
    const trigger = screen.getByRole('button', { name: 'Show details for TSLA' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('data-mirror');
    expect(container.querySelector('[data-part="expansion"]')).toBeNull();

    await userEvent.click(trigger);
    const expansion = container.querySelector('tr[data-part="expansion"]')!;
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', expansion.id);
    expect(expansion).toHaveTextContent('Details for TSLA');
    expect(expansion.querySelector('td')).toHaveAttribute('colspan', '5');
    expect(onExpandedChange).toHaveBeenLastCalledWith([1]);
  });

  it('shows skeleton rows while loading', () => {
    const { container } = render(<Table headers={headers} rows={rows} loading />);
    expect(root(container)).toHaveAttribute('aria-busy', 'true');
    expect(container.querySelectorAll('tbody tr[aria-hidden="true"]')).toHaveLength(3);
    expect(container.querySelectorAll('.apui-skeleton[data-shape="text"]')).toHaveLength(12);
    expect(container).not.toHaveTextContent('TSLA');
  });

  it('shows an EmptyState without rows, or the empty node', () => {
    const { container, rerender } = render(
      <Table headers={headers} rows={[]} emptyText="Nothing yet" />,
    );
    const cell = container.querySelector('td[data-empty]')!;
    expect(cell).toHaveAttribute('colspan', '4');
    expect(within(cell as HTMLElement).getByText('Nothing yet')).toHaveAttribute(
      'data-part',
      'title',
    );
    rerender(<Table headers={headers} rows={[]} empty={<a href="/new">Add one</a>} />);
    expect(screen.getByRole('link', { name: 'Add one' })).toBeInTheDocument();
  });

  it('renders cells, headers and actions from render props', () => {
    const { container } = render(
      <Table
        headers={headers}
        rows={rows}
        renderCell={(row: Row, column) =>
          column.key === 'amount' ? <strong>{row.amount}</strong> : undefined
        }
        renderHeader={(column) => (column.key === 'date' ? <u>When</u> : undefined)}
        renderActions={(row: Row) => <button type="button">Edit {row.symbol}</button>}
      />,
    );
    expect(bodyRows(container)[0]!.querySelector('strong')).toHaveTextContent('$30,021.23');
    expect(container.querySelector('thead u')).toHaveTextContent('When');
    expect(screen.getByText('Actions')).toHaveClass('apui-sr-only');
    expect(screen.getByRole('button', { name: 'Edit MTCH' }).closest('td')).toHaveAttribute(
      'data-actions',
    );
  });

  it('puts footer content and Pagination in the footer', async () => {
    const onPageChange = vi.fn();
    const { container } = render(
      <Table
        headers={headers}
        rows={rows}
        footer="1 selected"
        pagination={{ page: 3, total: 128, perPage: 4, onPageChange }}
      />,
    );
    const footer = container.querySelector('[data-part="footer"]')!;
    expect(footer.firstElementChild).toHaveTextContent('1 selected');
    expect(footer.querySelector('nav.apui-pagination')).not.toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'Page 4' }));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('reports row clicks outside controls', async () => {
    const onRowClick = vi.fn();
    const { container } = render(
      <Table headers={headers} rows={rows} selectable onRowClick={onRowClick} />,
    );
    await userEvent.click(screen.getByText('Phoenix Baker'));
    expect(onRowClick).toHaveBeenCalledWith(rows[1], 1);
    await userEvent.click(screen.getByRole('checkbox', { name: 'Select TSLA' }));
    expect(onRowClick).toHaveBeenCalledTimes(1);
    expect(bodyRows(container)[0]).toHaveAttribute('data-clickable');
  });

  it('sets density, surface, sticky header and hidden headers', () => {
    const { container } = render(
      <Table
        headers={headers}
        rows={rows}
        density="compact"
        surface="glass"
        stickyHeader={false}
        hideHeaders
        classes={{ cell: 'c', headCell: 'h' }}
      />,
    );
    expect(root(container)).toHaveAttribute('data-density', 'compact');
    expect(root(container)).toHaveAttribute('data-surface', 'glass');
    expect(root(container)).not.toHaveAttribute('data-sticky-header');
    expect(container.querySelector('thead')).toHaveClass('apui-sr-only');
    expect(container.querySelector('td[data-part="cell"]')).toHaveClass('c');
    expect(container.querySelector('th[data-part="head-cell"]')).toHaveClass('h');
  });

  it('keeps the 1.x props working', async () => {
    const onSort = vi.fn();
    const onSelectionChange = vi.fn();
    const { container } = render(
      <Table
        headers={headers}
        rows={rows}
        compact
        noHeaders
        striped
        hoverable
        containerClassName="wrap"
        selectable
        selectedKeys={new Set<TableKey>([1])}
        onSelectionChange={onSelectionChange}
        sortBy={{ key: 'date', direction: 'asc' }}
        onSort={onSort}
      />,
    );
    expect(root(container)).toHaveAttribute('data-density', 'compact');
    expect(root(container)).not.toHaveAttribute('striped');
    expect(container.querySelector('thead')).toHaveClass('apui-sr-only');
    expect(container.querySelector('[data-part="scroll"]')).toHaveClass('wrap');
    expect(bodyRows(container)[0]).toHaveAttribute('aria-selected', 'true');
    expect(container.querySelectorAll('th[data-part="head-cell"]')[2]).toHaveAttribute(
      'aria-sort',
      'ascending',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Sort by Date' }));
    expect(onSort).toHaveBeenCalledWith({ key: 'date', direction: 'desc' });
    await userEvent.click(screen.getByRole('checkbox', { name: 'Select MTCH' }));
    expect(onSelectionChange).toHaveBeenCalledWith(new Set([1, 2]));
  });

  it('reads dot paths', () => {
    expect(tableValue({ a: { b: 1 } }, 'a.b')).toBe(1);
    expect(tableValue({ a: null }, 'a.b')).toBeUndefined();
  });
});
