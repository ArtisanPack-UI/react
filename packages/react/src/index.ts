/**
 * @module @artisanpack-ui/react
 *
 * The main entry point for the ArtisanPack UI React component library.
 * Re-exports all components, hooks, providers, and shared types.
 *
 * @packageDocumentation
 */

// Components
export * from './components/form';
export * from './components/layout';
export * from './components/navigation';
export * from './components/data';
export * from './components/feedback';
export * from './components/utility';

// Hooks & Providers
export { ThemeProvider, useTheme } from './hooks/use-theme';
export type { ThemeContextValue, ColorScheme } from './hooks/use-theme';

// Types
export type * from './types/common';
export type * from './types/form';
