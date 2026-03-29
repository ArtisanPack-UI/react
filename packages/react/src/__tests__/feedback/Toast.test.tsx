import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ToastProvider, useToast } from '../../components/feedback/Toast/Toast';

function TestConsumer() {
  const toast = useToast();
  return (
    <div>
      <button onClick={() => toast.success('Saved!')}>Success</button>
      <button onClick={() => toast.error('Failed!')}>Error</button>
      <button onClick={() => toast.warning('Careful!')}>Warning</button>
      <button onClick={() => toast.info('FYI!')}>Info</button>
      <button onClick={() => toast.show({ message: 'Custom', duration: 0 })}>Persistent</button>
      <button onClick={() => toast.dismissAll()}>Dismiss All</button>
    </div>
  );
}

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('throws when useToast is used outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => {
      function Bad() {
        useToast();
        return null;
      }
      render(<Bad />);
    }).toThrow('useToast must be used within a ToastProvider');
    spy.mockRestore();
  });

  it('shows a success toast', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByText('Success'));
    expect(screen.getByText('Saved!')).toBeInTheDocument();
  });

  it('applies correct color class for each variant', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText('Success'));
    expect(screen.getByText('Saved!').closest('.alert')).toHaveClass('alert-success');

    fireEvent.click(screen.getByText('Error'));
    expect(screen.getByText('Failed!').closest('.alert')).toHaveClass('alert-error');

    fireEvent.click(screen.getByText('Warning'));
    expect(screen.getByText('Careful!').closest('.alert')).toHaveClass('alert-warning');

    fireEvent.click(screen.getByText('Info'));
    expect(screen.getByText('FYI!').closest('.alert')).toHaveClass('alert-info');
  });

  it('uses role="alert" for warning/error and role="status" for info/success', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText('Error'));
    expect(screen.getByText('Failed!').closest('.alert')).toHaveAttribute('role', 'alert');

    fireEvent.click(screen.getByText('Warning'));
    expect(screen.getByText('Careful!').closest('.alert')).toHaveAttribute('role', 'alert');

    fireEvent.click(screen.getByText('Success'));
    expect(screen.getByText('Saved!').closest('.alert')).toHaveAttribute('role', 'status');

    fireEvent.click(screen.getByText('Info'));
    expect(screen.getByText('FYI!').closest('.alert')).toHaveAttribute('role', 'status');
  });

  it('auto-dismisses after default duration', () => {
    render(
      <ToastProvider defaultDuration={1000}>
        <TestConsumer />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText('Success'));
    expect(screen.getByText('Saved!')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.queryByText('Saved!')).not.toBeInTheDocument();
  });

  it('uses 5000ms as default auto-dismiss duration', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText('Success'));
    expect(screen.getByText('Saved!')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(4999);
    });

    expect(screen.getByText('Saved!')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(screen.queryByText('Saved!')).not.toBeInTheDocument();
  });

  it('does not auto-dismiss when duration is 0', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText('Persistent'));
    expect(screen.getByText('Custom')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(screen.getByText('Custom')).toBeInTheDocument();
  });

  it('dismisses individual toast via close button', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText('Success'));
    expect(screen.getByText('Saved!')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Dismiss notification'));
    expect(screen.queryByText('Saved!')).not.toBeInTheDocument();
  });

  it('dismisses all toasts', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText('Success'));
    fireEvent.click(screen.getByText('Error'));
    expect(screen.getByText('Saved!')).toBeInTheDocument();
    expect(screen.getByText('Failed!')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Dismiss All'));
    expect(screen.queryByText('Saved!')).not.toBeInTheDocument();
    expect(screen.queryByText('Failed!')).not.toBeInTheDocument();
  });

  it('respects max toast limit', () => {
    render(
      <ToastProvider max={2} defaultDuration={0}>
        <TestConsumer />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText('Success'));
    fireEvent.click(screen.getByText('Error'));
    fireEvent.click(screen.getByText('Warning'));

    expect(screen.queryByText('Saved!')).not.toBeInTheDocument();
    expect(screen.getByText('Failed!')).toBeInTheDocument();
    expect(screen.getByText('Careful!')).toBeInTheDocument();
  });

  it('renders toast container with aria-live and accessible name', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText('Success'));
    const container = screen.getByRole('log');
    expect(container).toHaveAttribute('aria-live', 'polite');
    expect(container).toHaveAttribute('aria-label', 'Notifications');
  });

  it('does not render toast container when empty', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    );

    expect(screen.queryByRole('log')).not.toBeInTheDocument();
  });
});
