import { useMemo } from 'react';
import { usePage } from '@inertiajs/react';
import type { AuthProps, AuthUser, SharedPageProps } from '../types';

export interface UseAuthReturn {
  /** The authenticated user, or null if not authenticated */
  user: AuthUser | null;
  /** Whether a user is currently authenticated */
  isAuthenticated: boolean;
  /** The full auth props object from page props */
  auth: AuthProps;
}

/**
 * Hook to access the authenticated user from Inertia shared page props.
 * Reads from `page.props.auth.user` by default.
 *
 * @example
 * ```tsx
 * function ProfileButton() {
 *   const { user, isAuthenticated } = useAuth();
 *
 *   if (!isAuthenticated) return <InertiaLink href="/login">Log in</InertiaLink>;
 *
 *   return <span>Hello, {user.name}</span>;
 * }
 * ```
 */
export function useAuth(): UseAuthReturn {
  const page = usePage<SharedPageProps>();

  return useMemo(() => {
    const auth = page.props.auth ?? { user: null };
    return {
      user: auth.user,
      isAuthenticated: auth.user != null,
      auth,
    };
  }, [page.props.auth]);
}
