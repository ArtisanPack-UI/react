import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ErrorDisplay as ErrorComponent } from '../../components/feedback/Error/Error';

describe('Error', () => {
  it('renders default title', () => {
    render(<ErrorComponent />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders custom title', () => {
    render(<ErrorComponent title="404 Not Found" />);
    expect(screen.getByText('404 Not Found')).toBeInTheDocument();
  });

  it('renders message', () => {
    render(<ErrorComponent message="Please try again later" />);
    expect(screen.getByText('Please try again later')).toBeInTheDocument();
  });

  it('has role="alert"', () => {
    render(<ErrorComponent />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders icon', () => {
    render(<ErrorComponent icon={<span data-testid="error-icon">⚠</span>} />);
    expect(screen.getByTestId('error-icon')).toBeInTheDocument();
  });

  it('shows retry button when onRetry is provided', () => {
    render(<ErrorComponent onRetry={() => {}} />);
    expect(screen.getByText('Try again')).toBeInTheDocument();
  });

  it('does not show retry button without onRetry', () => {
    render(<ErrorComponent />);
    expect(screen.queryByText('Try again')).not.toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', () => {
    const onRetry = vi.fn();
    render(<ErrorComponent onRetry={onRetry} />);
    fireEvent.click(screen.getByText('Try again'));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('renders custom retry label', () => {
    render(<ErrorComponent onRetry={() => {}} retryLabel="Reload" />);
    expect(screen.getByText('Reload')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(<ErrorComponent>Extra details</ErrorComponent>);
    expect(screen.getByText('Extra details')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<ErrorComponent className="custom" />);
    expect(screen.getByRole('alert')).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<ErrorComponent ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
