import { useCallback, type FormEvent, type ReactNode } from 'react';
import type { InertiaFormProps } from '@inertiajs/react';
import { FormContextProvider } from './FormContext';

/** Generic form data constraint used across form utilities. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormDataRecord = Record<string, any>;

/** HTTP methods supported by Inertia form submissions. */
type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

/**
 * Props for the {@link InertiaForm} component.
 *
 * @typeParam TForm - The form data shape (e.g. `{ name: string; email: string }`)
 *
 * @see {@link useInertiaForm} for creating the form instance
 */
export interface InertiaFormComponentProps<TForm extends FormDataRecord> {
  /** Inertia form instance from useForm() or useInertiaForm() */
  form: InertiaFormProps<TForm>;
  /** URL to submit the form to */
  url: string;
  /** HTTP method (default: 'post') */
  method?: HttpMethod;
  /** Preserve scroll position on submit (default: false) */
  preserveScroll?: boolean;
  /** Preserve component state on submit (default: false) */
  preserveState?: boolean;
  /** Callback before form submission. Return false to abort. */
  onBefore?: () => boolean | void;
  /** Callback on successful submission */
  onSuccess?: () => void;
  /** Callback on submission error */
  onError?: (errors: Record<string, string>) => void;
  /** Form children */
  children: ReactNode;
  /** Additional form element class name */
  className?: string;
}

/**
 * Form wrapper that integrates with Inertia's form handling.
 * Provides form context to child components and handles submission.
 *
 * @example
 * ```tsx
 * const { form, field } = useInertiaForm({ name: '', email: '' });
 *
 * <InertiaForm form={form} url="/users" method="post">
 *   <Input {...field('name')} label="Name" />
 *   <Input {...field('email')} label="Email" />
 *   <Button type="submit" loading={form.processing}>Save</Button>
 * </InertiaForm>
 * ```
 */
export function InertiaForm<TForm extends FormDataRecord>({
  form,
  url,
  method = 'post',
  preserveScroll,
  preserveState,
  onBefore,
  onSuccess,
  onError,
  children,
  className,
}: InertiaFormComponentProps<TForm>) {
  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (onBefore?.() === false) return;

      form[method](url, {
        preserveScroll,
        preserveState,
        onSuccess: () => onSuccess?.(),
        onError: (errors) => onError?.(errors as Record<string, string>),
      });
    },
    [form, method, url, preserveScroll, preserveState, onBefore, onSuccess, onError],
  );

  return (
    <FormContextProvider form={form}>
      <form onSubmit={handleSubmit} className={className}>
        {children}
      </form>
    </FormContextProvider>
  );
}
