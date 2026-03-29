import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Skeleton } from '../../components/feedback/Skeleton/Skeleton';

describe('Skeleton', () => {
  it('renders with skeleton class', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass('skeleton');
  });

  it('is hidden from assistive technology', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies width and height styles', () => {
    const { container } = render(<Skeleton width="200px" height="20px" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe('200px');
    expect(el.style.height).toBe('20px');
  });

  it('applies circle variant', () => {
    const { container } = render(<Skeleton circle height="48px" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass('rounded-full');
    expect(el.style.width).toBe('48px');
    expect(el.style.height).toBe('48px');
  });

  it('applies custom className', () => {
    const { container } = render(<Skeleton className="custom" />);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('merges custom styles', () => {
    const { container } = render(<Skeleton height="10px" style={{ margin: '8px' }} />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.height).toBe('10px');
    expect(el.style.margin).toBe('8px');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Skeleton ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
