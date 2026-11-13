/**
 * @module Menu
 *
 * The design-system Menu (#56): a navigation list in a nav landmark, with
 * links, section titles, separators and collapsible sub-menus. Renders the
 * `.apui-menu` markup contract styled by `@artisanpack-ui/css`, every part
 * scoped `menu`. It is not an ARIA menu (that's DropdownMenu): sub-menus use
 * the disclosure pattern, a button with `aria-expanded`, so no behavior
 * engine is needed.
 *
 * Compose it from {@link MenuItem}, {@link MenuSub}, {@link MenuTitle} and
 * {@link MenuSeparator}, or pass the same structure as `items`.
 *
 * @packageDocumentation
 */

import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';

import { IconPart, IconSvg } from '../../../internal/icon';
import { cx, hasContent, type PartClasses } from '../../../internal/parts';
import { safeHref } from '../../../internal/url';

/** The parts a {@link Menu} accepts extra classes for. `root` is the nav. */
export type MenuPart =
  | 'root'
  | 'list'
  | 'item'
  | 'icon'
  | 'itemText'
  | 'badge'
  | 'chevron'
  | 'sub'
  | 'title'
  | 'separator';

/** A link in {@link MenuProps.items}. */
export interface MenuLinkData {
  type?: 'item';
  /** A stable React key; defaults to `href`, then the position. */
  key?: string;
  label: ReactNode;
  href?: string;
  icon?: ReactNode;
  badge?: ReactNode;
  current?: boolean;
  disabled?: boolean;
  /** Renders the link with a router's own component; see {@link MenuItemProps.renderLink}. */
  renderLink?: MenuItemProps['renderLink'];
}

/** A sub-menu in {@link MenuProps.items}. */
export interface MenuSubData {
  type?: 'sub';
  /** A stable React key; defaults to the position. */
  key?: string;
  label: ReactNode;
  icon?: ReactNode;
  /** A count or status at the end of the toggle. */
  badge?: ReactNode;
  /** Disables the toggle. */
  disabled?: boolean;
  /** Opens it initially. Defaults to whether it holds the current page. */
  open?: boolean;
  items: MenuItemData[];
}

/** A section title in {@link MenuProps.items}. */
export interface MenuTitleData {
  type: 'title';
  label: ReactNode;
}

/** A separator in {@link MenuProps.items}. */
export interface MenuSeparatorData {
  type: 'separator';
}

/** One entry of {@link MenuProps.items}. */
export type MenuItemData = MenuLinkData | MenuSubData | MenuTitleData | MenuSeparatorData;

interface MenuContextValue {
  collapsible: boolean;
  classes: PartClasses<MenuPart>;
}

const MenuContext = createContext<MenuContextValue | null>(null);

function useMenuContext(component: string): MenuContextValue {
  const context = useContext(MenuContext);
  if (!context) throw new Error(`<${component}> must be used inside <Menu>.`);
  return context;
}

/** Props for the {@link Menu} component. Native `<nav>` attributes go to the root. */
export interface MenuProps extends HTMLAttributes<HTMLElement> {
  /** The menu as data, rendering the same children as composition. Rendered before `children`. */
  items?: MenuItemData[];
  /**
   * Sub-menus open and close from their item. Off shows every sub-menu, with
   * its item as a plain heading. Emitted as `data-collapsible`. @defaultValue `true`
   */
  collapsible?: boolean;
  /** Names the nav landmark, such as `Main`. Name every Menu when a page has several navs. */
  label?: string;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<MenuPart>;
}

/** Renders `items` data as the composition components. */
function renderItems(items: MenuItemData[]): ReactNode {
  return items.map((item, index) => {
    if (item.type === 'separator') return <MenuSeparator key={`separator-${index}`} />;
    if (item.type === 'title') return <MenuTitle key={`title-${index}`}>{item.label}</MenuTitle>;
    if ('items' in item && Array.isArray(item.items)) {
      const sub = item as MenuSubData;
      return (
        <MenuSub
          key={sub.key ?? `sub-${index}`}
          label={sub.label}
          icon={sub.icon}
          badge={sub.badge}
          disabled={sub.disabled}
          defaultOpen={sub.open}
        >
          {renderItems(sub.items)}
        </MenuSub>
      );
    }
    const { label, type: _type, key, ...props } = item as MenuLinkData;
    return (
      <MenuItem key={key ?? props.href ?? `item-${index}`} {...props}>
        {label}
      </MenuItem>
    );
  });
}

/**
 * A navigation list in a nav landmark.
 *
 * @example
 * ```tsx
 * <Menu label="Main">
 *   <MenuItem href="/dashboard" icon="list" current>Dashboard</MenuItem>
 *   <MenuSub label="Properties" icon="settings">
 *     <MenuItem href="/properties">All properties</MenuItem>
 *   </MenuSub>
 *   <MenuTitle>Settings</MenuTitle>
 *   <MenuItem href="/team" icon="user">Team</MenuItem>
 * </Menu>
 * ```
 */
export const Menu = forwardRef<HTMLElement, MenuProps>(
  ({ items, collapsible = true, label, classes = {}, className, children, ...rest }, ref) => (
    <MenuContext.Provider value={{ collapsible, classes }}>
      <nav
        aria-label={label}
        {...rest}
        ref={ref}
        className={cx('apui-menu', classes.root, className)}
        data-collapsible={collapsible ? '' : undefined}
      >
        <ul data-scope="menu" data-part="list" className={classes.list}>
          {items ? renderItems(items) : null}
          {children}
        </ul>
      </nav>
    </MenuContext.Provider>
  ),
);

Menu.displayName = 'Menu';

/** An item's icon, label and badge. */
function ItemContent({
  icon,
  badge,
  children,
  classes,
}: {
  icon?: ReactNode;
  badge?: ReactNode;
  children?: ReactNode;
  classes: PartClasses<MenuPart>;
}) {
  return (
    <>
      <IconPart
        scope="menu"
        part="icon"
        name={typeof icon === 'string' ? icon : undefined}
        node={typeof icon === 'string' ? undefined : icon}
        mirror
        className={classes.icon}
      />
      <span data-scope="menu" data-part="item-text" className={classes.itemText}>
        {children}
      </span>
      {hasContent(badge) ? (
        <span data-scope="menu" data-part="badge" className={classes.badge}>
          {badge}
        </span>
      ) : null}
    </>
  );
}

/** Props for the {@link MenuItem} component. Native attributes go to the link or button. */
export interface MenuItemProps extends AnchorHTMLAttributes<HTMLElement> {
  /** The link's destination. Without one, the item is a button (for `onClick`). */
  href?: string;
  /** An icon name from the registry, or a node, before the label. */
  icon?: ReactNode;
  /** A count or status at the end of the item. */
  badge?: ReactNode;
  /** Marks the current page: `aria-current="page"`. */
  current?: boolean;
  /** Disables the item: no href, `aria-disabled`, out of the Tab order. */
  disabled?: boolean;
  /**
   * Renders the link with a router's own component, such as Inertia's `<Link>`.
   * Used only for an enabled item with an `href`. It receives the part's props,
   * which the link should spread so the markup matches a plain item: the
   * item's other attributes and handlers (`onClick`, …) and the forwarded `ref`
   * come with them.
   */
  renderLink?: (
    props: AnchorHTMLAttributes<HTMLElement> & {
      href: string;
      className?: string;
      children: ReactNode;
      'data-scope': 'menu';
      'data-part': 'item';
      'aria-current'?: 'page';
      ref?: Ref<HTMLElement>;
    },
  ) => ReactElement;
}

/** A link (or button) in a {@link Menu}. */
export const MenuItem = forwardRef<HTMLElement, MenuItemProps>(
  (
    {
      href,
      icon,
      badge,
      current = false,
      disabled = false,
      renderLink,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const { classes } = useMenuContext('MenuItem');
    const shared = {
      'data-scope': 'menu' as const,
      'data-part': 'item' as const,
      className: cx(classes.item, className),
      'aria-current': current ? ('page' as const) : undefined,
    };
    const content = (
      <ItemContent icon={icon} badge={badge} classes={classes}>
        {children}
      </ItemContent>
    );
    const safe = safeHref(href);
    // A disallowed href (javascript:, data:, …) renders a plain non-link.
    const unsafe = href !== undefined && safe === undefined;
    if (renderLink && safe !== undefined && !disabled) {
      return <li>{renderLink({ ...rest, ...shared, ref, href: safe, children: content })}</li>;
    }
    if (disabled || unsafe) {
      // No href and no handlers: a disabled item (or one whose href was
      // dropped) can't be followed or clicked.
      return (
        <li>
          <a
            {...withoutHandlers(rest)}
            {...shared}
            ref={ref as never}
            aria-disabled={disabled ? 'true' : undefined}
            tabIndex={disabled ? -1 : undefined}
          >
            {content}
          </a>
        </li>
      );
    }
    return (
      <li>
        {safe !== undefined ? (
          <a {...rest} {...shared} ref={ref as never} href={safe}>
            {content}
          </a>
        ) : (
          <button
            {...(rest as HTMLAttributes<HTMLButtonElement>)}
            {...shared}
            ref={ref as never}
            type="button"
          >
            {content}
          </button>
        )}
      </li>
    );
  },
);

MenuItem.displayName = 'MenuItem';

/** Whether any element in `children` (recursively) is marked `current`. */
/** The attributes without event handlers (`on*`). */
function withoutHandlers<T extends object>(attrs: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(attrs).filter(([name]) => !/^on[A-Z]/.test(name)),
  ) as Partial<T>;
}

function holdsCurrent(children: ReactNode): boolean {
  let found = false;
  Children.forEach(children, (child) => {
    if (found || !isValidElement(child)) return;
    const props = child.props as { current?: boolean; children?: ReactNode };
    if (props.current) found = true;
    else if (props.children) found = holdsCurrent(props.children);
  });
  return found;
}

/** Props for the {@link MenuSub} component. Native `<li>` attributes go to its list item. */
export interface MenuSubProps extends Omit<HTMLAttributes<HTMLLIElement>, 'onToggle'> {
  /** The sub-menu's item label. */
  label: ReactNode;
  /** An icon name from the registry, or a node, before the label. */
  icon?: ReactNode;
  /** A count or status at the end of the toggle. */
  badge?: ReactNode;
  /** Disables the toggle. */
  disabled?: boolean;
  /** Whether it's open (controlled). Pair it with `onOpenChange`. */
  open?: boolean;
  /** The initial state when uncontrolled. Defaults to whether it holds the current page. */
  defaultOpen?: boolean;
  /** Called when its toggle opens or closes it. */
  onOpenChange?: (open: boolean) => void;
}

/** A collapsible sub-menu of a {@link Menu}: a toggle button and its list. */
export const MenuSub = forwardRef<HTMLLIElement, MenuSubProps>(
  (
    {
      label,
      icon,
      badge,
      disabled = false,
      open,
      defaultOpen,
      onOpenChange,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const { collapsible, classes } = useMenuContext('MenuSub');
    const id = useId();
    const current = holdsCurrent(children);
    const [own, setOwn] = useState(() => defaultOpen ?? current);
    // A child becoming current (navigating in a persistent layout) opens it:
    // adjust the state while rendering, as React recommends for derived
    // changes, and tell a controlling parent after the commit.
    const [prevCurrent, setPrevCurrent] = useState(current);
    if (current !== prevCurrent) {
      setPrevCurrent(current);
      if (current && open === undefined) setOwn(true);
    }
    const wasCurrent = useRef(current);
    useEffect(() => {
      if (current && !wasCurrent.current) onOpenChange?.(true);
      wasCurrent.current = current;
    }, [current, onOpenChange]);
    const isOpen = !collapsible || (open ?? own);
    const content = (
      <ItemContent icon={icon} badge={badge} classes={classes}>
        {label}
      </ItemContent>
    );

    return (
      <li {...rest} ref={ref} className={className}>
        {collapsible ? (
          <button
            type="button"
            data-scope="menu"
            data-part="item"
            className={classes.item}
            aria-expanded={isOpen}
            aria-controls={id}
            disabled={disabled || undefined}
            aria-disabled={disabled ? 'true' : undefined}
            onClick={() => {
              const next = !isOpen;
              if (open === undefined) setOwn(next);
              onOpenChange?.(next);
            }}
          >
            {content}
            <span
              data-scope="menu"
              data-part="chevron"
              aria-hidden="true"
              data-mirror=""
              className={classes.chevron}
            >
              <IconSvg name="chevron-right" />
            </span>
          </button>
        ) : (
          <span data-scope="menu" data-part="item" className={classes.item}>
            {content}
          </span>
        )}
        <ul data-scope="menu" data-part="sub" id={id} hidden={!isOpen} className={classes.sub}>
          {children}
        </ul>
      </li>
    );
  },
);

MenuSub.displayName = 'MenuSub';

/** Props for the {@link MenuTitle} component. */
export type MenuTitleProps = HTMLAttributes<HTMLLIElement>;

/** A section title between items of a {@link Menu}. */
export const MenuTitle = forwardRef<HTMLLIElement, MenuTitleProps>(
  ({ className, ...rest }, ref) => {
    const { classes } = useMenuContext('MenuTitle');
    return (
      <li
        {...rest}
        ref={ref}
        data-scope="menu"
        data-part="title"
        className={cx(classes.title, className)}
      />
    );
  },
);

MenuTitle.displayName = 'MenuTitle';

/** Props for the {@link MenuSeparator} component. */
export type MenuSeparatorProps = HTMLAttributes<HTMLLIElement>;

/** A rule between items of a {@link Menu}, hidden from assistive technology. */
export const MenuSeparator = forwardRef<HTMLLIElement, MenuSeparatorProps>(
  ({ className, ...rest }, ref) => {
    const { classes } = useMenuContext('MenuSeparator');
    return (
      <li
        {...rest}
        ref={ref}
        data-scope="menu"
        data-part="separator"
        aria-hidden="true"
        className={cx(classes.separator, className)}
      />
    );
  },
);

MenuSeparator.displayName = 'MenuSeparator';
