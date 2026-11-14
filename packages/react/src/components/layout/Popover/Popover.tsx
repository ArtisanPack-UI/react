/**
 * @module Popover
 *
 * The design-system Popover (#58): an anchored, non-modal `role=dialog`
 * panel on the behavior engine's popover machine (`usePopover`), rendering
 * the `.apui-popover` markup contract styled by `@artisanpack-ui/css`. The
 * panel carries the root class and is Zag's `content` part (D-019).
 *
 * @packageDocumentation
 */

import { usePopover } from '@artisanpack-ui/behavior/react';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { mergePartProps } from '../../../internal/merge';
import { cx, hasContent, type PartClasses } from '../../../internal/parts';
import { Portal } from '../../../internal/portal';
import { cloneTrigger, triggerElement, triggerId } from '../../../internal/trigger';
import { Button } from '../../form/Button/Button';

/** The trigger's side a {@link Popover} sits on. `start` and `end` follow the reading direction. */
export type PopoverPlacement = 'top' | 'bottom' | 'start' | 'end';

/** The parts a {@link Popover} accepts extra classes for. `root` is the panel. */
export type PopoverPart =
  | 'root'
  | 'trigger'
  | 'positioner'
  | 'arrow'
  | 'title'
  | 'body'
  | 'actions';

/** Props for the {@link Popover} component. Native `<div>` attributes go to the panel. */
export interface PopoverProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Whether it's open (controlled). Pair it with `onOpenChange`. Emitted as `data-state`. */
  open?: boolean;
  /** The initial state of an uncontrolled popover. @defaultValue `false` */
  defaultOpen?: boolean;
  /**
   * Called when the popover opens or closes itself: the trigger, Escape or an
   * outside click. Setting `open` doesn't call it.
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * The trigger's side the panel sits on, lined up with the trigger's start
   * edge. Emitted as `data-placement`; the side it settled on, after
   * flipping, is `data-side`. @defaultValue `'bottom'`
   */
  placement?: PopoverPlacement;
  /** Draws the arrow that points at the trigger. @defaultValue `true` */
  arrow?: boolean;
  /** The heading, the panel's accessible name. Without one, give the popover an `aria-label`. */
  title?: ReactNode;
  /** A row of actions at the end of the panel. */
  actions?: ReactNode;
  /**
   * The control that opens it. Text renders an outline Button; an element (a
   * Button, an icon button) becomes the trigger itself and keeps its own id.
   */
  trigger?: ReactNode;
  /** Renders the panel at the end of the body (a React portal). Off renders it in place. @defaultValue `true` */
  portal?: boolean;
  /** Extra classes per part; `classes.root` (the panel) merges with `className`. */
  classes?: PartClasses<PopoverPart>;
}

/**
 * An anchored, non-modal panel for a short task tied to one control. Focus
 * moves in when it opens and returns to the trigger when it closes. The ref
 * points at the panel, which renders (hidden) while closed.
 *
 * @example
 * ```tsx
 * <Popover trigger="Share" title="Share report" actions={<Button size="sm">Copy link</Button>}>
 *   <Input label="Link" readOnly value={url} />
 * </Popover>
 * ```
 */
export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
  (
    {
      open,
      defaultOpen,
      onOpenChange,
      placement = 'bottom',
      arrow = true,
      title,
      actions,
      trigger,
      portal = true,
      classes = {},
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const ownTrigger = triggerElement(trigger);
    const api = usePopover({
      open,
      defaultOpen,
      placement,
      portalled: portal,
      ids: { trigger: triggerId(trigger) },
      onOpenChange: ({ open: next }) => onOpenChange?.(next),
    });

    const triggerProps = {
      ...(api.getTriggerProps() as Record<string, unknown>),
      className: classes.trigger,
    };

    return (
      <>
        {ownTrigger ? (
          cloneTrigger(ownTrigger, triggerProps)
        ) : hasContent(trigger) ? (
          <Button {...triggerProps} variant="outline" color="neutral">
            {trigger}
          </Button>
        ) : null}
        <Portal enabled={portal}>
          <div {...api.getPositionerProps()} className={classes.positioner}>
            <div
              {...mergePartProps(rest, api.getContentProps())}
              ref={ref}
              className={cx('apui-popover', classes.root, className)}
            >
              {arrow ? (
                <span {...api.getArrowProps()} className={classes.arrow} aria-hidden="true" />
              ) : null}
              {hasContent(title) ? (
                <h3 {...api.getTitleProps()} className={classes.title}>
                  {title}
                </h3>
              ) : null}
              {hasContent(children) ? (
                <div className={classes.body} data-scope="popover" data-part="body">
                  {children}
                </div>
              ) : null}
              {hasContent(actions) ? (
                <div className={classes.actions} data-scope="popover" data-part="actions">
                  {actions}
                </div>
              ) : null}
            </div>
          </div>
        </Portal>
      </>
    );
  },
);

Popover.displayName = 'Popover';
