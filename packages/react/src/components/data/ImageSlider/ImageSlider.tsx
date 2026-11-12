/**
 * @module ImageSlider
 *
 * The design-system ImageSlider (#61): one large image per view with a glass
 * caption, a counter, previous and next buttons, dots and optional
 * thumbnails, on the behavior engine's carousel (`useCarousel`, Zag's
 * carousel machine scoped `image-slider`). It renders the
 * `.apui-image-slider` markup contract styled by `@artisanpack-ui/css`.
 *
 * @packageDocumentation
 */

import { useCarousel } from '@artisanpack-ui/behavior/react';
import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';

import { IconSvg } from '../../../internal/icon';
import { mergePartProps } from '../../../internal/merge';
import { cx, hasContent, type PartClasses } from '../../../internal/parts';
import { isSafeMediaSrc } from '../../../internal/url';
import { Button } from '../../form/Button/Button';

/** One slide of an {@link ImageSlider}. */
export interface ImageSliderImage {
  /** The image URL. */
  src: string;
  /** Describes the image. Every image needs it. */
  alt?: string;
  /** The glass caption's title. */
  caption?: ReactNode;
  /** The glass caption's supporting text. */
  description?: ReactNode;
}

/** The parts an {@link ImageSlider} accepts extra classes for. */
export type ImageSliderPart =
  | 'root'
  | 'viewport'
  | 'itemGroup'
  | 'item'
  | 'image'
  | 'caption'
  | 'title'
  | 'description'
  | 'progressText'
  | 'prevTrigger'
  | 'nextTrigger'
  | 'indicatorGroup'
  | 'indicator'
  | 'autoplayTrigger'
  | 'thumbs'
  | 'thumb';

/** Props for the {@link ImageSlider} component. Native `<div>` attributes go to the root. */
export interface ImageSliderProps extends HTMLAttributes<HTMLDivElement> {
  /** The slides, in order. */
  images: ImageSliderImage[];
  /** The frame's aspect ratio, as CSS takes it. @defaultValue `'21 / 9'` */
  aspectRatio?: string;
  /** The slide shown, 0-based (controlled). Pair it with `onIndexChange`. */
  index?: number;
  /** The initial slide of an uncontrolled slider. @defaultValue `0` */
  defaultIndex?: number;
  /** Called when the slider moves to another slide. Setting `index` doesn't call it. */
  onIndexChange?: (index: number) => void;
  /** Wraps from the last slide to the first and back. @defaultValue `true` */
  loop?: boolean;
  /** Advances every `interval` ms, with a pause button. @defaultValue `false` */
  autoplay?: boolean;
  /** Milliseconds between slides while autoplay runs. @defaultValue `5000` */
  interval?: number;
  /** Shows a strip of thumbnails under the frame. @defaultValue `false` */
  thumbnails?: boolean;
  /** Names the slider region. @defaultValue `'Photos'` */
  label?: string;
  /** The previous button's accessible name. @defaultValue `'Previous photo'` */
  previousLabel?: string;
  /** The next button's accessible name. @defaultValue `'Next photo'` */
  nextLabel?: string;
  /** A dot's accessible name; `{index}` is replaced. @defaultValue `'Photo {index}'` */
  indicatorLabel?: string;
  /** A slide's accessible name. @defaultValue `'{index} of {count}'` */
  slideLabel?: string;
  /** The counter text. @defaultValue `'{index} / {count}'` */
  counterLabel?: string;
  /** The autoplay button's name while paused. @defaultValue `'Start slide rotation'` */
  playLabel?: string;
  /** The autoplay button's name while playing. @defaultValue `'Stop slide rotation'` */
  pauseLabel?: string;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<ImageSliderPart>;
}

const safeSrc = (src: string) => (isSafeMediaSrc(src) ? src : undefined);

/**
 * One large image per view with a glass caption, a counter, previous and
 * next buttons, dots and optional thumbnails. Arrow keys on the dots follow
 * the text direction.
 *
 * @example
 * ```tsx
 * <ImageSlider label="Lakeview Lofts photos" images={[{ src: '/a.jpg', alt: 'Lobby', caption: 'The lobby' }]} />
 * ```
 */
export const ImageSlider = forwardRef<HTMLDivElement, ImageSliderProps>(
  (
    {
      images,
      aspectRatio = '21 / 9',
      index,
      defaultIndex,
      onIndexChange,
      loop = true,
      autoplay = false,
      interval = 5000,
      thumbnails = false,
      label = 'Photos',
      previousLabel = 'Previous photo',
      nextLabel = 'Next photo',
      indicatorLabel = 'Photo {index}',
      slideLabel = '{index} of {count}',
      counterLabel = '{index} / {count}',
      playLabel = 'Start slide rotation',
      pauseLabel = 'Stop slide rotation',
      classes = {},
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const list = images ?? [];
    const api = useCarousel({
      slideCount: list.length,
      scope: 'image-slider',
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
        progress: counterLabel,
        play: playLabel,
        pause: pauseLabel,
      },
    });
    const rootProps = api.getRootProps() as { style?: CSSProperties };

    return (
      <div
        {...mergePartProps(rest, rootProps)}
        ref={ref}
        className={cx('apui-image-slider', classes.root, className)}
        aria-label={label}
        style={
          {
            ...rootProps.style,
            ...style,
            '--apui-_image-slider-ratio': aspectRatio,
          } as CSSProperties
        }
      >
        <div className={classes.viewport} data-scope="image-slider" data-part="viewport">
          <div {...api.getItemGroupProps()} className={classes.itemGroup}>
            {list.map((image, i) => (
              <div key={i} {...api.getItemProps({ index: i })} className={classes.item}>
                <img
                  className={classes.image}
                  data-scope="image-slider"
                  data-part="image"
                  src={safeSrc(image.src)}
                  alt={image.alt ?? ''}
                  loading={i > 0 ? 'lazy' : undefined}
                  decoding="async"
                />
                {hasContent(image.caption) || hasContent(image.description) ? (
                  <div className={classes.caption} data-scope="image-slider" data-part="caption">
                    {hasContent(image.caption) ? (
                      <p className={classes.title} data-scope="image-slider" data-part="title">
                        {image.caption}
                      </p>
                    ) : null}
                    {hasContent(image.description) ? (
                      <p
                        className={classes.description}
                        data-scope="image-slider"
                        data-part="description"
                      >
                        {image.description}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          <span {...api.getProgressTextProps()} className={classes.progressText}>
            {api.progressText}
          </span>
          <Button
            {...api.getPrevTriggerProps()}
            variant="soft"
            color="neutral"
            iconOnly
            leadingIcon="chevron-left"
            className={classes.prevTrigger}
          />
          <Button
            {...api.getNextTriggerProps()}
            variant="soft"
            color="neutral"
            iconOnly
            leadingIcon="chevron-right"
            className={classes.nextTrigger}
          />
          <div {...api.getIndicatorGroupProps()} className={classes.indicatorGroup}>
            {list.map((_, i) => (
              <button
                key={i}
                {...api.getIndicatorProps({ index: i })}
                className={classes.indicator}
              />
            ))}
          </div>
          {autoplay ? (
            <button {...api.getAutoplayTriggerProps()} className={classes.autoplayTrigger}>
              <IconSvg name={api.isPlaying ? 'pause' : 'play'} />
            </button>
          ) : null}
        </div>
        {thumbnails ? (
          <div className={classes.thumbs} data-scope="image-slider" data-part="thumbs">
            {list.map((image, i) => (
              <button key={i} {...api.getThumbProps({ index: i })} className={classes.thumb}>
                <img
                  src={safeSrc(image.src)}
                  alt={image.alt ?? ''}
                  loading="lazy"
                  decoding="async"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    );
  },
);

ImageSlider.displayName = 'ImageSlider';
