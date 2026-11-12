/**
 * @module AppShell
 *
 * The design-system AppShell (#58): the application frame. A sidebar island
 * (brand, navigation, footer) and a main column (an optional header, then
 * the content), separated by a gutter. Renders the `.apui-app-shell` markup
 * contract styled by `@artisanpack-ui/css`; parts are scoped `app-shell`.
 * A skip link to the main landmark comes first. The navigation is usually a
 * {@link Menu}; collapsed, its items show only their icons. Replaces the
 * 1.x `Sidebar`.
 *
 * @packageDocumentation
 */

import {
  forwardRef,
  useId,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

import { IconSvg } from '../../../internal/icon';
import { cx, flag, hasContent, type PartClasses } from '../../../internal/parts';

/** The parts an {@link AppShell} accepts extra classes for. */
export type AppShellPart =
  | 'root'
  | 'skipLink'
  | 'sidebar'
  | 'brand'
  | 'footer'
  | 'collapseTrigger'
  | 'main'
  | 'content';

/** Props for the {@link AppShell} component. Native `<div>` attributes go to the root. */
export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  /** Shrinks the sidebar to its icons. Emitted as `data-collapsed`. Seeds the state; changes to it are followed. */
  collapsed?: boolean;
  /** Called when the collapse button collapses or expands the sidebar. */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Adds the collapse button at the foot of the sidebar. Emitted as `data-collapsible`. */
  collapsible?: boolean;
  /** The expanded sidebar's width, any CSS length. Sets `--apui-sidebar-width`. */
  sidebarWidth?: string;
  /** The space around and between the islands. Sets `--apui-shell-gutter`. */
  gutter?: string;
  /** The brand at the top of the sidebar. */
  brand?: ReactNode;
  /** The sidebar's navigation, usually a Menu. */
  sidebar?: ReactNode;
  /** The bar at the top of the main column, usually a Navbar with `layout="island"`. */
  header?: ReactNode;
  /** The foot of the sidebar: the account. */
  footer?: ReactNode;
  /** Names the sidebar landmark. @defaultValue `'Sidebar'` */
  label?: string;
  /** The skip link's text. @defaultValue `'Skip to main content'` */
  skipLabel?: string;
  /** Names the collapse button. @defaultValue `'Collapse sidebar'` */
  collapseLabel?: string;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<AppShellPart>;
}

/**
 * The application frame.
 *
 * @example
 * ```tsx
 * <AppShell brand="Apexify" sidebar={<Menu items={items} />} header={<Navbar layout="island" />} collapsible>
 *   <PageHeader title="Dashboard" />
 * </AppShell>
 * ```
 */
export const AppShell = forwardRef<HTMLDivElement, AppShellProps>(
  (
    {
      collapsed = false,
      onCollapsedChange,
      collapsible = false,
      sidebarWidth,
      gutter,
      brand,
      sidebar,
      header,
      footer,
      label = 'Sidebar',
      skipLabel = 'Skip to main content',
      collapseLabel = 'Collapse sidebar',
      classes = {},
      className,
      style,
      children,
      ...rest
    },
    ref,
  ) => {
    const id = useId();
    const sidebarId = `${id}-sidebar`;
    const mainId = `${id}-main`;
    const [isCollapsed, setCollapsed] = useState(collapsed);
    // Follow the prop when it changes (state adjusted during render, not in an effect).
    const [seen, setSeen] = useState(collapsed);
    if (seen !== collapsed) {
      setSeen(collapsed);
      setCollapsed(collapsed);
    }

    const toggle = () => {
      const next = !isCollapsed;
      setCollapsed(next);
      onCollapsedChange?.(next);
    };

    const tokens: Record<string, string> = {};
    if (sidebarWidth) tokens['--apui-sidebar-width'] = sidebarWidth;
    if (gutter) tokens['--apui-shell-gutter'] = gutter;
    const rootStyle =
      Object.keys(tokens).length > 0 ? ({ ...style, ...tokens } as CSSProperties) : style;

    return (
      <div
        {...rest}
        ref={ref}
        className={cx('apui-app-shell', classes.root, className)}
        data-collapsed={flag(isCollapsed)}
        data-collapsible={flag(collapsible)}
        style={rootStyle}
      >
        <a
          data-scope="app-shell"
          data-part="skip-link"
          href={`#${mainId}`}
          className={classes.skipLink}
        >
          {skipLabel}
        </a>
        <aside
          data-scope="app-shell"
          data-part="sidebar"
          id={sidebarId}
          aria-label={label}
          className={classes.sidebar}
        >
          {hasContent(brand) ? (
            <div data-scope="app-shell" data-part="brand" className={classes.brand}>
              {brand}
            </div>
          ) : null}
          {sidebar}
          {hasContent(footer) || collapsible ? (
            <div data-scope="app-shell" data-part="footer" className={classes.footer}>
              {footer}
              {collapsible ? (
                <button
                  type="button"
                  data-scope="app-shell"
                  data-part="collapse-trigger"
                  aria-label={collapseLabel}
                  aria-pressed={isCollapsed ? 'true' : 'false'}
                  aria-controls={sidebarId}
                  className={classes.collapseTrigger}
                  onClick={toggle}
                >
                  <IconSvg name="chevron-left" />
                </button>
              ) : null}
            </div>
          ) : null}
        </aside>
        <main
          data-scope="app-shell"
          data-part="main"
          id={mainId}
          tabIndex={-1}
          className={classes.main}
        >
          {header}
          <div data-scope="app-shell" data-part="content" className={classes.content}>
            {children}
          </div>
        </main>
      </div>
    );
  },
);

AppShell.displayName = 'AppShell';
