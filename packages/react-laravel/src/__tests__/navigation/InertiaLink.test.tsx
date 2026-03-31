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
        <span data-testid="label">Add</span>
      </InertiaLink>,
    );
    const icon = screen.getByTestId('icon');
    const label = screen.getByTestId('label');
    expect(icon.compareDocumentPosition(label) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('renders iconRight after children', () => {
    render(
      <InertiaLink href="/icon" iconRight={<span data-testid="icon-right">→</span>}>
        <span data-testid="label">Next</span>
      </InertiaLink>,
    );
    const label = screen.getByTestId('label');
    const iconRight = screen.getByTestId('icon-right');
    expect(
      label.compareDocumentPosition(iconRight) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
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

    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    link.dispatchEvent(clickEvent);
    expect(clickEvent.defaultPrevented).toBe(true);
  });
});
