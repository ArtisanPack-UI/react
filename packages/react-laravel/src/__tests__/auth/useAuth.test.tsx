import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '../../auth/useAuth';

const mockUsePage = vi.fn();

vi.mock('@inertiajs/react', () => ({
  usePage: () => mockUsePage(),
}));

beforeEach(() => {
  mockUsePage.mockReset();
});

function TestComponent() {
  const { user, isAuthenticated } = useAuth();
  return (
    <div>
      <span data-testid="authenticated">{String(isAuthenticated)}</span>
      <span data-testid="user">{user ? user.name : 'none'}</span>
    </div>
  );
}

describe('useAuth', () => {
  it('returns authenticated user when present', () => {
    mockUsePage.mockReturnValue({
      props: {
        auth: {
          user: { id: 1, name: 'John', email: 'john@example.com' },
        },
      },
    });

    render(<TestComponent />);

    expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    expect(screen.getByTestId('user')).toHaveTextContent('John');
  });

  it('returns null user when not authenticated', () => {
    mockUsePage.mockReturnValue({
      props: {
        auth: { user: null },
      },
    });

    render(<TestComponent />);

    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('user')).toHaveTextContent('none');
  });

  it('handles missing auth prop gracefully', () => {
    mockUsePage.mockReturnValue({
      props: {},
    });

    render(<TestComponent />);

    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('user')).toHaveTextContent('none');
  });
});
