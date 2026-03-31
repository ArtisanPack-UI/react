import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Loading } from '../../components/feedback/Loading/Loading';

describe('Loading', () => {
  it('renders with role="status"', () => {
    render(<Loading />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has aria-label', () => {
    render(<Loading />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading');
  });

  it('applies default spinner variant', () => {
    render(<Loading />);
    expect(screen.getByRole('status')).toHaveClass('loading-spinner');
  });

  it('applies variant class', () => {
    const variants = ['spinner', 'dots', 'ring', 'ball', 'bars', 'infinity'] as const;
    variants.forEach((variant) => {
      const { unmount } = render(<Loading variant={variant} />);
      expect(screen.getByRole('status')).toHaveClass(`loading-${variant}`);
      unmount();
    });
  });

  it('applies color class', () => {
    render(<Loading color="primary" />);
    expect(screen.getByRole('status')).toHaveClass('text-primary');
  });

  it('applies size class', () => {
    render(<Loading size="lg" />);
    expect(screen.getByRole('status')).toHaveClass('loading-lg');
  });

  it('applies custom className', () => {
    render(<Loading className="custom" />);
    expect(screen.getByRole('status')).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<Loading ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});
