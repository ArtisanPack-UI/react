/**
 * @module layout
 *
 * Layout components for structuring page content, managing visibility,
 * and organizing UI elements. Includes containers (Card, Grid, Stack),
 * interactive panels (Accordion, Collapse, Dialog, Drawer, Tabs), floating
 * surfaces (DropdownMenu, Popover), and visual separators (Divider).
 * Card, Dialog and DropdownMenu render the design-system markup contract
 * (styled by `@artisanpack-ui/css`); Modal and Dropdown are deprecated in
 * favor of Dialog and DropdownMenu.
 *
 * @packageDocumentation
 */

export { Accordion, AccordionItem } from './Accordion/Accordion';
export type {
  AccordionProps,
  AccordionItemProps,
  AccordionItemData,
  AccordionVariant,
  AccordionPart,
} from './Accordion/Accordion';

export { AppShell } from './AppShell/AppShell';
export type { AppShellProps, AppShellPart } from './AppShell/AppShell';

export { Card } from './Card/Card';
export type { CardProps, CardSurface, CardPart } from './Card/Card';

export { Collapse } from './Collapse/Collapse';
export type { CollapseProps, CollapseVariant, CollapsePart } from './Collapse/Collapse';

export { Dialog } from './Dialog/Dialog';
export type {
  DialogProps,
  DialogSize,
  DialogSurface,
  DialogRole,
  DialogColor,
  DialogPart,
} from './Dialog/Dialog';

export { Divider } from './Divider/Divider';
export type {
  DividerProps,
  DividerOrientation,
  DividerAlign,
  DividerStrength,
  DividerPart,
} from './Divider/Divider';

export { Drawer } from './Drawer/Drawer';
export type {
  DrawerProps,
  DrawerSide,
  DrawerSize,
  DrawerSurface,
  DrawerPart,
} from './Drawer/Drawer';

export { Dropdown, DropdownItem } from './Dropdown/Dropdown';
export type { DropdownProps, DropdownItemProps } from './Dropdown/Dropdown';

export {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from './DropdownMenu/DropdownMenu';
export type {
  DropdownMenuProps,
  DropdownMenuItemProps,
  DropdownMenuGroupProps,
  DropdownMenuSeparatorProps,
  DropdownMenuAlign,
  DropdownMenuSurface,
  DropdownMenuPart,
  DropdownMenuCheckedChange,
  DropdownMenuItemType,
  DropdownMenuItemData,
  DropdownMenuActionItemData,
  DropdownMenuOptionItemData,
  DropdownMenuSeparatorData,
  DropdownMenuGroupData,
} from './DropdownMenu/DropdownMenu';

export { Grid } from './Grid/Grid';
export type { GridProps, GridAlign, SpaceStep } from './Grid/Grid';

export { Modal } from './Modal/Modal';
export type { ModalProps } from './Modal/Modal';

export { Popover } from './Popover/Popover';
export type { PopoverProps, PopoverPlacement, PopoverPart } from './Popover/Popover';

export { PageHeader } from './PageHeader/PageHeader';
export type { PageHeaderProps, PageHeaderPart } from './PageHeader/PageHeader';

export { Stack } from './Stack/Stack';
export type { StackProps, StackOrientation, StackAlign, StackJustify } from './Stack/Stack';

export { Tabs, Tab } from './Tabs/Tabs';
export type {
  TabsProps,
  TabProps,
  TabData,
  TabsVariant,
  TabsSize,
  TabsOrientation,
  TabsActivationMode,
  TabsPart,
} from './Tabs/Tabs';

export { Heading } from './Heading/Heading';
export type { HeadingProps, HeadingStep, HeadingPart } from './Heading/Heading';

export { List, ListItem } from './ListItem/ListItem';
export type { ListProps, ListItemProps, ListVariant, ListItemPart } from './ListItem/ListItem';

export { Text } from './Text/Text';
export type { TextProps, TextElement, TextSize, TextTone, TextWeight } from './Text/Text';

export { UserMenu } from './UserMenu/UserMenu';
export type {
  UserMenuProps,
  UserMenuUser,
  UserMenuWorkspace,
  UserMenuTheme,
  UserMenuPart,
} from './UserMenu/UserMenu';
