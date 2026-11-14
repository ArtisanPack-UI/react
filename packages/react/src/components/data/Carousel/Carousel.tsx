/**
 * @module Carousel
 *
 * The design-system Carousel (#65): scroll-snapped slides with previous and
 * next buttons, position dots and optional autoplay with a pause button, on
 * the behavior engine's carousel (`useCarousel`, Zag's carousel machine
 * scoped `carousel`, the one ImageSlider runs on, D-041). `perView` shows
 * several slides at once with the next one peeking; a slide's `id` keys it,
 * so reordered slides keep their own state. The autoplay button comes first
 * in the Tab order. It renders the `.apui-carousel` markup contract styled by
 * `@artisanpack-ui/css`.
 *
 * @packageDocumentation
 */

import { carouselPageCount, useCarousel } from '@artisanpack-ui/behavior/react';
import {
  createElement,
  forwardRef,
  type CSSProperties,
  type ForwardedRef,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';

import { IconSvg } from '../../../internal/icon';
import { mergePartProps } from '../../../internal/merge';
import { cx, hasContent, type PartClasses } from '../../../internal/parts';
import { Button } from '../../form/Button/Button';
import { Card } from '../../layout/Card/Card';

/** One slide of a {@link Carousel}: the default Card's content, or anything `renderSlide` draws. */
export interface CarouselSlide {
  /**
   * A stable id. When every slide has a distinct one it keys the slide, so a
   * reordered list keeps each `renderSlide`'s own state; else slides are
   * keyed by position.
   */
  id?: string | number;
  /** The Card's image URL. */
  image?: string;
  /** Describes the image. */
  alt?: string;
  /** The Card's title. */
  title?: ReactNode;
  /** The Card's supporting text. */
  description?: ReactNode;
  /** Links the Card's title. */
  href?: string;
  /** Content that replaces the Card, as in 2.x. Prefer `renderSlide`. */
  content?: ReactNode;
  [key: string]: unknown;
}

/** The parts a {@link Carousel} accepts extra classes for. */
export type CarouselPart =
  | 'root'
  | 'header'
  | 'title'
  | 'viewport'
  | 'itemGroup'
  | 'item'
  | 'prevTrigger'
  | 'nextTrigger'
  | 'indicatorGroup'
  | 'indicator'
  | 'autoplayTrigger';

/** Props for the {@link Carousel} component. Native `<div>` attributes go to the root. */
export interface CarouselProps<Slide = CarouselSlide> extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'title'
> {
  /** The slides, in order. */
  slides: Slide[];
  /** Slides in view at once, a whole number; above 1 the next one peeks. @defaultValue `1` */
  perView?: number;
  /** The position shown, 0-based (controlled). Pair it with `onIndexChange`. */
  index?: number;
  /** The initial position of an uncontrolled carousel. @defaultValue `0` */
  defaultIndex?: number;
  /** Called when the carousel moves to another position. Setting `index` doesn't call it. */
  onIndexChange?: (index: number) => void;
  /** Wraps from the last position to the first and back. @defaultValue `false` */
  loop?: boolean;
  /** Advances every `interval` ms, with a pause button. @defaultValue `false` */
  autoplay?: boolean;
  /** Milliseconds between slides while autoplay runs. @defaultValue `5000` */
  interval?: number;
  /** A heading in the header, with the buttons beside it. Without it they overlay the slides. */
  title?: string;
  /** The title's heading level, 2 to 6. @defaultValue `3` */
  headingLevel?: number;
  /** Names the region. Defaults to a passed `aria-label`, then the title, else `'Carousel'`. */
  label?: string;
  /** The previous button's accessible name. @defaultValue `'Previous slide'` */
  previousLabel?: string;
  /** The next button's accessible name. @defaultValue `'Next slide'` */
  nextLabel?: string;
  /** A dot's accessible name; `{index}` is replaced. @defaultValue `'Go to slide {index}'` */
  indicatorLabel?: string;
  /** A slide's accessible name. @defaultValue `'{index} of {count}'` */
  slideLabel?: string;
  /** The autoplay button's name while paused. @defaultValue `'Start slide rotation'` */
  playLabel?: string;
  /** The autoplay button's name while playing. @defaultValue `'Stop slide rotation'` */
  pauseLabel?: string;
  /** Renders one slide's content. Without it each slide is a Card. */
  renderSlide?: (slide: Slide, index: number) => ReactNode;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<CarouselPart>;
}

const text = (value: unknown): string | undefined =>
  typeof value === 'string' && value !== '' ? value : undefined;

/** The default slide: a Card from `{ image, alt, title, description, href }`. */
function DefaultSlide({ slide }: { slide: CarouselSlide }) {
  if (hasContent(slide.content)) return <>{slide.content}</>;
  return (
    <Card
      media={text(slide.image)}
      mediaAlt={text(slide.alt) ?? ''}
      title={hasContent(slide.title) ? slide.title : undefined}
      description={hasContent(slide.description) ? slide.description : undefined}
      href={text(slide.href)}
    />
  );
}

/**
 * Each slide's React key: its `id` when every slide has a distinct string or
 * number one, so reordered slides keep their own state; else its position.
 */
function slideKeys(list: readonly unknown[]): (string | number)[] {
  const ids = list.map((slide) =>
    slide && typeof slide === 'object' ? (slide as { id?: unknown }).id : undefined,
  );
  const usable =
    ids.every((id) => (typeof id === 'string' && id !== '') || typeof id === 'number') &&
    new Set(ids).size === ids.length;
  return usable ? (ids as (string | number)[]) : list.map((_, i) => i);
}

const headingTag = (level: number) =>
  `h${Math.min(6, Math.max(2, Math.floor(level)))}` as 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

/**
 * Scroll-snapped slides with previous and next buttons and position dots.
 * Arrow keys on the dots follow the text direction.
 *
 * @example
 * ```tsx
 * <Carousel title="Featured properties" perView={3} slides={properties} />
 * ```
 */
function CarouselInner<Slide = CarouselSlide>(
  {
    slides,
    perView = 1,
    index,
    defaultIndex,
    onIndexChange,
    loop = false,
    autoplay = false,
    interval = 5000,
    title,
    headingLevel = 3,
    label,
    previousLabel = 'Previous slide',
    nextLabel = 'Next slide',
    indicatorLabel = 'Go to slide {index}',
    slideLabel = '{index} of {count}',
    playLabel = 'Start slide rotation',
    pauseLabel = 'Stop slide rotation',
    renderSlide,
    classes = {},
    className,
    style,
    ...rest
  }: CarouselProps<Slide>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const list = slides ?? [];
  const view = Math.max(1, Math.floor(perView));
  const pages = carouselPageCount(list.length, view);
  const hasTitle = typeof title === 'string' && title !== '';
  const api = useCarousel({
    slideCount: list.length,
    perView: view,
    spacing: '12px',
    scope: 'carousel',
    index,
    defaultIndex,
    onIndexChange: ({ index: next }) => onIndexChange?.(next),
    loop,
    autoplay,
    interval,
    labels: {
      previous: previousLabel,
      next: nextLabel,
      indicator: indicatorLabel,
      slide: slideLabel,
      play: playLabel,
      pause: pauseLabel,
    },
  });
  const rootProps = api.getRootProps() as { style?: CSSProperties };
  const keys = slideKeys(list);

  const triggers = (
    <>
      <Button
        {...api.getPrevTriggerProps()}
        variant={hasTitle ? 'outline' : 'soft'}
        color="neutral"
        size="sm"
        iconOnly
        leadingIcon="chevron-left"
        className={classes.prevTrigger}
      />
      <Button
        {...api.getNextTriggerProps()}
        variant={hasTitle ? 'outline' : 'soft'}
        color="neutral"
        size="sm"
        iconOnly
        leadingIcon="chevron-right"
        className={classes.nextTrigger}
      />
    </>
  );

  return (
    <div
      {...mergePartProps(rest, rootProps)}
      ref={ref}
      className={cx('apui-carousel', classes.root, className)}
      aria-label={label || rest['aria-label'] || title || 'Carousel'}
      style={{ ...rootProps.style, ...style }}
    >
      {/* First in the Tab order, before the rotating slides; CSS places it over the viewport. */}
      {autoplay ? (
        <button {...api.getAutoplayTriggerProps()} className={classes.autoplayTrigger}>
          <IconSvg name={api.isPlaying ? 'pause' : 'play'} />
        </button>
      ) : null}
      {hasTitle ? (
        <div className={classes.header} data-scope="carousel" data-part="header">
          {createElement(
            headingTag(headingLevel),
            { className: classes.title, 'data-scope': 'carousel', 'data-part': 'title' },
            title,
          )}
          {triggers}
        </div>
      ) : null}
      <div className={classes.viewport} data-scope="carousel" data-part="viewport">
        <div {...api.getItemGroupProps()} className={classes.itemGroup} tabIndex={0}>
          {list.map((slide, i) => (
            <div key={keys[i]} {...api.getItemProps({ index: i })} className={classes.item}>
              {renderSlide ? (
                renderSlide(slide, i)
              ) : (
                <DefaultSlide slide={slide as unknown as CarouselSlide} />
              )}
            </div>
          ))}
        </div>
        {hasTitle ? null : triggers}
      </div>
      {pages > 1 ? (
        <div {...api.getIndicatorGroupProps()} className={classes.indicatorGroup}>
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              {...api.getIndicatorProps({ index: i })}
              className={classes.indicator}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Scroll-snapped slides with previous and next buttons and position dots.
 *
 * @example
 * ```tsx
 * <Carousel title="Featured properties" perView={3} slides={properties} />
 * <Carousel label="Customer notes" slides={quotes} autoplay renderSlide={(quote) => <Card>{quote.text}</Card>} />
 * ```
 */
export const Carousel = forwardRef(CarouselInner) as (<Slide = CarouselSlide>(
  props: CarouselProps<Slide> & { ref?: Ref<HTMLDivElement> },
) => ReturnType<typeof CarouselInner>) & { displayName?: string };

Carousel.displayName = 'Carousel';
