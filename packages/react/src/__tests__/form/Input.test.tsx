import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Input } from '../../components/form/Input/Input';

describe('Input', () => {
  it('renders with label', () => {
    render(<Input label="Name" />);
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('renders hint text', () => {
    render(<Input label="Email" hint="We will never share your email" />);
    expect(screen.getByText('We will never share your email')).toBeInTheDocument();
  });

  it('renders error message', () => {
    render(<Input label="Email" error="Email is required" />);
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('hides hint when error is shown', () => {
    render(<Input label="Email" hint="Enter email" error="Required" />);
    expect(screen.queryByText('Enter email')).not.toBeInTheDocument();
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('sets aria-invalid when error is present', () => {
    render(<Input label="Email" error="Required" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows required indicator', () => {
    render(<Input label="Name" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders icon', () => {
    render(<Input label="Search" icon={<span data-testid="icon">🔍</span>} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders prefix and suffix', () => {
    render(<Input label="Price" prefix="$" suffix=".00" />);
    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByText('.00')).toBeInTheDocument();
  });

  it('renders clearable button', () => {
    const onClear = vi.fn();
    render(<Input label="Search" clearable onClear={onClear} />);
    const clearButton = screen.getByLabelText('Clear input');
    fireEvent.click(clearButton);
    expect(onClear).toHaveBeenCalledOnce();
  });

  it('renders inline label', () => {
    render(<Input label="Floating" inline />);
    expect(screen.getByText('Floating')).toHaveClass('label');
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Input ref={ref} label="Test" />);
    expect(ref).toHaveBeenCalled();
  });
});
