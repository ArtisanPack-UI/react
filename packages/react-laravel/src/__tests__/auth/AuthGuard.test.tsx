import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { AuthGuard } from '../../auth/AuthGuard';

const mockUsePage = vi.fn();

vi.mock('@inertiajs/react', () => ({
  usePage: () => mockUsePage(),
}));

describe('AuthGuard', () => {
  afterEach(() => {
    mockUsePage.mockReset();
  });

  it('renders children when user is authenticated', () => {
    mockUsePage.mockReturnValue({
      props: {
        auth: { user: { id: 1, name: 'John', email: 'john@example.com' } },
      },
    });

    render(
      <AuthGuard>
        <span>Protected content</span>
      </AuthGuard>,
    );

    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });

  it('renders fallback when user is not authenticated', () => {
    mockUsePage.mockReturnValue({
      props: { auth: { user: null } },
    });

    render(
      <AuthGuard fallback={<span>Please log in</span>}>
        <span>Protected content</span>
      </AuthGuard>,
    );

    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
    expect(screen.getByText('Please log in')).toBeInTheDocument();
  });

  it('renders nothing as fallback by default when not authenticated', () => {
    mockUsePage.mockReturnValue({
      props: { auth: { user: null } },
    });

    const { container } = render(
      <AuthGuard>
        <span>Protected content</span>
      </AuthGuard>,
    );

    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
    expect(container.innerHTML).toBe('');
  });

  it('renders children when guest=true and user is NOT authenticated', () => {
    mockUsePage.mockReturnValue({
      props: { auth: { user: null } },
    });

    render(
      <AuthGuard guest>
        <span>Guest content</span>
      </AuthGuard>,
    );

    expect(screen.getByText('Guest content')).toBeInTheDocument();
  });

  it('renders fallback when guest=true and user IS authenticated', () => {
    mockUsePage.mockReturnValue({
      props: {
        auth: { user: { id: 1, name: 'John', email: 'john@example.com' } },
      },
    });

    render(
      <AuthGuard guest fallback={<span>Redirect to dashboard</span>}>
        <span>Guest content</span>
      </AuthGuard>,
    );

    expect(screen.queryByText('Guest content')).not.toBeInTheDocument();
    expect(screen.getByText('Redirect to dashboard')).toBeInTheDocument();
  });
});
