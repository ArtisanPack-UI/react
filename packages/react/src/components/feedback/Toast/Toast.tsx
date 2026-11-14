/**
 * @module Toast
 *
 * The design-system Toast (#51): a brief, non-blocking message rendering the
 * `.apui-toast` markup contract styled by `@artisanpack-ui/css`.
 *
 * Rendered on its own, a Toast is static: its parts come from the behavior
 * engine's `staticToastParts()`, with no machine, so it renders on the server
 * and shows until its owner hides it. Toasts that time out and stack live in
 * a {@link Toaster}, created from data with `toast.create({ … })` (D-019).
 *
 * @packageDocumentation
 */

import { staticToastParts } from '@artisanpack-ui/behavior/react';
import { forwardRef, useId, type HTMLAttributes, type ReactNode, type Ref } from 'react';

import { IconSvg } from '../../../internal/icon';
import { cx, hasContent, type PartClasses } from '../../../internal/parts';
import { Button } from '../../form/Button/Button';

/** The color that tints a {@link Toast}'s icon. `error` makes it an alert. */
export type ToastColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

/** Visual treatment of a {@link Toast}. */
export type ToastVariant = 'default' | 'inverse';

/** The surface of a {@link Toast}. */
export type ToastSurface = 'overlay' | 'glass';

/** The parts a {@link Toast} accepts extra classes for. */
export type ToastPart = 'root' | 'icon' | 'title' | 'description' | 'actions' | 'closeTrigger';

/** The close button's accessible name. */
export const TOAST_CLOSE_LABEL = 'Dismiss notification';

/** Props for the {@link Toast} component. Native `<div>` attributes go to the root. */
export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'color'> {
  /** The message, linked with `aria-labelledby`. */
  title?: ReactNode;
  /** Supporting text, linked with `aria-describedby`. */
  description?: ReactNode;
  /** Tints the icon. Emitted as `data-color`; `error` sets `role="alert"`. @defaultValue `'neutral'` */
  color?: ToastColor;
  /** `inverse` uses the inverse surface, for a toast that must stand out. Emitted as `data-variant`. @defaultValue `'default'` */
  variant?: ToastVariant;
  /** The toast's surface. Emitted as `data-surface`. @defaultValue `'overlay'` */
  surface?: ToastSurface;
  /**
   * An icon name from the registry, or a node. Defaults to the color's status
   * icon: `circle-check`, `triangle-alert`, `circle-alert` or `info`.
   */
  icon?: ReactNode;
  /** Buttons under the text, such as Undo. */
  actions?: ReactNode;
  /** Hides the close button. @defaultValue `false` */
  hideClose?: boolean;
  /** The close button's accessible name. Translate it for your locale. @defaultValue `'Dismiss notification'` */
  closeLabel?: string;
  /** Called with `false` when the close button is pressed. Hiding the toast is the owner's job. */
  onOpenChange?: (open: boolean) => void;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<ToastPart>;
}

type Attrs = Record<string, unknown>;

/** The markup every toast shares, standalone or in a toaster. @internal */
export interface ToastLayoutProps {
  rootRef?: Ref<HTMLDivElement>;
  root: Attrs;
  icon: Attrs;
  iconContent: ReactNode;
  titleProps: Attrs;
  title?: ReactNode;
  descriptionProps: Attrs;
  description?: ReactNode;
  actionsProps: Attrs;
  actions?: ReactNode;
  /** The close button's props, or `undefined` to leave it out. */
  closeTrigger?: Attrs;
  classes: PartClasses<ToastPart>;
  className?: string;
}

/** Renders a toast's parts in the contract order. @internal */
export function ToastLayout({
  rootRef,
  root,
  icon,
  iconContent,
  titleProps,
  title,
  descriptionProps,
  description,
  actionsProps,
  actions,
  closeTrigger,
  classes,
  className,
}: ToastLayoutProps) {
  return (
    <div {...root} ref={rootRef} className={cx('apui-toast', classes.root, className)}>
      {hasContent(iconContent) ? (
        <span {...icon} className={classes.icon}>
          {iconContent}
        </span>
      ) : null}
      {hasContent(title) ? (
        <p {...titleProps} className={classes.title}>
          {title}
        </p>
      ) : null}
      {hasContent(description) ? (
        <p {...descriptionProps} className={classes.description}>
          {description}
        </p>
      ) : null}
      {hasContent(actions) ? (
        <div {...actionsProps} className={classes.actions}>
          {actions}
        </div>
      ) : null}
      {closeTrigger ? (
        <Button
          variant="ghost"
          color="neutral"
          size="sm"
          iconOnly
          leadingIcon="x"
          {...closeTrigger}
          className={classes.closeTrigger}
        />
      ) : null}
    </div>
  );
}

/**
 * A brief, non-blocking message. On its own it's static (docs, inline
 * status); for toasts that time out, render a {@link Toaster} and call
 * `toast.create()`. The ref points at the root.
 *
 * @example
 * ```tsx
 * <Toast color="success" title="Listing saved" description="Cedarwood Estates is live now." />
 * ```
 */
export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      title,
      description,
      color = 'neutral',
      variant = 'default',
      surface = 'overlay',
      icon,
      actions,
      hideClose = false,
      closeLabel = TOAST_CLOSE_LABEL,
      onOpenChange,
      classes = {},
      className,
      ...rest
    },
    ref,
  ) => {
    const id = useId();
    const parts = staticToastParts(
      {
        color,
        variant,
        surface,
        icon: typeof icon === 'string' ? icon : undefined,
        // Only presence matters here: it decides aria-labelledby/-describedby.
        title: hasContent(title) ? 'title' : undefined,
        description: hasContent(description) ? 'description' : undefined,
      },
      { root: `${id}root`, title: `${id}title`, description: `${id}description` },
      { closeTriggerLabel: closeLabel },
    );

    return (
      <ToastLayout
        rootRef={ref}
        root={{ ...rest, ...parts.root }}
        icon={parts.icon}
        iconContent={
          hasContent(icon) && typeof icon !== 'string' ? icon : <IconSvg name={parts.iconName} />
        }
        titleProps={parts.title}
        title={title}
        descriptionProps={parts.description}
        description={description}
        actionsProps={parts.actions}
        actions={actions}
        closeTrigger={
          hideClose ? undefined : { ...parts.closeTrigger, onClick: () => onOpenChange?.(false) }
        }
        classes={classes}
        className={className}
      />
    );
  },
);

Toast.displayName = 'Toast';
