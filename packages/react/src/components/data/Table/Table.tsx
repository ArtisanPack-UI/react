/**
 * @module Table
 *
 * Feature-rich data table component built on DaisyUI's table classes.
 * Supports sortable columns, row selection with checkboxes, expandable row details,
 * custom cell renderers, action columns, zebra striping, and empty state messaging.
 * Generic over the row data type for type-safe header definitions and render functions.
 */

import {
  forwardRef,
  Fragment,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '@artisanpack-ui/tokens';
import type { Size } from '@artisanpack-ui/tokens';

/**
 * Defines a column header for the {@link Table} component.
 *
 * @typeParam T - The row data type.
 */
export interface TableHeader<T = Record<string, unknown>> {
  /** Dot-notation key path to the row value for this column (e.g., 'user.name'). */
  key: string;
  /** Display label for the column header. */
  label: ReactNode;
  /** Whether this column is sortable. Requires `onSort` on the Table. */
  sortable?: boolean;
  /** Additional CSS class for the header and body cells. */
  className?: string;
  /** Custom render function for cells in this column. Receives the cell value, full row, and row index. */
  render?: (value: unknown, row: T, index: number) => ReactNode;
}

/**
 * Configuration for the current sort state of the table.
 */
export interface TableSortConfig {
  /** Column key currently being sorted. */
  key: string;
  /** Sort direction. */
  direction: 'asc' | 'desc';
}

/**
 * Props for the {@link Table} component.
 *
 * @typeParam T - The row data type. Must extend `Record<string, unknown>`.
 */
export interface TableProps<T = Record<string, unknown>> extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {
  /** Column header definitions. */
  headers: TableHeader<T>[];
  /** Array of row data objects. */
  rows: T[];
  /** Dot-notation key path used to derive unique keys for each row. @defaultValue 'id' */
  keyBy?: string;
  /** Whether to apply zebra striping to alternating rows. */
  striped?: boolean;
  /** Whether rows highlight on hover. @defaultValue true */
  hoverable?: boolean;
  /** Whether to use compact row padding. */
  compact?: boolean;
  /** DaisyUI size variant for the table (xs, sm, md, lg). */
  size?: Size;
  /** Whether to hide the table header row. */
  noHeaders?: boolean;
  /** Current sort configuration (controlled). */
  sortBy?: TableSortConfig;
  /** Callback fired when a sortable column header is clicked. */
  onSort?: (sort: TableSortConfig) => void;
  /** Whether to show row selection checkboxes. */
  selectable?: boolean;
  /** Set of currently selected row keys (controlled). */
  selectedKeys?: Set<string | number>;
  /** Callback fired when the selection changes. */
  onSelectionChange?: (keys: Set<string | number>) => void;
  /** Dot-notation key path used to derive the selectable key for each row. @defaultValue 'id' */
  selectableKey?: string;
  /** Whether rows can be expanded to show additional detail. */
  expandable?: boolean;
  /** Dot-notation key path used to derive the expandable key for each row. @defaultValue 'id' */
  expandableKey?: string;
  /** Render function for expanded row content. */
  renderExpansion?: (row: T, index: number) => ReactNode;
  /** Render function for the actions column on each row. */
  renderActions?: (row: T, index: number) => ReactNode;
  /** Content displayed when the rows array is empty. @defaultValue 'No data available.' */
  emptyText?: ReactNode;
  /** Content rendered in the table footer. */
  footer?: ReactNode;
  /** Additional CSS class for the outer scroll container. */
  containerClassName?: string;
}

const sizeMap: Record<Size, string> = {
  xs: 'table-xs',
  sm: 'table-sm',
  md: 'table-md',
  lg: 'table-lg',
};

/**
 * Retrieves a nested value from an object using a dot-notation path.
 *
 * @param obj - The source object to traverse.
 * @param path - Dot-notation key path (e.g., 'user.address.city').
 * @returns The resolved value, or `undefined` if the path does not exist.
 */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return '[Object]';
  }
}

/**
 * Internal Table implementation with generic type parameter.
 *
 * @typeParam T - The row data type.
 */
function TableInner<T extends Record<string, unknown>>(
  {
    headers,
    rows,
    keyBy = 'id',
    striped = false,
    hoverable = true,
    compact = false,
    size,
    noHeaders = false,
    sortBy,
    onSort,
    selectable = false,
    selectedKeys,
    onSelectionChange,
    selectableKey = 'id',
    expandable = false,
    expandableKey = 'id',
    renderExpansion,
    renderActions,
    emptyText = 'No data available.',
    footer,
    containerClassName,
    className,
    ...rest
  }: TableProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const [expandedKeys, setExpandedKeys] = useState<Set<string | number>>(new Set());

  const toggleExpand = (key: string | number) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleSort = (key: string) => {
    if (!onSort) return;
    const direction = sortBy?.key === key && sortBy.direction === 'asc' ? 'desc' : 'asc';
    onSort({ key, direction });
  };

  const allSelected = useMemo(
    () =>
      selectable &&
      rows.length > 0 &&
      rows.every((row) => {
        const key = getNestedValue(row, selectableKey) as string | number;
        return selectedKeys?.has(key);
      }),
    [selectable, rows, selectedKeys, selectableKey],
  );

  const toggleSelectAll = () => {
    if (!onSelectionChange) return;
    const base = new Set(selectedKeys ?? []);
    if (allSelected) {
      for (const row of rows) {
        base.delete(getNestedValue(row, selectableKey) as string | number);
      }
    } else {
      for (const row of rows) {
        base.add(getNestedValue(row, selectableKey) as string | number);
      }
    }
    onSelectionChange(base);
  };

  const toggleSelect = (key: string | number) => {
    if (!onSelectionChange) return;
    const base = new Set(selectedKeys ?? []);
    if (base.has(key)) base.delete(key);
    else base.add(key);
    onSelectionChange(base);
  };

  const hasActions = !!renderActions;
  const canExpand = expandable && !!renderExpansion;
  const totalCols =
    headers.length + (selectable ? 1 : 0) + (canExpand ? 1 : 0) + (hasActions ? 1 : 0);

  return (
    <div ref={ref} className={cn('overflow-x-auto', containerClassName)} {...rest}>
      <table
        className={cn(
          'table',
          striped && 'table-zebra',
          compact && 'table-compact',
          size && sizeMap[size],
          className,
        )}
      >
        {!noHeaders && (
          <thead>
            <tr>
              {selectable && (
                <th className="w-12">
                  <label>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      disabled={!onSelectionChange}
                      aria-label="Select all rows"
                    />
                  </label>
                </th>
              )}
              {canExpand && <th className="w-12" />}
              {headers.map((header) => (
                <th
                  key={header.key}
                  className={header.className}
                  aria-sort={
                    sortBy?.key === header.key
                      ? sortBy.direction === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : undefined
                  }
                >
                  {header.sortable && onSort ? (
                    <button
                      type="button"
                      className="flex items-center gap-1 w-full cursor-pointer select-none hover:bg-base-200 px-1 -mx-1 rounded"
                      onClick={() => handleSort(header.key)}
                    >
                      {header.label}
                      {sortBy?.key === header.key && (
                        <span aria-hidden="true">
                          {sortBy.direction === 'asc' ? '\u25B2' : '\u25BC'}
                        </span>
                      )}
                    </button>
                  ) : (
                    header.label
                  )}
                </th>
              ))}
              {hasActions && <th className="text-right">Actions</th>}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={totalCols} className="text-center py-8 opacity-60">
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => {
              const rowKey = (getNestedValue(row, keyBy) as string | number) ?? rowIndex;
              const expandKey = (getNestedValue(row, expandableKey) as string | number) ?? rowIndex;
              const selectKey = (getNestedValue(row, selectableKey) as string | number) ?? rowIndex;
              const isExpanded = expandedKeys.has(expandKey);
              const isSelected = selectedKeys?.has(selectKey);

              return (
                <Fragment key={rowKey}>
                  <tr className={cn(hoverable && 'hover', isSelected && 'active')}>
                    {selectable && (
                      <td>
                        <label>
                          <input
                            type="checkbox"
                            className="checkbox checkbox-sm"
                            checked={isSelected ?? false}
                            onChange={() => toggleSelect(selectKey)}
                            disabled={!onSelectionChange}
                            aria-label={`Select row ${rowIndex + 1}`}
                          />
                        </label>
                      </td>
                    )}
                    {canExpand && (
                      <td>
                        <button
                          type="button"
                          className="btn btn-ghost btn-xs"
                          onClick={() => toggleExpand(expandKey)}
                          aria-expanded={isExpanded}
                          aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className={cn(
                              'w-4 h-4 transition-transform',
                              isExpanded && 'rotate-90',
                            )}
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </td>
                    )}
                    {headers.map((header) => {
                      const value = getNestedValue(row, header.key);
                      return (
                        <td key={header.key} className={header.className}>
                          {header.render
                            ? header.render(value, row, rowIndex)
                            : typeof value === 'boolean'
                              ? String(value)
                              : value !== null && typeof value === 'object'
                                ? safeStringify(value)
                                : ((value as ReactNode) ?? '')}
                        </td>
                      );
                    })}
                    {hasActions && <td className="text-right">{renderActions!(row, rowIndex)}</td>}
                  </tr>
                  {canExpand && isExpanded && (
                    <tr key={`expand-${rowKey}`}>
                      <td colSpan={totalCols} className="bg-base-200 p-4">
                        {renderExpansion(row, rowIndex)}
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })
          )}
        </tbody>
        {footer && (
          <tfoot>
            <tr>
              <td colSpan={totalCols}>{footer}</td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}

/**
 * Feature-rich data table with sorting, selection, expandable rows, and custom rendering.
 *
 * Built on DaisyUI's `table` classes with full accessibility support including
 * `aria-sort` on sortable headers, `aria-expanded` on expandable row toggles,
 * and `aria-label` on selection checkboxes.
 *
 * @example
 * ```tsx
 * const headers = [
 *   { key: 'name', label: 'Name', sortable: true },
 *   { key: 'email', label: 'Email' },
 * ];
 *
 * <Table
 *   headers={headers}
 *   rows={users}
 *   keyBy="id"
 *   striped
 *   sortBy={{ key: 'name', direction: 'asc' }}
 *   onSort={setSortConfig}
 * />
 * ```
 */
export const Table = forwardRef(TableInner) as <T extends Record<string, unknown>>(
  props: TableProps<T> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement | null;

(Table as { displayName?: string }).displayName = 'Table';
