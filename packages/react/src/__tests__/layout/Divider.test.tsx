import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Divider } from '../../components/layout/Divider/Divider';

describe('Divider', () => {
  it('renders a horizontal separator by default', () => {
    render(<Divider />);
    const el = screen.getByRole('separator');
    expect(el).toHaveAttribute('aria-orientation', 'horizontal');
    expect(el).toHaveClass('divider');
  });

  it('renders vertical orientation', () => {
    render(<Divider vertical />);
    const el = screen.getByRole('separator');
    expect(el).toHaveAttribute('aria-orientation', 'vertical');
    expect(el).toHaveClass('divider-vertical');
  });

  it('renders label text', () => {
    render(<Divider label="OR" />);
    expect(screen.getByText('OR')).toBeInTheDocument();
  });

  it('renders children as content', () => {
    render(<Divider>Section Break</Divider>);
    expect(screen.getByText('Section Break')).toBeInTheDocument();
  });

  it('applies color variant', () => {
    render(<Divider color="primary" />);
    expect(screen.getByRole('separator')).toHaveClass('divider-primary');
  });

  it('applies label position', () => {
    render(<Divider label="Start" labelPosition="start" />);
    expect(screen.getByRole('separator')).toHaveClass('divider-start');
  });

  it('applies custom className', () => {
    render(<Divider className="my-custom" />);
    expect(screen.getByRole('separator')).toHaveClass('my-custom');
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Divider ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});
