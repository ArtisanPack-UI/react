/**
 * @module UserMenu
 *
 * The design-system UserMenu (#58): the account menu, composed from
 * {@link Avatar} and {@link DropdownMenu} on the same menu machine
 * (`useDropdownMenu`). The panel is `.apui-dropdown-menu.apui-user-menu`; the
 * trigger, header and theme control are scoped `user-menu`, and the items keep
 * the dropdown-menu scope (D-019).
 *
 * @packageDocumentation
 */

import { useDropdownMenu } from '@artisanpack-ui/behavior/react';
import { forwardRef, useCallback, useRef, type HTMLAttributes, type ReactNode } from 'react';

import { IconSvg } from '../../../internal/icon';
import { mergePartProps } from '../../../internal/merge';
import { cx, hasContent, type PartClasses } from '../../../internal/parts';
import { Portal } from '../../../internal/portal';
import { Avatar, avatarColor, avatarInitials, type AvatarStatus } from '../../data/Avatar/Avatar';
import {
  DropdownMenuContext,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  type DropdownMenuAlign,
  type DropdownMenuCheckedChange,
  type DropdownMenuContextValue,
  type DropdownMenuItemData,
  type DropdownMenuPart,
  type DropdownMenuSurface,
  type RegisteredItem,
} from '../DropdownMenu/DropdownMenu';

/** A theme the theme control offers. */
export type UserMenuTheme = 'light' | 'dark' | 'system';

/** Who is signed in. */
export interface UserMenuUser {
  name: string;
  email?: string;
  /** An image URL for the avatar. */
  avatar?: string;
  /** The line under the name in the trigger, such as "Admin · Apexify". */
  role?: string;
  status?: AvatarStatus;
}

/** A workspace to switch to. */
export interface UserMenuWorkspace {
  id: string;
  name: string;
}

/** The parts a {@link UserMenu} accepts extra classes for, the menu's included. */
export type UserMenuPart =
  | DropdownMenuPart
  | 'avatar'
  | 'identity'
  | 'name'
  | 'role'
  | 'indicator'
  | 'header'
  | 'email'
  | 'theme'
  | 'themeOptions';

const THEME_ICONS: Record<UserMenuTheme, string> = {
  light: 'sun',
  dark: 'moon',
  system: 'monitor',
};

/** Props for the {@link UserMenu} component. Native `<div>` attributes go to the panel. */
export interface UserMenuProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Who is signed in. */
  user: UserMenuUser;
  /** Workspaces to switch between; two or more render a Workspace group. */
  workspaces?: UserMenuWorkspace[];
  /** The current workspace's id. */
  workspace?: string;
  /** Called with a workspace's id when it's chosen; checking it stays yours. */
  onWorkspaceChange?: (id: string) => void;
  /** Hides the theme control. @defaultValue `false` */
  hideTheme?: boolean;
  /** The checked theme. @defaultValue `'system'` */
  theme?: UserMenuTheme;
  /** Called when a theme is chosen; applying it stays yours. */
  onThemeChange?: (theme: UserMenuTheme) => void;
  /** Items between the theme control and Log out, as DropdownMenu items data. */
  items?: DropdownMenuItemData[];
  /** Shows only the avatar in the trigger; the name stays its accessible name. @defaultValue `false` */
  compact?: boolean;
  /** Whether the menu is open (controlled). Pair it with `onOpenChange`. */
  open?: boolean;
  /** The initial state of an uncontrolled menu. @defaultValue `false` */
  defaultOpen?: boolean;
  /** Called when the menu opens or closes itself. */
  onOpenChange?: (open: boolean) => void;
  /** Called with an item's value when it's chosen; Log out reports `logout`. */
  onSelect?: (value: string) => void;
  /** Which of the menu's edges lines up with the trigger's. @defaultValue `'start'` */
  align?: DropdownMenuAlign;
  /** The menu's surface. @defaultValue `'overlay'` */
  surface?: DropdownMenuSurface;
  /** Renders the menu at the end of the body (a React portal). @defaultValue `true` */
  portal?: boolean;
  /** The workspace group's label; translate it. @defaultValue `'Workspace'` */
  workspaceLabel?: string;
  /** The theme group's label; translate it. @defaultValue `'Theme'` */
  themeLabel?: string;
  /** The theme options' names; translate them. @defaultValue `{ light: 'Light', dark: 'Dark', system: 'System' }` */
  themeLabels?: Partial<Record<UserMenuTheme, string>>;
  /** The last item's label; translate it. @defaultValue `'Log out'` */
  logoutLabel?: string;
  /** Replaces the trigger's content (avatar, name and role). */
  trigger?: ReactNode;
  /** Extra classes per part, the menu's included; `classes.root` (the panel) merges with `className`. */
  classes?: PartClasses<UserMenuPart>;
}

/**
 * The account menu: identity, workspace switcher, theme, your items and Log
 * out, last. Compose more DropdownMenuItem children after `items`. The ref
 * points at the panel.
 *
 * @example
 * ```tsx
 * <UserMenu user={{ name: 'Olivia Rhye', email: 'olivia@company.com' }} onSelect={go} />
 * ```
 */
export const UserMenu = forwardRef<HTMLDivElement, UserMenuProps>(
  (
    {
      user,
      workspaces = [],
      workspace,
      onWorkspaceChange,
      hideTheme = false,
      theme = 'system',
      onThemeChange,
      items,
      compact = false,
      open,
      defaultOpen,
      onOpenChange,
      onSelect,
      align = 'start',
      surface = 'overlay',
      portal = true,
      workspaceLabel = 'Workspace',
      themeLabel = 'Theme',
      themeLabels = {},
      logoutLabel = 'Log out',
      trigger,
      classes = {},
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const registry = useRef(new Map<string, RegisteredItem>());
    const api = useDropdownMenu({
      open,
      defaultOpen,
      align,
      onOpenChange: ({ open: next }) => onOpenChange?.(next),
      onSelect: ({ value }) => {
        const item = registry.current.get(value);
        if (item && item.type !== 'item') return;
        item?.onSelect?.(value);
        onSelect?.(value);
      },
    });
    const register = useCallback((value: string, item: RegisteredItem) => {
      registry.current.set(value, item);
      return () => {
        if (registry.current.get(value) === item) registry.current.delete(value);
      };
    }, []);
    const onCheckedChange = ({ value }: DropdownMenuCheckedChange) => {
      if (value.startsWith('workspace:')) onWorkspaceChange?.(value.slice('workspace:'.length));
      else if (value.startsWith('theme:'))
        onThemeChange?.(value.slice('theme:'.length) as UserMenuTheme);
    };
    const context: DropdownMenuContextValue = { api, classes, onCheckedChange, register };

    const name = (user?.name ?? '').trim();
    const avatar = {
      initials: avatarInitials(name),
      color: avatarColor(name),
      src: user?.avatar || undefined,
      status: user?.status,
      className: classes.avatar,
      'data-scope': 'user-menu',
      'data-part': 'avatar',
    } as const;
    const labels: Record<UserMenuTheme, string> = {
      light: themeLabels.light ?? 'Light',
      dark: themeLabels.dark ?? 'Dark',
      system: themeLabels.system ?? 'System',
    };
    const options = workspaces.filter((option) => option && option.id !== undefined);
    const triggerProps = api.getTriggerProps();
    const checkedTheme: UserMenuTheme = theme in THEME_ICONS ? theme : 'system';

    return (
      <DropdownMenuContext.Provider value={context}>
        <button
          type="button"
          {...triggerProps}
          className={classes.trigger}
          data-scope="user-menu"
          data-part="trigger"
          data-avatar-only={compact ? '' : undefined}
          aria-label={compact ? name : undefined}
        >
          {hasContent(trigger) ? (
            trigger
          ) : (
            <>
              <Avatar {...avatar} size="sm" />
              {compact ? null : (
                <>
                  <span className={classes.identity} data-scope="user-menu" data-part="identity">
                    <span className={classes.name} data-scope="user-menu" data-part="name">
                      {name}
                    </span>
                    {user?.role ? (
                      <span className={classes.role} data-scope="user-menu" data-part="role">
                        {user.role}
                      </span>
                    ) : null}
                  </span>
                  <span
                    className={classes.indicator}
                    data-scope="user-menu"
                    data-part="indicator"
                    aria-hidden="true"
                  >
                    <IconSvg name="chevrons-up-down" />
                  </span>
                </>
              )}
            </>
          )}
        </button>
        <Portal enabled={portal}>
          <div {...api.getPositionerProps()} className={classes.positioner}>
            <div
              {...mergePartProps(rest, api.getContentProps())}
              ref={ref}
              className={cx('apui-dropdown-menu', 'apui-user-menu', classes.root, className)}
              data-surface={surface}
              data-align={align}
            >
              <div className={classes.header} data-scope="user-menu" data-part="header">
                <Avatar {...avatar} />
                <span className={classes.identity} data-scope="user-menu" data-part="identity">
                  <span className={classes.name} data-scope="user-menu" data-part="name">
                    {name}
                  </span>
                  {user?.email ? (
                    <span className={classes.email} data-scope="user-menu" data-part="email">
                      {user.email}
                    </span>
                  ) : null}
                </span>
              </div>
              <DropdownMenuSeparator />
              {options.length > 1 ? (
                <>
                  <DropdownMenuGroup label={workspaceLabel}>
                    {options.map((option) => (
                      <DropdownMenuItem
                        key={option.id}
                        type="radio"
                        value={`workspace:${option.id}`}
                        checked={option.id === workspace}
                      >
                        {option.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                </>
              ) : null}
              {items ? renderItems(items) : null}
              {children}
              {hideTheme ? null : (
                <div className={classes.theme} data-scope="user-menu" data-part="theme">
                  <DropdownMenuGroup label={themeLabel}>
                    <div
                      className={classes.themeOptions}
                      data-scope="user-menu"
                      data-part="theme-options"
                    >
                      {(Object.keys(THEME_ICONS) as UserMenuTheme[]).map((option) => (
                        <DropdownMenuItem
                          key={option}
                          type="radio"
                          value={`theme:${option}`}
                          icon={THEME_ICONS[option]}
                          checked={option === checkedTheme}
                        >
                          {labels[option]}
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </DropdownMenuGroup>
                </div>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem value="logout" icon="log-out">
                {logoutLabel}
              </DropdownMenuItem>
            </div>
          </div>
        </Portal>
      </DropdownMenuContext.Provider>
    );
  },
);

UserMenu.displayName = 'UserMenu';

/** Renders `items` data as DropdownMenu children. */
function renderItems(items: DropdownMenuItemData[]): ReactNode {
  return items.map((item, index) => {
    if (item.type === 'separator') return <DropdownMenuSeparator key={`separator-${index}`} />;
    if (item.type === 'group') {
      return (
        <DropdownMenuGroup key={`group-${index}`} label={item.label}>
          {renderItems(item.items)}
        </DropdownMenuGroup>
      );
    }
    const { label, ...props } = item;
    return (
      <DropdownMenuItem key={item.value} {...props}>
        {label}
      </DropdownMenuItem>
    );
  });
}
