/**
 * @module Timeline
 *
 * The design-system Timeline (#61): events in order, rendering the
 * `ol.apui-timeline` markup contract styled by `@artisanpack-ui/css`.
 * Compose it from {@link TimelineItem} children, or pass the same events as
 * `items` (D-023).
 *
 * @packageDocumentation
 */

import {
  createContext,
  forwardRef,
  useContext,
  type LiHTMLAttributes,
  type OlHTMLAttributes,
  type ReactNode,
} from 'react';

import { IconSvg } from '../../../internal/icon';
import { cx, hasContent, type PartClasses } from '../../../internal/parts';

/** A Timeline's markers. Emitted as `data-variant`. */
export type TimelineVariant = 'icon' | 'dot';

/** A marker's color. Emitted as `data-color` on the marker. */
export type TimelineColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

/** The parts a {@link Timeline} accepts extra classes for, its items' included. */
export type TimelinePart = 'root' | 'item' | 'marker' | 'head' | 'time' | 'body' | 'card';

/** One event in {@link TimelineProps.items}. */
export interface TimelineItemData {
  /** What happened: the head. */
  title?: ReactNode;
  /** When, as shown ("2h ago"). */
  time?: ReactNode;
  /** When, machine-readable (ISO 8601), for the `<time>` element. */
  datetime?: string;
  /** A registry icon name for the marker. */
  icon?: string;
  /** Tints the marker. */
  color?: TimelineColor;
  /** Muted detail under the head. */
  description?: ReactNode;
  /** A sunken box under the head, such as a comment. */
  card?: ReactNode;
}

/** Props for the {@link Timeline} component. Native `<ol>` attributes go to the root. */
export interface TimelineProps extends OlHTMLAttributes<HTMLOListElement> {
  /** The events as data, rendering the same children as composition. Rendered before `children`. */
  items?: TimelineItemData[];
  /** Icon markers, or small dots for a compact history. @defaultValue `'icon'` */
  variant?: TimelineVariant;
  /** The list's accessible name. */
  label?: string;
  /** Extra classes per part, its items' included; `classes.root` merges with `className`. */
  classes?: PartClasses<TimelinePart>;
}

/** Props for a {@link TimelineItem}. Native `<li>` attributes go to the item. */
export interface TimelineItemProps
  extends Omit<LiHTMLAttributes<HTMLLIElement>, 'title' | 'color'>, TimelineItemData {}

const COLORS: readonly TimelineColor[] = [
  'primary',
  'secondary',
  'accent',
  'neutral',
  'success',
  'warning',
  'error',
  'info',
];

const TimelineContext = createContext<PartClasses<TimelinePart>>({});

/**
 * Events in order. The ref points at the `<ol>`.
 *
 * @example
 * ```tsx
 * <Timeline label="Activity">
 *   <TimelineItem icon="circle-check" color="success" time="2h ago" title="Offer accepted" />
 * </Timeline>
 * ```
 */
export const Timeline = forwardRef<HTMLOListElement, TimelineProps>(
  ({ items, variant = 'icon', label, classes = {}, className, children, ...rest }, ref) => (
    <TimelineContext.Provider value={classes}>
      <ol
        {...rest}
        ref={ref}
        className={cx('apui-timeline', classes.root, className)}
        data-variant={variant === 'dot' ? 'dot' : 'icon'}
        aria-label={label}
      >
        {(items ?? []).map((item, index) => (
          <TimelineItem key={`apui-timeline-${index}`} {...item} />
        ))}
        {children}
      </ol>
    </TimelineContext.Provider>
  ),
);

Timeline.displayName = 'Timeline';

/**
 * One event of a {@link Timeline}: the marker, the head (`children` or
 * `title`, then the time), the body and the card. The ref points at the `<li>`.
 */
export const TimelineItem = forwardRef<HTMLLIElement, TimelineItemProps>(
  (
    { title, time, datetime, icon, color, description, card, className, children, ...rest },
    ref,
  ) => {
    const classes = useContext(TimelineContext);
    const markerColor = color !== undefined && COLORS.includes(color) ? color : undefined;

    return (
      <li
        {...rest}
        ref={ref}
        className={cx(classes.item, className)}
        data-scope="timeline"
        data-part="item"
      >
        <span
          className={classes.marker}
          data-scope="timeline"
          data-part="marker"
          data-color={markerColor}
          aria-hidden="true"
        >
          {icon ? <IconSvg name={icon} /> : null}
        </span>
        <div className={classes.head} data-scope="timeline" data-part="head">
          {hasContent(children) ? children : title}
          {hasContent(time) ? (
            <time
              className={classes.time}
              data-scope="timeline"
              data-part="time"
              dateTime={datetime || undefined}
            >
              {time}
            </time>
          ) : null}
        </div>
        {hasContent(description) ? (
          <div className={classes.body} data-scope="timeline" data-part="body">
            {description}
          </div>
        ) : null}
        {hasContent(card) ? (
          <div className={classes.card} data-scope="timeline" data-part="card">
            {card}
          </div>
        ) : null}
      </li>
    );
  },
);

TimelineItem.displayName = 'TimelineItem';
