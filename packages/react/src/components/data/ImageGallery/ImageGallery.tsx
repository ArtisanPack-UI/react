/**
 * @module ImageGallery
 *
 * The design-system ImageGallery (#61): a grid of images that opens a
 * lightbox, on the behavior engine's lightbox (`useLightbox`: the dialog
 * machine scoped `image-gallery`, plus the index of the image shown). It
 * renders the `.apui-image-gallery` markup contract styled by
 * `@artisanpack-ui/css`; the lightbox panel is `.apui-lightbox`, Zag's
 * `content` part (D-019).
 *
 * @packageDocumentation
 */

import { lightboxCounter, useLightbox } from '@artisanpack-ui/behavior/react';
import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';

import { cx, flag, hasContent, type PartClasses } from '../../../internal/parts';
import { Portal } from '../../../internal/portal';
import { isSafeMediaSrc } from '../../../internal/url';
import { Button } from '../../form/Button/Button';

/** One image of an {@link ImageGallery}. */
export interface ImageGalleryImage {
  /** The image URL. */
  src: string;
  /** Describes the image. Every image needs it; a caption doesn't replace it. */
  alt?: string;
  /** Visible text under the image, and after the counter in the lightbox. */
  caption?: ReactNode;
}

/** The parts an {@link ImageGallery} accepts extra classes for. */
export type ImageGalleryPart =
  | 'root'
  | 'grid'
  | 'item'
  | 'trigger'
  | 'image'
  | 'caption'
  | 'backdrop'
  | 'positioner'
  | 'content'
  | 'bar'
  | 'title'
  | 'download'
  | 'closeTrigger'
  | 'stage'
  | 'prevTrigger'
  | 'nextTrigger'
  | 'thumbs'
  | 'thumb';

/** Props for the {@link ImageGallery} component. Native `<div>` attributes go to the root. */
export interface ImageGalleryProps extends HTMLAttributes<HTMLDivElement> {
  /** The images, in order. */
  images: ImageGalleryImage[];
  /** How many columns the grid has. @defaultValue `4` */
  columns?: number;
  /** The first image spans two columns and two rows. Emitted as `data-featured`. @defaultValue `false` */
  featured?: boolean;
  /** Each image is a button that opens the lightbox. Off renders a plain grid. @defaultValue `true` */
  lightbox?: boolean;
  /** Whether the lightbox is open (controlled). Pair it with `onOpenChange`. */
  open?: boolean;
  /** The initial state of an uncontrolled lightbox. @defaultValue `false` */
  defaultOpen?: boolean;
  /** Called when the lightbox opens or closes itself. Setting `open` doesn't call it. */
  onOpenChange?: (open: boolean) => void;
  /** The image the lightbox shows, 0-based (controlled). Pair it with `onIndexChange`. */
  index?: number;
  /** The initial image of an uncontrolled lightbox. @defaultValue `0` */
  defaultIndex?: number;
  /** Called when the lightbox shows another image. Setting `index` doesn't call it. */
  onIndexChange?: (index: number) => void;
  /** Adds a download link for the image shown to the lightbox's bar. @defaultValue `false` */
  downloadable?: boolean;
  /** Traps focus, locks scroll and hides the page behind the lightbox. @defaultValue `true` */
  modal?: boolean;
  /** Renders the lightbox at the end of the body (a React portal). @defaultValue `true` */
  portal?: boolean;
  /** The close button's accessible name. @defaultValue `'Close'` */
  closeLabel?: string;
  /** The previous button's accessible name. @defaultValue `'Previous photo'` */
  previousLabel?: string;
  /** The next button's accessible name. @defaultValue `'Next photo'` */
  nextLabel?: string;
  /** The download link's accessible name. @defaultValue `'Download'` */
  downloadLabel?: string;
  /** The counter; `{index}` and `{count}` are replaced. @defaultValue `'{index} / {count}'` */
  counterLabel?: string;
  /** Names the thumbnail strip. @defaultValue `'Photos'` */
  thumbsLabel?: string;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<ImageGalleryPart>;
}

const safeSrc = (src: string) => (isSafeMediaSrc(src) ? src : undefined);

/**
 * A grid of images that opens a lightbox: a dark dialog with the image, a
 * counter and caption, previous and next buttons, thumbnails, and arrow keys
 * that follow the text direction.
 *
 * @example
 * ```tsx
 * <ImageGallery featured images={[{ src: '/a.jpg', alt: 'Lobby', caption: 'The lobby' }]} />
 * ```
 */
export const ImageGallery = forwardRef<HTMLDivElement, ImageGalleryProps>(
  (
    {
      images,
      columns = 4,
      featured = false,
      lightbox = true,
      open,
      defaultOpen,
      onOpenChange,
      index,
      defaultIndex,
      onIndexChange,
      downloadable = false,
      modal = true,
      portal = true,
      closeLabel = 'Close',
      previousLabel = 'Previous photo',
      nextLabel = 'Next photo',
      downloadLabel = 'Download',
      counterLabel = '{index} / {count}',
      thumbsLabel = 'Photos',
      classes = {},
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const list = images ?? [];
    const api = useLightbox({
      count: list.length,
      open,
      defaultOpen,
      onOpenChange: ({ open: next }) => onOpenChange?.(next),
      index,
      defaultIndex,
      onIndexChange: ({ index: next }) => onIndexChange?.(next),
      modal,
    });
    const current = list[api.index];
    const currentSrc = current ? safeSrc(current.src) : undefined;

    return (
      <div
        {...rest}
        ref={ref}
        className={cx('apui-image-gallery', classes.root, className)}
        data-scope="image-gallery"
        data-part="root"
        data-featured={flag(featured)}
        style={{ ...style, '--apui-_image-gallery-columns': columns } as CSSProperties}
      >
        <div className={classes.grid} data-scope="image-gallery" data-part="grid">
          {list.map((image, i) => {
            const img = (
              <img
                className={classes.image}
                data-scope="image-gallery"
                data-part="image"
                src={safeSrc(image.src)}
                alt={image.alt ?? ''}
                loading="lazy"
                decoding="async"
              />
            );
            return (
              <figure key={i} className={classes.item} data-scope="image-gallery" data-part="item">
                {lightbox ? (
                  <button {...api.getTriggerProps({ index: i })} className={classes.trigger}>
                    {img}
                  </button>
                ) : (
                  img
                )}
                {hasContent(image.caption) ? (
                  <figcaption
                    className={classes.caption}
                    data-scope="image-gallery"
                    data-part="caption"
                  >
                    {image.caption}
                  </figcaption>
                ) : null}
              </figure>
            );
          })}
        </div>
        {lightbox ? (
          <Portal enabled={portal}>
            <div {...api.getBackdropProps()} className={classes.backdrop} />
            <div {...api.getPositionerProps()} className={classes.positioner}>
              <div {...api.getContentProps()} className={cx('apui-lightbox', classes.content)}>
                <div className={classes.bar} data-scope="image-gallery" data-part="bar">
                  <h2 {...api.getTitleProps()} className={classes.title} aria-live="polite">
                    {/* One text node, as Livewire and Vue render it, so the glyphs shape alike. */}
                    {current && typeof current.caption === 'string' && current.caption !== '' ? (
                      `${lightboxCounter(counterLabel, api.index, api.count)} · ${current.caption}`
                    ) : (
                      <>
                        {lightboxCounter(counterLabel, api.index, api.count)}
                        {current && hasContent(current.caption) ? <> · {current.caption}</> : null}
                      </>
                    )}
                  </h2>
                  {downloadable ? (
                    <Button
                      {...api.getDownloadProps()}
                      variant="ghost"
                      color="neutral"
                      size="sm"
                      iconOnly
                      leadingIcon="download"
                      href={currentSrc}
                      download=""
                      aria-label={downloadLabel}
                      className={classes.download}
                    />
                  ) : null}
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
                </div>
                <div className={classes.stage} data-scope="image-gallery" data-part="stage">
                  <img
                    {...api.getImageProps()}
                    className={classes.image}
                    src={currentSrc}
                    alt={current?.alt ?? ''}
                  />
                  <Button
                    {...api.getPrevTriggerProps()}
                    variant="soft"
                    color="neutral"
                    iconOnly
                    leadingIcon="chevron-left"
                    aria-label={previousLabel}
                    className={classes.prevTrigger}
                  />
                  <Button
                    {...api.getNextTriggerProps()}
                    variant="soft"
                    color="neutral"
                    iconOnly
                    leadingIcon="chevron-right"
                    aria-label={nextLabel}
                    className={classes.nextTrigger}
                  />
                </div>
                <div
                  className={classes.thumbs}
                  data-scope="image-gallery"
                  data-part="thumbs"
                  role="group"
                  aria-label={thumbsLabel}
                >
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
              </div>
            </div>
          </Portal>
        ) : null}
      </div>
    );
  },
);

ImageGallery.displayName = 'ImageGallery';
