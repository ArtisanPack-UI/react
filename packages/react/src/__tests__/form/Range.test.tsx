import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Range } from '../../components/form/Range/Range';

describe('Range', () => {
  it('renders with label', () => {
    render(<Range label="Volume" />);
    expect(screen.getByText('Volume')).toBeInTheDocument();
  });

  it('renders as range input', () => {
    render(<Range label="Volume" />);
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('applies color class', () => {
    render(<Range label="Volume" color="primary" />);
    expect(screen.getByRole('slider')).toHaveClass('range-primary');
  });

  it('sets min and max attributes', () => {
    render(<Range label="Volume" min={10} max={50} />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('min', '10');
    expect(slider).toHaveAttribute('max', '50');
  });

  it('defaults to min 0 and max 100', () => {
    render(<Range label="Volume" />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('min', '0');
    expect(slider).toHaveAttribute('max', '100');
  });

  it('renders hint', () => {
    render(<Range label="Volume" hint="Adjust volume" />);
    expect(screen.getByText('Adjust volume')).toBeInTheDocument();
  });

  it('renders error', () => {
    render(<Range label="Volume" error="Invalid" />);
    expect(screen.getByText('Invalid')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Range ref={ref} label="Test" />);
    expect(ref).toHaveBeenCalled();
  });
});
