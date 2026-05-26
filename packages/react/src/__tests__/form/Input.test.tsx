import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Input } from '../../components/form/Input/Input';

describe('Input', () => {
  it('renders with label', () => {
    render(<Input label="Name" />);
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('does not wrap a single input in a fieldset/legend', () => {
    const { container } = render(<Input label="Email" type="email" />);
    expect(container.querySelector('fieldset')).not.toBeInTheDocument();
    expect(container.querySelector('legend')).not.toBeInTheDocument();
  });

  it('associates the visible label with the input via htmlFor/id', () => {
    render(<Input label="Email" type="email" />);
    const input = screen.getByLabelText('Email');
    expect(input).toBeInstanceOf(HTMLInputElement);
    expect(input).toHaveAttribute('id');
    expect(input.id).toBeTruthy();
  });

  it('renders the visible label with the daisyUI v5 fieldset-legend class', () => {
    render(<Input id="email" label="Email" type="email" />);
    const labelEl = screen.getByText('Email').closest('label');
    expect(labelEl).toBeInTheDocument();
    expect(labelEl).toHaveClass('fieldset-legend');
    expect(labelEl).toHaveAttribute('for', 'email');
  });

  it('uses an explicit caller-provided id', () => {
    render(<Input id="user-email" label="Email" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('id', 'user-email');
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

  it('wires aria-describedby to the hint when present', () => {
    render(<Input id="phone" label="Phone" hint="Numbers only" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-describedby', 'phone-hint');
  });

  it('wires aria-describedby to the error when present', () => {
    render(<Input id="phone" label="Phone" error="Required" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-describedby', 'phone-error');
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

  it('keeps the clear button keyboard-focusable', () => {
    render(<Input label="Search" clearable onClear={() => {}} />);
    expect(screen.getByLabelText('Clear input')).not.toHaveAttribute('tabindex', '-1');
  });

  it('renders inline label as a floating label associated with the input', () => {
    const { container } = render(<Input id="city" label="City" inline />);
    expect(container.querySelector('fieldset')).not.toBeInTheDocument();
    expect(container.querySelector('legend')).not.toBeInTheDocument();
    const wrapper = container.querySelector('label.floating-label');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveAttribute('for', 'city');
    const input = screen.getByLabelText('City');
    expect(input).toHaveAttribute('id', 'city');
    expect(wrapper?.contains(input)).toBe(true);
    expect(input).toHaveAttribute('placeholder', ' ');
  });

  it('does not inject a single-space placeholder in non-inline mode', () => {
    render(<Input id="city" label="City" />);
    const input = screen.getByLabelText('City');
    expect(input).not.toHaveAttribute('placeholder');
  });

  it('preserves a caller-provided placeholder in inline mode', () => {
    render(<Input id="city" label="City" inline placeholder="Type a city" />);
    const input = screen.getByLabelText('City');
    expect(input).toHaveAttribute('placeholder', 'Type a city');
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Input ref={ref} label="Test" />);
    expect(ref).toHaveBeenCalled();
  });
});
