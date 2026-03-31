/**
 * @module SpotlightSearch
 *
 * Command palette / search overlay component following the Cmd+K pattern.
 * Provides word-based substring filtering, grouped results, keyboard navigation
 * (arrow keys, Home, End, Enter), and custom link renderers for React Router or
 * Inertia integration.
 */

import {
  forwardRef,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useId,
  type HTMLAttributes,
  type ReactNode,
  type ReactElement,
  type KeyboardEvent,
} from 'react';
import { cn } from '@artisanpack-ui/tokens';

/**
 * Represents a searchable item displayed in the spotlight results list.
 */
export interface SpotlightItem {
  /** Unique key used for identification and rendering. */
  key: string;
  /** Primary display label used for search matching and display. */
  label: string;
  /** Optional secondary text displayed below the label. Also used for search matching. */
  description?: string;
  /** Optional icon element rendered before the label. */
  icon?: ReactNode;
  /** Group name for categorizing items under section headings in the results list. */
  group?: string;
  /** Additional keywords used for search matching beyond the label and description. */
  keywords?: string[];
  /**
   * Custom link renderer for integration with React Router, Inertia, or other routing libraries.
   * When provided, replaces the default clickable `<li>` element.
   */
  renderLink?: (props: {
    className: string;
    children: ReactNode;
    onClick: () => void;
  }) => ReactElement;
}

/**
 * Props for the {@link SpotlightSearch} component.
 */
export interface SpotlightSearchProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Whether the spotlight overlay is open (controlled). */
  open: boolean;
  /** Callback fired to close the spotlight (e.g., on Escape or backdrop click). */
  onClose: () => void;
  /** Array of items available for searching and selection. */
  items: SpotlightItem[];
  /** Callback fired when the user selects an item from the results. */
  onSelect?: (item: SpotlightItem) => void;
  /** Placeholder text for the search input field. @defaultValue 'Search…' */
  placeholder?: string;
  /** Custom filter function to override the default word-based substring matching. */
  filterFn?: (item: SpotlightItem, query: string) => boolean;
  /** Message or element displayed when no results match the query. @defaultValue 'No results found.' */
  emptyMessage?: ReactNode;
  /** Whether to register the Cmd+K / Ctrl+K global keyboard shortcut. @defaultValue true */
  shortcut?: boolean;
  /** Maximum number of filtered items to display. @defaultValue 20 */
  maxResults?: number;
}

/**
 * Default word-based substring filter. Matches if every whitespace-separated
 * query word appears as a substring within the item's label, description, or keywords.
 *
 * @param item - The spotlight item to test.
 * @param query - The user's search query string.
 * @returns `true` if the item matches the query.
 */
function defaultFilter(item: SpotlightItem, query: string): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return true;

  const words = q.split(/\s+/);
  const searchable = [item.label, item.description ?? '', ...(item.keywords ?? [])]
    .join(' ')
    .toLowerCase();

  return words.every((word) => searchable.includes(word));
}

/**
 * Command palette / search overlay with Cmd+K shortcut, keyboard navigation, and item filtering.
 *
 * Renders a modal dialog with a search input and a grouped, scrollable results list.
 * Supports full keyboard navigation, custom filtering, and item grouping.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false);
 *
 * <SpotlightSearch
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   items={[
 *     { key: 'home', label: 'Go to Home', group: 'Pages' },
 *     { key: 'settings', label: 'Open Settings', group: 'Actions' },
 *   ]}
 *   onSelect={(item) => navigate(item.key)}
 *   shortcut
 * />
 * ```
 */
export const SpotlightSearch = forwardRef<HTMLDivElement, SpotlightSearchProps>(
  (
    {
      open,
      onClose,
      items,
      onSelect,
      placeholder = 'Search…',
      filterFn,
      emptyMessage = 'No results found.',
      shortcut = true,
      maxResults = 20,
      className,
      ...rest
    },
    ref,
  ) => {
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const dialogRef = useRef<HTMLDivElement | null>(null);
    const autoId = useId();

    const filter = filterFn ?? defaultFilter;

    const limit = Math.max(0, maxResults);
    const flatItems = useMemo(
      () => items.filter((item) => filter(item, query)).slice(0, limit),
      [items, filter, query, limit],
    );

    const groups = useMemo(() => {
      const m = new Map<string, SpotlightItem[]>();
      for (const item of flatItems) {
        const g = item.group ?? '';
        if (!m.has(g)) m.set(g, []);
        m.get(g)!.push(item);
      }
      return m;
    }, [flatItems]);

    // Precompute item key -> index lookup for O(1) access in render
    const itemIndexMap = useMemo(() => {
      const map = new Map<string, number>();
      flatItems.forEach((item, i) => map.set(item.key, i));
      return map;
    }, [flatItems]);

    // Handle global keyboard shortcuts (Escape to close, Cmd+K to toggle)
    useEffect(() => {
      if (!open) return;

      const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        } else if (shortcut && (e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          onClose();
        }
      };

      document.addEventListener('keydown', handleGlobalKeyDown);
      return () => document.removeEventListener('keydown', handleGlobalKeyDown);
    }, [shortcut, open, onClose]);

    // Focus input when opening
    /* eslint-disable react-hooks/set-state-in-effect -- intentional reset on open transition */
    useEffect(() => {
      if (open) {
        setQuery('');
        setActiveIndex(-1);
        requestAnimationFrame(() => inputRef.current?.focus());
      }
    }, [open]);
    /* eslint-enable react-hooks/set-state-in-effect */

    const getListItems = useCallback((): HTMLElement[] => {
      if (!listRef.current) return [];
      return Array.from(listRef.current.querySelectorAll<HTMLElement>('[role="option"]'));
    }, []);

    const focusItem = useCallback(
      (index: number) => {
        setActiveIndex(index);
        const els = getListItems();
        els[index]?.scrollIntoView?.({ block: 'nearest' });
      },
      [getListItems],
    );

    const selectItem = useCallback(
      (item: SpotlightItem) => {
        onSelect?.(item);
        onClose();
      },
      [onSelect, onClose],
    );

    const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (flatItems.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = activeIndex < flatItems.length - 1 ? activeIndex + 1 : 0;
        focusItem(next);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const next = activeIndex > 0 ? activeIndex - 1 : flatItems.length - 1;
        focusItem(next);
      } else if (e.key === 'Home') {
        e.preventDefault();
        focusItem(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        focusItem(flatItems.length - 1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < flatItems.length) {
          selectItem(flatItems[activeIndex]);
        }
      }
    };

    const handleBackdropClick = () => {
      onClose();
    };

    if (!open) return null;

    const listboxId = `spotlight-listbox-${autoId}`;

    return (
      <div
        ref={ref}
        className={cn('fixed inset-0 z-50 flex items-start justify-center pt-[15vh]', className)}
        role="presentation"
        {...rest}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50"
          onClick={handleBackdropClick}
          aria-hidden="true"
          data-testid="backdrop"
        />

        {/* Dialog */}
        <div
          ref={dialogRef}
          role="dialog"
          aria-label="Spotlight search"
          className="relative w-full max-w-lg rounded-box bg-base-100 shadow-2xl overflow-hidden"
        >
          {/* Search input */}
          <div className="flex items-center gap-2 border-b border-base-300 px-4">
            <svg
              className="h-5 w-5 shrink-0 text-base-content/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              className="w-full border-0 bg-transparent py-3 text-base-content placeholder:text-base-content/40 focus:outline-none"
              placeholder={placeholder}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(-1);
              }}
              onKeyDown={handleInputKeyDown}
              role="combobox"
              aria-expanded="true"
              aria-haspopup="listbox"
              aria-autocomplete="list"
              aria-controls={listboxId}
              aria-activedescendant={
                activeIndex >= 0 ? `spotlight-item-${autoId}-${activeIndex}` : undefined
              }
              aria-label="Search"
            />
            <kbd className="kbd kbd-sm shrink-0">Esc</kbd>
          </div>

          {/* Results */}
          <ul ref={listRef} id={listboxId} role="listbox" className="max-h-72 overflow-y-auto p-2">
            {flatItems.length === 0 ? (
              <li className="px-4 py-8 text-center text-base-content/60" role="presentation">
                {emptyMessage}
              </li>
            ) : (
              Array.from(groups.entries()).map(([group, groupItems]) => (
                <li key={group} role="presentation">
                  {group && (
                    <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-base-content/50">
                      {group}
                    </div>
                  )}
                  <ul role="group" aria-label={group || undefined}>
                    {groupItems.map((item) => {
                      const globalIndex = itemIndexMap.get(item.key) ?? -1;
                      const isActive = globalIndex === activeIndex;

                      const content = (
                        <>
                          {item.icon && (
                            <span className="shrink-0" aria-hidden="true">
                              {item.icon}
                            </span>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="truncate">{item.label}</div>
                            {item.description && (
                              <div className="truncate text-xs text-base-content/50">
                                {item.description}
                              </div>
                            )}
                          </div>
                        </>
                      );

                      const optionClass = cn(
                        'flex cursor-pointer items-center gap-3 rounded-btn px-3 py-2',
                        isActive && 'bg-primary text-primary-content',
                      );

                      if (item.renderLink) {
                        return (
                          <li
                            key={item.key}
                            id={`spotlight-item-${autoId}-${globalIndex}`}
                            role="option"
                            aria-selected={isActive}
                            onMouseEnter={() => focusItem(globalIndex)}
                          >
                            {item.renderLink({
                              className: optionClass,
                              children: content,
                              onClick: () => selectItem(item),
                            })}
                          </li>
                        );
                      }

                      return (
                        <li
                          key={item.key}
                          id={`spotlight-item-${autoId}-${globalIndex}`}
                          role="option"
                          aria-selected={isActive}
                          className={optionClass}
                          onClick={() => selectItem(item)}
                          onMouseEnter={() => focusItem(globalIndex)}
                        >
                          {content}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    );
  },
);

SpotlightSearch.displayName = 'SpotlightSearch';
