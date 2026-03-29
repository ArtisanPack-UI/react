import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Progress } from '../../components/data/Progress/Progress';

describe('Progress', () => {
  it('renders a progress element', () => {
    render(<Progress value={50} />);
    const progress = screen.getByRole('progressbar');
    expect(progress).toBeInTheDocument();
  });

  it('sets value and max attributes', () => {
    render(<Progress value={30} max={100} />);
    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('value', '30');
    expect(progress).toHaveAttribute('max', '100');
  });

  it('renders indeterminate without value/max', () => {
    render(<Progress indeterminate />);
    const progress = screen.getByRole('progressbar');
    expect(progress).not.toHaveAttribute('value');
    expect(progress).not.toHaveAttribute('max');
  });

  it('applies color class', () => {
    render(<Progress value={50} color="primary" />);
    expect(screen.getByRole('progressbar')).toHaveClass('progress-primary');
  });

  it('renders label', () => {
    render(<Progress value={50} label="Loading..." />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows percentage when showValue is true', () => {
    render(<Progress value={75} max={100} showValue />);
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('does not show percentage for indeterminate', () => {
    render(<Progress indeterminate showValue />);
    expect(screen.queryByText(/\d+%/)).not.toBeInTheDocument();
  });

  it('sets aria attributes', () => {
    render(<Progress value={50} max={100} label="Upload" />);
    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-valuenow', '50');
    expect(progress).toHaveAttribute('aria-valuemin', '0');
    expect(progress).toHaveAttribute('aria-valuemax', '100');
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Progress ref={ref} value={50} />);
    expect(ref).toHaveBeenCalled();
  });
});
