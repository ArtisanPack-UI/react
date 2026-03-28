import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Pin } from '../../components/form/Pin/Pin';

describe('Pin', () => {
  it('renders correct number of inputs', () => {
    render(<Pin length={4} />);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(4);
  });

  it('renders 6 inputs', () => {
    render(<Pin length={6} />);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(6);
  });

  it('uses password type when hide is true', () => {
    const { container } = render(<Pin length={4} hide />);
    const inputs = container.querySelectorAll('input[type="password"]');
    expect(inputs).toHaveLength(4);
  });

  it('sets numeric inputMode when numeric is true', () => {
    render(<Pin length={4} numeric />);
    const inputs = screen.getAllByRole('textbox');
    inputs.forEach((input) => {
      expect(input).toHaveAttribute('inputmode', 'numeric');
    });
  });

  it('renders error', () => {
    render(<Pin length={4} error="Invalid code" />);
    expect(screen.getByText('Invalid code')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('applies color class', () => {
    render(<Pin length={4} color="primary" />);
    const inputs = screen.getAllByRole('textbox');
    inputs.forEach((input) => {
      expect(input).toHaveClass('input-primary');
    });
  });

  it('has aria-label on each input', () => {
    render(<Pin length={4} />);
    expect(screen.getByLabelText('PIN digit 1 of 4')).toBeInTheDocument();
    expect(screen.getByLabelText('PIN digit 4 of 4')).toBeInTheDocument();
  });

  it('has group role with PIN input label', () => {
    render(<Pin length={4} />);
    expect(screen.getByRole('group', { name: 'PIN input' })).toBeInTheDocument();
  });

  it('calls onComplete when all digits filled', () => {
    const onComplete = vi.fn();
    render(<Pin length={4} onComplete={onComplete} />);
    const inputs = screen.getAllByRole('textbox');

    fireEvent.input(inputs[0], { target: { value: '1' } });
    fireEvent.input(inputs[1], { target: { value: '2' } });
    fireEvent.input(inputs[2], { target: { value: '3' } });
    fireEvent.input(inputs[3], { target: { value: '4' } });

    expect(onComplete).toHaveBeenCalledWith('1234');
  });

  it('forwards ref to first input', () => {
    const ref = vi.fn();
    render(<Pin ref={ref} length={4} />);
    expect(ref).toHaveBeenCalled();
  });
});
