/**
 * @module SpotlightSearch
 *
 * Deprecated alias of {@link Spotlight}, kept for 1.x code. It maps the old
 * props onto Spotlight: `onClose` → `onOpenChange(false)`, `items` → `groups`
 * (one per item `group`, in order, with each item's `key` as its `value`),
 * `emptyMessage` → `emptyLabel` and `shortcut` → `'mod+k'` or off. It keeps
 * 1.x filtering, `filterFn` and `maxResults` by filtering the items itself
 * and passing them to Spotlight as `remote` results. `onSelect` still
 * receives the original item. An item's `icon` carries over only when it's an
 * icon name; `renderLink` has no equivalent and is ignored (give Spotlight
 * items an `href`).
 *
 * @deprecated Use `Spotlight`.
 * @packageDocumentation
 */

import { forwardRef, useMemo, useState, type ReactElement, type ReactNode } from 'react';

import { devWarnOnce } from '../../../internal/parts';
import { Spotlight, type SpotlightGroup, type SpotlightProps } from '../Spotlight/Spotlight';

/**
 * An item of the deprecated {@link SpotlightSearch}.
 *
 * @deprecated Use `SpotlightResult` in a `SpotlightGroup`.
 */
export interface SpotlightItem {
  /** Unique key, used as the Spotlight item's `value`. */
  key: string;
  /** The text shown and searched. */
  label: string;
  /** Secondary text under the label, searched too. */
  description?: string;
  /** An icon name from the registry. Other nodes aren't drawn. */
  icon?: ReactNode;
  /** The group heading the item is listed under. */
  group?: string;
  /** More words the search matches. */
  keywords?: string[];
  /** Ignored: Spotlight items take an `href` instead. */
  renderLink?: (props: {
    className: string;
    children: ReactNode;
    onClick: () => void;
  }) => ReactElement;
}

/**
 * Props for the deprecated {@link SpotlightSearch}.
 *
 * @deprecated Use `SpotlightProps`.
 */
export interface SpotlightSearchProps extends Omit<
  SpotlightProps,
  | 'open'
  | 'defaultOpen'
  | 'onOpenChange'
  | 'groups'
  | 'onSelect'
  | 'shortcut'
  | 'remote'
  | 'search'
  | 'onSearchChange'
> {
  /** Whether the palette is open. */
  open: boolean;
  /** Called when the palette asks to close. Use Spotlight's `onOpenChange`. */
  onClose: () => void;
  /** The items. Use Spotlight's `groups`. */
  items: SpotlightItem[];
  /** Called with the chosen item. */
  onSelect?: (item: SpotlightItem) => void;
  /** Replaces the default word-based filter. Spotlight has no custom filter: use `remote`. */
  filterFn?: (item: SpotlightItem, query: string) => boolean;
  /** Shown when nothing matches. Use Spotlight's `emptyLabel`. @defaultValue `'No results found.'` */
  emptyMessage?: ReactNode;
  /** Registers ⌘K / Ctrl+K. Use Spotlight's `shortcut` string. @defaultValue `true` */
  shortcut?: boolean;
  /** The most items listed. Spotlight has no cap. @defaultValue `20` */
  maxResults?: number;
}

/** The 1.x filter: every query word appears in the label, description or keywords. */
function defaultFilter(item: SpotlightItem, query: string): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return true;
  const searchable = [item.label, item.description ?? '', ...(item.keywords ?? [])]
    .join(' ')
    .toLowerCase();
  return q.split(/\s+/).every((word) => searchable.includes(word));
}

/** Groups 1.x items by their `group`, in first-seen order. */
function toGroups(items: SpotlightItem[]): SpotlightGroup[] {
  const groups = new Map<string, SpotlightGroup>();
  for (const item of items) {
    const key = item.group ?? '';
    if (!groups.has(key)) groups.set(key, { id: key || undefined, label: item.group, items: [] });
    groups.get(key)!.items.push({
      value: item.key,
      label: item.label,
      description: item.description,
      icon: typeof item.icon === 'string' ? item.icon : undefined,
      keywords: item.keywords,
    });
  }
  return [...groups.values()];
}

/**
 * Deprecated: renders a {@link Spotlight}. The ref points at the panel.
 *
 * @deprecated Use `Spotlight`.
 */
export const SpotlightSearch = forwardRef<HTMLDivElement, SpotlightSearchProps>(
  (
    {
      open,
      onClose,
      items,
      onSelect,
      filterFn,
      emptyMessage = 'No results found.',
      shortcut = true,
      maxResults = 20,
      emptyLabel,
      ...rest
    },
    ref,
  ) => {
    devWarnOnce('SpotlightSearch', 'SpotlightSearch is deprecated; use Spotlight.');
    const [query, setQuery] = useState('');
    const filter = filterFn ?? defaultFilter;
    const matches = useMemo(
      () => items.filter((item) => filter(item, query)).slice(0, Math.max(0, maxResults)),
      [items, filter, query, maxResults],
    );

    return (
      <Spotlight
        {...rest}
        ref={ref}
        open={open}
        onOpenChange={(next) => {
          if (!next) onClose();
        }}
        groups={toGroups(matches)}
        remote
        search={query}
        onSearchChange={setQuery}
        onSelect={(chosen) => {
          const item = items.find((candidate) => candidate.key === chosen.value);
          if (item) onSelect?.(item);
        }}
        shortcut={shortcut ? 'mod+k' : ''}
        emptyLabel={emptyLabel ?? emptyMessage}
      />
    );
  },
);

SpotlightSearch.displayName = 'SpotlightSearch';
