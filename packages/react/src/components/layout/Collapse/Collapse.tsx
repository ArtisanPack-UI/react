/**
 * @module Collapse
 *
 * The design-system Collapse (#58): a single disclosure on the behavior
 * engine's collapsible machine (`useCollapse`), rescoped `collapse`. Renders
 * the `.apui-collapse` markup contract styled by `@artisanpack-ui/css`.
 * A `section` hides its region while closed; a `read-more` clamps it behind
 * a fade and puts the trigger after it.
 *
 * @packageDocumentation
 */

import { type CollapseApi, useCollapse } from '@artisanpack-ui/behavior/react';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { IconSvg } from '../../../internal/icon';
import { mergePartProps } from '../../../internal/merge';
import { cx, hasContent, type PartClasses } from '../../../internal/parts';

/** The two Collapse layouts. */
export type CollapseVariant = 'section' | 'read-more';

/** The parts a {@link Collapse} accepts extra classes for. */
export type CollapsePart = 'root' | 'trigger' | 'icon' | 'content' | 'fade';

/** Props for the {@link Collapse} component. Native `<div>` attributes go to the root. */
export interface CollapseProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether the region shows (controlled). Pair it with `onOpenChange`. */
  open?: boolean;
  /** Whether an uncontrolled collapse starts open. */
  defaultOpen?: boolean;
  /** Called when the trigger opens or closes the region. Setting `open` doesn't call it. */
  onOpenChange?: (open: boolean) => void;
  /** Emitted as `data-variant`. @defaultValue `'section'` */
  variant?: CollapseVariant;
  /** The trigger's text. A read-more defaults it to `Read more`. */
  label?: ReactNode;
  /** The trigger's text while open. A read-more defaults it to `Show less`. */
  openLabel?: string;
  /** The trigger can't be focused or toggled. */
  disabled?: boolean;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<CollapsePart>;
}

/**
 * A single disclosure: show and hide one region.
 *
 * @example
 * ```tsx
 * <Collapse label="Advanced settings">…</Collapse>
 * <Collapse variant="read-more">Long text…</Collapse>
 * ```
 */
export const Collapse = forwardRef<HTMLDivElement, CollapseProps>(
  (
    {
      open,
      defaultOpen,
      onOpenChange,
      variant = 'section',
      label,
      openLabel,
      disabled = false,
      classes = {},
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const readMore = variant === 'read-more';
    const api: CollapseApi = useCollapse({
      ...(open !== undefined ? { open } : { defaultOpen }),
      variant,
      disabled: disabled || undefined,
      onOpenChange: ({ open: next }) => onOpenChange?.(next),
    });
    const closedText = hasContent(label) ? label : readMore ? 'Read more' : undefined;
    const openText = openLabel ?? (readMore ? 'Show less' : undefined);
    const text = api.open && hasContent(openText) ? openText : closedText;

    const trigger = (
      <button
        {...api.getTriggerProps()}
        disabled={disabled || undefined}
        className={classes.trigger}
      >
        {text}
        <span {...api.getIndicatorProps()} aria-hidden="true" className={classes.icon}>
          <IconSvg name="chevron-down" />
        </span>
      </button>
    );
    const content = (
      <div {...api.getContentProps()} className={classes.content}>
        {children}
        {readMore ? (
          <span
            data-scope="collapse"
            data-part="fade"
            aria-hidden="true"
            className={classes.fade}
          />
        ) : null}
      </div>
    );

    return (
      <div
        {...mergePartProps(rest, api.getRootProps())}
        ref={ref}
        className={cx('apui-collapse', classes.root, className)}
        data-variant={variant}
      >
        {readMore ? content : trigger}
        {readMore ? trigger : content}
      </div>
    );
  },
);

Collapse.displayName = 'Collapse';
