import type { ReactNode } from 'react';
import { useAuth } from './useAuth';

export interface AuthGuardProps {
  /** Content to render when the user is authenticated */
  children: ReactNode;
  /** Content to render when the user is NOT authenticated */
  fallback?: ReactNode;
  /** Invert the guard: render children only when NOT authenticated */
  guest?: boolean;
}

/**
 * Conditionally renders content based on authentication state.
 * Reads auth state from Inertia's shared page props.
 *
 * @example
 * ```tsx
 * // Only show when authenticated
 * <AuthGuard>
 *   <p>Welcome, {user.name}!</p>
 * </AuthGuard>
 *
 * // With a fallback for guests
 * <AuthGuard fallback={<InertiaLink href="/login">Log in</InertiaLink>}>
 *   <UserMenu />
 * </AuthGuard>
 *
 * // Only show when NOT authenticated (guest mode)
 * <AuthGuard guest>
 *   <InertiaLink href="/login">Log in</InertiaLink>
 * </AuthGuard>
 * ```
 */
export function AuthGuard({ children, fallback = null, guest = false }: AuthGuardProps) {
  const { isAuthenticated } = useAuth();

  const shouldRender = guest ? !isAuthenticated : isAuthenticated;

  return <>{shouldRender ? children : fallback}</>;
}
