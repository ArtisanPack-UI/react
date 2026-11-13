/**
 * @module Alert
 *
 * The design-system Alert (#60): an inline message about the state of a page
 * or section, rendering the `.apui-alert` markup contract styled by
 * `@artisanpack-ui/css`. The tint and the status icon carry the meaning, so
 * it never relies on color alone. Errors are `role="alert"`, every other
 * color `role="status"`.
 *
 * @packageDocumentation
 */

import { forwardRef, useState, type HTMLAttributes, type ReactNode } from 'react';

import { IconSvg } from '../../../internal/icon';
import { cx, hasContent, type PartClasses } from '../../../internal/parts';
import { Button } from '../../form/Button/Button';

/** The status color of an {@link Alert}. */
export type AlertColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

/** Visual treatment of an {@link Alert}. */
export type AlertVariant = 'soft' | 'outline' | 'solid';

/** The surface of an {@link Alert}. */
export type AlertSurface = 'default' | 'glass';

/** The parts an {@link Alert} accepts extra classes for. */
export type AlertPart = 'root' | 'icon' | 'title' | 'description' | 'actions' | 'closeTrigger';

/** The close button's default accessible name. */
export const ALERT_CLOSE_LABEL = 'Dismiss';

/** The status icon each color shows by default. */
export function alertStatusIcon(color: AlertColor): string {
  switch (color) {
    case 'success':
      return 'circle-check';
    case 'warning':
      return 'triangle-alert';
    case 'error':
      return 'circle-alert';
    default:
      return 'info';
  }
}

/** Props for the {@link Alert} component. Native `<div>` attributes go to the root. */
export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'color'> {
  /** The headline: what happened. */
  title?: ReactNode;
  /** Supporting text: what to do next. `children` override it. */
  description?: ReactNode;
  /** The status. Emitted as `data-color`; `error` sets `role="alert"`. @defaultValue `'neutral'` */
  color?: AlertColor;
  /** `soft` tints, `outline` suits dense forms, `solid` blocks work. @defaultValue `'soft'` */
  variant?: AlertVariant;
  /** The alert's surface. Emitted as `data-surface`. @defaultValue `'default'` */
  surface?: AlertSurface;
  /**
   * An icon name from the registry, or a node. Defaults to the color's status
   * icon: `circle-check`, `triangle-alert`, `circle-alert` or `info`.
   */
  icon?: ReactNode;
  /** Buttons under the text. */
  actions?: ReactNode;
  /** Adds a close button; pressing it hides the alert. @defaultValue `false` */
  dismissible?: boolean;
  /** The close button's accessible name. Translate it for your locale. @defaultValue `'Dismiss'` */
  closeLabel?: string;
  /** Called with `false` when the close button is pressed; the alert hides itself. */
  onOpenChange?: (open: boolean) => void;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<AlertPart>;
}

/**
 * An inline message about the state of a page or section. The ref points at
 * the root.
 *
 * @example
 * ```tsx
 * <Alert color="success" title="Listing published" dismissible />
 * ```
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      title,
      description,
      color = 'neutral',
      variant = 'soft',
      surface = 'default',
      icon,
      actions,
      dismissible = false,
      closeLabel = ALERT_CLOSE_LABEL,
      onOpenChange,
      classes = {},
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const [dismissed, setDismissed] = useState(false);
    const body = hasContent(children) ? children : description;
    const iconNode =
      hasContent(icon) && typeof icon !== 'string' ? (
        icon
      ) : (
        <IconSvg name={typeof icon === 'string' && icon !== '' ? icon : alertStatusIcon(color)} />
      );

    return (
      <div
        {...rest}
        ref={ref}
        className={cx('apui-alert', classes.root, className)}
        data-scope="alert"
        data-part="root"
        role={color === 'error' ? 'alert' : 'status'}
        data-color={color}
        data-variant={variant}
        data-surface={surface}
        hidden={dismissed || rest.hidden}
      >
        <span data-scope="alert" data-part="icon" aria-hidden="true" className={classes.icon}>
          {iconNode}
        </span>
        {hasContent(title) ? (
          <p data-scope="alert" data-part="title" className={classes.title}>
            {title}
          </p>
        ) : null}
        {hasContent(body) ? (
          <div data-scope="alert" data-part="description" className={classes.description}>
            {body}
          </div>
        ) : null}
        {hasContent(actions) ? (
          <div data-scope="alert" data-part="actions" className={classes.actions}>
            {actions}
          </div>
        ) : null}
        {dismissible ? (
          <Button
            variant="ghost"
            color="neutral"
            size="xs"
            iconOnly
            leadingIcon="x"
            aria-label={closeLabel}
            data-scope="alert"
            data-part="close-trigger"
            className={classes.closeTrigger}
            onClick={() => {
              setDismissed(true);
              onOpenChange?.(false);
            }}
          />
        ) : null}
      </div>
    );
  },
);

Alert.displayName = 'Alert';
