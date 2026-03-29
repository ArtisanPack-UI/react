import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Badge } from '../../components/data/Badge/Badge';

describe('Badge', () => {
  it('renders with value prop', () => {
    render(<Badge value="New" />);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('renders with children', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('prefers value over children', () => {
    render(<Badge value="Value">Children</Badge>);
    expect(screen.getByText('Value')).toBeInTheDocument();
  });

  it('applies color class', () => {
    render(<Badge value="Test" color="primary" />);
    expect(screen.getByText('Test')).toHaveClass('badge-primary');
  });

  it('applies size class', () => {
    render(<Badge value="Test" size="lg" />);
    expect(screen.getByText('Test')).toHaveClass('badge-lg');
  });

  it('applies outline variant', () => {
    render(<Badge value="Test" outline />);
    expect(screen.getByText('Test')).toHaveClass('badge-outline');
  });

  it('applies ghost color', () => {
    render(<Badge value="Test" color="ghost" />);
    expect(screen.getByText('Test')).toHaveClass('badge-ghost');
  });

  it('applies custom className', () => {
    render(<Badge value="Test" className="custom-class" />);
    expect(screen.getByText('Test')).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Badge ref={ref} value="Test" />);
    expect(ref).toHaveBeenCalled();
  });
});
