/**
 * @module Carousel
 *
 * Image/content carousel component with autoplay, keyboard navigation (arrow keys, Home, End),
 * touch swipe support, navigation arrows, and dot indicators. Supports custom slide rendering
 * and respects the `prefers-reduced-motion` media query for autoplay.
 */

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '@artisanpack-ui/tokens';

/**
 * Represents a single slide in the carousel.
 */
export interface CarouselSlide {
  /** URL of the slide image. */
  image?: string;
  /** Alt text for the slide image. */
  alt?: string;
  /** Title text displayed over the slide image in a gradient overlay. */
  title?: ReactNode;
  /** Description text displayed below the title in the gradient overlay. */
  description?: ReactNode;
  /** Arbitrary content to render as the slide. When provided, `image`, `title`, and `description` are ignored. */
  content?: ReactNode;
}

/**
 * Props for the {@link Carousel} component.
 */
export interface CarouselProps extends Omit<HTMLAttributes<HTMLDivElement>, 'content'> {
  /** Array of slides to display. */
  slides: CarouselSlide[];
  /** Whether to automatically advance slides at the given interval. @defaultValue false */
  autoplay?: boolean;
  /** Autoplay interval in milliseconds. @defaultValue 3000 */
  interval?: number;
  /** Whether to show dot indicators at the bottom. @defaultValue true */
  showIndicators?: boolean;
  /** Whether to show left/right arrow buttons. @defaultValue true */
  showArrows?: boolean;
  /** Custom render function for slides, receiving the slide data and its index. */
  renderSlide?: (slide: CarouselSlide, index: number) => ReactNode;
}

const reducedMotionQuery = '(prefers-reduced-motion: reduce)';

function subscribeReducedMotion(onStoreChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const mql = window.matchMedia(reducedMotionQuery);
  mql.addEventListener('change', onStoreChange);
  return () => mql.removeEventListener('change', onStoreChange);
}

function getReducedMotionSnapshot(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia(reducedMotionQuery).matches
  );
}

function getReducedMotionServerSnapshot(): boolean {
  return false;
}

/**
 * Image/content carousel with autoplay, keyboard navigation, and touch swipe support.
 *
 * Renders an accessible `role="region"` with `aria-roledescription="carousel"`.
 * Each slide is wrapped in a `role="group"` with `aria-roledescription="slide"`.
 * Autoplay is disabled when the user prefers reduced motion.
 *
 * @example
 * ```tsx
 * <Carousel
 *   slides={[
 *     { image: '/slide1.jpg', alt: 'Slide 1', title: 'Welcome' },
 *     { image: '/slide2.jpg', alt: 'Slide 2', title: 'Features' },
 *     { content: <div>Custom slide content</div> },
 *   ]}
 *   autoplay
 *   interval={5000}
 * />
 * ```
 */
export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      slides,
      autoplay = false,
      interval = 3000,
      showIndicators = true,
      showArrows = true,
      renderSlide,
      className,
      'aria-label': ariaLabel = 'Carousel',
      onKeyDown: onKeyDownProp,
      onTouchStart: onTouchStartProp,
      onTouchEnd: onTouchEndProp,
      onTouchCancel: onTouchCancelProp,
      ...rest
    },
    ref,
  ) => {
    const [current, setCurrent] = useState(0);
    const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const touchStartRef = useRef<number | null>(null);

    const total = slides.length;

    const prefersReducedMotion = useSyncExternalStore(
      subscribeReducedMotion,
      getReducedMotionSnapshot,
      getReducedMotionServerSnapshot,
    );
    const effectiveAutoplay = autoplay && !prefersReducedMotion;

    const goTo = useCallback(
      (index: number) => {
        if (total === 0) return;
        const safe = ((index % total) + total) % total;
        setCurrent(safe);
      },
      [total],
    );

    /* eslint-disable react-hooks/set-state-in-effect -- clamp index when slides are removed */
    useEffect(() => {
      if (total > 0) {
        setCurrent((c) => Math.min(c, total - 1));
      }
    }, [total]);
    /* eslint-enable react-hooks/set-state-in-effect */

    const safeIndex = total > 0 ? Math.max(0, Math.min(current, total - 1)) : 0;

    const next = useCallback(() => goTo(safeIndex + 1), [safeIndex, goTo]);
    const prev = useCallback(() => goTo(safeIndex - 1), [safeIndex, goTo]);

    useEffect(() => {
      if (!effectiveAutoplay || total <= 1) return;

      autoplayRef.current = setInterval(() => {
        setCurrent((c) => (c + 1) % total);
      }, interval);
      return () => {
        if (autoplayRef.current) clearInterval(autoplayRef.current);
      };
    }, [effectiveAutoplay, interval, total]);

    const isInteractiveTarget = (target: EventTarget): boolean => {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName;
      return (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        tag === 'BUTTON' ||
        tag === 'A' ||
        target.isContentEditable
      );
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDownProp?.(e);
      if (e.defaultPrevented || isInteractiveTarget(e.target)) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goTo(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goTo(total - 1);
      }
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
      onTouchStartProp?.(e);
      if (e.defaultPrevented) return;
      touchStartRef.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
      onTouchEndProp?.(e);
      if (e.defaultPrevented || touchStartRef.current === null) {
        touchStartRef.current = null;
        return;
      }
      const diff = touchStartRef.current - e.changedTouches[0].clientX;
      touchStartRef.current = null;
      if (Math.abs(diff) > 50) {
        if (diff > 0) next();
        else prev();
      }
    };

    const handleTouchCancel = (e: React.TouchEvent<HTMLDivElement>) => {
      touchStartRef.current = null;
      onTouchCancelProp?.(e);
    };

    if (total === 0) return null;

    const slide = slides[safeIndex];

    return (
      <div
        ref={ref}
        className={cn('relative w-full overflow-hidden rounded-box', className)}
        role="region"
        aria-label={ariaLabel}
        aria-roledescription="carousel"
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        tabIndex={0}
        {...rest}
      >
        <div
          className="w-full"
          role="group"
          aria-roledescription="slide"
          aria-label={`Slide ${safeIndex + 1} of ${total}`}
          aria-live={effectiveAutoplay ? 'off' : 'polite'}
          aria-atomic="true"
        >
          {renderSlide ? (
            renderSlide(slide, safeIndex)
          ) : slide.content !== undefined ? (
            slide.content
          ) : (
            <div className="relative">
              {slide.image && (
                <img src={slide.image} alt={slide.alt ?? ''} className="w-full object-cover" />
              )}
              {(slide.title || slide.description) && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 text-white">
                  {slide.title && <h3 className="text-xl font-bold">{slide.title}</h3>}
                  {slide.description && <p className="mt-1 opacity-80">{slide.description}</p>}
                </div>
              )}
            </div>
          )}
        </div>

        {showArrows && total > 1 && (
          <>
            <button
              type="button"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-base-100/80 hover:bg-base-100 cursor-pointer transition-colors"
              onClick={prev}
              aria-label="Previous slide"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-base-100/80 hover:bg-base-100 cursor-pointer transition-colors"
              onClick={next}
              aria-label="Next slide"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </>
        )}

        {showIndicators && total > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                className={cn(
                  'w-3 h-3 rounded-full transition-opacity',
                  i === safeIndex ? 'bg-base-100 opacity-100' : 'bg-base-100 opacity-50',
                )}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === safeIndex ? 'step' : undefined}
              />
            ))}
          </div>
        )}
      </div>
    );
  },
);

Carousel.displayName = 'Carousel';
