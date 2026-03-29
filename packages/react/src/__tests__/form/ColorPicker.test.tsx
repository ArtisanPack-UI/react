import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ColorPicker } from '../../components/form/ColorPicker/ColorPicker';

describe('ColorPicker', () => {
  it('renders with label', () => {
    render(<ColorPicker label="Brand Color" />);
    expect(screen.getByText('Brand Color')).toBeInTheDocument();
  });

  it('renders color input', () => {
    render(<ColorPicker label="Color" />);
    const input = screen.getByLabelText('Color');
    expect(input).toHaveAttribute('type', 'color');
  });

  it('displays current hex value', () => {
    render(<ColorPicker label="Color" value="#ff0000" />);
    expect(screen.getByText('#ff0000')).toBeInTheDocument();
  });

  it('renders clearable button', () => {
    const onClear = vi.fn();
    render(<ColorPicker label="Color" clearable onClear={onClear} />);
    const clearButton = screen.getByLabelText('Clear color');
    fireEvent.click(clearButton);
    expect(onClear).toHaveBeenCalledOnce();
  });

  it('renders random button', () => {
    const onRandom = vi.fn();
    render(<ColorPicker label="Color" random onRandomColor={onRandom} />);
    const randomButton = screen.getByLabelText('Generate random color');
    fireEvent.click(randomButton);
    expect(onRandom).toHaveBeenCalledOnce();
  });

  it('renders error', () => {
    render(<ColorPicker label="Color" error="Required" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders hint', () => {
    render(<ColorPicker label="Color" hint="Choose a color" />);
    expect(screen.getByText('Choose a color')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<ColorPicker ref={ref} label="Test" />);
    expect(ref).toHaveBeenCalled();
  });
});
