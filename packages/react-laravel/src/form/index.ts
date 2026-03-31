/**
 * Form handling utilities integrating Inertia's form helpers with ArtisanPack UI components.
 * Provides field-binding helpers, form context, and a form wrapper component.
 *
 * @packageDocumentation
 */

export { useInertiaForm } from './useInertiaForm';
export type { InertiaFormHelpers } from './useInertiaForm';

export { InertiaForm } from './InertiaForm';
export type { InertiaFormComponentProps } from './InertiaForm';

export { useFormContext, FormContextProvider } from './FormContext';
export type { FormContextProviderProps } from './FormContext';
