import { forwardRef, Fragment, useMemo, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@artisanpack-ui/tokens';
import type { Size } from '@artisanpack-ui/tokens';

export interface TableHeader<T = Record<string, unknown>> {
  key: string;
  label: ReactNode;
  sortable?: boolean;
  className?: string;
  render?: (value: unknown, row: T, index: number) => ReactNode;
}

export interface TableSortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface TableProps<T = Record<string, unknown>>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  headers: TableHeader<T>[];
  rows: T[];
  keyBy?: string;
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  size?: Size;
  noHeaders?: boolean;
  sortBy?: TableSortConfig;
  onSort?: (sort: TableSortConfig) => void;
  selectable?: boolean;
  selectedKeys?: Set<string | number>;
  onSelectionChange?: (keys: Set<string | number>) => void;
  selectableKey?: string;
  expandable?: boolean;
  expandableKey?: string;
  renderExpansion?: (row: T, index: number) => ReactNode;
  renderActions?: (row: T, index: number) => ReactNode;
  emptyText?: ReactNode;
  footer?: ReactNode;
  containerClassName?: string;
}

const sizeMap: Record<Size, string> = {
  xs: 'table-xs',
  sm: 'table-sm',
  md: 'table-md',
  lg: 'table-lg',
};

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
    const direction =
      sortBy?.key === key && sortBy.direction === 'asc' ? 'desc' : 'asc';
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
              const rowKey = getNestedValue(row, keyBy) as string | number ?? rowIndex;
              const expandKey = getNestedValue(row, expandableKey) as string | number ?? rowIndex;
              const selectKey = getNestedValue(row, selectableKey) as string | number ?? rowIndex;
              const isExpanded = expandedKeys.has(expandKey);
              const isSelected = selectedKeys?.has(selectKey);

              return (
                <Fragment key={rowKey}>
                  <tr
                    className={cn(
                      hoverable && 'hover',
                      isSelected && 'active',
                    )}
                  >
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
                                : (value as ReactNode) ?? ''}
                        </td>
                      );
                    })}
                    {hasActions && (
                      <td className="text-right">{renderActions!(row, rowIndex)}</td>
                    )}
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

export const Table = forwardRef(TableInner) as <T extends Record<string, unknown>>(
  props: TableProps<T> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement | null;

(Table as { displayName?: string }).displayName = 'Table';
