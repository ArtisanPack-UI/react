import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Password } from '../../components/form/Password/Password';

describe('Password', () => {
  it('renders with label', () => {
    render(<Password label="Password" />);
    expect(screen.getByText('Password')).toBeInTheDocument();
  });

  it('does not wrap a single input in a fieldset/legend', () => {
    const { container } = render(<Password label="Password" />);
    expect(container.querySelector('fieldset')).not.toBeInTheDocument();
    expect(container.querySelector('legend')).not.toBeInTheDocument();
  });

  it('associates the visible label with the input via htmlFor/id', () => {
    render(<Password id="user-pw" label="Password" />);
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('id', 'user-pw');
  });

  it('renders as password type by default', () => {
    const { container } = render(<Password label="Password" />);
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('toggles visibility', () => {
    const { container } = render(<Password label="Password" />);
    const input = container.querySelector('input')!;
    const toggleButton = screen.getByLabelText('Show password');

    expect(input).toHaveAttribute('type', 'password');
    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');

    const hideButton = screen.getByLabelText('Hide password');
    fireEvent.click(hideButton);
    expect(input).toHaveAttribute('type', 'password');
  });

  it('hides toggle when hideToggle is true', () => {
    render(<Password label="Password" hideToggle />);
    expect(screen.queryByLabelText('Show password')).not.toBeInTheDocument();
  });

  it('keeps the visibility toggle keyboard-focusable', () => {
    render(<Password label="Password" />);
    expect(screen.getByLabelText('Show password')).not.toHaveAttribute('tabindex', '-1');
  });

  it('keeps the clear button keyboard-focusable', () => {
    render(<Password label="Password" clearable onClear={() => {}} />);
    expect(screen.getByLabelText('Clear password')).not.toHaveAttribute('tabindex', '-1');
  });

  it('renders error', () => {
    render(<Password label="Password" error="Too short" />);
    expect(screen.getByText('Too short')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders hint', () => {
    render(<Password label="Password" hint="Min 8 characters" />);
    expect(screen.getByText('Min 8 characters')).toBeInTheDocument();
  });

  it('renders clearable button', () => {
    const onClear = vi.fn();
    render(<Password label="Password" clearable onClear={onClear} />);
    const clearButton = screen.getByLabelText('Clear password');
    fireEvent.click(clearButton);
    expect(onClear).toHaveBeenCalledOnce();
  });

  it('renders icon', () => {
    render(<Password label="Password" icon={<span data-testid="icon">🔒</span>} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('shows required indicator', () => {
    render(<Password label="Password" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Password ref={ref} label="Test" />);
    expect(ref).toHaveBeenCalled();
  });
});
