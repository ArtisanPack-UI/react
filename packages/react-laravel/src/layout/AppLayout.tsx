import type { ComponentType, ReactNode } from 'react';
import { Head } from '@inertiajs/react';

export interface AppLayoutProps {
  /** Page title set via Inertia's <Head> */
  title?: string;
  /** Content rendered before the main children */
  header?: ReactNode;
  /** Content rendered after the main children */
  footer?: ReactNode;
  /** Page content */
  children: ReactNode;
  /** Additional class name for the main content wrapper */
  className?: string;
}

/**
 * Application layout wrapper for Inertia persistent layouts.
 * Sets page title via `<Head>` and provides header/footer slots.
 *
 * @example
 * ```tsx
 * // As a persistent layout:
 * Dashboard.layout = (page) => <AppLayout title="Dashboard">{page}</AppLayout>;
 *
 * // Or use createLayout for reusable persistent layouts:
 * Dashboard.layout = createLayout(AppLayout, { title: 'Dashboard' });
 * ```
 */
export function AppLayout({ title, header, footer, children, className }: AppLayoutProps) {
  return (
    <>
      {title && <Head title={title} />}
      {header}
      <main className={className}>{children}</main>
      {footer}
    </>
  );
}

/**
 * Factory function for creating Inertia persistent layout functions.
 * Returns a layout function that can be assigned to a page component's `layout` property.
 *
 * @example
 * ```tsx
 * // Simple usage with AppLayout
 * MyPage.layout = createLayout(AppLayout, { title: 'My Page' });
 *
 * // With custom layout component
 * MyPage.layout = createLayout(AdminLayout, { sidebar: true });
 *
 * // Nested layouts
 * MyPage.layout = [
 *   createLayout(AppLayout, { title: 'Admin' }),
 *   createLayout(AdminSidebar),
 * ];
 * ```
 */
export function createLayout<P extends { children: ReactNode }>(
  Layout: ComponentType<P>,
  props?: Omit<P, 'children'>,
): ((page: ReactNode) => ReactNode) & { displayName?: string } {
  const LayoutWrapper = (page: ReactNode) => {
    const layoutProps = (props ?? {}) as P;
    return <Layout {...layoutProps}>{page}</Layout>;
  };
  LayoutWrapper.displayName = `createLayout(${Layout.displayName ?? Layout.name ?? 'Component'})`;
  return LayoutWrapper;
}
