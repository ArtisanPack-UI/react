/**
 * @module Drawer
 *
 * The design-system Drawer (#58): a panel that slides in from an edge, on the
 * behavior engine's dialog machine (`useDrawer`), rendering the
 * `.apui-drawer` markup contract styled by `@artisanpack-ui/css`. The panel
 * carries the root class and is the machine's `content` part (D-019); every
 * part is scoped `drawer`.
 *
 * @packageDocumentation
 */

import { useDrawer } from '@artisanpack-ui/behavior/react';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { mergePartProps } from '../../../internal/merge';
import { cx, hasContent, type PartClasses } from '../../../internal/parts';
import { Portal } from '../../../internal/portal';
import { Button } from '../../form/Button/Button';

/** The edge a {@link Drawer} slides in from. `end` and `start` follow the reading direction. */
export type DrawerSide = 'end' | 'start' | 'bottom';

/** The panel's width of a {@link Drawer} at the start or end side. */
export type DrawerSize = 'sm' | 'md' | 'lg';

/** The panel's surface of a {@link Drawer}. */
export type DrawerSurface = 'overlay' | 'glass';

/** The parts a {@link Drawer} accepts extra classes for. `root` is the panel. */
export type DrawerPart =
  | 'root'
  | 'trigger'
  | 'backdrop'
  | 'positioner'
  | 'handle'
  | 'header'
  | 'title'
  | 'description'
  | 'closeTrigger'
  | 'body'
  | 'footer';

/** Props for the {@link Drawer} component. Native `<aside>` attributes go to the panel. */
export interface DrawerProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Whether it's open (controlled). Pair it with `onOpenChange`. Emitted as `data-state` on every part. */
  open?: boolean;
  /** The initial state of an uncontrolled drawer. @defaultValue `false` */
  defaultOpen?: boolean;
  /**
   * Called when the drawer opens or closes itself: the trigger, Escape, the
   * backdrop or the close button. Setting `open` doesn't call it.
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * The edge it slides in from: `end` is on the right in LTR and on the left
   * in RTL; `bottom` is a full-width sheet with a handle. Emitted as
   * `data-side`. @defaultValue `'end'`
   */
  side?: DrawerSide;
  /** The panel's width at the start or end side. Emitted as `data-size`. @defaultValue `'md'` */
  size?: DrawerSize;
  /** The panel's surface. Emitted as `data-surface`. @defaultValue `'overlay'` */
  surface?: DrawerSurface;
  /** The heading, the panel's accessible name. Every drawer needs one. */
  title?: ReactNode;
  /** Supporting text under the title, linked with `aria-describedby`. */
  description?: ReactNode;
  /** The actions row. Put the primary action here. */
  footer?: ReactNode;
  /** Content for a trigger button that opens the drawer. Without it, open the drawer through `open`. */
  trigger?: ReactNode;
  /**
   * Traps focus, locks scroll and hides the rest of the page from assistive
   * technology. Sets `aria-modal`. @defaultValue `true`
   */
  modal?: boolean;
  /** Renders the backdrop and panel at the end of the body (a React portal). Off renders them in place. @defaultValue `true` */
  portal?: boolean;
  /** Hides the close button in the header. Escape still closes the drawer. @defaultValue `false` */
  hideClose?: boolean;
  /** The close button's accessible name. Translate it for your locale. @defaultValue `'Close'` */
  closeLabel?: string;
  /** Extra classes per part; `classes.root` (the panel) merges with `className`. */
  classes?: PartClasses<DrawerPart>;
}

/**
 * A panel that slides in from an edge for filters, details or secondary
 * tasks. The ref points at the panel, which renders (hidden) while the
 * drawer is closed.
 *
 * @example
 * ```tsx
 * <Drawer open={open} onOpenChange={setOpen} trigger="Filters" title="Filters"
 *   footer={<Button onClick={() => setOpen(false)}>Show results</Button>}>
 *   <Input label="Location" />
 * </Drawer>
 * ```
 */
export const Drawer = forwardRef<HTMLElement, DrawerProps>(
  (
    {
      open,
      defaultOpen,
      onOpenChange,
      side = 'end',
      size = 'md',
      surface = 'overlay',
      title,
      description,
      footer,
      trigger,
      modal = true,
      portal = true,
      hideClose = false,
      closeLabel = 'Close',
      classes = {},
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const hasTitle = hasContent(title);
    const api = useDrawer({
      open,
      defaultOpen,
      modal,
      // Without a title, an aria-label names the panel instead.
      label: hasTitle ? undefined : rest['aria-label'],
      onOpenChange: ({ open: next }) => onOpenChange?.(next),
    });

    const hasDescription = hasContent(description);

    return (
      <>
        {hasContent(trigger) ? (
          <Button
            {...api.getTriggerProps()}
            variant="outline"
            color="neutral"
            className={classes.trigger}
          >
            {trigger}
          </Button>
        ) : null}
        <Portal enabled={portal}>
          <div {...api.getBackdropProps()} className={classes.backdrop} />
          <div {...api.getPositionerProps()} className={classes.positioner} data-side={side}>
            <aside
              {...mergePartProps(rest, api.getContentProps())}
              ref={ref}
              className={cx('apui-drawer', classes.root, className)}
              data-side={side}
              data-size={size}
              data-surface={surface}
            >
              {side === 'bottom' ? (
                <div
                  className={classes.handle}
                  data-scope="drawer"
                  data-part="handle"
                  aria-hidden="true"
                />
              ) : null}
              {hasTitle || hasDescription || !hideClose ? (
                <div className={classes.header} data-scope="drawer" data-part="header">
                  {hasTitle ? (
                    <h2 {...api.getTitleProps()} className={classes.title}>
                      {title}
                    </h2>
                  ) : null}
                  {hasDescription ? (
                    <p {...api.getDescriptionProps()} className={classes.description}>
                      {description}
                    </p>
                  ) : null}
                  {hideClose ? null : (
                    <Button
                      {...api.getCloseTriggerProps()}
                      variant="ghost"
                      color="neutral"
                      size="sm"
                      iconOnly
                      leadingIcon="x"
                      aria-label={closeLabel}
                      className={classes.closeTrigger}
                    />
                  )}
                </div>
              ) : null}
              {hasContent(children) ? (
                <div className={classes.body} data-scope="drawer" data-part="body">
                  {children}
                </div>
              ) : null}
              {hasContent(footer) ? (
                <div className={classes.footer} data-scope="drawer" data-part="footer">
                  {footer}
                </div>
              ) : null}
            </aside>
          </div>
        </Portal>
      </>
    );
  },
);

Drawer.displayName = 'Drawer';
