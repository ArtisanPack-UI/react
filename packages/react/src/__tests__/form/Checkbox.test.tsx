import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Checkbox } from '../../components/form/Checkbox/Checkbox';

describe('Checkbox', () => {
  it('renders with label', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
  });

  it('renders as checkbox input', () => {
    render(<Checkbox label="Check" />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('applies color class', () => {
    render(<Checkbox label="Check" color="primary" />);
    expect(screen.getByRole('checkbox')).toHaveClass('checkbox-primary');
  });

  it('handles change events', () => {
    const onChange = vi.fn();
    render(<Checkbox label="Check" onChange={onChange} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('renders hint', () => {
    render(<Checkbox label="Check" hint="Optional" />);
    expect(screen.getByText('Optional')).toBeInTheDocument();
  });

  it('renders error', () => {
    render(<Checkbox label="Check" error="Required" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders card variant', () => {
    render(<Checkbox label="Check" card />);
    const label = screen.getByText('Check').closest('label');
    expect(label).toHaveClass('border', 'rounded-lg');
  });

  it('renders required indicator', () => {
    render(<Checkbox label="Check" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Checkbox ref={ref} label="Test" />);
    expect(ref).toHaveBeenCalled();
  });
});
