/**
 * @module Navbar
 *
 * The design-system Navbar (#56): the top bar, with a brand, the primary
 * links, a search and actions, as a full-width bar or an island. Renders the
 * `.apui-navbar` markup contract styled by `@artisanpack-ui/css`, every part
 * scoped `navbar`. Glass is a surface (D-006).
 *
 * Compose the links from {@link NavbarItem} children, or pass them as `links`.
 *
 * @packageDocumentation
 */

import {
  Children,
  createContext,
  forwardRef,
  useContext,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

import { cx, hasContent, type PartClasses } from '../../../internal/parts';
import { safeHref } from '../../../internal/url';

/** A full-width bar or a rounded island. */
export type NavbarLayout = 'bar' | 'island';

/** The bar's surface. */
export type NavbarSurface = 'default' | 'glass';

/** The parts a {@link Navbar} accepts extra classes for. `root` is the header. */
export type NavbarPart = 'root' | 'brand' | 'links' | 'link' | 'search' | 'actions';

/** One link in {@link NavbarProps.links}. */
export interface NavbarLinkData {
  label: ReactNode;
  href: string;
  /** Marks the current page: `aria-current="page"`. */
  current?: boolean;
}

const NavbarContext = createContext<PartClasses<NavbarPart> | null>(null);

/** Props for the {@link Navbar} component. Native `<header>` attributes go to the root. */
export interface NavbarProps extends HTMLAttributes<HTMLElement> {
  /** Emitted as `data-layout`. @defaultValue `'bar'` */
  layout?: NavbarLayout;
  /** Emitted as `data-surface`. Glass falls back to an opaque surface. @defaultValue `'default'` */
  surface?: NavbarSurface;
  /** Sticks to the top of the scrolling container. Emitted as `data-sticky`. @defaultValue `true` */
  sticky?: boolean;
  /** The brand at the start. */
  brand?: ReactNode;
  /** The primary links as data, rendering the same children as composition. Rendered before `children`. */
  links?: NavbarLinkData[];
  /** A search field; it takes the free space. */
  search?: ReactNode;
  /** Controls at the end. */
  actions?: ReactNode;
  /** Names the links' nav landmark. @defaultValue `'Main'` */
  label?: string;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<NavbarPart>;
}

/**
 * The top bar.
 *
 * @example
 * ```tsx
 * <Navbar brand={<a href="/">Horizon</a>} actions={<Button size="sm">Sign in</Button>}>
 *   <NavbarItem href="/properties" current>Properties</NavbarItem>
 *   <NavbarItem href="/analytics">Analytics</NavbarItem>
 * </Navbar>
 * ```
 */
export const Navbar = forwardRef<HTMLElement, NavbarProps>(
  (
    {
      layout = 'bar',
      surface = 'default',
      sticky = true,
      brand,
      links,
      search,
      actions,
      label = 'Main',
      classes = {},
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const hasLinks = (links?.length ?? 0) > 0 || Children.count(children) > 0;
    return (
      <NavbarContext.Provider value={classes}>
        <header
          {...rest}
          ref={ref}
          className={cx('apui-navbar', classes.root, className)}
          data-layout={layout}
          data-surface={surface}
          data-sticky={sticky ? '' : undefined}
        >
          {hasContent(brand) ? (
            <div data-scope="navbar" data-part="brand" className={classes.brand}>
              {brand}
            </div>
          ) : null}
          {hasLinks ? (
            <nav data-scope="navbar" data-part="links" aria-label={label} className={classes.links}>
              {links?.map((link, index) => (
                <NavbarItem key={`${link.href}-${index}`} href={link.href} current={link.current}>
                  {link.label}
                </NavbarItem>
              ))}
              {children}
            </nav>
          ) : null}
          {hasContent(search) ? (
            <div data-scope="navbar" data-part="search" className={classes.search}>
              {search}
            </div>
          ) : null}
          {hasContent(actions) ? (
            <div data-scope="navbar" data-part="actions" className={classes.actions}>
              {actions}
            </div>
          ) : null}
        </header>
      </NavbarContext.Provider>
    );
  },
);

Navbar.displayName = 'Navbar';

/** Props for the {@link NavbarItem} component. Native `<a>` attributes go to the link. */
export interface NavbarItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  /** Marks the current page: `aria-current="page"`. */
  current?: boolean;
}

/** A primary link of a {@link Navbar}. */
export const NavbarItem = forwardRef<HTMLAnchorElement, NavbarItemProps>(
  ({ current = false, href, className, ...rest }, ref) => {
    const classes = useContext(NavbarContext);
    if (!classes) throw new Error('<NavbarItem> must be used inside <Navbar>.');
    // A disallowed href (javascript:, data:, …) renders a plain non-link,
    // without handlers.
    const safe = safeHref(href);
    const attrs =
      safe === undefined
        ? Object.fromEntries(Object.entries(rest).filter(([name]) => !/^on[A-Z]/.test(name)))
        : rest;
    return (
      <a
        {...attrs}
        href={safe}
        ref={ref}
        data-scope="navbar"
        data-part="link"
        aria-current={current ? 'page' : undefined}
        className={cx(classes.link, className)}
      />
    );
  },
);

NavbarItem.displayName = 'NavbarItem';
