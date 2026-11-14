import { forwardRef, useMemo, type ComponentProps, type ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import { Menu, type MenuItemData, type MenuProps } from '@artisanpack-ui/react/navigation';

/**
 * Menu item descriptor with Inertia `href` support.
 * Items with an `href` render Inertia's `<Link>` for client-side navigation;
 * items with `children` render a sub-menu; the rest render buttons.
 *
 * @see {@link InertiaMenuProps}
 */
export interface InertiaMenuItemType {
  /** Identifies the item, for {@link InertiaMenuProps.activeKey}. */
  key?: string;
  /** The item's text. */
  label: ReactNode;
  /** Inertia route URL for this menu item */
  href?: string;
  /** An icon name from the registry, or a node, before the label. */
  icon?: ReactNode;
  /** A count or status at the end of the item. */
  badge?: ReactNode;
  /** Disables the item. */
  disabled?: boolean;
  /** Nested sub-items; the item becomes a sub-menu. */
  children?: InertiaMenuItemType[];
}

/**
 * Props for the {@link InertiaMenu} component.
 * Extends the base `MenuProps` but accepts {@link InertiaMenuItemType} items.
 */
export interface InertiaMenuProps extends Omit<MenuProps, 'items'> {
  /** Menu items with Inertia href support */
  items: InertiaMenuItemType[];
  /** The `key` of the current page's item: it gets `aria-current="page"`. */
  activeKey?: string;
}

/** Whether an item or any of its descendants is the active one. */
function holdsActive(item: InertiaMenuItemType, activeKey?: string): boolean {
  if (activeKey === undefined) return false;
  if (item.key === activeKey) return true;
  return item.children?.some((child) => holdsActive(child, activeKey)) ?? false;
}

/** Converts InertiaMenuItemType items to Menu data, rendering links with Inertia's `<Link>`. */
function toMenuItems(items: InertiaMenuItemType[], activeKey?: string): MenuItemData[] {
  return items.map((item): MenuItemData => {
    const { key, href, children, ...rest } = item;

    if (children) {
      return {
        type: 'sub',
        key,
        label: rest.label,
        icon: rest.icon,
        badge: rest.badge,
        disabled: rest.disabled,
        // Opens initially when it holds the active item; the sub-menu also
        // opens itself when a child becomes current later (persistent layouts).
        open: holdsActive(item, activeKey) || undefined,
        items: toMenuItems(children, activeKey),
      };
    }

    return {
      ...rest,
      key,
      href,
      current: key !== undefined && key === activeKey,
      // The item's attributes, handlers and ref pass through to Inertia's Link.
      renderLink: href
        ? (props) => <Link {...(props as unknown as ComponentProps<typeof Link>)} />
        : undefined,
    };
  });
}

/**
 * Menu pre-wired with Inertia's `<Link>` for client-side navigation.
 * Accepts `href` on each menu item instead of requiring `renderLink`.
 *
 * @see {@link InertiaMenuItemType} for the item descriptor shape
 *
 * @example
 * ```tsx
 * <InertiaMenu
 *   activeKey="dashboard"
 *   items={[
 *     { key: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: 'house' },
 *     { key: 'users', label: 'Users', href: '/users' },
 *     { key: 'settings', label: 'Settings', children: [
 *       { key: 'profile', label: 'Profile', href: '/settings/profile' },
 *       { key: 'security', label: 'Security', href: '/settings/security' },
 *     ]},
 *   ]}
 * />
 * ```
 */
export const InertiaMenu = forwardRef<HTMLElement, InertiaMenuProps>(
  ({ items, activeKey, ...rest }, ref) => {
    const menuItems = useMemo(() => toMenuItems(items, activeKey), [items, activeKey]);

    return <Menu ref={ref} items={menuItems} {...rest} />;
  },
);

InertiaMenu.displayName = 'InertiaMenu';
