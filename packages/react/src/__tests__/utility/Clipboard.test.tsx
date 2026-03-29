import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Clipboard } from '../../components/utility/Clipboard/Clipboard';

describe('Clipboard', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('renders a button with default label', () => {
    render(<Clipboard text="hello" />);
    expect(screen.getByText('Copy')).toBeInTheDocument();
  });

  it('renders custom label', () => {
    render(<Clipboard text="hello" label="Copy code" />);
    expect(screen.getByText('Copy code')).toBeInTheDocument();
  });

  it('has correct aria-label', () => {
    render(<Clipboard text="hello" />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Copy');
  });

  it('copies text to clipboard on click', async () => {
    render(<Clipboard text="some text" />);
    fireEvent.click(screen.getByRole('button'));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('some text');
  });

  it('shows success label after copying', async () => {
    render(<Clipboard text="hello" />);
    fireEvent.click(screen.getByRole('button'));

    // Wait for state update
    await screen.findByText('Copied!');
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Copied!');
  });

  it('shows custom success label', async () => {
    render(<Clipboard text="hello" successLabel="Done!" />);
    fireEvent.click(screen.getByRole('button'));
    await screen.findByText('Done!');
  });

  it('calls onCopy callback', async () => {
    const onCopy = vi.fn();
    render(<Clipboard text="hello" onCopy={onCopy} />);
    fireEvent.click(screen.getByRole('button'));
    await vi.waitFor(() => {
      expect(onCopy).toHaveBeenCalledOnce();
    });
  });

  it('applies color class', () => {
    render(<Clipboard text="hello" color="primary" />);
    expect(screen.getByRole('button')).toHaveClass('btn-primary');
  });

  it('applies size class', () => {
    render(<Clipboard text="hello" size="lg" />);
    expect(screen.getByRole('button')).toHaveClass('btn-lg');
  });

  it('applies custom className', () => {
    render(<Clipboard text="hello" className="custom" />);
    expect(screen.getByRole('button')).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Clipboard ref={ref} text="hello" />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('renders an svg icon', () => {
    render(<Clipboard text="hello" />);
    const button = screen.getByRole('button');
    expect(button.querySelector('svg')).toBeInTheDocument();
  });
});
