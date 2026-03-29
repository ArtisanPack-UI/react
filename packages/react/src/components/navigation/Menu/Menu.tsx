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

export interface MenuItemType {
  /** Unique key for the item */
  key: string;
  /** Display label */
  label: ReactNode;
  /** Icon element */
  icon?: ReactNode;
  /** Disable this item */
  disabled?: boolean;
  /** Nested sub-items */
  children?: MenuItemType[];
  /** Custom link element rendered instead of button (for React Router / Inertia) */
  renderLink?: (props: { className: string; children: ReactNode; onClick: () => void }) => ReactElement;
}

export interface MenuProps extends Omit<HTMLAttributes<HTMLUListElement>, 'onChange'> {
  /** Menu items to render */
  items: MenuItemType[];
  /** Currently active item key */
  activeKey?: string;
  /** Callback when item is selected */
  onChange?: (key: string) => void;
  /** Horizontal layout */
  horizontal?: boolean;
  /** DaisyUI color for active item */
  color?: DaisyColor;
  /** Menu size */
  size?: Size;
  /** Compact spacing */
  compact?: boolean;
  /** Menu title */
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
 * Menu component with vertical/horizontal layout, active state, and keyboard navigation.
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
          ':scope > li > a:not([aria-disabled="true"]), :scope > li > button:not([disabled]), :scope > li > details[open] li > a:not([aria-disabled="true"]), :scope > li > details[open] li > button:not([disabled])',
        ),
      );
    };

    const handleKeyDown = (e: KeyboardEvent) => {
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
        return (
          <li key={item.key}>
            <details>
              <summary>{item.icon && <span aria-hidden="true">{item.icon}</span>}{item.label}</summary>
              <ul>
                {item.children.map((child) => renderItem(child))}
              </ul>
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
          compact && 'menu-compact',
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
