/**
 * @artisanpack-ui/react-laravel
 *
 * Laravel + Inertia.js integration layer for ArtisanPack UI React components.
 * Provides navigation components pre-wired with Inertia's client-side router,
 * form helpers that bind to Inertia's form handling, authentication utilities
 * reading from shared page props, and flash-message-to-toast bridging.
 *
 * @packageDocumentation
 */

// Navigation
export { InertiaLink, InertiaMenu, InertiaBreadcrumbs, InertiaPagination } from './navigation';
export type {
  InertiaLinkProps,
  InertiaMenuProps,
  InertiaMenuItemType,
  InertiaBreadcrumbsProps,
  InertiaBreadcrumbItem,
  InertiaPaginationProps,
} from './navigation';

// Form
export { useInertiaForm, InertiaForm, useFormContext, FormContextProvider } from './form';
export type {
  InertiaFormHelpers,
  InertiaFormComponentProps,
  FormContextProviderProps,
} from './form';

// Layout
export { AppLayout, createLayout } from './layout';
export type { AppLayoutProps } from './layout';

// Auth
export { useAuth, AuthGuard } from './auth';
export type { UseAuthReturn, AuthGuardProps } from './auth';

// Feedback
export { InertiaToastProvider, useFlashMessages } from './feedback';
export type { InertiaToastProviderProps } from './feedback';

// Types
export type {
  FlashMessages,
  AuthUser,
  AuthProps,
  SharedPageProps,
  LaravelPaginator,
  PaginatorLink,
} from './types';
