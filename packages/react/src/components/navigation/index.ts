/**
 * @module navigation
 *
 * Navigation component exports for the ArtisanPack UI React library.
 * Includes menus, breadcrumbs, pagination, steps, navbar, sidebar,
 * and spotlight search components.
 */

// Navigation components
export { Menu, MenuItem, MenuSub, MenuTitle, MenuSeparator } from './Menu/Menu';
export type {
  MenuProps,
  MenuItemProps,
  MenuSubProps,
  MenuTitleProps,
  MenuSeparatorProps,
  MenuPart,
  MenuItemData,
  MenuLinkData,
  MenuSubData,
  MenuTitleData,
  MenuSeparatorData,
} from './Menu/Menu';

export { Breadcrumbs, BreadcrumbsItem } from './Breadcrumbs/Breadcrumbs';
export type {
  BreadcrumbsProps,
  BreadcrumbsItemProps,
  BreadcrumbItem,
  BreadcrumbsPart,
} from './Breadcrumbs/Breadcrumbs';

export { Link } from './Link/Link';
export type { LinkProps, LinkTone, LinkPart } from './Link/Link';

export { Pagination, paginationRange } from './Pagination/Pagination';
export type { PaginationProps, PaginationPart } from './Pagination/Pagination';

export { Steps, Step } from './Steps/Steps';
export type {
  StepsProps,
  StepProps,
  StepItem,
  StepState,
  StepsOrientation,
  StepsPart,
} from './Steps/Steps';

export { Navbar, NavbarItem } from './Navbar/Navbar';
export type {
  NavbarProps,
  NavbarItemProps,
  NavbarLinkData,
  NavbarLayout,
  NavbarSurface,
  NavbarPart,
} from './Navbar/Navbar';

// Deprecated: replaced by AppShell (layout, #58).
export { Sidebar } from './Sidebar/Sidebar';
export type { SidebarProps } from './Sidebar/Sidebar';

export { Spotlight } from './Spotlight/Spotlight';
export type {
  SpotlightProps,
  SpotlightPart,
  SpotlightGroup,
  SpotlightResult,
} from './Spotlight/Spotlight';

// Deprecated: replaced by Spotlight (#57). SpotlightItem stays the deprecated
// component's item; Spotlight's is SpotlightResult.
export { SpotlightSearch } from './SpotlightSearch/SpotlightSearch';
export type { SpotlightSearchProps, SpotlightItem } from './SpotlightSearch/SpotlightSearch';
