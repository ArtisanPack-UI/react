/**
 * @module Accordion
 *
 * The design-system Accordion (#58): stacked sections that expand and
 * collapse, on the behavior engine's accordion machine (`useAccordion`).
 * Renders the `.apui-accordion` markup contract styled by
 * `@artisanpack-ui/css`; every part is scoped `accordion`. Zag's item
 * trigger, indicator and content render as the spec's `trigger`, `chevron`
 * and `content`; each trigger sits in a heading (`title`) at `headingLevel`.
 *
 * Compose it from {@link AccordionItem} children, or pass the same structure
 * as `items`.
 *
 * @packageDocumentation
 */

import { type AccordionApi, useAccordion } from '@artisanpack-ui/behavior/react';
import {
  Children,
  createElement,
  forwardRef,
  Fragment,
  isValidElement,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';

import { IconSvg } from '../../../internal/icon';
import { mergePartProps } from '../../../internal/merge';
import { cx, flag, type PartClasses } from '../../../internal/parts';

/** The accordion's visual treatment. */
export type AccordionVariant = 'default' | 'separated' | 'flush';

/** The parts an {@link Accordion} accepts extra classes for. */
export type AccordionPart = 'root' | 'item' | 'title' | 'trigger' | 'chevron' | 'content';

/** One item in {@link AccordionProps.items}. */
export interface AccordionItemData {
  value: string;
  title: ReactNode;
  content?: ReactNode;
  disabled?: boolean;
}

/** Props for the {@link Accordion} component. Native `<div>` attributes go to the root. */
export interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
  /** The open items' values (controlled). Pair it with `onValueChange`. */
  value?: string[];
  /** The items open at first when uncontrolled. */
  defaultValue?: string[];
  /** Called when an item opens or closes. Setting `value` doesn't call it. */
  onValueChange?: (value: string[]) => void;
  /** The items as data, rendered before `children`. */
  items?: AccordionItemData[];
  /** Lets several items be open at once. Emitted as `data-multiple`. @defaultValue `false` */
  multiple?: boolean;
  /** Lets the open item of a single accordion close. Emitted as `data-collapsible`. @defaultValue `true` */
  collapsible?: boolean;
  /** Emitted as `data-variant`. @defaultValue `'default'` */
  variant?: AccordionVariant;
  /** The level of each item's heading, 2 to 6. @defaultValue `3` */
  headingLevel?: number;
  /** Disables every item. */
  disabled?: boolean;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<AccordionPart>;
}

/** Props for the {@link AccordionItem} component. Native `<div>` attributes go to the item root. */
export interface AccordionItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The item's value, unique in the accordion. */
  value: string;
  /** The trigger's text. */
  title: ReactNode;
  /** Disables the item; the arrow keys skip it. */
  disabled?: boolean;
  /** The panel's content. */
  children?: ReactNode;
}

/**
 * One section of an {@link Accordion}: its heading, trigger and panel.
 * Rendered by the parent, so it must be a direct child (or inside a fragment).
 */
export function AccordionItem(_props: AccordionItemProps): ReactElement | null {
  throw new Error('<AccordionItem> must be used inside <Accordion>.');
}

AccordionItem.displayName = 'AccordionItem';

/** The AccordionItem elements among `children`, fragments flattened. */
function itemElements(children: ReactNode): ReactElement<AccordionItemProps>[] {
  const found: ReactElement<AccordionItemProps>[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (child.type === Fragment) {
      found.push(...itemElements((child.props as { children?: ReactNode }).children));
    } else if (child.type === AccordionItem) {
      found.push(child as ReactElement<AccordionItemProps>);
    }
  });
  return found;
}

/** A heading level clamped to h2–h6. */
const headingTag = (level: number) =>
  `h${Math.min(6, Math.max(2, Math.round(Number(level) || 3)))}`;

/**
 * Stacked sections that expand and collapse.
 *
 * @example
 * ```tsx
 * <Accordion defaultValue={['live']}>
 *   <AccordionItem value="live" title="How long does a listing stay live?">…</AccordionItem>
 *   <AccordionItem value="owners" title="Can co-owners edit a listing?">…</AccordionItem>
 * </Accordion>
 * ```
 */
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      items,
      multiple = false,
      collapsible = true,
      variant = 'default',
      headingLevel = 3,
      disabled = false,
      classes = {},
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const all: AccordionItemProps[] = [
      ...(items ?? []).map(({ content, ...item }) => ({ ...item, children: content })),
      ...itemElements(children).map((element) => element.props),
    ];

    const api: AccordionApi = useAccordion({
      ...(value !== undefined ? { value } : { defaultValue }),
      multiple,
      collapsible,
      disabled: disabled || undefined,
      onValueChange: ({ value: next }) => onValueChange?.(next),
    });
    const heading = headingTag(headingLevel);

    return (
      <div
        {...mergePartProps(rest, api.getRootProps())}
        ref={ref}
        className={cx('apui-accordion', classes.root, className)}
        data-variant={variant}
        data-multiple={flag(multiple)}
        data-collapsible={flag(collapsible)}
      >
        {all.map(
          ({
            value: itemValue,
            title,
            disabled: itemDisabled,
            className: itemClass,
            children: panel,
            ...itemRest
          }) => {
            const part = { value: itemValue, disabled: itemDisabled || undefined };
            return (
              <div
                key={itemValue}
                {...mergePartProps(itemRest, api.getItemProps(part))}
                className={cx(itemClass, classes.item)}
              >
                {createElement(
                  heading,
                  { 'data-scope': 'accordion', 'data-part': 'title', className: classes.title },
                  <button {...api.getItemTriggerProps(part)} className={classes.trigger}>
                    {title}
                    <span
                      {...api.getItemIndicatorProps(part)}
                      aria-hidden="true"
                      className={classes.chevron}
                    >
                      <IconSvg name="chevron-down" />
                    </span>
                  </button>,
                )}
                <div {...api.getItemContentProps(part)} className={classes.content}>
                  {panel}
                </div>
              </div>
            );
          },
        )}
      </div>
    );
  },
);

Accordion.displayName = 'Accordion';
