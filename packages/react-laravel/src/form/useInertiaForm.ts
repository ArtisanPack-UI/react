import { useCallback, useMemo, type ChangeEvent } from 'react';
import { useForm, type InertiaFormProps } from '@inertiajs/react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormDataRecord = Record<string, any>;

export interface InertiaFormHelpers<TForm extends FormDataRecord> {
  /** The raw Inertia form instance */
  form: InertiaFormProps<TForm>;

  /**
   * Get props to spread onto an ArtisanPack UI form field component.
   * Automatically binds value, onChange, and error from the Inertia form state.
   *
   * @example
   * ```tsx
   * const { field } = useInertiaForm({ name: '', email: '' });
   * <Input {...field('name')} label="Name" />
   * <Input {...field('email')} label="Email" type="email" />
   * ```
   */
  field: <K extends Extract<keyof TForm, string>>(
    name: K,
  ) => {
    name: K;
    value: TForm[K];
    error: string | undefined;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onBlur: () => void;
  };

  /**
   * Get props for a checkbox/toggle field.
   * Binds `checked` instead of `value`.
   */
  checkbox: <K extends Extract<keyof TForm, string>>(
    name: K,
  ) => {
    name: K;
    checked: boolean;
    error: string | undefined;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  };

  /** Submit as POST to the given URL */
  post: (url: string) => void;

  /** Submit as PUT to the given URL */
  put: (url: string) => void;

  /** Submit as PATCH to the given URL */
  patch: (url: string) => void;

  /** Submit as DELETE to the given URL */
  destroy: (url: string) => void;
}

/**
 * Enhanced Inertia form hook that returns field-binding helpers
 * for ArtisanPack UI form components.
 *
 * @example
 * ```tsx
 * const { form, field, checkbox, post } = useInertiaForm({
 *   name: '',
 *   email: '',
 *   terms: false,
 * });
 *
 * <InertiaForm form={form} url="/users" method="post">
 *   <Input {...field('name')} label="Name" />
 *   <Input {...field('email')} label="Email" type="email" />
 *   <Checkbox {...checkbox('terms')} label="Accept terms" />
 *   <Button type="submit" loading={form.processing}>Save</Button>
 * </InertiaForm>
 * ```
 */
export function useInertiaForm<TForm extends FormDataRecord>(
  initialData: TForm | (() => TForm),
): InertiaFormHelpers<TForm>;
export function useInertiaForm<TForm extends FormDataRecord>(
  rememberKey: string,
  initialData: TForm | (() => TForm),
): InertiaFormHelpers<TForm>;
export function useInertiaForm<TForm extends FormDataRecord>(
  ...args: [TForm | (() => TForm)] | [string, TForm | (() => TForm)]
): InertiaFormHelpers<TForm> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<TForm>(...(args as [any]));

  const field = useCallback(
    <K extends Extract<keyof TForm, string>>(name: K) => ({
      name,
      value: form.data[name],
      error: (form.errors as Record<string, string | undefined>)[name],
      onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        form.setData(name as any, e.target.value as any);
      },
      onBlur: () => {
        // Placeholder for future field-level validation
      },
    }),
    [form],
  );

  const checkbox = useCallback(
    <K extends Extract<keyof TForm, string>>(name: K) => ({
      name,
      checked: Boolean(form.data[name]),
      error: (form.errors as Record<string, string | undefined>)[name],
      onChange: (e: ChangeEvent<HTMLInputElement>) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        form.setData(name as any, e.target.checked as any);
      },
    }),
    [form],
  );

  const post = useCallback((url: string) => form.post(url), [form]);
  const put = useCallback((url: string) => form.put(url), [form]);
  const patch = useCallback((url: string) => form.patch(url), [form]);
  const destroy = useCallback((url: string) => form.delete(url), [form]);

  return useMemo(
    () => ({ form, field, checkbox, post, put, patch, destroy }),
    [form, field, checkbox, post, put, patch, destroy],
  );
}
