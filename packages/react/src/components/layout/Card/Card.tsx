/**
 * @module Card
 *
 * A versatile content container built on DaisyUI's card component. Supports
 * title/subtitle, header/footer slots, figure placement, glass morphism, and
 * optional rendering as an anchor element when a `link` prop is provided.
 *
 * @packageDocumentation
 */

import { forwardRef, type AnchorHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@artisanpack-ui/tokens';

/**
 * Shared props for the Card component, independent of the underlying element type.
 */
interface CardBaseProps {
  /** Card title rendered as an `<h2>` inside the card body. */
  title?: string;
  /** Card subtitle rendered below the title. */
  subtitle?: string;
  /** Image or figure content displayed alongside the card body. */
  figure?: ReactNode;
  /** Placement of the figure relative to the card body. @defaultValue `'top'` */
  figurePosition?: 'top' | 'bottom' | 'left' | 'right';
  /** Custom header slot. When provided, `title` and `subtitle` are ignored. */
  header?: ReactNode;
  /** Footer/actions slot rendered at the bottom of the card body. */
  footer?: ReactNode;
  /** Menu content rendered on the right side of the header area. */
  menu?: ReactNode;
  /** Remove the default shadow from the card. */
  noShadow?: boolean;
  /** Apply a visible border around the card. */
  bordered?: boolean;
  /** Use compact (reduced) padding inside the card body. */
  compact?: boolean;
  /** Apply a glass morphism (frosted-glass) visual effect. */
  glass?: boolean;
}

/**
 * Card props when rendering as a `<div>` element (no link provided).
 */
interface CardDivProps extends CardBaseProps, HTMLAttributes<HTMLDivElement> {
  /** When omitted, the card renders as a `<div>`. */
  link?: undefined;
}

/**
 * Card props when rendering as an `<a>` element (link provided).
 */
interface CardLinkProps extends CardBaseProps, AnchorHTMLAttributes<HTMLAnchorElement> {
  /** When provided, the card renders as an `<a>` with this URL as its `href`. */
  link: string;
}

/**
 * Union type for Card props. The card renders as a `<div>` by default, or as
 * an `<a>` when the `link` prop is provided.
 */
export type CardProps = CardDivProps | CardLinkProps;

/**
 * Content container with header, body, footer slots and figure support.
 *
 * Renders as a `<div>` by default. When a `link` prop is supplied, it renders
 * as an `<a>` element instead. The figure can be positioned on any side via
 * `figurePosition`.
 *
 * @example
 * ```tsx
 * <Card title="Hello" subtitle="World" footer={<Button>Action</Button>}>
 *   <p>Card body content here.</p>
 * </Card>
 * ```
 *
 * @example
 * ```tsx
 * // Card as a link with a side figure
 * <Card link="/details" figure={<img src="/photo.jpg" alt="" />} figurePosition="left">
 *   <p>Click to navigate.</p>
 * </Card>
 * ```
 */
export const Card = forwardRef<HTMLDivElement | HTMLAnchorElement, CardProps>(
  (
    {
      title,
      subtitle,
      figure,
      figurePosition = 'top',
      header,
      footer,
      menu,
      noShadow = false,
      bordered = false,
      compact = false,
      glass = false,
      link,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const isHorizontal = figurePosition === 'left' || figurePosition === 'right';

    const hasHeader = header || title || subtitle || menu;

    const figureEl = figure ? (
      <figure className={cn(isHorizontal && 'shrink-0')}>{figure}</figure>
    ) : null;

    const headerEl = hasHeader ? (
      <div className="flex items-center justify-between">
        <div>
          {header ?? (
            <>
              {title && <h2 className="card-title">{title}</h2>}
              {subtitle && <p className="text-base-content/60 text-sm">{subtitle}</p>}
            </>
          )}
        </div>
        {menu && <div>{menu}</div>}
      </div>
    ) : null;

    const body = (
      <div className="card-body">
        {headerEl}
        {children}
        {footer && <div className="card-actions justify-end">{footer}</div>}
      </div>
    );

    const cardContent = (
      <>
        {figurePosition === 'top' || figurePosition === 'left' ? figureEl : null}
        {body}
        {figurePosition === 'bottom' || figurePosition === 'right' ? figureEl : null}
      </>
    );

    const cardClasses = cn(
      'card',
      'bg-base-100',
      !noShadow && 'shadow-xl',
      bordered && 'card-bordered',
      compact && 'card-compact',
      glass && 'glass',
      isHorizontal && 'card-side',
      className,
    );

    if (link) {
      const { link: _link, ...anchorRest } = rest as CardLinkProps;
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={link}
          className={cardClasses}
          {...anchorRest}
        >
          {cardContent}
        </a>
      );
    }

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={cardClasses}
        {...(rest as CardDivProps)}
      >
        {cardContent}
      </div>
    );
  },
);

Card.displayName = 'Card';
