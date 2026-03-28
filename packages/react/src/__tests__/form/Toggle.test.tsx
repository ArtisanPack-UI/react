import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Toggle } from '../../components/form/Toggle/Toggle';

describe('Toggle', () => {
  it('renders with label', () => {
    render(<Toggle label="Enable notifications" />);
    expect(screen.getByText('Enable notifications')).toBeInTheDocument();
  });

  it('renders as switch role', () => {
    render(<Toggle label="Toggle" />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('applies color class', () => {
    render(<Toggle label="Toggle" color="success" />);
    expect(screen.getByRole('switch')).toHaveClass('toggle-success');
  });

  it('handles change events', () => {
    const onChange = vi.fn();
    render(<Toggle label="Toggle" onChange={onChange} />);
    fireEvent.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('renders hint', () => {
    render(<Toggle label="Toggle" hint="Optional feature" />);
    expect(screen.getByText('Optional feature')).toBeInTheDocument();
  });

  it('renders error', () => {
    render(<Toggle label="Toggle" error="Required" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('shows required indicator', () => {
    render(<Toggle label="Toggle" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Toggle ref={ref} label="Test" />);
    expect(ref).toHaveBeenCalled();
  });
});
