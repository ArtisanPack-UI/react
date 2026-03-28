import {
  forwardRef,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '@artisanpack-ui/tokens';

interface CardBaseProps {
  /** Card title */
  title?: string;
  /** Card subtitle */
  subtitle?: string;
  /** Card image/figure element */
  figure?: ReactNode;
  /** Figure position */
  figurePosition?: 'top' | 'bottom' | 'left' | 'right';
  /** Header slot (overrides title/subtitle) */
  header?: ReactNode;
  /** Footer/actions slot */
  footer?: ReactNode;
  /** Menu slot rendered in the header area */
  menu?: ReactNode;
  /** Remove shadow */
  noShadow?: boolean;
  /** Add border */
  bordered?: boolean;
  /** Compact padding */
  compact?: boolean;
  /** Glass morphism effect */
  glass?: boolean;
}

interface CardDivProps extends CardBaseProps, HTMLAttributes<HTMLDivElement> {
  /** When omitted, card renders as a div */
  link?: undefined;
}

interface CardLinkProps extends CardBaseProps, AnchorHTMLAttributes<HTMLAnchorElement> {
  /** When provided, card renders as an anchor */
  link: string;
}

export type CardProps = CardDivProps | CardLinkProps;

/**
 * Content container with header, body, footer slots and figure support.
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
              {subtitle && (
                <p className="text-base-content/60 text-sm">{subtitle}</p>
              )}
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
        {footer && (
          <div className="card-actions justify-end">{footer}</div>
        )}
      </div>
    );

    const cardContent = (
      <>
        {figurePosition === 'top' || figurePosition === 'left'
          ? figureEl
          : null}
        {body}
        {figurePosition === 'bottom' || figurePosition === 'right'
          ? figureEl
          : null}
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
