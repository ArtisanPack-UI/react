import { createContext, useContext, type ReactNode } from 'react';
import type { InertiaFormProps } from '@inertiajs/react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormDataRecord = Record<string, any>;

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

/**
 * React context holding the current Inertia form instance.
 * Used internally by {@link InertiaForm} and accessed via {@link useFormContext}.
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const InertiaFormContext = createContext<InertiaFormProps<any> | null>(null);

/**
 * Access the Inertia form instance from within an `<InertiaForm>`.
 * Returns the full `InertiaFormProps` object including data, errors, setData, etc.
 *
 * Must be called within an {@link InertiaForm} or {@link FormContextProvider}.
 * Throws if used outside a form context.
 *
 * @typeParam TForm - The form data shape
 *
 * @example
 * ```tsx
 * function SubmitButton() {
 *   const form = useFormContext<{ name: string }>();
 *   return (
 *     <Button type="submit" loading={form.processing}>
 *       Save
 *     </Button>
 *   );
 * }
 * ```
 */
export function useFormContext<TForm extends FormDataRecord>(): InertiaFormProps<TForm> {
  const context = useContext(InertiaFormContext);
  if (!context) {
    throw new Error('useFormContext must be used within an <InertiaForm> component');
  }
  return context as InertiaFormProps<TForm>;
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

/**
 * Props for the {@link FormContextProvider} component.
 *
 * @typeParam TForm - The form data shape
 */
export interface FormContextProviderProps<TForm extends FormDataRecord> {
  /** Inertia form instance to provide via context */
  form: InertiaFormProps<TForm>;
  /** Child components that may consume the form context */
  children: ReactNode;
}

/**
 * Provides an Inertia form instance to descendant components via React context.
 * Used internally by {@link InertiaForm}, but can be used directly for custom form layouts.
 *
 * @typeParam TForm - The form data shape
 *
 * @see {@link useFormContext} to consume the provided form instance
 *
 * @example
 * ```tsx
 * const form = useForm({ name: '' });
 *
 * <FormContextProvider form={form}>
 *   <NameField />
 *   <SubmitButton />
 * </FormContextProvider>
 * ```
 */
export function FormContextProvider<TForm extends FormDataRecord>({
  form,
  children,
}: FormContextProviderProps<TForm>) {
  return <InertiaFormContext.Provider value={form}>{children}</InertiaFormContext.Provider>;
}
