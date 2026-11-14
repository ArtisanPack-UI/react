/**
 * @module Tabs
 *
 * The design-system Tabs (#56): a tablist of triggers and one panel per tab,
 * on the behavior engine's tabs machine (`useTabs`). Renders the
 * `.apui-tabs` markup contract styled by `@artisanpack-ui/css`; every part is
 * scoped `tabs`, and the spec's panel is Zag's `content` part (D-019).
 *
 * Compose it from {@link Tab} children, each holding its panel, or pass the
 * same structure as `tabs`. The arrow keys follow the orientation and the
 * text direction; activation is automatic or manual.
 *
 * @packageDocumentation
 */

import { type TabsApi, useTabs } from '@artisanpack-ui/behavior/react';
import {
  Children,
  forwardRef,
  Fragment,
  isValidElement,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';

import { IconPart } from '../../../internal/icon';
import { mergePartProps } from '../../../internal/merge';
import { cx, hasContent, type PartClasses } from '../../../internal/parts';

/** The tabs' visual treatment. */
export type TabsVariant = 'segmented' | 'underline';

/** The triggers' size. */
export type TabsSize = 'sm' | 'md';

/** Lays the tablist out in a row or a column. */
export type TabsOrientation = 'horizontal' | 'vertical';

/** How a tab is selected from the keyboard. */
export type TabsActivationMode = 'automatic' | 'manual';

/** The parts a {@link Tabs} accepts extra classes for. */
export type TabsPart = 'root' | 'list' | 'trigger' | 'icon' | 'count' | 'content';

/** One tab in {@link TabsProps.tabs}. */
export interface TabData {
  value: string;
  label: ReactNode;
  /** An icon name from the registry, or a node. */
  icon?: ReactNode;
  count?: ReactNode;
  disabled?: boolean;
  /** The panel's content. */
  content?: ReactNode;
}

/** Props for the {@link Tabs} component. Native `<div>` attributes go to the root. */
export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
  /** The selected tab's value (controlled). Pair it with `onValueChange`. */
  value?: string;
  /** The initially selected tab when uncontrolled. Defaults to the first enabled tab. */
  defaultValue?: string;
  /** Called when another tab is selected, by click or the keyboard. Setting `value` doesn't call it. */
  onValueChange?: (value: string) => void;
  /** The tabs as data, rendering the same children as composition. Rendered before `children`. */
  tabs?: TabData[];
  /** Emitted as `data-variant`. @defaultValue `'segmented'` */
  variant?: TabsVariant;
  /** Emitted as `data-size`. @defaultValue `'md'` */
  size?: TabsSize;
  /** Emitted as `data-orientation`; picks the arrow keys. @defaultValue `'horizontal'` */
  orientation?: TabsOrientation;
  /** `manual` only moves focus with the arrow keys; Enter or Space selects. @defaultValue `'automatic'` */
  activationMode?: TabsActivationMode;
  /** Names the tablist. Needed when a page has more than one set of tabs. */
  label?: string;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<TabsPart>;
}

/** Props for the {@link Tab} component. Native `<div>` attributes go to its panel. */
export interface TabProps extends HTMLAttributes<HTMLDivElement> {
  /** The tab's value, unique in the tabs. */
  value: string;
  /** The trigger's label. */
  label: ReactNode;
  /** An icon name from the registry, or a node, before the label. */
  icon?: ReactNode;
  /** A count at the end of the trigger, such as unread items. */
  count?: ReactNode;
  /** Disables the tab; the arrow keys skip it. */
  disabled?: boolean;
  /** The panel's content. */
  children?: ReactNode;
}

/**
 * One tab of a {@link Tabs}: its trigger and its panel. Rendered by the
 * parent, so it must be a direct child (or inside a fragment).
 */
export function Tab(_props: TabProps): ReactElement | null {
  throw new Error('<Tab> must be used inside <Tabs>.');
}

Tab.displayName = 'Tab';

/** The Tab elements among `children`, fragments flattened. */
function tabElements(children: ReactNode): ReactElement<TabProps>[] {
  const found: ReactElement<TabProps>[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (child.type === Fragment) {
      found.push(...tabElements((child.props as { children?: ReactNode }).children));
    } else if (child.type === Tab) {
      found.push(child as ReactElement<TabProps>);
    }
  });
  return found;
}

/** `tabs` data as Tab props. */
function dataTabs(tabs: TabData[] | undefined): TabProps[] {
  return (tabs ?? []).map(({ content, ...rest }) => ({ ...rest, children: content }));
}

/**
 * Switches between views of the same content.
 *
 * @example
 * ```tsx
 * <Tabs value={section} onValueChange={setSection} label="Account">
 *   <Tab value="profile" label="Profile" icon="user">…</Tab>
 *   <Tab value="security" label="Security" icon="lock">…</Tab>
 * </Tabs>
 * ```
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      tabs: data,
      variant = 'segmented',
      size = 'md',
      orientation = 'horizontal',
      activationMode = 'automatic',
      label,
      classes = {},
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const all: TabProps[] = [
      ...dataTabs(data),
      ...tabElements(children).map((element) => element.props),
    ];
    const firstEnabled = all.find((tab) => !tab.disabled)?.value;

    const api: TabsApi = useTabs({
      ...(value !== undefined ? { value } : { defaultValue: defaultValue ?? firstEnabled }),
      orientation,
      activationMode,
      label,
      onValueChange: ({ value: next }) => onValueChange?.(next),
    });

    return (
      <div
        {...mergePartProps(rest, api.getRootProps())}
        ref={ref}
        className={cx('apui-tabs', classes.root, className)}
        data-variant={variant}
        data-size={size}
        data-activation-mode={activationMode}
      >
        <div {...api.getListProps()} className={classes.list}>
          {all.map((tab) => (
            <button
              key={tab.value}
              {...api.getTriggerProps({ value: tab.value, disabled: tab.disabled })}
              className={classes.trigger}
            >
              <IconPart
                scope="tabs"
                part="icon"
                name={typeof tab.icon === 'string' ? tab.icon : undefined}
                node={typeof tab.icon === 'string' ? undefined : tab.icon}
                mirror
                className={classes.icon}
              />
              {tab.label}
              {hasContent(tab.count) ? (
                <span data-scope="tabs" data-part="count" className={classes.count}>
                  {tab.count}
                </span>
              ) : null}
            </button>
          ))}
        </div>
        {all.map(
          ({
            value: tabValue,
            label: _label,
            icon: _icon,
            count: _count,
            disabled: _disabled,
            className: panelClass,
            children: panel,
            ...panelRest
          }) => (
            <div
              key={tabValue}
              {...mergePartProps(panelRest, api.getContentProps({ value: tabValue }))}
              className={cx(classes.content, panelClass)}
            >
              {panel}
            </div>
          ),
        )}
      </div>
    );
  },
);

Tabs.displayName = 'Tabs';
