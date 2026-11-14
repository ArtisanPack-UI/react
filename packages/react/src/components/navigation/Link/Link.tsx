/**
 * @module Link
 *
 * The design-system Link (#56): an anchor, or a button styled as a link
 * when there's no href, rendering the `.apui-link` markup contract styled by
 * `@artisanpack-ui/css`.
 *
 * @packageDocumentation
 */

import { forwardRef, type AnchorHTMLAttributes, type ReactNode, type Ref } from 'react';

import { IconPart } from '../../../internal/icon';
import { cx, flag, type PartClasses } from '../../../internal/parts';
import { safeHref } from '../../../internal/url';

/** The tone of a {@link Link}. Emitted as `data-tone`. */
export type LinkTone = 'primary' | 'muted';

/** The parts a {@link Link} accepts extra classes for. */
export type LinkPart = 'root' | 'icon' | 'iconEnd';

/**
 * Props for the {@link Link} component. Native anchor attributes go to the
 * root (to the button too, when there's no `href`).
 */
export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLElement>, 'href'> {
  /**
   * The destination. Only relative, http, https, mailto, tel and sms URLs are
   * used; without one, a `<button type="button">` renders with the same styles.
   */
  href?: string;
  /** `primary` for running text and calls to action, `muted` for secondary links. @defaultValue `'primary'` */
  tone?: LinkTone;
  /** A link on its own line: medium weight, underlined only on hover. @defaultValue `false` */
  standalone?: boolean;
  /** Opens in a new tab, adds the external-link icon and announces it. @defaultValue `false` */
  external?: boolean;
  /** The visually hidden text an external link announces; translate it. @defaultValue `'(opens in a new tab)'` */
  externalLabel?: string;
  /** Icon name before the text, resolved through the icon registry. `icon` overrides it. */
  leadingIcon?: string;
  /**
   * Icon name after the text, resolved through the icon registry; it replaces the
   * external-link icon. Arrows mirror in RTL. `iconEnd` overrides it.
   */
  trailingIcon?: string;
  /** Leading icon node; overrides `leadingIcon`. */
  icon?: ReactNode;
  /** Trailing icon node; overrides `trailingIcon` and the external-link icon. */
  iconEnd?: ReactNode;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<LinkPart>;
}

/**
 * Navigates somewhere. The ref points at the anchor (or the button).
 *
 * @example
 * ```tsx
 * <Link href="/properties" standalone trailingIcon="arrow-right">View all properties</Link>
 * ```
 */
export const Link = forwardRef<HTMLElement, LinkProps>(
  (
    {
      href,
      tone = 'primary',
      standalone = false,
      external = false,
      externalLabel = '(opens in a new tab)',
      leadingIcon,
      trailingIcon,
      icon,
      iconEnd,
      classes = {},
      className,
      children,
      target,
      rel,
      ...rest
    },
    ref,
  ) => {
    const linkHref = safeHref(href === '' ? undefined : href);
    const trailing = trailingIcon ?? (external ? 'external-link' : undefined);
    const content = (
      <>
        <IconPart
          scope="link"
          part="icon"
          name={leadingIcon}
          node={icon}
          mirror
          className={classes.icon}
        />
        {children}
        <IconPart
          scope="link"
          part="iconEnd"
          name={trailing}
          node={iconEnd}
          mirror
          className={classes.iconEnd}
        />
        {external ? <span className="apui-sr-only"> {externalLabel}</span> : null}
      </>
    );
    const shared = {
      className: cx('apui-link', classes.root, className),
      'data-tone': tone === 'muted' ? 'muted' : 'primary',
      'data-standalone': flag(standalone),
    };

    if (linkHref === undefined) {
      return (
        <button
          {...(rest as Record<string, unknown>)}
          ref={ref as Ref<HTMLButtonElement>}
          type="button"
          {...shared}
        >
          {content}
        </button>
      );
    }

    return (
      <a
        {...rest}
        ref={ref as Ref<HTMLAnchorElement>}
        href={linkHref}
        target={external ? '_blank' : target}
        rel={external ? 'noopener noreferrer' : rel}
        {...shared}
      >
        {content}
      </a>
    );
  },
);

Link.displayName = 'Link';
