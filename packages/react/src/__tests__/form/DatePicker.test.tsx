import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DatePicker } from '../../components/form/DatePicker/DatePicker';

describe('DatePicker', () => {
  it('renders with label', () => {
    render(<DatePicker label="Start Date" />);
    expect(screen.getByText('Start Date')).toBeInTheDocument();
  });

  it('renders date input by default', () => {
    const { container } = render(<DatePicker label="Date" />);
    const input = container.querySelector('input[type="date"]');
    expect(input).toBeInTheDocument();
  });

  it('supports datetime-local type', () => {
    const { container } = render(<DatePicker label="DateTime" dateType="datetime-local" />);
    const input = container.querySelector('input[type="datetime-local"]');
    expect(input).toBeInTheDocument();
  });

  it('supports time type', () => {
    const { container } = render(<DatePicker label="Time" dateType="time" />);
    const input = container.querySelector('input[type="time"]');
    expect(input).toBeInTheDocument();
  });

  it('renders error', () => {
    render(<DatePicker label="Date" error="Required" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders hint', () => {
    render(<DatePicker label="Date" hint="Select a date" />);
    expect(screen.getByText('Select a date')).toBeInTheDocument();
  });

  it('renders icon', () => {
    render(<DatePicker label="Date" icon={<span data-testid="icon">📅</span>} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('shows required indicator', () => {
    render(<DatePicker label="Date" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<DatePicker ref={ref} label="Test" />);
    expect(ref).toHaveBeenCalled();
  });
});
