import type { ReactNode } from 'react';

/**
 * Flash message from Laravel's `redirect()->with()`.
 * Matches the shape available on Inertia's `page.props.flash`.
 */
export interface FlashMessages {
  success?: string;
  error?: string;
  warning?: string;
  info?: string;
  [key: string]: unknown;
}

/**
 * Authenticated user shape shared via Inertia page props.
 * Extend this interface to match your application's User model.
 */
export interface AuthUser {
  id: number | string;
  name: string;
  email: string;
  [key: string]: unknown;
}

/**
 * Auth data shared via Inertia page props.
 */
export interface AuthProps {
  user: AuthUser | null;
}

/**
 * Standard Inertia shared page props for Laravel applications.
 * Extend this interface in your app for additional shared data:
 *
 * ```ts
 * declare module '@artisanpack-ui/react-laravel' {
 *   interface SharedPageProps {
 *     locale: string;
 *     permissions: string[];
 *   }
 * }
 * ```
 */
export interface SharedPageProps {
  auth?: AuthProps;
  flash?: FlashMessages;
  errors?: Record<string, string>;
  [key: string]: unknown;
}

/**
 * Laravel paginator response shape returned by `->paginate()`.
 */
export interface LaravelPaginator<T = unknown> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
  first_page_url: string;
  last_page_url: string;
  next_page_url: string | null;
  prev_page_url: string | null;
  path: string;
  links: PaginatorLink[];
}

export interface PaginatorLink {
  url: string | null;
  label: string;
  active: boolean;
}

/**
 * Props for components that accept children.
 */
export interface ChildrenProps {
  children: ReactNode;
}
