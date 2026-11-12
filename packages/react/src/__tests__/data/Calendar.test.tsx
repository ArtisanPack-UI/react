import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import {
  Calendar,
  type CalendarEvent,
  type CalendarProps,
} from '../../components/data/Calendar/Calendar';

const declaredProps: (keyof CalendarProps)[] = [
  'view',
  'date',
  'today',
  'events',
  'weekStartsOn',
  'locale',
  'timeZone',
  'maxEvents',
  'creatable',
  'details',
  'labels',
  'classes',
];

const events: CalendarEvent[] = [
  {
    id: 1,
    start: '2026-11-02T09:00',
    end: '2026-11-02T10:00',
    title: 'Team meeting',
    color: 'error',
    category: 'Marketing',
    description: 'Weekly sync.',
  },
  { id: 6, start: '2026-11-12T11:00', title: 'Viewing · Lakeview', color: 'primary' },
  { id: 7, start: '2026-11-12T16:00', title: 'Hubstaff broadcast', color: 'info' },
  {
    id: 8,
    start: '2026-11-12T18:00',
    title: 'Board dinner',
    color: 'success',
    href: 'https://example.com/dinner',
  },
];

const base = { id: 'cal', events, today: '2026-11-07', weekStartsOn: 1 };

const q = (container: HTMLElement, selector: string) =>
  container.querySelector<HTMLElement>(selector)!;

describe('Calendar', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Calendar, 'Calendar', {
      declared: {
        props: declaredProps,
        events: ['onViewChange', 'onDateChange', 'onEventClick', 'onCreate'],
      },
    });
  });

  it('renders the month grid with a tab stop, today and labeled days', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<Calendar ref={ref} {...base} />);
    const root = q(container, '.apui-calendar');
    expect(ref.current).toBe(root);
    expect(root.getAttribute('data-view')).toBe('month');
    expect(q(container, '#cal-title').textContent).toBe('November 2026');
    expect(q(container, '[role="grid"]').getAttribute('aria-labelledby')).toBe('cal-title');
    expect(container.querySelectorAll('[role="columnheader"]')).toHaveLength(7);
    expect(container.querySelectorAll('[role="gridcell"]')).toHaveLength(42);
    expect(q(container, '[role="gridcell"][tabindex="0"]').getAttribute('data-date')).toBe(
      '2026-11-07',
    );
    const today = q(container, '[aria-current="date"]');
    expect(today.querySelector('.apui-sr-only')!.textContent).toBe('Saturday, November 7, 2026');
    expect(today.hasAttribute('data-today')).toBe(true);
  });

  it('names events by title, category and time, and folds the rest into +N more', () => {
    const { container } = render(<Calendar {...base} />);
    const event = q(container, '[data-date="2026-11-02"] [data-part="event"]');
    expect(event.tagName).toBe('BUTTON');
    expect(event.getAttribute('data-color')).toBe('error');
    expect(event.getAttribute('aria-haspopup')).toBe('dialog');
    expect(event.hasAttribute('aria-label')).toBe(false);
    expect(event.textContent).toBe(
      '09:00Team meeting, Marketing, Monday, November 2, 2026, 09:00 – 10:00',
    );
    expect(container.querySelectorAll('[data-date="2026-11-12"] [data-part="event"]')).toHaveLength(
      2,
    );
    const more = q(container, '[data-date="2026-11-12"] [data-part="more"]');
    expect(more.textContent).toBe('+1 more');
    expect(more.getAttribute('aria-label')).toBe(
      'Show 1 more events on Thursday, November 12, 2026',
    );
  });

  it('moves between dates and views, controlled or not', () => {
    const onDateChange = vi.fn();
    const onViewChange = vi.fn();
    const { container } = render(
      <Calendar {...base} onDateChange={onDateChange} onViewChange={onViewChange} />,
    );
    fireEvent.click(q(container, '[data-part="next-trigger"]'));
    expect(onDateChange).toHaveBeenLastCalledWith('2026-12-07');
    expect(q(container, '#cal-title').textContent).toBe('December 2026');
    fireEvent.click(q(container, '[data-part="today-trigger"]'));
    expect(q(container, '#cal-title').textContent).toBe('November 2026');
    fireEvent.click(screen.getByRole('tab', { name: 'Week' }));
    expect(onViewChange).toHaveBeenLastCalledWith('week');
    expect(q(container, '#cal-title').textContent).toBe('Nov 2 – Nov 8, 2026');
    expect(q(container, '#cal-body').getAttribute('aria-labelledby')).toBe('cal-tab-week');

    const controlled = render(
      <Calendar {...base} id="c2" view="month" onViewChange={onViewChange} />,
    );
    fireEvent.click(controlled.getAllByRole('tab', { name: 'Day' })[0]!);
    expect(q(controlled.container, '#c2').getAttribute('data-view')).toBe('month');
  });

  it('opens the day from +N more', () => {
    const { container } = render(<Calendar {...base} />);
    fireEvent.click(q(container, '[data-date="2026-11-12"] [data-part="more"]'));
    expect(q(container, '.apui-calendar').getAttribute('data-view')).toBe('day');
    expect(container.querySelectorAll('[data-part="event"]')).toHaveLength(3);
  });

  it('reports event clicks and opens the details Dialog', async () => {
    const onEventClick = vi.fn();
    const { container } = render(<Calendar {...base} onEventClick={onEventClick} />);
    fireEvent.click(q(container, '[data-date="2026-11-02"] [data-part="event"]'));
    expect(onEventClick).toHaveBeenCalledWith(events[0]);
    const dialog = await screen.findByRole('dialog');
    expect(dialog.textContent).toContain('Team meeting');
    expect(dialog.textContent).toContain('Monday, November 2, 2026, 09:00 – 10:00');
    expect(dialog.textContent).toContain('Weekly sync.');
  });

  it('renders links for events with href and the New event button', () => {
    const onCreate = vi.fn();
    const { container } = render(
      <Calendar {...base} maxEvents={3} creatable onCreate={onCreate} />,
    );
    const link = q(container, 'a[data-part="event"]');
    expect(link.getAttribute('href')).toBe('https://example.com/dinner');
    expect(link.hasAttribute('aria-haspopup')).toBe(false);
    fireEvent.click(q(container, '[data-part="create-trigger"]'));
    expect(onCreate).toHaveBeenCalledWith('2026-11-07');
  });

  it('moves focus with the arrow keys, following the text direction', () => {
    const { container } = render(
      <div dir="rtl">
        <Calendar {...base} />
      </div>,
    );
    const start = q(container, '[data-date="2026-11-07"]');
    start.focus();
    fireEvent.keyDown(start, { key: 'ArrowLeft' });
    expect(document.activeElement?.getAttribute('data-date')).toBe('2026-11-08');
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
    expect(document.activeElement?.getAttribute('data-date')).toBe('2026-11-15');
    fireEvent.keyDown(document.activeElement!, { key: 'Home' });
    expect(document.activeElement?.getAttribute('data-date')).toBe('2026-11-09');
    expect(q(container, '[data-date="2026-11-09"]').tabIndex).toBe(0);
    expect(start.tabIndex).toBe(-1);
  });

  it('keeps one tab stop after arrow keys and a period change', () => {
    const { container } = render(<Calendar {...base} />);
    const start = q(container, '[data-date="2026-11-07"]');
    start.focus();
    fireEvent.keyDown(start, { key: 'ArrowUp' });
    expect(document.activeElement?.getAttribute('data-date')).toBe('2026-10-31');
    fireEvent.click(q(container, '[data-part="previous-trigger"]'));
    const stops = container.querySelectorAll('[role="gridcell"][tabindex="0"]');
    expect(stops).toHaveLength(1);
    fireEvent.click(q(container, '[data-part="next-trigger"]'));
    expect(container.querySelectorAll('[role="gridcell"][tabindex="0"]')).toHaveLength(1);
  });

  it('seeds the date from the 2.x value without locking it', () => {
    const onChange = vi.fn();
    const { container, rerender } = render(
      <Calendar {...base} value={new Date(2026, 2, 10)} onChange={onChange} />,
    );
    const title = () => q(container, '[data-part="title"]').textContent;
    expect(title()).toBe('March 2026');
    fireEvent.click(q(container, '[data-part="next-trigger"]'));
    expect(title()).toBe('April 2026');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0]![0]).toBeInstanceOf(Date);
    expect((onChange.mock.calls[0]![0] as Date).getMonth()).toBe(3);
    rerender(<Calendar {...base} value={new Date(2026, 2, 10)} onChange={onChange} />);
    expect(title()).toBe('April 2026');
    rerender(<Calendar {...base} value={new Date(2026, 7, 1)} onChange={onChange} />);
    expect(title()).toBe('August 2026');
  });

  it('renders the agenda as a list, with an empty state', () => {
    const { container } = render(<Calendar {...base} view="agenda" />);
    expect(container.querySelectorAll('ul[data-part="grid"] > li[data-part="row"]')).toHaveLength(
      2,
    );
    expect(q(container, 'h3[data-part="weekday"]').textContent).toBe('Monday, November 2, 2026');
    const empty = render(<Calendar {...base} id="e" events={[]} view="agenda" />);
    expect(q(empty.container, '.apui-empty-state').textContent).toContain('No events');
  });

  it('takes labels, classes and the 2.x props', () => {
    const { container } = render(
      <Calendar
        {...base}
        weekStartsOn={undefined}
        weekStartsOnSunday
        labels={{ today: 'Hoy' }}
        classes={{ cell: 'my-cell' }}
        events={[{ id: 'x', date: '2026-11-03', title: '2.x event' }]}
      />,
    );
    expect(q(container, '[data-part="today-trigger"]').textContent).toBe('Hoy');
    expect(q(container, '[role="columnheader"]').textContent).toBe('Sun');
    expect(container.querySelectorAll('.my-cell')).toHaveLength(35);
    expect(q(container, '[data-date="2026-11-03"] [data-part="event-title"]').textContent).toBe(
      '2.x event',
    );
  });
});
