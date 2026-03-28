import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Textarea } from '../../components/form/Textarea/Textarea';

describe('Textarea', () => {
  it('renders with label', () => {
    render(<Textarea label="Description" />);
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('renders hint', () => {
    render(<Textarea label="Bio" hint="Max 500 characters" />);
    expect(screen.getByText('Max 500 characters')).toBeInTheDocument();
  });

  it('renders error and hides hint', () => {
    render(<Textarea label="Bio" hint="Max 500" error="Too long" />);
    expect(screen.queryByText('Max 500')).not.toBeInTheDocument();
    expect(screen.getByText('Too long')).toBeInTheDocument();
  });

  it('sets aria-invalid on error', () => {
    render(<Textarea label="Bio" error="Required" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('applies border-dashed when readOnly', () => {
    render(<Textarea label="Bio" readOnly />);
    expect(screen.getByRole('textbox')).toHaveClass('border-dashed');
  });

  it('shows required indicator', () => {
    render(<Textarea label="Bio" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Textarea ref={ref} label="Test" />);
    expect(ref).toHaveBeenCalled();
  });
});
