import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Diff } from '../../components/data/Diff/Diff';

describe('Diff', () => {
  const oldContent = 'line 1\nline 2\nline 3';
  const newContent = 'line 1\nline 2 modified\nline 3\nline 4';

  it('renders inline diff by default', () => {
    render(<Diff oldContent={oldContent} newContent={newContent} />);
    expect(screen.getByText('Original')).toBeInTheDocument();
    expect(screen.getByText('Modified')).toBeInTheDocument();
  });

  it('renders custom labels', () => {
    render(
      <Diff oldContent={oldContent} newContent={newContent} oldLabel="Before" newLabel="After" />,
    );
    expect(screen.getByText('Before')).toBeInTheDocument();
    expect(screen.getByText('After')).toBeInTheDocument();
  });

  it('renders side-by-side mode', () => {
    render(<Diff oldContent={oldContent} newContent={newContent} mode="side-by-side" />);
    expect(screen.getByText('Original')).toBeInTheDocument();
    expect(screen.getByText('Modified')).toBeInTheDocument();
  });

  it('shows unchanged lines', () => {
    render(<Diff oldContent={oldContent} newContent={newContent} />);
    expect(screen.getByText('line 1')).toBeInTheDocument();
  });

  it('shows added lines with + prefix', () => {
    render(<Diff oldContent="a" newContent="a\nb" />);
    const plusSigns = screen.getAllByText('+');
    expect(plusSigns.length).toBeGreaterThan(0);
  });

  it('shows removed lines with - prefix', () => {
    render(<Diff oldContent="a\nb" newContent="a" />);
    const minusSigns = screen.getAllByText('-');
    expect(minusSigns.length).toBeGreaterThan(0);
  });

  it('handles identical content', () => {
    render(<Diff oldContent="same" newContent="same" />);
    expect(screen.getByText('same')).toBeInTheDocument();
  });

  it('handles empty content', () => {
    const { container } = render(<Diff oldContent="" newContent="" />);
    expect(container).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Diff oldContent="a" newContent="b" className="custom-diff" />,
    );
    expect(container.firstChild).toHaveClass('custom-diff');
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Diff ref={ref} oldContent="a" newContent="b" />);
    expect(ref).toHaveBeenCalled();
  });
});
