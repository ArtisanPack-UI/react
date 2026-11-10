/**
 * @module Card
 *
 * The design-system Card (#48): a surface with optional media, header, body
 * and footer parts, rendering the `.apui-card` markup contract styled by
 * `@artisanpack-ui/css`.
 *
 * @packageDocumentation
 */

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cx, devWarnOnce, flag, hasContent, type PartClasses } from '../../../internal/parts';
import { isSafeMediaSrc, safeHref } from '../../../internal/url';

/** The surface of a {@link Card}. */
export type CardSurface = 'default' | 'raised' | 'sunken' | 'glass';

/** The parts a {@link Card} accepts extra classes for. */
export type CardPart =
  | 'root'
  | 'media'
  | 'header'
  | 'title'
  | 'description'
  | 'actions'
  | 'body'
  | 'footer';

/** Props for the {@link Card} component. Native `<div>` attributes go to the root. */
export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The surface. Emitted as `data-surface`. @defaultValue `'default'` */
  surface?: CardSurface;
  /** Adds the hover edge. Emitted as `data-interactive`; implied by `href`. @defaultValue `false` */
  interactive?: boolean;
  /**
   * Makes the title a link whose hit area covers the whole card. Needs a `title`;
   * only relative, http, https, mailto, tel and sms URLs are used.
   */
  href?: string;
  /** The heading in the header, rendered in an `<h3>`. */
  title?: ReactNode;
  /** Supporting text under the title. */
  description?: ReactNode;
  /** Controls at the end of the header. */
  actions?: ReactNode;
  /** The footer row, separated by an edge. */
  footer?: ReactNode;
  /**
   * Edge-to-edge media above the header: an image URL, or a node (a video, a
   * chart) that replaces the image. Only relative, http, https, blob and `data:image/…` URLs are used.
   */
  media?: ReactNode;
  /** Alternative text for an image `media`. Empty marks it decorative. @defaultValue `''` */
  mediaAlt?: string;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<CardPart>;
}

/**
 * The default container. The ref points at the root `<div>`.
 *
 * @example
 * ```tsx
 * <Card title="Quarterly report" description="Updated 2 hours ago" actions={<Button size="sm">Share</Button>}>
 *   Revenue grew 12% this quarter.
 * </Card>
 * ```
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      surface = 'default',
      interactive = false,
      href,
      title,
      description,
      actions,
      footer,
      media,
      mediaAlt = '',
      classes = {},
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const hasTitle = hasContent(title);
    // The title holds the link, so href needs one. Unsafe schemes are dropped.
    const linkHref = hasTitle ? safeHref(href) : undefined;
    if (href !== undefined && !hasTitle) {
      devWarnOnce('card:href-without-title', 'Card ignores `href` without a `title`.');
    }
    const hasDescription = hasContent(description);
    const hasActions = hasContent(actions);

    let mediaPart: ReactNode = null;
    if (typeof media === 'string') {
      if (media !== '' && isSafeMediaSrc(media)) {
        mediaPart = (
          <img
            className={classes.media}
            data-scope="card"
            data-part="media"
            src={media}
            alt={mediaAlt}
          />
        );
      }
    } else if (hasContent(media)) {
      mediaPart = (
        <div className={classes.media} data-scope="card" data-part="media">
          {media}
        </div>
      );
    }

    return (
      <div
        {...rest}
        ref={ref}
        className={cx('apui-card', classes.root, className)}
        data-surface={surface}
        data-interactive={flag(interactive || linkHref !== undefined)}
      >
        {mediaPart}
        {hasTitle || hasDescription || hasActions ? (
          <div className={classes.header} data-scope="card" data-part="header">
            {hasTitle || hasDescription ? (
              <div>
                {hasTitle ? (
                  <h3 className={classes.title} data-scope="card" data-part="title">
                    {linkHref !== undefined ? <a href={linkHref}>{title}</a> : title}
                  </h3>
                ) : null}
                {hasDescription ? (
                  <p className={classes.description} data-scope="card" data-part="description">
                    {description}
                  </p>
                ) : null}
              </div>
            ) : null}
            {hasActions ? (
              <div className={classes.actions} data-scope="card" data-part="actions">
                {actions}
              </div>
            ) : null}
          </div>
        ) : null}
        {hasContent(children) ? (
          <div className={classes.body} data-scope="card" data-part="body">
            {children}
          </div>
        ) : null}
        {hasContent(footer) ? (
          <div className={classes.footer} data-scope="card" data-part="footer">
            {footer}
          </div>
        ) : null}
      </div>
    );
  },
);

Card.displayName = 'Card';
