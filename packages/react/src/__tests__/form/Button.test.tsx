import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../../components/form/Button/Button';

describe('Button', () => {
  it('renders with label', () => {
    render(<Button label="Click Me" />);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(<Button>Save</Button>);
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('applies color class', () => {
    render(<Button label="Primary" color="primary" />);
    expect(screen.getByRole('button')).toHaveClass('btn-primary');
  });

  it('applies size class', () => {
    render(<Button label="Small" size="sm" />);
    expect(screen.getByRole('button')).toHaveClass('btn-sm');
  });

  it('shows loading spinner', () => {
    render(<Button label="Submit" loading />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button.querySelector('.loading-spinner')).toBeInTheDocument();
  });

  it('renders as a link when link prop is provided', () => {
    render(<Button label="Go" link="https://example.com" />);
    const link = screen.getByRole('button');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('opens link in new tab when external', () => {
    render(<Button label="Go" link="https://example.com" external />);
    const link = screen.getByRole('button');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders badge', () => {
    render(<Button label="Notifications" badge="5" />);
    expect(screen.getByText('5')).toHaveClass('badge');
  });

  it('renders icon', () => {
    render(<Button label="Add" icon={<span data-testid="icon">+</span>} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders iconRight', () => {
    render(<Button label="Next" iconRight={<span data-testid="icon-right">→</span>} />);
    expect(screen.getByTestId('icon-right')).toBeInTheDocument();
  });

  it('hides label on small screens when responsive', () => {
    render(<Button label="Full Label" responsive />);
    const labelSpan = screen.getByText('Full Label');
    expect(labelSpan).toHaveClass('hidden', 'sm:inline');
  });

  it('renders tooltip wrapper', () => {
    render(<Button label="Hover me" tooltip="Tooltip text" />);
    const wrapper = screen.getByText('Hover me').closest('.tooltip');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveAttribute('data-tip', 'Tooltip text');
  });

  it('handles click events', () => {
    const onClick = vi.fn();
    render(<Button label="Click" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('defaults to type button', () => {
    render(<Button label="Test" />);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('does not fire click when disabled', () => {
    const onClick = vi.fn();
    render(<Button label="Disabled" disabled onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Button ref={ref} label="Ref" />);
    expect(ref).toHaveBeenCalled();
  });
});
