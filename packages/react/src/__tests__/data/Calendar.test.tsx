import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Calendar } from '../../components/data/Calendar/Calendar';
import type { CalendarEvent } from '../../components/data/Calendar/Calendar';

describe('Calendar', () => {
  it('renders month and year header', () => {
    render(<Calendar value={new Date(2025, 0, 15)} />);
    expect(screen.getByText('January 2025')).toBeInTheDocument();
  });

  it('renders weekday headers starting Monday by default', () => {
    render(<Calendar />);
    const headers = screen.getAllByRole('columnheader');
    expect(headers[0]).toHaveTextContent('Mon');
  });

  it('renders weekday headers starting Sunday', () => {
    render(<Calendar weekStartsOnSunday />);
    const headers = screen.getAllByRole('columnheader');
    expect(headers[0]).toHaveTextContent('Sun');
  });

  it('renders day numbers', () => {
    render(<Calendar value={new Date(2025, 0, 15)} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('31')).toBeInTheDocument();
  });

  it('calls onChange when day is clicked', () => {
    const onChange = vi.fn();
    render(<Calendar value={new Date(2025, 0, 15)} onChange={onChange} />);
    fireEvent.click(screen.getByText('20'));
    expect(onChange).toHaveBeenCalled();
    const calledDate = onChange.mock.calls[0][0] as Date;
    expect(calledDate.getFullYear()).toBe(2025);
    expect(calledDate.getMonth()).toBe(0);
    expect(calledDate.getDate()).toBe(20);
  });

  it('navigates to previous month', () => {
    render(<Calendar value={new Date(2025, 1, 15)} />);
    expect(screen.getByText('February 2025')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Previous month'));
    expect(screen.getByText('January 2025')).toBeInTheDocument();
  });

  it('navigates to next month', () => {
    render(<Calendar value={new Date(2025, 0, 15)} />);
    fireEvent.click(screen.getByLabelText('Next month'));
    expect(screen.getByText('February 2025')).toBeInTheDocument();
  });

  it('renders Today button', () => {
    render(<Calendar />);
    expect(screen.getByText('Today')).toBeInTheDocument();
  });

  it('renders event dots', () => {
    const events: CalendarEvent[] = [
      { id: 1, title: 'Meeting', date: '2025-01-15', color: 'primary' },
    ];
    render(<Calendar value={new Date(2025, 0, 15)} events={events} />);
    const dot = screen.getByTitle('Meeting');
    expect(dot).toBeInTheDocument();
  });

  it('expands multi-day events across date range', () => {
    const events: CalendarEvent[] = [
      { id: 1, title: 'Conference', date: '2025-01-13', endDate: '2025-01-15' },
    ];
    render(<Calendar value={new Date(2025, 0, 13)} events={events} />);
    const dots = screen.getAllByTitle('Conference');
    expect(dots).toHaveLength(3);
  });

  it('renders non-interactive dots when onEventClick is absent', () => {
    const events: CalendarEvent[] = [
      { id: 1, title: 'Meeting', date: '2025-01-15' },
    ];
    render(<Calendar value={new Date(2025, 0, 15)} events={events} />);
    const dot = screen.getByTitle('Meeting');
    expect(dot.tagName).toBe('SPAN');
    expect(screen.queryByRole('button', { name: 'Meeting' })).not.toBeInTheDocument();
  });

  it('syncs visible month when controlled value changes', () => {
    const { rerender } = render(<Calendar value={new Date(2025, 0, 15)} />);
    expect(screen.getByText('January 2025')).toBeInTheDocument();

    rerender(<Calendar value={new Date(2025, 4, 1)} />);
    expect(screen.getByText('May 2025')).toBeInTheDocument();
  });

  it('renders custom day via renderDay', () => {
    render(
      <Calendar
        value={new Date(2025, 0, 15)}
        renderDay={(date) => <div data-testid={`day-${date.getDate()}`}>{date.getDate()}</div>}
      />,
    );
    expect(screen.getByTestId('day-15')).toBeInTheDocument();
  });

  it('applies selected styling to value date', () => {
    const { container } = render(<Calendar value={new Date(2025, 0, 15)} color="primary" />);
    expect(container.querySelector('.bg-primary')).toBeInTheDocument();
  });

  it('disables days outside minDate/maxDate range', () => {
    const onChange = vi.fn();
    render(
      <Calendar
        value={new Date(2025, 0, 15)}
        onChange={onChange}
        minDate={new Date(2025, 0, 10)}
        maxDate={new Date(2025, 0, 20)}
      />,
    );
    // Day 5 should be disabled
    const day5 = screen.getByText('5').closest('button');
    expect(day5).toBeDisabled();
    fireEvent.click(day5!);
    expect(onChange).not.toHaveBeenCalled();

    // Day 25 should be disabled
    const day25 = screen.getByText('25').closest('button');
    expect(day25).toBeDisabled();
  });

  it('renders overflow indicator for more than 3 events', () => {
    const events: CalendarEvent[] = [
      { id: 1, title: 'E1', date: '2025-01-15' },
      { id: 2, title: 'E2', date: '2025-01-15' },
      { id: 3, title: 'E3', date: '2025-01-15' },
      { id: 4, title: 'E4', date: '2025-01-15' },
    ];
    render(<Calendar value={new Date(2025, 0, 15)} events={events} />);
    expect(screen.getByText('+1')).toBeInTheDocument();
  });

  it('fires onEventClick via click on event dot button', () => {
    const onEventClick = vi.fn();
    const events: CalendarEvent[] = [
      { id: 1, title: 'Meeting', date: '2025-01-15' },
    ];
    render(
      <Calendar
        value={new Date(2025, 0, 15)}
        events={events}
        onEventClick={onEventClick}
      />,
    );
    const dot = screen.getByLabelText('Meeting');
    expect(dot.tagName).toBe('BUTTON');
    fireEvent.click(dot);
    expect(onEventClick).toHaveBeenCalledWith(events[0]);
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Calendar ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});
