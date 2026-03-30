import { forwardRef, useMemo, type ReactElement } from 'react';
import { Link } from '@inertiajs/react';
import { Menu, type MenuProps, type MenuItemType } from '@artisanpack-ui/react';

export interface InertiaMenuItemType extends Omit<MenuItemType, 'renderLink' | 'children'> {
  /** Inertia route URL for this menu item */
  href?: string;
  /** Nested sub-items */
  children?: InertiaMenuItemType[];
}

export interface InertiaMenuProps extends Omit<MenuProps, 'items'> {
  /** Menu items with Inertia href support */
  items: InertiaMenuItemType[];
}

/**
 * Converts InertiaMenuItemType items to MenuItemType by injecting Inertia Link
 * via the `renderLink` prop for items that have an `href`.
 */
function toMenuItems(items: InertiaMenuItemType[]): MenuItemType[] {
  return items.map((item) => {
    const { href, children, ...rest } = item;

    const menuItem: MenuItemType = { ...rest };

    if (href) {
      menuItem.renderLink = (props): ReactElement => (
        <Link
          href={href}
          className={props.className}
          onClick={props.onClick}
          aria-current={props['aria-current']}
        >
          {props.children}
        </Link>
      );
    }

    if (children) {
      menuItem.children = toMenuItems(children);
    }

    return menuItem;
  });
}

/**
 * Menu pre-wired with Inertia's `<Link>` for client-side navigation.
 * Accepts `href` on each menu item instead of requiring `renderLink`.
 */
export const InertiaMenu = forwardRef<HTMLUListElement, InertiaMenuProps>(
  ({ items, ...rest }, ref) => {
    const menuItems = useMemo(() => toMenuItems(items), [items]);

    return <Menu ref={ref} items={menuItems} {...rest} />;
  },
);

InertiaMenu.displayName = 'InertiaMenu';
