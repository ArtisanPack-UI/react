import { useCallback, useMemo, type ChangeEvent } from 'react';
import { useForm, type InertiaFormProps } from '@inertiajs/react';
import type { UseFormSubmitOptions } from '@inertiajs/core';

/** Generic form data constraint used across form utilities. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormDataRecord = Record<string, any>;

/**
 * Return type of {@link useInertiaForm}, providing the raw Inertia form instance
 * alongside field-binding helpers for ArtisanPack UI form components.
 *
 * @typeParam TForm - The form data shape
 */
export interface InertiaFormHelpers<TForm extends FormDataRecord> {
  /** The raw Inertia form instance */
  form: InertiaFormProps<TForm>;

  /**
   * Get props to spread onto an ArtisanPack UI form field component.
   * Automatically binds value, onChange, and error from the Inertia form state.
   *
   * `onChange` keeps a number field a number: when the field's current value
   * is a number, the control's text is converted (an empty control stays
   * `''`, so it can be cleared). `onBlur` is included once the form uses
   * Laravel Precognition (`form.withPrecognition(method, url)`), and
   * validates the field on the server, as Precognition's `form.validate(name)`.
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
    onBlur?: () => void;
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
  post: (url: string, options?: UseFormSubmitOptions) => void;

  /** Submit as PUT to the given URL */
  put: (url: string, options?: UseFormSubmitOptions) => void;

  /** Submit as PATCH to the given URL */
  patch: (url: string, options?: UseFormSubmitOptions) => void;

  /** Submit as DELETE to the given URL */
  destroy: (url: string, options?: UseFormSubmitOptions) => void;
}

/**
 * A control's text as the type of the field's current value: a number field
 * gets a number back, unless the control is empty or the text isn't a number.
 */
export function coerceFieldValue(current: unknown, raw: string): unknown {
  if (typeof current !== 'number' || raw.trim() === '') return raw;
  const parsed = Number(raw);
  return Number.isNaN(parsed) ? raw : parsed;
}

/** Whether the form has been given Laravel Precognition with `withPrecognition()`. */
function precognitiveValidate(form: object): ((field: string) => unknown) | undefined {
  const validate = (form as { validate?: unknown }).validate;
  return typeof validate === 'function' ? (validate as (field: string) => unknown) : undefined;
}

/**
 * Enhanced Inertia form hook that returns field-binding helpers
 * for ArtisanPack UI form components.
 *
 * Wraps Inertia's `useForm` and adds `field()` and `checkbox()` helpers
 * that return props ready to spread onto ArtisanPack UI input components.
 *
 * @typeParam TForm - The form data shape
 *
 * @param initialData - Initial form values, or a factory function returning them
 * @returns Form instance and field-binding helpers
 *
 * @see {@link InertiaForm} for the form wrapper component
 * @see {@link InertiaFormHelpers} for the full return type
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
/**
 * Overload that accepts a remember key for persisting form data across navigations.
 *
 * @param rememberKey - Key used by Inertia to remember form state in history
 * @param initialData - Initial form values, or a factory function returning them
 */
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
    <K extends Extract<keyof TForm, string>>(name: K) => {
      const validate = precognitiveValidate(form);
      return {
        name,
        value: form.data[name],
        error: (form.errors as Record<string, string | undefined>)[name],
        onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          form.setData(name as any, coerceFieldValue(form.data[name], e.target.value) as any);
        },
        ...(validate ? { onBlur: () => validate.call(form, name) } : {}),
      };
    },
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

  const post = useCallback(
    (url: string, options?: UseFormSubmitOptions) => form.post(url, options),
    [form],
  );
  const put = useCallback(
    (url: string, options?: UseFormSubmitOptions) => form.put(url, options),
    [form],
  );
  const patch = useCallback(
    (url: string, options?: UseFormSubmitOptions) => form.patch(url, options),
    [form],
  );
  const destroy = useCallback(
    (url: string, options?: UseFormSubmitOptions) => form.delete(url, options),
    [form],
  );

  return useMemo(
    () => ({ form, field, checkbox, post, put, patch, destroy }),
    [form, field, checkbox, post, put, patch, destroy],
  );
}
