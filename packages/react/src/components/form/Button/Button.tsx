/**
 * @module Button
 *
 * The design-system Button (#44). Renders the shared `.apui-button` markup
 * contract, styled by `@artisanpack-ui/css`.
 */

import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from 'react';

import { IconPart } from '../../../internal/icon';
import { cx, flag, hasContent, type PartClasses } from '../../../internal/parts';
import { safeHref } from '../../../internal/url';

/** Visual treatment of a {@link Button}. */
export type ButtonVariant = 'solid' | 'soft' | 'outline' | 'ghost' | 'link';

/** Semantic color of a {@link Button}. */
export type ButtonColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

/** Control height of a {@link Button}. */
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** The parts a {@link Button} accepts extra classes for. */
export type ButtonPart = 'root' | 'icon' | 'label' | 'iconEnd' | 'spinner';

/**
 * Props for the {@link Button} component.
 *
 * Native `<button>` attributes pass through to the root; with `href`, the
 * anchor attributes `target`, `rel`, `download` and `hrefLang` apply too.
 */
export interface ButtonProps
  extends
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'color' | 'onClick' | 'onAuxClick'>,
    Pick<AnchorHTMLAttributes<HTMLAnchorElement>, 'target' | 'rel' | 'download' | 'hrefLang'> {
  /** Visual treatment. Emitted as `data-variant`. @defaultValue `'solid'` */
  variant?: ButtonVariant;
  /** Semantic color. Emitted as `data-color`. @defaultValue `'primary'` */
  color?: ButtonColor;
  /** Control height. Emitted as `data-size`. @defaultValue `'md'` */
  size?: ButtonSize;
  /** Renders only the icon. Requires an `aria-label`. @defaultValue `false` */
  iconOnly?: boolean;
  /** Shows the spinner, sets `aria-busy` and ignores clicks. @defaultValue `false` */
  loading?: boolean;
  /** Disables the button. With `href`, renders an anchor without href and with `aria-disabled`. */
  disabled?: boolean;
  /**
   * Renders an `<a>` with the same styles. A `javascript:`, `vbscript:` or `data:` URL is
   * ignored (renders a `<button>`). While `loading` or `disabled`, the anchor has no href.
   */
  href?: string;
  /** Icon name before the label, resolved through the icon registry. `icon` overrides it. */
  leadingIcon?: string;
  /** Icon name after the label, resolved through the icon registry. `iconEnd` overrides it. */
  trailingIcon?: string;
  /** The native button type. Ignored with `href`. @defaultValue `'button'` */
  type?: 'button' | 'submit' | 'reset';
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<ButtonPart>;
  /** Leading icon node; overrides `leadingIcon`. */
  icon?: ReactNode;
  /** Trailing icon node; overrides `trailingIcon`. */
  iconEnd?: ReactNode;
  /** Click handler. Not called while `loading` or `disabled`. */
  onClick?: (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  /** Auxiliary (e.g. middle) click handler. Not called while `loading` or `disabled`. */
  onAuxClick?: (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
}

/**
 * Triggers an action. Renders a native `<button>`, or an `<a>` when `href` is
 * set. The ref points at that element.
 *
 * @example
 * ```tsx
 * <Button leadingIcon="plus">Add item</Button>
 * <Button variant="outline" color="neutral" href="/docs">Docs</Button>
 * <Button iconOnly leadingIcon="trash" aria-label="Delete" color="error" />
 * ```
 */
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      variant = 'solid',
      color = 'primary',
      size = 'md',
      iconOnly = false,
      loading = false,
      disabled = false,
      href,
      leadingIcon,
      trailingIcon,
      type = 'button',
      classes = {},
      icon,
      iconEnd,
      className,
      children,
      onClick,
      onAuxClick,
      target,
      rel,
      download,
      hrefLang,
      ...rest
    },
    ref,
  ) => {
    const inactive = loading || disabled;
    const linkHref = safeHref(href);

    const handleClick = (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      if (inactive) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    };

    // Middle and other auxiliary clicks would open a link in a new tab; block them (and the
    // caller's handler) while the button is inactive.
    const handleAuxClick = (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      if (inactive) {
        event.preventDefault();
        return;
      }
      onAuxClick?.(event);
    };

    const shared = {
      ...rest,
      className: cx('apui-button', classes.root, className),
      'data-variant': variant,
      'data-color': color,
      'data-size': size,
      'data-icon-only': flag(iconOnly),
      'aria-busy': loading ? true : rest['aria-busy'],
      onClick: handleClick,
      onAuxClick: handleAuxClick,
    };

    const content = (
      <>
        <IconPart
          scope="button"
          part="icon"
          name={leadingIcon}
          node={icon}
          mirror
          className={classes.icon}
        />
        {!iconOnly && hasContent(children) ? (
          <span className={classes.label} data-scope="button" data-part="label">
            {children}
          </span>
        ) : null}
        <IconPart
          scope="button"
          part="iconEnd"
          name={trailingIcon}
          node={iconEnd}
          mirror
          className={classes.iconEnd}
        />
        {loading ? (
          <span
            className={classes.spinner}
            data-scope="button"
            data-part="spinner"
            aria-hidden="true"
          />
        ) : null}
      </>
    );

    if (linkHref !== undefined) {
      const {
        form: _form,
        formAction: _formAction,
        formEncType: _formEncType,
        formMethod: _formMethod,
        formNoValidate: _formNoValidate,
        formTarget: _formTarget,
        name: _name,
        value: _value,
        ...anchorProps
      } = shared;
      return (
        <a
          {...(anchorProps as AnchorHTMLAttributes<HTMLAnchorElement>)}
          ref={ref as Ref<HTMLAnchorElement>}
          href={inactive ? undefined : linkHref}
          target={target}
          rel={rel}
          download={download}
          hrefLang={hrefLang}
          aria-disabled={inactive ? true : rest['aria-disabled']}
          data-disabled={flag(disabled)}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        {...shared}
        ref={ref as Ref<HTMLButtonElement>}
        type={type}
        disabled={disabled || undefined}
        data-disabled={flag(disabled)}
      >
        {content}
      </button>
    );
  },
);

Button.displayName = 'Button';
