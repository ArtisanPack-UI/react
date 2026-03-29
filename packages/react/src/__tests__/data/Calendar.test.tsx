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
    const dot = screen.getByLabelText('Meeting');
    expect(dot).toBeInTheDocument();
  });

  it('calls onEventClick when event dot is clicked', () => {
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
    fireEvent.click(screen.getByLabelText('Meeting'));
    expect(onEventClick).toHaveBeenCalledWith(events[0]);
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

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Calendar ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});
