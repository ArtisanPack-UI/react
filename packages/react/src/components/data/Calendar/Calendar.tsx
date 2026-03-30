import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor } from '@artisanpack-ui/tokens';

export interface CalendarEvent {
  id: string | number;
  title: string;
  date: string; // ISO date string (YYYY-MM-DD)
  endDate?: string;
  color?: DaisyColor;
  description?: string;
}

export interface CalendarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: Date;
  onChange?: (date: Date) => void;
  events?: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  weekStartsOnSunday?: boolean;
  highlightWeekends?: boolean;
  highlightToday?: boolean;
  minDate?: Date;
  maxDate?: Date;
  color?: DaisyColor;
  renderDay?: (date: Date, events: CalendarEvent[]) => ReactNode;
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

const eventDotMap: Record<DaisyColor, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  accent: 'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
  info: 'bg-info',
  neutral: 'bg-neutral',
};

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isBeforeDay(a: Date, b: Date): boolean {
  const aDay = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const bDay = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return aDay < bDay;
}

function isAfterDay(a: Date, b: Date): boolean {
  const aDay = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const bDay = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return aDay > bDay;
}

function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const WEEKDAYS_SUN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAYS_MON = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      value,
      onChange,
      events = [],
      onEventClick,
      weekStartsOnSunday = false,
      highlightWeekends = false,
      highlightToday = true,
      minDate,
      maxDate,
      color = 'primary',
      renderDay,
      className,
      ...rest
    },
    ref,
  ) => {
    const today = new Date();
    const [viewDate, setViewDate] = useState(() => value ?? today);

    // Sync viewDate when controlled value changes
    /* eslint-disable react-hooks/set-state-in-effect -- intentional sync from controlled prop */
    useEffect(() => {
      if (value) setViewDate(value);
    }, [value]);
    /* eslint-enable react-hooks/set-state-in-effect */

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const weekdays = weekStartsOnSunday ? WEEKDAYS_SUN : WEEKDAYS_MON;

    const eventsByDate = useMemo(() => {
      const map = new Map<string, CalendarEvent[]>();
      for (const event of events) {
        const startKey = event.date;
        if (event.endDate && event.endDate > startKey) {
          const start = new Date(startKey + 'T00:00:00');
          const end = new Date(event.endDate + 'T00:00:00');
          const cursor = new Date(start);
          while (cursor <= end) {
            const key = formatDateKey(cursor);
            const existing = map.get(key) ?? [];
            existing.push(event);
            map.set(key, existing);
            cursor.setDate(cursor.getDate() + 1);
          }
        } else {
          const existing = map.get(startKey) ?? [];
          existing.push(event);
          map.set(startKey, existing);
        }
      }
      return map;
    }, [events]);

    const calendarDays = useMemo(() => {
      const firstOfMonth = new Date(year, month, 1);
      const lastOfMonth = new Date(year, month + 1, 0);

      const startDay = firstOfMonth.getDay();
      const offset = weekStartsOnSunday ? startDay : (startDay + 6) % 7;

      const days: (Date | null)[] = [];

      for (let i = 0; i < offset; i++) {
        days.push(null);
      }

      for (let d = 1; d <= lastOfMonth.getDate(); d++) {
        days.push(new Date(year, month, d));
      }

      while (days.length % 7 !== 0) {
        days.push(null);
      }

      return days;
    }, [year, month, weekStartsOnSunday]);

    const goToPrevMonth = useCallback(() => {
      setViewDate(new Date(year, month - 1, 1));
    }, [year, month]);

    const goToNextMonth = useCallback(() => {
      setViewDate(new Date(year, month + 1, 1));
    }, [year, month]);

    const goToToday = useCallback(() => {
      setViewDate(new Date());
    }, []);

    const handleDayClick = (date: Date) => {
      if (minDate && isBeforeDay(date, minDate)) return;
      if (maxDate && isAfterDay(date, maxDate)) return;
      onChange?.(date);
    };

    const isWeekend = (date: Date): boolean => {
      const day = date.getDay();
      return day === 0 || day === 6;
    };

    const isDisabled = (date: Date): boolean => {
      if (minDate && isBeforeDay(date, minDate)) return true;
      if (maxDate && isAfterDay(date, maxDate)) return true;
      return false;
    };

    const handleEventDotInteraction = (event: CalendarEvent, e: React.MouseEvent) => {
      if (onEventClick) {
        e.stopPropagation();
        onEventClick(event);
      }
    };

    return (
      <div ref={ref} className={cn('bg-base-100 rounded-box p-4 shadow', className)} {...rest}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={goToPrevMonth}
            aria-label="Previous month"
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

          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold">
              {MONTH_NAMES[month]} {year}
            </h2>
            <button type="button" className="btn btn-ghost btn-xs" onClick={goToToday}>
              Today
            </button>
          </div>

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={goToNextMonth}
            aria-label="Next month"
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
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-1" role="row" aria-label="Days of the week">
          {weekdays.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium opacity-60 py-2"
              role="columnheader"
              aria-label={day}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7" role="grid" aria-label={`${MONTH_NAMES[month]} ${year}`}>
          {calendarDays.map((date, i) => {
            if (!date) {
              return <div key={`empty-${i}`} className="p-2" role="gridcell" />;
            }

            const dateKey = formatDateKey(date);
            const dayEvents = eventsByDate.get(dateKey) ?? [];
            const isToday = highlightToday && isSameDay(date, today);
            const isSelected = value && isSameDay(date, value);
            const disabled = isDisabled(date);
            const weekend = highlightWeekends && isWeekend(date);

            if (renderDay) {
              return (
                <div key={dateKey} className="p-1" role="gridcell">
                  {renderDay(date, dayEvents)}
                </div>
              );
            }

            return (
              <div
                key={dateKey}
                role="gridcell"
                className={cn(
                  'flex flex-col items-center p-2 rounded-lg transition-colors min-h-12',
                  weekend && !isSelected && 'bg-base-200/50',
                  disabled && 'opacity-30',
                )}
              >
                <button
                  type="button"
                  className={cn(
                    'w-full rounded-md px-1 py-0.5 text-sm transition-colors',
                    'hover:bg-base-200',
                    isToday && !isSelected && 'ring-2 ring-current',
                    isSelected && color && colorMap[color],
                    disabled && 'cursor-not-allowed',
                  )}
                  onClick={() => handleDayClick(date)}
                  disabled={disabled}
                  aria-label={date.toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  aria-selected={isSelected ?? undefined}
                  aria-current={isToday ? 'date' : undefined}
                >
                  {date.getDate()}
                </button>
                {dayEvents.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5">
                    {dayEvents.slice(0, 3).map((event) =>
                      onEventClick ? (
                        <button
                          key={event.id}
                          type="button"
                          className="relative flex items-center justify-center w-4 h-4 cursor-pointer"
                          aria-label={event.title}
                          onClick={(e) => handleEventDotInteraction(event, e)}
                        >
                          <span
                            className={cn(
                              'w-1.5 h-1.5 rounded-full',
                              event.color ? eventDotMap[event.color] : eventDotMap.primary,
                            )}
                            aria-hidden="true"
                          />
                        </button>
                      ) : (
                        <span
                          key={event.id}
                          className={cn(
                            'w-1.5 h-1.5 rounded-full',
                            event.color ? eventDotMap[event.color] : eventDotMap.primary,
                          )}
                          title={event.title}
                          role="img"
                          aria-label={event.title}
                        />
                      ),
                    )}
                    {dayEvents.length > 3 && (
                      <span className="text-xs opacity-50">+{dayEvents.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);

Calendar.displayName = 'Calendar';
