/**
 * @module Calendar
 *
 * The design-system Calendar (#64): events on a month grid, a week, a day or
 * an agenda list, rendering the `.apui-calendar` markup contract styled by
 * `@artisanpack-ui/css`. The days, titles, labels and event order come from
 * the behavior package's `calendarModel`, the same rules Livewire's
 * server-rendered grid ports to PHP. The toolbar uses the design-system
 * Button and the Tabs markup; event details open in the design-system Dialog.
 *
 * @packageDocumentation
 */

import {
  CALENDAR_LABELS,
  CALENDAR_MAX_EVENTS,
  calendarGridKeydown,
  calendarModel,
  rovingKeydown,
  type CalendarColor,
  type CalendarEvent,
  type CalendarItem,
  type CalendarLabels,
  type CalendarView,
} from '@artisanpack-ui/behavior';
import {
  forwardRef,
  useId,
  useMemo,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

import { cx, devWarnOnce, flag, type PartClasses } from '../../../internal/parts';
import { safeHref } from '../../../internal/url';
import { Button } from '../../form/Button/Button';
import { EmptyState } from '../../feedback/EmptyState/EmptyState';
import { Dialog } from '../../layout/Dialog/Dialog';
import { Badge } from '../Badge/Badge';
import { Text } from '../../layout/Text/Text';
import { Stack } from '../../layout/Stack/Stack';

export type { CalendarColor, CalendarEvent, CalendarLabels, CalendarView };

/** The parts a {@link Calendar} accepts extra classes for. */
export type CalendarPart =
  | 'root'
  | 'toolbar'
  | 'todayTrigger'
  | 'previousTrigger'
  | 'nextTrigger'
  | 'title'
  | 'viewTabs'
  | 'createTrigger'
  | 'body'
  | 'grid'
  | 'row'
  | 'weekday'
  | 'cell'
  | 'date'
  | 'event'
  | 'eventTime'
  | 'eventTitle'
  | 'more'
  | 'legend'
  | 'legendItem';

/** Props for the {@link Calendar} component. Native `<div>` attributes go to the root. */
export interface CalendarProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  /** month, week, day or agenda. Controlled with `onViewChange`; uncontrolled when unset. @defaultValue `'month'` */
  view?: CalendarView;
  /** The date the view shows, YYYY-MM-DD. Controlled with `onDateChange`; uncontrolled (today) when unset. */
  date?: string;
  /** The date marked as today, YYYY-MM-DD. Defaults to the current date in `timeZone`. */
  today?: string;
  /** The events: `{ id, start, end, title, color, allDay, category, description, href }`. */
  events?: readonly CalendarEvent[];
  /** The first day of the week, 0 (Sunday) to 6. Follows the locale unless set. */
  weekStartsOn?: number;
  /** BCP 47 locale for names and the first day of the week. @defaultValue `'en-US'` */
  locale?: string;
  /** IANA zone for today and for times with Z or an offset. @defaultValue `'UTC'` */
  timeZone?: string;
  /** Events a month cell shows before "+N more". @defaultValue `2` */
  maxEvents?: number;
  /** Shows a New event button that fires `onCreate`. @defaultValue `false` */
  creatable?: boolean;
  /** Clicking an event opens a Dialog with its details. @defaultValue `true` */
  details?: boolean;
  /** Built-in text; keys you leave out keep their defaults. Translate them. */
  labels?: Partial<CalendarLabels>;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<CalendarPart>;
  /** A view tab or "+N more" chose a view. */
  onViewChange?: (view: CalendarView) => void;
  /** Today, previous, next or "+N more" moved the date. */
  onDateChange?: (date: string) => void;
  /** An event without href was chosen. */
  onEventClick?: (event: CalendarEvent) => void;
  /** The New event button was chosen, with the shown date. */
  onCreate?: (date: string) => void;
  /** Replaces the details Dialog's body. */
  renderEventDetails?: (event: CalendarEvent) => ReactNode;
  /**
   * @deprecated 2.x: use `date` (YYYY-MM-DD). Seeds the shown date, and
   * re-seeds it whenever it changes to another day; it doesn't lock it, so
   * the toolbar still moves.
   */
  value?: Date;
  /**
   * @deprecated 2.x: use `onDateChange`; this one receives a Date. Fires
   * whenever the shown date moves (today, previous, next, "+N more").
   */
  onChange?: (date: Date) => void;
  /** @deprecated 2.x: use `weekStartsOn={0}`. */
  weekStartsOnSunday?: boolean;
  /** @deprecated 2.x: no longer drawn. Ignored. */
  highlightWeekends?: boolean;
  /** @deprecated 2.x: today is always marked. Ignored. */
  highlightToday?: boolean;
  /** @deprecated 2.x: no longer limited. Ignored. */
  minDate?: Date;
  /** @deprecated 2.x: no longer limited. Ignored. */
  maxDate?: Date;
  /** @deprecated 2.x: events take their own `color`. Ignored. */
  color?: string;
  /** @deprecated 2.x: no longer supported. Ignored. */
  renderDay?: (date: Date, events: CalendarEvent[]) => ReactNode;
}

const VIEWS: readonly CalendarView[] = ['month', 'week', 'day', 'agenda'];

const isoOf = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

/**
 * Events on a month grid, a week, a day or an agenda list. The ref points at
 * the root.
 *
 * @example
 * ```tsx
 * <Calendar events={[{ start: '2026-11-02T09:00', title: 'Team meeting', color: 'error' }]} />
 * ```
 */
export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      view: controlledView,
      date: controlledDate,
      today,
      events = [],
      weekStartsOn,
      locale = 'en-US',
      timeZone,
      maxEvents = CALENDAR_MAX_EVENTS,
      creatable = false,
      details = true,
      labels,
      classes = {},
      onViewChange,
      onDateChange,
      onEventClick,
      onCreate,
      renderEventDetails,
      value,
      onChange,
      weekStartsOnSunday,
      highlightWeekends: _highlightWeekends,
      highlightToday: _highlightToday,
      minDate: _minDate,
      maxDate: _maxDate,
      color: _color,
      renderDay,
      className,
      id: idProp,
      ...rest
    },
    ref,
  ) => {
    const generated = useId();
    const id = idProp ?? `apui-calendar-${generated.replace(/:/g, '')}`;
    if (renderDay)
      devWarnOnce('calendar-render-day', 'Calendar: renderDay is no longer supported.');

    const legacyDate =
      value instanceof Date && !Number.isNaN(value.getTime()) ? isoOf(value) : undefined;
    const [ownView, setOwnView] = useState<CalendarView>(controlledView ?? 'month');
    const [ownDate, setOwnDate] = useState<string | undefined>(controlledDate ?? legacyDate);
    const [seededFrom, setSeededFrom] = useState(legacyDate);
    if (legacyDate !== seededFrom) {
      setSeededFrom(legacyDate);
      if (legacyDate !== undefined) setOwnDate(legacyDate);
    }
    const [roving, setRoving] = useState<{ period: string; date: string } | null>(null);
    const [selected, setSelected] = useState<CalendarItem | null>(null);
    const view = controlledView ?? ownView;
    const shownDate = controlledDate ?? ownDate;
    const weekStart = weekStartsOn ?? (weekStartsOnSunday ? 0 : undefined);

    const model = useMemo(
      () =>
        calendarModel({
          view,
          date: shownDate,
          today,
          events,
          weekStartsOn: weekStart,
          locale,
          timeZone,
          maxEvents,
          labels: { ...CALENDAR_LABELS, ...labels },
        }),
      [view, shownDate, today, events, weekStart, locale, timeZone, maxEvents, labels],
    );
    const text = model.labels;
    const period = `${model.view}:${model.date}`;
    const tabStop = roving !== null && roving.period === period ? roving.date : null;
    const hasStop =
      tabStop !== null && model.rows.some((row) => row.some((day) => day.date === tabStop));
    const titleId = `${id}-title`;
    const bodyId = `${id}-body`;
    const tabId = (option: CalendarView) => `${id}-tab-${option}`;

    const changeView = (next: CalendarView) => {
      if (controlledView === undefined) setOwnView(next);
      onViewChange?.(next);
    };
    const changeDate = (next: string) => {
      if (controlledDate === undefined) setOwnDate(next);
      onDateChange?.(next);
      if (onChange) {
        const [y, m, d] = next.split('-').map(Number);
        onChange(new Date(y!, m! - 1, d!));
      }
    };
    const chooseEvent = (item: CalendarItem) => {
      onEventClick?.(item.event);
      if (details) setSelected(item);
    };

    const renderEvent = (item: CalendarItem, time: string) => {
      const href = safeHref(item.href ?? undefined);
      const inner = (
        <>
          {time !== '' ? (
            <span data-scope="calendar" data-part="event-time" className={classes.eventTime}>
              {time}
            </span>
          ) : null}
          <span data-scope="calendar" data-part="event-title" className={classes.eventTitle}>
            {item.title}
          </span>
          <span className="apui-sr-only">, {item.context}</span>
        </>
      );
      const common = {
        'data-scope': 'calendar',
        'data-part': 'event',
        'data-color': item.color,
        'data-event-key': item.eventKey,
        className: classes.event,
      };
      return href ? (
        <a key={item.key} {...common} href={href}>
          {inner}
        </a>
      ) : (
        <button
          key={item.key}
          {...common}
          type="button"
          aria-haspopup={details ? 'dialog' : undefined}
          onClick={() => chooseEvent(item)}
        >
          {inner}
        </button>
      );
    };

    const onGridKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      const cell = calendarGridKeydown(event.nativeEvent, event.currentTarget);
      const date = cell?.getAttribute('data-date');
      if (date) setRoving({ period, date });
    };
    const onTabsKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      rovingKeydown(event.nativeEvent, event.currentTarget, '[role="tab"]');
    };

    let body: ReactNode;
    if (model.view === 'agenda') {
      body =
        model.agenda.length === 0 ? (
          <EmptyState size="sm" icon="calendar" title={text.empty} />
        ) : (
          <ul
            data-scope="calendar"
            data-part="grid"
            aria-labelledby={titleId}
            className={classes.grid}
          >
            {model.agenda.map((day) => (
              <li
                key={day.date}
                data-scope="calendar"
                data-part="row"
                data-date={day.date}
                data-today={flag(day.today)}
                className={classes.row}
              >
                <h3
                  data-scope="calendar"
                  data-part="weekday"
                  id={`${id}-${day.date}`}
                  data-today={flag(day.today)}
                  className={classes.weekday}
                >
                  {day.label}
                </h3>
                <ul
                  data-scope="calendar"
                  data-part="cell"
                  aria-labelledby={`${id}-${day.date}`}
                  className={classes.cell}
                >
                  {day.events.map((item) => (
                    <li key={item.key}>{renderEvent(item, item.range)}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        );
    } else {
      body = (
        <div
          data-scope="calendar"
          data-part="grid"
          role="grid"
          aria-labelledby={titleId}
          onKeyDown={onGridKeyDown}
          className={classes.grid}
        >
          <div data-scope="calendar" data-part="row" role="row" className={classes.row}>
            {model.weekdays.map((weekday, index) => (
              <div
                key={index}
                data-scope="calendar"
                data-part="weekday"
                role="columnheader"
                data-today={flag(weekday.today)}
                className={classes.weekday}
              >
                {weekday.short}
                {weekday.day !== null ? (
                  <>
                    {' '}
                    <span data-scope="calendar" data-part="date" className={classes.date}>
                      {weekday.day}
                    </span>
                  </>
                ) : null}
              </div>
            ))}
          </div>
          {model.rows.map((row) => (
            <div
              key={row[0]!.date}
              data-scope="calendar"
              data-part="row"
              role="row"
              className={classes.row}
            >
              {row.map((day) => (
                <div
                  key={day.date}
                  data-scope="calendar"
                  data-part="cell"
                  role="gridcell"
                  id={`${id}-${day.date}`}
                  data-date={day.date}
                  tabIndex={(hasStop ? day.date === tabStop : day.focus) ? 0 : -1}
                  data-outside={flag(day.outside)}
                  data-today={flag(day.today)}
                  aria-current={day.today ? 'date' : undefined}
                  className={classes.cell}
                >
                  <span className="apui-sr-only">{day.label}</span>
                  {model.view === 'month' ? (
                    <span
                      data-scope="calendar"
                      data-part="date"
                      aria-hidden="true"
                      className={classes.date}
                    >
                      {day.day}
                    </span>
                  ) : null}
                  {day.events.map((item) =>
                    renderEvent(item, model.view === 'month' ? item.time : item.range),
                  )}
                  {day.more > 0 ? (
                    <button
                      type="button"
                      data-scope="calendar"
                      data-part="more"
                      aria-label={day.moreLabel}
                      className={classes.more}
                      onClick={() => {
                        changeDate(day.date);
                        changeView('day');
                      }}
                    >
                      {day.moreText}
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div
        {...rest}
        ref={ref}
        id={id}
        className={cx('apui-calendar', classes.root, className)}
        data-view={model.view}
      >
        <div data-scope="calendar" data-part="toolbar" className={classes.toolbar}>
          <Button
            variant="outline"
            color="neutral"
            size="sm"
            data-scope="calendar"
            data-part="today-trigger"
            className={classes.todayTrigger}
            onClick={() => changeDate(model.today)}
          >
            {text.today}
          </Button>
          <Button
            variant="ghost"
            color="neutral"
            size="sm"
            iconOnly
            leadingIcon="chevron-left"
            aria-label={text.previous}
            data-scope="calendar"
            data-part="previous-trigger"
            className={classes.previousTrigger}
            onClick={() => changeDate(model.previousDate)}
          />
          <Button
            variant="ghost"
            color="neutral"
            size="sm"
            iconOnly
            leadingIcon="chevron-right"
            aria-label={text.next}
            data-scope="calendar"
            data-part="next-trigger"
            className={classes.nextTrigger}
            onClick={() => changeDate(model.nextDate)}
          />
          <h2
            data-scope="calendar"
            data-part="title"
            id={titleId}
            aria-live="polite"
            className={classes.title}
          >
            {model.title}
          </h2>
          <div
            className={cx('apui-tabs', classes.viewTabs)}
            data-variant="segmented"
            data-size="sm"
            data-scope="calendar"
            data-part="view-tabs"
          >
            <div
              data-scope="tabs"
              data-part="list"
              role="tablist"
              aria-label={text.views}
              onKeyDown={onTabsKeyDown}
            >
              {VIEWS.map((option) => (
                <button
                  key={option}
                  type="button"
                  data-scope="tabs"
                  data-part="trigger"
                  role="tab"
                  id={tabId(option)}
                  aria-selected={option === model.view ? 'true' : 'false'}
                  aria-controls={bodyId}
                  tabIndex={option === model.view ? 0 : -1}
                  data-selected={flag(option === model.view)}
                  onClick={() => changeView(option)}
                >
                  {text[option]}
                </button>
              ))}
            </div>
          </div>
          {creatable ? (
            <Button
              size="sm"
              leadingIcon="plus"
              data-scope="calendar"
              data-part="create-trigger"
              className={classes.createTrigger}
              onClick={() => onCreate?.(model.date)}
            >
              {text.newEvent}
            </Button>
          ) : null}
        </div>
        <div
          data-scope="calendar"
          data-part="body"
          id={bodyId}
          role="tabpanel"
          aria-labelledby={tabId(model.view)}
          className={classes.body}
        >
          {body}
        </div>
        {model.legend.length > 0 ? (
          <ul
            data-scope="calendar"
            data-part="legend"
            aria-label={text.legend}
            className={classes.legend}
          >
            {model.legend.map((entry) => (
              <li
                key={entry.category}
                data-scope="calendar"
                data-part="legend-item"
                data-color={entry.color}
                className={classes.legendItem}
              >
                {entry.category}
              </li>
            ))}
          </ul>
        ) : null}
        {details ? (
          <Dialog
            open={selected !== null}
            onOpenChange={(open) => {
              if (!open) setSelected(null);
            }}
            title={selected?.title}
            description={selected?.when}
          >
            {selected !== null ? (
              renderEventDetails ? (
                renderEventDetails(selected.event)
              ) : (
                <Stack gap="3">
                  {selected.category ? (
                    <div>
                      <Badge variant="soft" color={selected.color}>
                        {selected.category}
                      </Badge>
                    </div>
                  ) : null}
                  {selected.description ? <Text>{selected.description}</Text> : null}
                </Stack>
              )
            ) : null}
          </Dialog>
        ) : null}
      </div>
    );
  },
);

Calendar.displayName = 'Calendar';
