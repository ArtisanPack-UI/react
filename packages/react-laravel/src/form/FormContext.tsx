import { createContext, useContext, type ReactNode } from 'react';
import type { InertiaFormProps } from '@inertiajs/react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormDataRecord = Record<string, any>;

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const InertiaFormContext = createContext<InertiaFormProps<any> | null>(null);

/**
 * Access the Inertia form instance from within an `<InertiaForm>`.
 * Returns the full `InertiaFormProps` object including data, errors, setData, etc.
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

export interface FormContextProviderProps<TForm extends FormDataRecord> {
  form: InertiaFormProps<TForm>;
  children: ReactNode;
}

export function FormContextProvider<TForm extends FormDataRecord>({
  form,
  children,
}: FormContextProviderProps<TForm>) {
  return <InertiaFormContext.Provider value={form}>{children}</InertiaFormContext.Provider>;
}
