import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { InertiaLink } from '../../navigation/InertiaLink';

// Mock Inertia's Link component
vi.mock('@inertiajs/react', () => ({
  Link: vi.fn(({ children, href, className, ...rest }: Record<string, unknown>) => (
    <a href={href as string} className={className as string} data-testid="inertia-link" {...rest}>
      {children as React.ReactNode}
    </a>
  )),
}));

describe('InertiaLink', () => {
  it('renders as a plain link by default', () => {
    render(<InertiaLink href="/dashboard">Dashboard</InertiaLink>);
    const link = screen.getByTestId('inertia-link');
    expect(link).toHaveTextContent('Dashboard');
    expect(link).toHaveAttribute('href', '/dashboard');
    expect(link).not.toHaveClass('btn');
  });

  it('renders as a button when asButton is true', () => {
    render(
      <InertiaLink href="/settings" asButton>
        Settings
      </InertiaLink>,
    );
    const link = screen.getByTestId('inertia-link');
    expect(link).toHaveClass('btn');
  });

  it('applies color variant when asButton is true', () => {
    render(
      <InertiaLink href="/save" asButton color="primary">
        Save
      </InertiaLink>,
    );
    const link = screen.getByTestId('inertia-link');
    expect(link).toHaveClass('btn-primary');
  });

  it('applies size variant when asButton is true', () => {
    render(
      <InertiaLink href="/small" asButton size="sm">
        Small
      </InertiaLink>,
    );
    const link = screen.getByTestId('inertia-link');
    expect(link).toHaveClass('btn-sm');
  });

  it('renders icon before children', () => {
    render(
      <InertiaLink href="/icon" icon={<span data-testid="icon">+</span>}>
        Add
      </InertiaLink>,
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders iconRight after children', () => {
    render(
      <InertiaLink href="/icon" iconRight={<span data-testid="icon-right">→</span>}>
        Next
      </InertiaLink>,
    );
    expect(screen.getByTestId('icon-right')).toBeInTheDocument();
  });

  it('shows loading spinner when loading', () => {
    render(
      <InertiaLink href="/loading" loading>
        Loading
      </InertiaLink>,
    );
    const link = screen.getByTestId('inertia-link');
    expect(link).toHaveAttribute('aria-busy', 'true');
    expect(link.querySelector('.loading-spinner')).toBeInTheDocument();
  });

  it('hides icon when loading', () => {
    render(
      <InertiaLink href="/loading" loading icon={<span data-testid="icon">+</span>}>
        Loading
      </InertiaLink>,
    );
    expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
  });

  it('prevents navigation when loading', () => {
    render(
      <InertiaLink href="/loading" loading>
        Loading
      </InertiaLink>,
    );
    const link = screen.getByTestId('inertia-link');
    expect(link).toHaveAttribute('tabindex', '-1');
  });
});
