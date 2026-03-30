/**
 * @module Tabs
 *
 * A tabbed interface component with accessible keyboard navigation
 * (Arrow keys, Home, End), vertical layout support, DaisyUI styling
 * variants, and controlled/uncontrolled active tab management.
 *
 * @packageDocumentation
 */

import {
  forwardRef,
  useEffect,
  useState,
  useId,
  type HTMLAttributes,
  type ReactNode,
  type KeyboardEvent,
  useRef,
} from 'react';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor, Size } from '@artisanpack-ui/tokens';

/**
 * Describes a single tab within the {@link Tabs} component.
 */
export interface TabItem {
  /** Unique identifier for this tab, used as the key for `activeTab` / `onChange`. */
  name: string;
  /** Label content displayed in the tab button. */
  label: ReactNode;
  /** Content rendered in the tab panel when this tab is active. */
  content: ReactNode;
  /** Whether this tab is disabled and cannot be selected. */
  disabled?: boolean;
  /** Optional icon displayed before the label in the tab button. */
  icon?: ReactNode;
}

/**
 * Props for the {@link Tabs} component.
 */
export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Array of tab definitions to render. Should be memoized (e.g. `useMemo`) to avoid unnecessary re-syncs of internal state. */
  tabs: TabItem[];
  /** Currently active tab name (controlled mode). */
  activeTab?: string;
  /** Tab name that is active on first render (uncontrolled mode). */
  defaultTab?: string;
  /** Callback fired when the active tab changes, receiving the new tab's `name`. */
  onChange?: (tabName: string) => void;
  /** DaisyUI visual variant for the tab list. @defaultValue `'bordered'` */
  variant?: 'bordered' | 'lifted' | 'boxed';
  /** Size of the tab buttons. */
  size?: Size;
  /** Render tabs vertically with the tab list on the left and content on the right. */
  vertical?: boolean;
  /** Render tabs vertically with the tab list on the right and content on the left. */
  verticalRight?: boolean;
  /** DaisyUI color applied to the active tab indicator. */
  color?: DaisyColor;
  /** Additional CSS class for the tab list container (`role="tablist"`). */
  tabListClassName?: string;
  /** Additional CSS class for the active tab panel. */
  panelClassName?: string;
  /** Additional CSS class applied to the active tab button. */
  activeTabClassName?: string;
}

const sizeMap: Record<Size, string> = {
  xs: 'tabs-xs',
  sm: 'tabs-sm',
  md: 'tabs-md',
  lg: 'tabs-lg',
};

type Variant = NonNullable<TabsProps['variant']>;

const variantMap: Record<Variant, string> = {
  bordered: 'tabs-bordered',
  lifted: 'tabs-lifted',
  boxed: 'tabs-boxed',
};

const colorMap: Record<DaisyColor, string> = {
  primary: 'tab-primary',
  secondary: 'tab-secondary',
  accent: 'tab-accent',
  success: 'tab-success',
  warning: 'tab-warning',
  error: 'tab-error',
  info: 'tab-info',
  neutral: 'tab-neutral',
};

/**
 * Returns the name of the first non-disabled tab, or an empty string
 * if all tabs are disabled.
 */
function firstSelectableTab(tabs: TabItem[]): string {
  return tabs.find((t) => !t.disabled)?.name ?? '';
}

/**
 * Checks whether a tab with the given `name` exists in the list and is
 * not disabled.
 */
function isSelectableTab(tabs: TabItem[], name: string | undefined): boolean {
  if (!name) return false;
  const tab = tabs.find((t) => t.name === name);
  return !!tab && !tab.disabled;
}

/**
 * Tabbed interface with accessible keyboard navigation, vertical layout,
 * and DaisyUI styling options.
 *
 * Implements WAI-ARIA Tabs pattern with `role="tablist"`, `role="tab"`,
 * and `role="tabpanel"`. Keyboard navigation uses Arrow keys for
 * adjacent tabs and Home/End for first/last. Automatically falls back
 * to the first selectable tab when the active tab becomes invalid.
 *
 * @example
 * ```tsx
 * const tabs = [
 *   { name: 'overview', label: 'Overview', content: <Overview /> },
 *   { name: 'details', label: 'Details', content: <Details /> },
 *   { name: 'settings', label: 'Settings', content: <Settings /> },
 * ];
 *
 * <Tabs tabs={tabs} defaultTab="overview" variant="lifted" />
 * ```
 *
 * @example
 * ```tsx
 * // Controlled vertical tabs
 * const [active, setActive] = useState('tab1');
 *
 * <Tabs
 *   tabs={myTabs}
 *   activeTab={active}
 *   onChange={setActive}
 *   vertical
 *   color="primary"
 * />
 * ```
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      tabs,
      activeTab,
      defaultTab,
      onChange,
      variant = 'bordered',
      size,
      vertical = false,
      verticalRight = false,
      color,
      tabListClassName,
      panelClassName,
      activeTabClassName,
      className,
      ...rest
    },
    ref,
  ) => {
    const autoId = useId();
    const tabListRef = useRef<HTMLDivElement>(null);

    const defaultActive = isSelectableTab(tabs, defaultTab)
      ? defaultTab!
      : firstSelectableTab(tabs);
    const [internalTab, setInternalTab] = useState(defaultActive);
    const isControlled = activeTab !== undefined;

    const current = isControlled
      ? isSelectableTab(tabs, activeTab)
        ? activeTab
        : firstSelectableTab(tabs)
      : isSelectableTab(tabs, internalTab)
        ? internalTab
        : firstSelectableTab(tabs);

    // Sync internalTab when tabs change and current selection becomes invalid
    /* eslint-disable react-hooks/set-state-in-effect -- intentional sync when tabs list changes */
    useEffect(() => {
      if (isControlled) return;
      if (!isSelectableTab(tabs, internalTab)) {
        setInternalTab(firstSelectableTab(tabs));
      }
    }, [tabs, isControlled, internalTab]);
    /* eslint-enable react-hooks/set-state-in-effect */

    const isVertical = vertical || verticalRight;

    const handleSelect = (name: string) => {
      const validName = isSelectableTab(tabs, name) ? name : firstSelectableTab(tabs);
      if (!isControlled) {
        setInternalTab(validName);
      }
      onChange?.(validName);
    };

    const enabledTabs = tabs.filter((t) => !t.disabled);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (enabledTabs.length === 0) return;

      const currentIndex = enabledTabs.findIndex((t) => t.name === current);
      let nextIndex: number | null = null;

      const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight';
      const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft';

      if (e.key === nextKey) {
        e.preventDefault();
        nextIndex = (currentIndex + 1) % enabledTabs.length;
      } else if (e.key === prevKey) {
        e.preventDefault();
        nextIndex = (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        nextIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        nextIndex = enabledTabs.length - 1;
      }

      if (nextIndex !== null) {
        const targetTab = enabledTabs[nextIndex];
        handleSelect(targetTab.name);
        const originalIndex = tabs.indexOf(targetTab);
        const btn = tabListRef.current?.querySelector<HTMLButtonElement>(
          `[data-tab-index="${originalIndex}"]`,
        );
        btn?.focus();
      }
    };

    const activeIndex = tabs.findIndex((t) => t.name === current);
    const activeTabItem = activeIndex >= 0 ? tabs[activeIndex] : undefined;

    const tabList = (
      <div
        ref={tabListRef}
        role="tablist"
        aria-orientation={isVertical ? 'vertical' : 'horizontal'}
        className={cn(
          'tabs',
          variant && variantMap[variant],
          size && sizeMap[size],
          isVertical && 'tabs-vertical min-w-48',
          tabListClassName,
        )}
        onKeyDown={handleKeyDown}
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.name}
            role="tab"
            type="button"
            data-tab-index={index}
            id={`tab-${autoId}-${index}`}
            aria-selected={current === tab.name}
            aria-controls={`tabpanel-${autoId}-${index}`}
            tabIndex={current === tab.name ? 0 : -1}
            disabled={tab.disabled}
            className={cn(
              'tab',
              isVertical && 'w-full justify-start',
              current === tab.name && 'tab-active',
              current === tab.name && color && colorMap[color],
              current === tab.name && activeTabClassName,
              tab.disabled && 'tab-disabled',
            )}
            onClick={() => handleSelect(tab.name)}
          >
            {tab.icon && (
              <span className="mr-1" aria-hidden="true">
                {tab.icon}
              </span>
            )}
            {tab.label}
          </button>
        ))}
      </div>
    );

    const panel =
      activeTabItem && activeIndex >= 0 ? (
        <div
          role="tabpanel"
          id={`tabpanel-${autoId}-${activeIndex}`}
          aria-labelledby={`tab-${autoId}-${activeIndex}`}
          tabIndex={0}
          className={cn(isVertical ? 'flex-1 pl-4' : 'p-4', panelClassName)}
        >
          {activeTabItem.content}
        </div>
      ) : null;

    return (
      <div ref={ref} className={cn(isVertical && 'flex', className)} {...rest}>
        {verticalRight ? (
          <>
            {panel}
            {tabList}
          </>
        ) : (
          <>
            {tabList}
            {panel}
          </>
        )}
      </div>
    );
  },
);

Tabs.displayName = 'Tabs';
