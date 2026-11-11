/**
 * @module Dialog
 *
 * The design-system Dialog (#49): a modal window on the behavior engine's
 * dialog machine (`useDialog`), rendering the `.apui-dialog` markup contract
 * styled by `@artisanpack-ui/css`. The panel carries the root class and is
 * Zag's `content` part (D-019).
 *
 * @packageDocumentation
 */

import { useDialog } from '@artisanpack-ui/behavior/react';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { IconPart } from '../../../internal/icon';
import { mergePartProps } from '../../../internal/merge';
import { cx, hasContent, type PartClasses } from '../../../internal/parts';
import { Portal } from '../../../internal/portal';
import { Button } from '../../form/Button/Button';

/** The panel's width of a {@link Dialog}. */
export type DialogSize = 'sm' | 'md' | 'lg';

/** The panel's surface of a {@link Dialog}. */
export type DialogSurface = 'overlay' | 'glass';

/** The ARIA role of a {@link Dialog}. */
export type DialogRole = 'dialog' | 'alertdialog';

/** The color that tints a {@link Dialog}'s header icon. */
export type DialogColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

/** The parts a {@link Dialog} accepts extra classes for. `root` is the panel. */
export type DialogPart =
  | 'root'
  | 'trigger'
  | 'backdrop'
  | 'positioner'
  | 'header'
  | 'icon'
  | 'title'
  | 'description'
  | 'closeTrigger'
  | 'body'
  | 'footer';

/** Props for the {@link Dialog} component. Native `<div>` attributes go to the panel. */
export interface DialogProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'role'> {
  /** Whether it's open (controlled). Pair it with `onOpenChange`. Emitted as `data-state` on every part. */
  open?: boolean;
  /** The initial state of an uncontrolled dialog. @defaultValue `false` */
  defaultOpen?: boolean;
  /**
   * Called when the dialog opens or closes itself: the trigger, Escape, the
   * backdrop or the close button. Setting `open` doesn't call it.
   */
  onOpenChange?: (open: boolean) => void;
  /** The panel's width. Emitted as `data-size`. @defaultValue `'md'` */
  size?: DialogSize;
  /**
   * `alertdialog` for confirmations that interrupt: the backdrop doesn't close
   * it, and focus starts on the close button. @defaultValue `'dialog'`
   */
  role?: DialogRole;
  /** The panel's surface. Emitted as `data-surface`. @defaultValue `'overlay'` */
  surface?: DialogSurface;
  /** Tints the header icon, for confirmations. Emitted as `data-color`. */
  color?: DialogColor;
  /** An icon name from the registry, or a node, shown in a tinted circle before the title. */
  icon?: ReactNode;
  /** The heading, the panel's accessible name. Every dialog needs one. */
  title?: ReactNode;
  /** Supporting text under the title, linked with `aria-describedby`. */
  description?: ReactNode;
  /** The actions row. Name the confirm action ("Delete listing"), not "OK". */
  footer?: ReactNode;
  /** Content for a trigger button that opens the dialog. Without it, open the dialog through `open`. */
  trigger?: ReactNode;
  /**
   * Traps focus, locks scroll and hides the rest of the page from assistive
   * technology. Sets `aria-modal`. @defaultValue `true`
   */
  modal?: boolean;
  /** Renders the backdrop and panel at the end of the body (a React portal). Off renders them in place. @defaultValue `true` */
  portal?: boolean;
  /** Hides the close button in the header. Escape still closes the dialog. @defaultValue `false` */
  hideClose?: boolean;
  /** The close button's accessible name. Translate it for your locale. @defaultValue `'Close'` */
  closeLabel?: string;
  /** Extra classes per part; `classes.root` (the panel) merges with `className`. */
  classes?: PartClasses<DialogPart>;
}

/**
 * A modal window for a focused task or a confirmation. The ref points at the
 * panel, which renders (hidden) while the dialog is closed.
 *
 * @example
 * ```tsx
 * <Dialog open={open} onOpenChange={setOpen} trigger="Invite member" title="Invite member"
 *   footer={<Button onClick={() => setOpen(false)}>Send invite</Button>}>
 *   <Input type="email" label="Email" />
 * </Dialog>
 * ```
 */
export const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  (
    {
      open,
      defaultOpen,
      onOpenChange,
      size = 'md',
      role = 'dialog',
      surface = 'overlay',
      color,
      icon,
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
    const api = useDialog({
      open,
      defaultOpen,
      role,
      modal,
      // Without a title, an aria-label names the panel instead (the machine
      // then drops aria-labelledby).
      label: hasTitle ? undefined : rest['aria-label'],
      onOpenChange: ({ open: next }) => onOpenChange?.(next),
    });

    const hasDescription = hasContent(description);
    const hasIcon = hasContent(icon);

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
          <div {...api.getPositionerProps()} className={classes.positioner}>
            <div
              {...mergePartProps(rest, api.getContentProps())}
              ref={ref}
              className={cx('apui-dialog', classes.root, className)}
              data-size={size}
              data-surface={surface}
              data-color={color}
            >
              {hasIcon || hasTitle || hasDescription || !hideClose ? (
                <div className={classes.header} data-scope="dialog" data-part="header">
                  <IconPart
                    scope="dialog"
                    part="icon"
                    name={typeof icon === 'string' ? icon : undefined}
                    node={typeof icon === 'string' ? undefined : icon}
                    className={classes.icon}
                  />
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
                <div className={classes.body} data-scope="dialog" data-part="body">
                  {children}
                </div>
              ) : null}
              {hasContent(footer) ? (
                <div className={classes.footer} data-scope="dialog" data-part="footer">
                  {footer}
                </div>
              ) : null}
            </div>
          </div>
        </Portal>
      </>
    );
  },
);

Dialog.displayName = 'Dialog';
