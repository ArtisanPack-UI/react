/**
 * @module Menu
 *
 * Vertical or horizontal menu component with DaisyUI styling, active state management,
 * nested sub-menus via `<details>`, and full keyboard navigation (arrow keys, Home, End).
 * Supports custom link renderers for React Router or Inertia integration.
 */

import {
  forwardRef,
  useRef,
  type HTMLAttributes,
  type ReactNode,
  type ReactElement,
  type KeyboardEvent,
} from 'react';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor, Size } from '@artisanpack-ui/tokens';

/**
 * Represents a single menu item, optionally with nested children.
 */
export interface MenuItemType {
  /** Unique key used to identify this item for active state and selection callbacks. */
  key: string;
  /** Display label for the menu item. Can be a string or any React node. */
  label: ReactNode;
  /** Optional icon element displayed before the label. */
  icon?: ReactNode;
  /** Whether this item is disabled and non-interactive. */
  disabled?: boolean;
  /** Nested sub-items rendered inside a collapsible `<details>` element. */
  children?: MenuItemType[];
  /**
   * Custom link renderer for integration with React Router, Inertia, or other routing libraries.
   * When provided, replaces the default `<button>` element.
   */
  renderLink?: (props: {
    className: string;
    children: ReactNode;
    onClick: () => void;
    'aria-current'?: 'page';
  }) => ReactElement;
}

/**
 * Props for the {@link Menu} component.
 */
export interface MenuProps extends Omit<HTMLAttributes<HTMLUListElement>, 'onChange'> {
  /** Array of menu items to render. */
  items: MenuItemType[];
  /** Key of the currently active item. Highlights the matching item and auto-opens parent sub-menus. */
  activeKey?: string;
  /** Callback fired when a menu item is selected, receiving the item's key. */
  onChange?: (key: string) => void;
  /** Render the menu horizontally instead of vertically. */
  horizontal?: boolean;
  /** DaisyUI color variant applied to the active item. */
  color?: DaisyColor;
  /** Size variant for the menu (xs, sm, md, lg). */
  size?: Size;
  /** Use compact spacing between items. */
  compact?: boolean;
  /** Optional title displayed at the top of the menu. */
  title?: string;
}

const sizeMap: Record<Size, string> = {
  xs: 'menu-xs',
  sm: 'menu-sm',
  md: 'menu-md',
  lg: 'menu-lg',
};

const colorMap: Record<DaisyColor, string> = {
  primary: 'active:bg-primary active:text-primary-content',
  secondary: 'active:bg-secondary active:text-secondary-content',
  accent: 'active:bg-accent active:text-accent-content',
  success: 'active:bg-success active:text-success-content',
  warning: 'active:bg-warning active:text-warning-content',
  error: 'active:bg-error active:text-error-content',
  info: 'active:bg-info active:text-info-content',
  neutral: 'active:bg-neutral active:text-neutral-content',
};

const activeColorMap: Record<DaisyColor, string> = {
  primary: 'bg-primary text-primary-content',
  secondary: 'bg-secondary text-secondary-content',
  accent: 'bg-accent text-accent-content',
  success: 'bg-success text-success-content',
  warning: 'bg-warning text-warning-content',
  error: 'bg-error text-error-content',
  info: 'bg-info text-info-content',
  neutral: 'bg-neutral text-neutral-content',
};

/**
 * Recursively checks if the given `activeKey` matches any item in the subtree.
 *
 * @param items - Array of menu items to search through.
 * @param activeKey - The key to search for.
 * @returns `true` if a matching key is found in the item tree.
 */
function hasActiveDescendant(items: MenuItemType[], activeKey: string | undefined): boolean {
  if (!activeKey) return false;
  return items.some(
    (item) =>
      item.key === activeKey ||
      (item.children != null && hasActiveDescendant(item.children, activeKey)),
  );
}

/**
 * Menu component with vertical/horizontal layout, active state, and keyboard navigation.
 *
 * Renders a DaisyUI-styled `<ul>` with `role="menu"`. Supports nested sub-menus,
 * custom link renderers, and full keyboard navigation with arrow keys, Home, and End.
 *
 * @example
 * ```tsx
 * <Menu
 *   items={[
 *     { key: 'home', label: 'Home' },
 *     { key: 'about', label: 'About' },
 *     { key: 'settings', label: 'Settings', children: [
 *       { key: 'profile', label: 'Profile' },
 *       { key: 'account', label: 'Account' },
 *     ]},
 *   ]}
 *   activeKey="home"
 *   onChange={(key) => console.log('Selected:', key)}
 *   color="primary"
 * />
 * ```
 */
export const Menu = forwardRef<HTMLUListElement, MenuProps>(
  (
    {
      items,
      activeKey,
      onChange,
      horizontal = false,
      color,
      size,
      compact = false,
      title,
      className,
      onKeyDown: consumerOnKeyDown,
      ...rest
    },
    ref,
  ) => {
    const menuRef = useRef<HTMLUListElement | null>(null);

    const setRefs = (node: HTMLUListElement | null) => {
      menuRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLUListElement | null>).current = node;
      }
    };

    const getMenuItems = (): HTMLElement[] => {
      if (!menuRef.current) return [];
      return Array.from(
        menuRef.current.querySelectorAll<HTMLElement>(
          [
            ':scope > li > a:not([aria-disabled="true"])',
            ':scope > li > button:not([disabled])',
            ':scope > li > details > summary',
            ':scope > li > details[open] li > a:not([aria-disabled="true"])',
            ':scope > li > details[open] li > button:not([disabled])',
          ].join(', '),
        ),
      );
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
      consumerOnKeyDown?.(e);
      if (e.defaultPrevented) return;

      const items = getMenuItems();
      if (items.length === 0) return;

      const currentIndex = items.indexOf(document.activeElement as HTMLElement);
      let nextIndex: number | null = null;

      const nextKey = horizontal ? 'ArrowRight' : 'ArrowDown';
      const prevKey = horizontal ? 'ArrowLeft' : 'ArrowUp';

      if (e.key === nextKey) {
        e.preventDefault();
        nextIndex = (currentIndex + 1) % items.length;
      } else if (e.key === prevKey) {
        e.preventDefault();
        nextIndex = (currentIndex - 1 + items.length) % items.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        nextIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        nextIndex = items.length - 1;
      }

      if (nextIndex !== null) {
        items[nextIndex].focus();
      }
    };

    const renderItem = (item: MenuItemType) => {
      const isActive = activeKey === item.key;
      const linkClass = cn(
        color && colorMap[color],
        isActive && 'active',
        isActive && color && activeColorMap[color],
      );

      if (item.children && item.children.length > 0) {
        const childActive = hasActiveDescendant(item.children, activeKey);

        return (
          <li key={item.key}>
            <details open={childActive || undefined}>
              <summary className={cn(childActive && 'font-semibold')}>
                {item.icon && <span aria-hidden="true">{item.icon}</span>}
                {item.label}
              </summary>
              <ul role="menu">{item.children.map((child) => renderItem(child))}</ul>
            </details>
          </li>
        );
      }

      if (item.renderLink) {
        return (
          <li key={item.key}>
            {item.renderLink({
              className: linkClass,
              children: (
                <>
                  {item.icon && <span aria-hidden="true">{item.icon}</span>}
                  {item.label}
                </>
              ),
              onClick: () => onChange?.(item.key),
              'aria-current': isActive ? 'page' : undefined,
            })}
          </li>
        );
      }

      return (
        <li key={item.key}>
          <button
            type="button"
            className={linkClass}
            disabled={item.disabled}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onChange?.(item.key)}
          >
            {item.icon && <span aria-hidden="true">{item.icon}</span>}
            {item.label}
          </button>
        </li>
      );
    };

    return (
      <ul
        ref={setRefs}
        role="menu"
        className={cn(
          'menu',
          horizontal && 'menu-horizontal',
          compact && 'menu-sm',
          size && sizeMap[size],
          className,
        )}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {title && <li className="menu-title">{title}</li>}
        {items.map(renderItem)}
      </ul>
    );
  },
);

Menu.displayName = 'Menu';
