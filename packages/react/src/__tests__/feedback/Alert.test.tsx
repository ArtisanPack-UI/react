import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Alert } from '../../components/feedback/Alert/Alert';

describe('Alert', () => {
  it('renders children', () => {
    render(<Alert>Something happened</Alert>);
    expect(screen.getByText('Something happened')).toBeInTheDocument();
  });

  it('has role="alert"', () => {
    render(<Alert>Message</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('applies color class', () => {
    render(<Alert color="success">Done</Alert>);
    expect(screen.getByRole('alert')).toHaveClass('alert-success');
  });

  it('applies all color variants', () => {
    const colors = ['info', 'success', 'warning', 'error'] as const;
    colors.forEach((color) => {
      const { unmount } = render(<Alert color={color}>Test</Alert>);
      expect(screen.getByRole('alert')).toHaveClass(`alert-${color}`);
      unmount();
    });
  });

  it('renders icon when provided', () => {
    render(<Alert icon={<span data-testid="icon">!</span>}>Message</Alert>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('does not show dismiss button by default', () => {
    render(<Alert>Message</Alert>);
    expect(screen.queryByLabelText('Dismiss alert')).not.toBeInTheDocument();
  });

  it('shows dismiss button when dismissible', () => {
    render(<Alert dismissible>Message</Alert>);
    expect(screen.getByLabelText('Dismiss alert')).toBeInTheDocument();
  });

  it('hides alert when dismissed', () => {
    render(<Alert dismissible>Message</Alert>);
    fireEvent.click(screen.getByLabelText('Dismiss alert'));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('calls onDismiss callback when dismissed', () => {
    const onDismiss = vi.fn();
    render(
      <Alert dismissible onDismiss={onDismiss}>
        Message
      </Alert>,
    );
    fireEvent.click(screen.getByLabelText('Dismiss alert'));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('applies custom className', () => {
    render(<Alert className="custom-class">Message</Alert>);
    expect(screen.getByRole('alert')).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Alert ref={ref}>Message</Alert>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('uses polite aria-live for info and success', () => {
    const { unmount } = render(<Alert color="info">Message</Alert>);
    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'polite');
    unmount();

    render(<Alert color="success">Message</Alert>);
    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'polite');
  });

  it('uses assertive aria-live for warning and error', () => {
    const { unmount } = render(<Alert color="warning">Message</Alert>);
    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive');
    unmount();

    render(<Alert color="error">Message</Alert>);
    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive');
  });

  it('defaults to polite aria-live without color', () => {
    render(<Alert>Message</Alert>);
    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'polite');
  });

  it('supports controlled visible prop', () => {
    const { rerender } = render(
      <Alert visible={true}>Controlled</Alert>,
    );
    expect(screen.getByText('Controlled')).toBeInTheDocument();

    rerender(<Alert visible={false}>Controlled</Alert>);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('does not hide internally when controlled and dismissed', () => {
    const onDismiss = vi.fn();
    render(
      <Alert visible={true} dismissible onDismiss={onDismiss}>
        Controlled
      </Alert>,
    );
    fireEvent.click(screen.getByLabelText('Dismiss alert'));
    expect(onDismiss).toHaveBeenCalledOnce();
    // Still visible because parent controls visibility
    expect(screen.getByText('Controlled')).toBeInTheDocument();
  });
});
