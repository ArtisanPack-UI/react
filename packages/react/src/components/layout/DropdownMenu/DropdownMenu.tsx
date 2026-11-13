/**
 * @module DropdownMenu
 *
 * The design-system DropdownMenu (#50): a menu of actions and options
 * anchored to a trigger button, on the behavior engine's menu machine
 * (`useDropdownMenu`). Renders the `.apui-dropdown-menu` markup contract
 * styled by `@artisanpack-ui/css`; the panel carries the root class and is
 * Zag's `content` part, and every part is scoped `dropdown-menu` (D-019).
 *
 * Compose it from {@link DropdownMenuItem}, {@link DropdownMenuGroup} and
 * {@link DropdownMenuSeparator}, or pass the same structure as `items`.
 *
 * @packageDocumentation
 */

import { type DropdownMenuApi, useDropdownMenu } from '@artisanpack-ui/behavior/react';
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

import { IconPart, IconSvg } from '../../../internal/icon';
import { mergePartProps } from '../../../internal/merge';
import { cx, hasContent, type PartClasses } from '../../../internal/parts';
import { Portal } from '../../../internal/portal';
import { Button } from '../../form/Button/Button';

/** Which of the menu's edges lines up with the trigger's. Logical: follows the text direction. */
export type DropdownMenuAlign = 'start' | 'center' | 'end';

/** The menu panel's surface. */
export type DropdownMenuSurface = 'overlay' | 'glass';

/** The parts a {@link DropdownMenu} accepts extra classes for. `root` is the panel. */
export type DropdownMenuPart =
  | 'root'
  | 'trigger'
  | 'positioner'
  | 'itemGroup'
  | 'itemGroupLabel'
  | 'item'
  | 'icon'
  | 'itemText'
  | 'shortcut'
  | 'itemIndicator'
  | 'separator';

/** What a checkbox or radio item reports when it's chosen. */
export interface DropdownMenuCheckedChange {
  value: string;
  checked: boolean;
}

/** The kind of a {@link DropdownMenuItem}. */
export type DropdownMenuItemType = 'item' | 'checkbox' | 'radio';

/** An action item in {@link DropdownMenuProps.items}. */
export interface DropdownMenuActionItemData {
  type?: 'item';
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  shortcut?: ReactNode;
  color?: 'error';
  disabled?: boolean;
}

/** A checkbox or radio item in {@link DropdownMenuProps.items}. */
export interface DropdownMenuOptionItemData {
  type: 'checkbox' | 'radio';
  value: string;
  label: ReactNode;
  checked?: boolean;
  icon?: ReactNode;
  shortcut?: ReactNode;
  disabled?: boolean;
}

/** A separator in {@link DropdownMenuProps.items}. */
export interface DropdownMenuSeparatorData {
  type: 'separator';
}

/** A labelled group in {@link DropdownMenuProps.items}. */
export interface DropdownMenuGroupData {
  type: 'group';
  label?: ReactNode;
  items: DropdownMenuItemData[];
}

/** One entry of {@link DropdownMenuProps.items}. */
export type DropdownMenuItemData =
  | DropdownMenuActionItemData
  | DropdownMenuOptionItemData
  | DropdownMenuSeparatorData
  | DropdownMenuGroupData;

/** An item registered with its menu, so `onSelect` knows its type. @internal */
export interface RegisteredItem {
  type: DropdownMenuItemType;
  onSelect?: (value: string) => void;
}

/** What a menu shares with its items. @internal */
export interface DropdownMenuContextValue {
  api: DropdownMenuApi;
  classes: PartClasses<DropdownMenuPart>;
  register(value: string, item: RegisteredItem): () => void;
  onCheckedChange?: (change: DropdownMenuCheckedChange) => void;
}

/**
 * The menu's context. Exported for components composed on the same machine
 * (UserMenu), not from the package index. @internal
 */
export const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);

function useMenuContext(component: string): DropdownMenuContextValue {
  const context = useContext(DropdownMenuContext);
  if (!context) throw new Error(`<${component}> must be used inside <DropdownMenu>.`);
  return context;
}

/** Props for the {@link DropdownMenu} component. Native `<div>` attributes go to the panel. */
export interface DropdownMenuProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** The trigger button's content. An icon-only trigger needs an `aria-label` through its text. */
  label?: ReactNode;
  /** The items as data, rendering the same children as composition. Rendered before `children`. */
  items?: DropdownMenuItemData[];
  /** Whether it's open (controlled). Pair it with `onOpenChange`. Emitted as `data-state` on every part. */
  open?: boolean;
  /** The initial state of an uncontrolled menu. @defaultValue `false` */
  defaultOpen?: boolean;
  /**
   * Called when the menu opens or closes itself: the trigger, Escape, an
   * outside click or a choice. Setting `open` doesn't call it.
   */
  onOpenChange?: (open: boolean) => void;
  /** Called when an action item is chosen, by click or Enter, with its value. */
  onSelect?: (value: string) => void;
  /** Called when a checkbox or radio item is chosen. Its `checked` stays yours to set. */
  onCheckedChange?: (change: DropdownMenuCheckedChange) => void;
  /** Which of the menu's edges lines up with the trigger's. Emitted as `data-align`. @defaultValue `'start'` */
  align?: DropdownMenuAlign;
  /** The menu's surface. Emitted as `data-surface`. @defaultValue `'overlay'` */
  surface?: DropdownMenuSurface;
  /** Renders the menu at the end of the body (a React portal). Off renders it in place. @defaultValue `true` */
  portal?: boolean;
  /** Extra classes per part; `classes.root` (the panel) merges with `className`. */
  classes?: PartClasses<DropdownMenuPart>;
}

/** Renders `items` data as the composition components. */
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

/**
 * A list of actions or options anchored to a trigger button. The ref points
 * at the panel, which renders (hidden) while the menu is closed.
 *
 * @example
 * ```tsx
 * <DropdownMenu label="Options" onSelect={(value) => run(value)}>
 *   <DropdownMenuItem value="edit" icon="pencil" shortcut="E">Edit</DropdownMenuItem>
 *   <DropdownMenuSeparator />
 *   <DropdownMenuItem value="delete" icon="trash" color="error">Delete</DropdownMenuItem>
 * </DropdownMenu>
 * ```
 */
export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  (
    {
      label,
      items,
      open,
      defaultOpen,
      onOpenChange,
      onSelect,
      onCheckedChange,
      align = 'start',
      surface = 'overlay',
      portal = true,
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
      // The machine reports every chosen item here; checkbox and radio items
      // report through `onCheckedChange` instead (the manifest's `select` is
      // for action items).
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

    const context: DropdownMenuContextValue = { api, classes, onCheckedChange, register };

    return (
      <DropdownMenuContext.Provider value={context}>
        <Button
          {...api.getTriggerProps()}
          variant="outline"
          color="neutral"
          trailingIcon="chevron-down"
          className={classes.trigger}
        >
          {label}
        </Button>
        <Portal enabled={portal}>
          <div {...api.getPositionerProps()} className={classes.positioner}>
            <div
              {...mergePartProps(rest, api.getContentProps())}
              ref={ref}
              className={cx('apui-dropdown-menu', classes.root, className)}
              data-surface={surface}
              data-align={align}
            >
              {items ? renderItems(items) : null}
              {children}
            </div>
          </div>
        </Portal>
      </DropdownMenuContext.Provider>
    );
  },
);

DropdownMenu.displayName = 'DropdownMenu';

/** Props for the {@link DropdownMenuItem} component. Native `<div>` attributes go to the item. */
export interface DropdownMenuItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** The item's value, unique in the menu. Reported by `onSelect` and `onCheckedChange`. */
  value: string;
  /** `checkbox` and `radio` items toggle and report through `onCheckedChange`. @defaultValue `'item'` */
  type?: DropdownMenuItemType;
  /** A checkbox or radio item's state. Stays yours to set. */
  checked?: boolean;
  /** An icon name from the registry, or a node, before the label. */
  icon?: ReactNode;
  /** A keyboard shortcut shown at the end, in a `<kbd>`. */
  shortcut?: ReactNode;
  /** `error` for a destructive action. Put it last, after a separator. Emitted as `data-color`. */
  color?: 'error';
  /** Disables the item; the arrow keys skip it. */
  disabled?: boolean;
  /** Called when this action item is chosen, with its value. */
  onSelect?: (value: string) => void;
  /** Called with the next checked state when this checkbox or radio item is chosen. */
  onCheckedChange?: (checked: boolean) => void;
}

/** An action, checkbox or radio item of a {@link DropdownMenu}. */
export const DropdownMenuItem = forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  (
    {
      value,
      type = 'item',
      checked = false,
      icon,
      shortcut,
      color,
      disabled = false,
      onSelect,
      onCheckedChange,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const {
      api,
      classes,
      register,
      onCheckedChange: onMenuCheckedChange,
    } = useMenuContext('DropdownMenuItem');

    useEffect(() => register(value, { type, onSelect }), [register, value, type, onSelect]);

    const isOption = type !== 'item';
    const option = isOption
      ? {
          type,
          value,
          checked,
          disabled,
          onCheckedChange: (next: boolean) => {
            onCheckedChange?.(next);
            onMenuCheckedChange?.({ value, checked: next });
          },
        }
      : undefined;
    const itemProps = option
      ? api.getOptionItemProps(option as Parameters<DropdownMenuApi['getOptionItemProps']>[0])
      : api.getItemProps({ value, disabled });

    return (
      <div
        {...mergePartProps(rest, itemProps)}
        ref={ref}
        className={cx(classes.item, className)}
        data-color={color}
      >
        {option ? (
          <span
            {...api.getItemIndicatorProps(
              option as Parameters<DropdownMenuApi['getItemIndicatorProps']>[0],
            )}
            className={classes.itemIndicator}
          >
            <IconSvg name="check" />
          </span>
        ) : null}
        <IconPart
          scope="dropdown-menu"
          part="icon"
          name={typeof icon === 'string' ? icon : undefined}
          node={typeof icon === 'string' ? undefined : icon}
          className={classes.icon}
        />
        <span
          {...api.getItemTextProps(
            (option ?? { value }) as Parameters<DropdownMenuApi['getItemTextProps']>[0],
          )}
          className={classes.itemText}
        >
          {children}
        </span>
        {hasContent(shortcut) ? (
          <kbd className={classes.shortcut} data-scope="dropdown-menu" data-part="shortcut">
            {shortcut}
          </kbd>
        ) : null}
      </div>
    );
  },
);

DropdownMenuItem.displayName = 'DropdownMenuItem';

/** Props for the {@link DropdownMenuGroup} component. */
export interface DropdownMenuGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** The group's label, which names it for assistive technology. */
  label?: ReactNode;
}

/** A labelled group of {@link DropdownMenuItem}s. */
export const DropdownMenuGroup = forwardRef<HTMLDivElement, DropdownMenuGroupProps>(
  ({ label, className, children, ...rest }, ref) => {
    const { api, classes } = useMenuContext('DropdownMenuGroup');
    const id = useId();
    const hasLabel = hasContent(label);
    const groupProps = api.getItemGroupProps({ id });
    return (
      <div
        {...mergePartProps(rest, groupProps)}
        // Without a label there's nothing to point at.
        aria-labelledby={hasLabel ? groupProps['aria-labelledby'] : rest['aria-labelledby']}
        ref={ref}
        className={cx(classes.itemGroup, className)}
      >
        {hasLabel ? (
          <div {...api.getItemGroupLabelProps({ htmlFor: id })} className={classes.itemGroupLabel}>
            {label}
          </div>
        ) : null}
        {children}
      </div>
    );
  },
);

DropdownMenuGroup.displayName = 'DropdownMenuGroup';

/** Props for the {@link DropdownMenuSeparator} component. */
export type DropdownMenuSeparatorProps = HTMLAttributes<HTMLHRElement>;

/** A rule between items of a {@link DropdownMenu}. */
export const DropdownMenuSeparator = forwardRef<HTMLHRElement, DropdownMenuSeparatorProps>(
  ({ className, ...rest }, ref) => {
    const { api, classes } = useMenuContext('DropdownMenuSeparator');
    return (
      <hr
        {...mergePartProps(rest, api.getSeparatorProps())}
        ref={ref}
        className={cx(classes.separator, className)}
      />
    );
  },
);

DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';
