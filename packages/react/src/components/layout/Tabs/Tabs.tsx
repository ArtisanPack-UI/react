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

export interface TabItem {
  /** Unique tab name/key */
  name: string;
  /** Tab label */
  label: ReactNode;
  /** Tab panel content */
  content: ReactNode;
  /** Disable this tab */
  disabled?: boolean;
  /** Icon to show in the tab */
  icon?: ReactNode;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Tab items to render. Should be memoized (e.g. useMemo) to avoid unnecessary re-syncs of internal state. */
  tabs: TabItem[];
  /** Currently active tab name (controlled) */
  activeTab?: string;
  /** Default active tab name (uncontrolled) */
  defaultTab?: string;
  /** Callback when active tab changes */
  onChange?: (tabName: string) => void;
  /** Tab visual variant */
  variant?: 'bordered' | 'lifted' | 'boxed';
  /** Tab size */
  size?: Size;
  /** Vertical tab orientation (tabs on left, content on right) */
  vertical?: boolean;
  /** Vertical tabs on the right side (content on left, tabs on right) */
  verticalRight?: boolean;
  /** DaisyUI color for active tab */
  color?: DaisyColor;
  /** Custom CSS class for the tab list container */
  tabListClassName?: string;
  /** Custom CSS class for each tab panel */
  panelClassName?: string;
  /** Custom CSS class for the active tab */
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

/** Returns the name of the first non-disabled tab, or empty string */
function firstSelectableTab(tabs: TabItem[]): string {
  return tabs.find((t) => !t.disabled)?.name ?? '';
}

/** Checks if a tab name exists and is not disabled */
function isSelectableTab(tabs: TabItem[], name: string | undefined): boolean {
  if (!name) return false;
  const tab = tabs.find((t) => t.name === name);
  return !!tab && !tab.disabled;
}

/**
 * Tabbed interface with accessible keyboard navigation, vertical layout, and styling options.
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
      ? (isSelectableTab(tabs, activeTab) ? activeTab : firstSelectableTab(tabs))
      : (isSelectableTab(tabs, internalTab) ? internalTab : firstSelectableTab(tabs));

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
        nextIndex =
          (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
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

    const panel = activeTabItem && activeIndex >= 0 ? (
      <div
        role="tabpanel"
        id={`tabpanel-${autoId}-${activeIndex}`}
        aria-labelledby={`tab-${autoId}-${activeIndex}`}
        tabIndex={0}
        className={cn(
          isVertical ? 'flex-1 pl-4' : 'p-4',
          panelClassName,
        )}
      >
        {activeTabItem.content}
      </div>
    ) : null;

    return (
      <div
        ref={ref}
        className={cn(isVertical && 'flex', className)}
        {...rest}
      >
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
