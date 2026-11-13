/**
 * @module Tooltip
 *
 * The design-system Tooltip (#59): a short label on hover and keyboard focus,
 * on the behavior engine's tooltip machine (`useTooltip`), rendering the
 * `.apui-tooltip` markup contract styled by `@artisanpack-ui/css`. The label
 * carries the root class and is Zag's `content` part (D-019); the child is
 * the trigger.
 *
 * @packageDocumentation
 */

import { tooltipKeys, useTooltip } from '@artisanpack-ui/behavior/react';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { mergePartProps } from '../../../internal/merge';
import { cx, flag, hasContent, type PartClasses } from '../../../internal/parts';
import { Portal } from '../../../internal/portal';
import { cloneTrigger, triggerElement, triggerId } from '../../../internal/trigger';

/** The trigger's side a {@link Tooltip} sits on. `start` and `end` follow the reading direction. */
export type TooltipPlacement = 'top' | 'bottom' | 'start' | 'end';

/** A {@link Tooltip}'s size: a one-line label, or a sentence or two. */
export type TooltipSize = 'md' | 'lg';

/** The parts a {@link Tooltip} accepts extra classes for. `root` is the label. */
export type TooltipPart = 'root' | 'trigger' | 'positioner' | 'arrow' | 'kbd';

/** Props for the {@link Tooltip} component. Native `<div>` attributes go to the label. */
export interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, 'content'> {
  /**
   * The label: text and inline formatting only. It describes the trigger
   * (`aria-describedby`); it's never the only name of an icon button.
   */
  content: ReactNode;
  /**
   * The trigger's side the label sits on, centered. Emitted as
   * `data-placement`; the side it settled on, after flipping, is `data-side`.
   * @defaultValue `'top'`
   */
  placement?: TooltipPlacement;
  /** Milliseconds the pointer rests on the trigger before it shows. Focus shows it at once. @defaultValue `400` */
  delay?: number;
  /** `lg` for a sentence or two, at body size. Emitted as `data-size`. @defaultValue `'md'` */
  size?: TooltipSize;
  /** A keyboard shortcut shown after the label, as keys joined with `+` (`⌘+K`). */
  shortcut?: string;
  /**
   * Controls the label: `true` shows it, `false` hides it, whatever the
   * pointer and focus do. Leave it out to let hover and focus show it.
   */
  open?: boolean;
  /** The initial state of an uncontrolled tooltip. @defaultValue `false` */
  defaultOpen?: boolean;
  /** Called when the label shows or hides itself (hover, focus, blur, Escape). */
  onOpenChange?: (open: boolean) => void;
  /** Never shows the label. Emitted as `data-disabled`. @defaultValue `false` */
  disabled?: boolean;
  /** Renders the label at the end of the body (a React portal). Off renders it in place. @defaultValue `true` */
  portal?: boolean;
  /** Extra classes per part; `classes.root` (the label) merges with `className`. */
  classes?: PartClasses<TooltipPart>;
  /** The trigger: one element (a button, a link), which keeps its own id. Text is wrapped in a focusable span. */
  children: ReactNode;
}

/**
 * A short label on hover and keyboard focus, linked to the child with
 * `aria-describedby` while it shows. Hoverable, and Escape hides it. The ref
 * points at the label.
 *
 * @example
 * ```tsx
 * <Tooltip content="Edit" shortcut="E">
 *   <Button iconOnly leadingIcon="pencil" aria-label="Edit" />
 * </Tooltip>
 * ```
 */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      content,
      placement = 'top',
      delay = 400,
      size = 'md',
      shortcut,
      open,
      defaultOpen,
      onOpenChange,
      disabled = false,
      portal = true,
      classes = {},
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const own = triggerElement(children);
    const api = useTooltip({
      open,
      defaultOpen,
      placement,
      delay,
      disabled,
      ids: { trigger: triggerId(children) },
      onOpenChange: ({ open: next }) => onOpenChange?.(next),
    });

    const triggerProps = {
      ...(api.getTriggerProps() as Record<string, unknown>),
      className: classes.trigger,
    };

    return (
      <>
        {own ? (
          cloneTrigger(own, triggerProps)
        ) : (
          <span tabIndex={0} {...triggerProps}>
            {children}
          </span>
        )}
        <Portal enabled={portal}>
          <div {...api.getPositionerProps()} className={classes.positioner}>
            <div
              {...mergePartProps(rest, api.getContentProps())}
              ref={ref}
              className={cx('apui-tooltip', classes.root, className)}
              data-size={size}
              data-disabled={flag(disabled)}
            >
              <span {...api.getArrowProps()} className={classes.arrow} aria-hidden="true" />
              {hasContent(content) ? content : null}
              {tooltipKeys(shortcut).map((key, index) => (
                <kbd key={index} className={classes.kbd} data-scope="tooltip" data-part="kbd">
                  {key}
                </kbd>
              ))}
            </div>
          </div>
        </Portal>
      </>
    );
  },
);

Tooltip.displayName = 'Tooltip';
