/**
 * @module Timeline
 *
 * Timeline component for displaying a chronological sequence of events.
 * Built on DaisyUI's timeline classes with support for vertical/horizontal
 * orientation, compact mode, colored indicators, custom icons, and pending states.
 */

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor } from '@artisanpack-ui/tokens';

/**
 * Represents a single item in the timeline.
 */
export interface TimelineItemData {
  /** Unique identifier for the timeline item. Falls back to array index if not provided. */
  id?: string | number;
  /** Primary title text for the event. */
  title: ReactNode;
  /** Optional subtitle displayed below the title (e.g., a date or category). */
  subtitle?: ReactNode;
  /** Optional description body text displayed below the subtitle. */
  description?: ReactNode;
  /** Custom icon element displayed in the timeline circle. Defaults to a checkmark SVG. */
  icon?: ReactNode;
  /** DaisyUI color for the timeline circle and connecting lines. @defaultValue 'primary' */
  color?: DaisyColor;
  /** Whether this item is in a pending/incomplete state (rendered with reduced opacity). */
  pending?: boolean;
}

/**
 * Props for the {@link Timeline} component.
 */
export interface TimelineProps extends HTMLAttributes<HTMLUListElement> {
  /** Array of timeline items to display in order. */
  items: TimelineItemData[];
  /** Whether to render the timeline vertically. @defaultValue true */
  vertical?: boolean;
  /** Whether to use compact mode (DaisyUI timeline-compact). @defaultValue false */
  compact?: boolean;
  /** Whether to snap icons to the timeline line (DaisyUI timeline-snap-icon). @defaultValue false */
  snap?: boolean;
}

const colorMap: Record<DaisyColor, string> = {
  primary: 'bg-primary text-primary-content',
  secondary: 'bg-secondary text-secondary-content',
  accent: 'bg-accent text-accent-content',
  success: 'bg-success text-success-content',
  warning: 'bg-warning text-warning-content',
  error: 'bg-error text-error-content',
  info: 'bg-info text-info-content',
  neutral: 'bg-neutral text-neutral-content',
};

const hrColorMap: Record<DaisyColor, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  accent: 'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
  info: 'bg-info',
  neutral: 'bg-neutral',
};

/**
 * Timeline component for displaying a chronological sequence of events.
 *
 * Renders a DaisyUI-styled `<ul>` with colored circles, connecting lines,
 * and event content for each item. Pending items are displayed with reduced
 * opacity and no color.
 *
 * @example
 * ```tsx
 * <Timeline
 *   items={[
 *     { title: 'Order Placed', subtitle: 'Mar 1', color: 'success' },
 *     { title: 'Shipped', subtitle: 'Mar 3', color: 'info' },
 *     { title: 'Delivered', subtitle: 'Pending', pending: true },
 *   ]}
 *   vertical
 * />
 * ```
 */
export const Timeline = forwardRef<HTMLUListElement, TimelineProps>(
  ({ items, vertical = true, compact = false, snap = false, className, ...rest }, ref) => {
    return (
      <ul
        ref={ref}
        className={cn(
          'timeline',
          vertical && 'timeline-vertical',
          !vertical && 'timeline-horizontal',
          compact && 'timeline-compact',
          snap && 'timeline-snap-icon',
          className,
        )}
        {...rest}
      >
        {items.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === items.length - 1;
          const color = item.pending ? undefined : (item.color ?? 'primary');
          const hrClass = color && !item.pending ? hrColorMap[color] : undefined;

          return (
            <li key={item.id ?? index}>
              {!isFirst && <hr className={cn(hrClass)} />}
              <div className="timeline-middle">
                <div
                  className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center',
                    color ? colorMap[color] : 'bg-base-300',
                    item.pending && 'opacity-50',
                  )}
                  aria-hidden="true"
                >
                  {item.icon ?? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-3 h-3"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <div className={cn('timeline-end mb-10', item.pending && 'opacity-50')}>
                <div className="font-bold">{item.title}</div>
                {item.subtitle && <div className="text-sm opacity-70">{item.subtitle}</div>}
                {item.description && <div className="mt-1">{item.description}</div>}
              </div>
              {!isLast && <hr className={cn(hrClass)} />}
            </li>
          );
        })}
      </ul>
    );
  },
);

Timeline.displayName = 'Timeline';
