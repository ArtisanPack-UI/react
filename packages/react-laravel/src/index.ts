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
