/**
 * @module Table
 *
 * The design-system Table (#62): rows of structured data in real table
 * markup, rendering the `.apui-table` markup contract styled by
 * `@artisanpack-ui/css`. A toolbar (title and toolbar content), the scroll
 * part with the native table, and a footer (footer content and Pagination).
 * Sortable headers carry `aria-sort` and a sort button; selectable rows a
 * Checkbox and `aria-selected`, with a select-all box that is mixed while some
 * rows are selected; expandable rows an expand button and a full-width
 * expansion row. Loading shows skeleton rows; no rows shows an EmptyState.
 *
 * @packageDocumentation
 */

import {
  forwardRef,
  Fragment,
  useId,
  useState,
  type ForwardedRef,
  type HTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type RefAttributes,
} from 'react';

import { Checkbox } from '../../form/Checkbox/Checkbox';
import { Pagination, type PaginationProps } from '../../navigation/Pagination/Pagination';
import { IconSvg } from '../../../internal/icon';
import { cx, hasContent, type PartClasses } from '../../../internal/parts';

/** A row key: what `keyBy` reads from each row. */
export type TableKey = string | number;

/** The parts a {@link Table} accepts extra classes for. */
export type TablePart =
  | 'root'
  | 'toolbar'
  | 'title'
  | 'scroll'
  | 'table'
  | 'headCell'
  | 'sort'
  | 'row'
  | 'cell'
  | 'select'
  | 'expandTrigger'
  | 'expansion'
  | 'primary'
  | 'secondary'
  | 'footer';

/** The table's sort. */
export interface TableSort {
  /** The column key. */
  column: string;
  /** The order. */
  direction: 'asc' | 'desc';
}

/** @deprecated Use {@link TableSort}. */
export type TableSortConfig = TableSort;

/** A column of a {@link Table}. */
export interface TableColumn<Row = Record<string, unknown>> {
  /** Dot path to the row value, such as `'user.name'`. */
  key: string;
  /** The header label. @defaultValue the key */
  label?: ReactNode;
  /** Makes the header a sort button with `aria-sort`. */
  sortable?: boolean;
  /** End-aligns the column with tabular figures. */
  numeric?: boolean;
  /** Leaves the column out. */
  hidden?: boolean;
  /** A second dot path, shown muted under the value. */
  secondary?: string;
  /** Extra classes for the header cell. */
  class?: string;
  /** Extra classes for the header cell. */
  className?: string;
  /** Renders the column's cells. `renderCell` on the table wins over it. */
  render?: (value: unknown, row: Row, index: number) => ReactNode;
}

/** @deprecated Use {@link TableColumn}. */
export type TableHeader<Row = Record<string, unknown>> = TableColumn<Row>;

/** Props for the {@link Table} component. Native `<div>` attributes go to the root. */
export interface TableProps<Row = Record<string, unknown>> extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'title' | 'children' | 'defaultValue'
> {
  /** The columns, in order. */
  headers: TableColumn<Row>[];
  /** The rows. */
  rows: Row[];
  /** Dot path to each row's unique key. @defaultValue `'id'` */
  keyBy?: string;
  /** The toolbar title; it names the table unless `label` is set. */
  title?: ReactNode;
  /** The table's accessible name, instead of the title. Translate it. */
  label?: string;
  /** Row height, padding and type size. Unset follows the page's density. */
  density?: 'compact' | 'default' | 'comfortable';
  /** `glass` puts the table on a translucent surface. @defaultValue `'default'` */
  surface?: 'default' | 'glass';
  /** Keeps the header row in view while the rows scroll. @defaultValue `true` */
  stickyHeader?: boolean;
  /** Hides the header row visually; screen readers still announce it. @defaultValue `false` */
  hideHeaders?: boolean;
  /** Adds row checkboxes and a select-all box. @defaultValue `false` */
  selectable?: boolean;
  /** The selected keys. Controlled with `onValueChange`; uncontrolled when unset. */
  value?: TableKey[];
  /** Adds an expand button to each row. @defaultValue `false` */
  expandable?: boolean;
  /** The expanded keys. Controlled with `onExpandedChange`; uncontrolled when unset. */
  expanded?: TableKey[];
  /**
   * The current sort; the sorted header carries `aria-sort`. The table never sorts rows itself.
   * The 1.x shape, `{ key, direction }`, still works.
   */
  sortBy?: TableSort | { key: string; direction: 'asc' | 'desc' };
  /** Shows skeleton rows and sets `aria-busy`. @defaultValue `false` */
  loading?: boolean;
  /** The empty state's title; translate it. @defaultValue `'No records found.'` */
  emptyText?: string;
  /** Replaces the empty state. */
  empty?: ReactNode;
  /** Toolbar content after the title. */
  toolbar?: ReactNode;
  /** Footer content at the start; Pagination sits at the end. */
  footer?: ReactNode;
  /** Pagination's props, rendered at the end of the footer, including `onPageChange`. */
  pagination?: PaginationProps;
  /** The select-all box's name; translate it. @defaultValue `'Select all'` */
  selectAllLabel?: string;
  /** Each row box's name, with `{row}`; translate it. @defaultValue `'Select {row}'` */
  selectRowLabel?: string;
  /** Each sort button's name, with `{column}`; translate it. @defaultValue `'Sort by {column}'` */
  sortLabel?: string;
  /** Each expand button's name, with `{row}`; translate it. @defaultValue `'Show details for {row}'` */
  expandLabel?: string;
  /** The actions column's hidden header; translate it. @defaultValue `'Actions'` */
  actionsLabel?: string;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<TablePart>;
  /** Renders a cell; return `undefined` to fall back to the column's `render` or the value. */
  renderCell?: (row: Row, column: TableColumn<Row>, index: number) => ReactNode;
  /** Renders a header's content. */
  renderHeader?: (column: TableColumn<Row>) => ReactNode;
  /** Renders row actions in a last, end-aligned column. */
  renderActions?: (row: Row, index: number) => ReactNode;
  /** Renders an expanded row's content. */
  renderExpansion?: (row: Row, index: number) => ReactNode;
  /** The selection changed, by a row box or select all. */
  onValueChange?: (keys: TableKey[]) => void;
  /** A sortable header was chosen: ascending first, then toggling. */
  onSortChange?: (sort: TableSort) => void;
  /** A row was expanded or collapsed. */
  onExpandedChange?: (keys: TableKey[]) => void;
  /** A row was clicked outside its links, buttons and boxes. */
  onRowClick?: (row: Row, index: number) => void;
  /** @deprecated 1.x: use `density="compact"`. */
  compact?: boolean;
  /** @deprecated 1.x: use `hideHeaders`. */
  noHeaders?: boolean;
  /** @deprecated 1.x: use `classes.scroll`. */
  containerClassName?: string;
  /** @deprecated 1.x: use `value`. */
  selectedKeys?: Set<TableKey>;
  /** @deprecated 1.x: use `onValueChange`. */
  onSelectionChange?: (keys: Set<TableKey>) => void;
  /** @deprecated 1.x: use `onSortChange`; this one receives `{ key, direction }`. */
  onSort?: (sort: { key: string; direction: 'asc' | 'desc' }) => void;
  /** @deprecated 1.x: no longer drawn; use a Badge for status. Ignored. */
  striped?: boolean;
  /** @deprecated 1.x: rows always tint on hover. Ignored. */
  hoverable?: boolean;
  /** @deprecated 1.x: use `density`. Ignored. */
  size?: string;
  /** @deprecated 1.x: keys come from `keyBy`. Ignored. */
  selectableKey?: string;
  /** @deprecated 1.x: keys come from `keyBy`. Ignored. */
  expandableKey?: string;
}

/** Reads a dot path from a row. */
export function tableValue(row: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((value, key) => {
    if (value !== null && typeof value === 'object' && key in (value as Record<string, unknown>)) {
      return (value as Record<string, unknown>)[key];
    }
    return undefined;
  }, row);
}

const sameKey = (a: unknown, b: unknown) => String(a) === String(b);
const hasKey = (list: readonly unknown[], key: unknown) => list.some((item) => sameKey(item, key));
const fill = (template: string, values: Record<string, string>) =>
  Object.entries(values).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, value),
    template,
  );
const text = (value: unknown): string =>
  typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
    ? String(value)
    : '';

function TableInner<Row>(
  {
    headers,
    rows,
    keyBy = 'id',
    title,
    label,
    density,
    surface = 'default',
    stickyHeader = true,
    hideHeaders = false,
    selectable = false,
    value,
    expandable = false,
    expanded,
    sortBy,
    loading = false,
    emptyText = 'No records found.',
    empty,
    toolbar,
    footer,
    pagination,
    selectAllLabel = 'Select all',
    selectRowLabel = 'Select {row}',
    sortLabel = 'Sort by {column}',
    expandLabel = 'Show details for {row}',
    actionsLabel = 'Actions',
    classes = {},
    className,
    renderCell,
    renderHeader,
    renderActions,
    renderExpansion,
    onValueChange,
    onSortChange,
    onExpandedChange,
    onRowClick,
    compact,
    noHeaders,
    containerClassName,
    selectedKeys,
    onSelectionChange,
    onSort,
    striped: _striped,
    hoverable: _hoverable,
    size: _size,
    selectableKey: _selectableKey,
    expandableKey: _expandableKey,
    ...rest
  }: TableProps<Row>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const baseId = useId();
  const controlledValue = value ?? (selectedKeys ? [...selectedKeys] : undefined);
  const resolvedDensity = density ?? (compact ? 'compact' : undefined);
  const headersHidden = hideHeaders || Boolean(noHeaders);
  const sortColumn = sortBy ? ('column' in sortBy ? sortBy.column : sortBy.key) : undefined;
  const [ownSelection, setOwnSelection] = useState<TableKey[]>(controlledValue ?? []);
  const [ownExpanded, setOwnExpanded] = useState<TableKey[]>(expanded ?? []);
  const selection = controlledValue ?? ownSelection;
  const expandedKeys = expanded ?? ownExpanded;

  const columns = headers.filter((column) => !column.hidden);
  const rowKey = (row: Row) => tableValue(row, keyBy) as TableKey;
  const pageKeys = selectable ? rows.map(rowKey) : [];
  const selectedOnPage = pageKeys.filter((key) => hasKey(selection, key)).length;
  const allState =
    selectedOnPage === 0
      ? 'unchecked'
      : selectedOnPage === pageKeys.length
        ? 'checked'
        : 'indeterminate';
  const hasActions = renderActions !== undefined;
  const colspan =
    columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0) + (hasActions ? 1 : 0);
  const hasTitle = hasContent(title);
  const titleId = `${baseId}-title`;

  const select = (next: TableKey[]) => {
    if (controlledValue === undefined) setOwnSelection(next);
    onValueChange?.(next);
    onSelectionChange?.(new Set(next));
  };
  const toggleRow = (key: TableKey, on: boolean) => {
    const rest = selection.filter((item) => !sameKey(item, key));
    select(on ? [...rest, key] : rest);
  };
  const toggleAll = (on: boolean) => {
    const rest = selection.filter((item) => !hasKey(pageKeys, item));
    select(on ? [...rest, ...pageKeys] : rest);
  };
  const toggleExpanded = (key: TableKey) => {
    const next = hasKey(expandedKeys, key)
      ? expandedKeys.filter((item) => !sameKey(item, key))
      : [...expandedKeys, key];
    if (expanded === undefined) setOwnExpanded(next);
    onExpandedChange?.(next);
  };

  const ariaSort = (column: TableColumn<Row>) =>
    !sortBy || sortColumn !== column.key
      ? 'none'
      : sortBy.direction === 'desc'
        ? 'descending'
        : 'ascending';
  const sortIcon = (column: TableColumn<Row>) =>
    ({ ascending: 'arrow-up', descending: 'arrow-down', none: 'chevrons-up-down' })[
      ariaSort(column)
    ];
  const columnName = (column: TableColumn<Row>) => text(column.label) || column.key;
  const rowName = (row: Row) => {
    const first = columns[0];
    const shown = first ? text(tableValue(row, first.key)).trim() : '';
    return shown || text(rowKey(row));
  };

  const cellContent = (row: Row, column: TableColumn<Row>, index: number): ReactNode => {
    const custom = renderCell?.(row, column, index);
    if (custom !== undefined) return custom;
    const raw = tableValue(row, column.key);
    if (column.render) return column.render(raw, row, index);
    const secondary = column.secondary ? tableValue(row, column.secondary) : undefined;
    if (secondary !== undefined && secondary !== null && secondary !== '') {
      return (
        <>
          <span className={classes.primary} data-scope="table" data-part="primary">
            {text(raw)}
          </span>
          <span className={classes.secondary} data-scope="table" data-part="secondary">
            {text(secondary)}
          </span>
        </>
      );
    }
    return text(raw);
  };

  const handleRowClick = (event: MouseEvent<HTMLTableRowElement>, row: Row, index: number) => {
    if ((event.target as Element).closest('a, button, input, label, select, textarea')) return;
    onRowClick?.(row, index);
  };

  const cellClass = classes.cell;
  const shrinkCell = (
    <td className={cellClass} data-scope="table" data-part="cell" data-shrink="" />
  );

  let body: ReactNode;
  if (loading) {
    body = [0, 1, 2].map((index) => (
      <tr
        key={`skeleton-${index}`}
        className={classes.row}
        data-scope="table"
        data-part="row"
        aria-hidden="true"
      >
        {selectable ? (
          <td className={classes.select} data-scope="table" data-part="select" />
        ) : null}
        {expandable ? shrinkCell : null}
        {columns.map((column) => (
          <td key={column.key} className={cellClass} data-scope="table" data-part="cell">
            <span className="apui-skeleton" data-shape="text" aria-hidden="true" />
          </td>
        ))}
        {hasActions ? shrinkCell : null}
      </tr>
    ));
  } else if (rows.length === 0) {
    body = (
      <tr>
        <td data-empty="" colSpan={Math.max(1, colspan)}>
          {hasContent(empty) ? (
            empty
          ) : (
            <div className="apui-empty-state" data-variant="no-results" data-size="sm">
              <p data-scope="empty-state" data-part="title">
                {emptyText}
              </p>
            </div>
          )}
        </td>
      </tr>
    );
  } else {
    body = rows.map((row, index) => {
      const key = rowKey(row);
      const isSelected = selectable && hasKey(selection, key);
      const isOpen = expandable && hasKey(expandedKeys, key);
      const name = rowName(row);
      const expansionId = `${baseId}-expansion-${index}`;
      return (
        <Fragment key={text(key) || index}>
          <tr
            className={classes.row}
            data-scope="table"
            data-part="row"
            aria-selected={selectable ? (isSelected ? 'true' : 'false') : undefined}
            data-clickable={onRowClick ? '' : undefined}
            onClick={onRowClick ? (event) => handleRowClick(event, row, index) : undefined}
          >
            {selectable ? (
              <td className={classes.select} data-scope="table" data-part="select">
                <Checkbox
                  aria-label={fill(selectRowLabel, { row: name })}
                  value={text(key)}
                  checked={isSelected}
                  onCheckedChange={(on) => toggleRow(key, on)}
                />
              </td>
            ) : null}
            {expandable ? (
              <td className={cellClass} data-scope="table" data-part="cell" data-shrink="">
                <button
                  type="button"
                  className={classes.expandTrigger}
                  data-scope="table"
                  data-part="expand-trigger"
                  aria-label={fill(expandLabel, { row: name })}
                  aria-expanded={isOpen ? 'true' : 'false'}
                  aria-controls={isOpen ? expansionId : undefined}
                  data-mirror=""
                  onClick={() => toggleExpanded(key)}
                >
                  <IconSvg name="chevron-right" />
                </button>
              </td>
            ) : null}
            {columns.map((column) => (
              <td
                key={column.key}
                className={cellClass}
                data-scope="table"
                data-part="cell"
                data-numeric={column.numeric ? '' : undefined}
              >
                {cellContent(row, column, index)}
              </td>
            ))}
            {hasActions ? (
              <td
                className={cellClass}
                data-scope="table"
                data-part="cell"
                data-shrink=""
                data-actions=""
              >
                {renderActions(row, index)}
              </td>
            ) : null}
          </tr>
          {isOpen ? (
            <tr
              className={classes.expansion}
              data-scope="table"
              data-part="expansion"
              id={expansionId}
            >
              <td colSpan={colspan}>{renderExpansion?.(row, index)}</td>
            </tr>
          ) : null}
        </Fragment>
      );
    });
  }

  const hasFooterContent = hasContent(footer);
  const hasPagination = pagination !== undefined;

  return (
    <div
      {...rest}
      ref={ref}
      className={cx('apui-table', classes.root, className)}
      data-surface={surface}
      data-density={resolvedDensity}
      data-sticky-header={stickyHeader ? '' : undefined}
      aria-busy={loading ? 'true' : undefined}
    >
      {hasTitle || hasContent(toolbar) ? (
        <div className={classes.toolbar} data-scope="table" data-part="toolbar">
          {hasTitle ? (
            <h3 className={classes.title} data-scope="table" data-part="title" id={titleId}>
              {title}
            </h3>
          ) : null}
          {toolbar}
        </div>
      ) : null}
      <div className={cx(classes.scroll, containerClassName)} data-scope="table" data-part="scroll">
        <table
          className={classes.table}
          data-scope="table"
          data-part="table"
          aria-label={label || undefined}
          aria-labelledby={!label && hasTitle ? titleId : undefined}
        >
          <thead className={headersHidden ? 'apui-sr-only' : undefined}>
            <tr>
              {selectable ? (
                <th className={classes.select} data-scope="table" data-part="select" scope="col">
                  <Checkbox
                    aria-label={selectAllLabel}
                    checked={allState === 'checked'}
                    indeterminate={allState === 'indeterminate'}
                    disabled={pageKeys.length === 0}
                    onCheckedChange={toggleAll}
                  />
                </th>
              ) : null}
              {expandable ? <td data-shrink="" /> : null}
              {columns.map((column) => {
                const content = renderHeader?.(column) ?? column.label ?? column.key;
                return (
                  <th
                    key={column.key}
                    className={cx(classes.headCell, column.class, column.className)}
                    data-scope="table"
                    data-part="head-cell"
                    scope="col"
                    aria-sort={column.sortable ? ariaSort(column) : undefined}
                    data-numeric={column.numeric ? '' : undefined}
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        className={classes.sort}
                        data-scope="table"
                        data-part="sort"
                        aria-label={fill(sortLabel, { column: columnName(column) })}
                        onClick={() => {
                          const direction = ariaSort(column) === 'ascending' ? 'desc' : 'asc';
                          onSortChange?.({ column: column.key, direction });
                          onSort?.({ key: column.key, direction });
                        }}
                      >
                        {content}
                        <IconSvg name={sortIcon(column)} />
                      </button>
                    ) : (
                      content
                    )}
                  </th>
                );
              })}
              {hasActions ? (
                <th
                  className={classes.headCell}
                  data-scope="table"
                  data-part="head-cell"
                  scope="col"
                  data-shrink=""
                >
                  <span className="apui-sr-only">{actionsLabel}</span>
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>{body}</tbody>
        </table>
      </div>
      {hasFooterContent || hasPagination ? (
        <div className={classes.footer} data-scope="table" data-part="footer">
          {hasFooterContent ? <span>{footer}</span> : null}
          {hasPagination ? <Pagination {...pagination} /> : null}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Rows of structured data. Generic over the row type. The ref points at the
 * root `<div>`.
 *
 * @example
 * ```tsx
 * <Table
 *   title="Transactions"
 *   headers={[{ key: 'symbol', label: 'Product' }, { key: 'amount', label: 'Amount', numeric: true }]}
 *   rows={rows}
 *   selectable
 *   value={selected}
 *   onValueChange={setSelected}
 *   sortBy={sort}
 *   onSortChange={setSort}
 * />
 * ```
 */
export const Table = forwardRef(TableInner) as (<Row = Record<string, unknown>>(
  props: TableProps<Row> & RefAttributes<HTMLDivElement>,
) => ReactElement | null) & { displayName?: string };

Table.displayName = 'Table';
