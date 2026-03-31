import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { InertiaForm } from '../../form/InertiaForm';
import type { InertiaFormProps } from '@inertiajs/react';

function createMockForm(
  overrides?: Partial<InertiaFormProps<Record<string, unknown>>>,
): InertiaFormProps<Record<string, unknown>> {
  return {
    data: { name: '' },
    isDirty: false,
    errors: {},
    hasErrors: false,
    processing: false,
    progress: null,
    wasSuccessful: false,
    recentlySuccessful: false,
    setData: vi.fn(),
    transform: vi.fn(),
    setDefaults: vi.fn(),
    reset: vi.fn(),
    clearErrors: vi.fn(),
    resetAndClearErrors: vi.fn(),
    setError: vi.fn(),
    submit: vi.fn(),
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    cancel: vi.fn(),
    dontRemember: vi.fn(),
    optimistic: vi.fn(),
    withPrecognition: vi.fn(),
    ...overrides,
  } as unknown as InertiaFormProps<Record<string, unknown>>;
}

describe('InertiaForm', () => {
  it('renders a form element with children', () => {
    const form = createMockForm();

    render(
      <InertiaForm form={form} url="/users">
        <input type="text" name="name" />
        <button type="submit">Submit</button>
      </InertiaForm>,
    );

    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('calls form.post on submit by default', () => {
    const form = createMockForm();

    render(
      <InertiaForm form={form} url="/users">
        <button type="submit">Submit</button>
      </InertiaForm>,
    );

    fireEvent.submit(screen.getByRole('button', { name: 'Submit' }).closest('form')!);

    expect(form.post).toHaveBeenCalledWith('/users', expect.any(Object));
  });

  it('calls form.put when method is put', () => {
    const form = createMockForm();

    render(
      <InertiaForm form={form} url="/users/1" method="put">
        <button type="submit">Update</button>
      </InertiaForm>,
    );

    fireEvent.submit(screen.getByRole('button', { name: 'Update' }).closest('form')!);

    expect(form.put).toHaveBeenCalledWith('/users/1', expect.any(Object));
  });

  it('calls form.delete when method is delete', () => {
    const form = createMockForm();

    render(
      <InertiaForm form={form} url="/users/1" method="delete">
        <button type="submit">Delete</button>
      </InertiaForm>,
    );

    fireEvent.submit(screen.getByRole('button', { name: 'Delete' }).closest('form')!);

    expect(form.delete).toHaveBeenCalledWith('/users/1', expect.any(Object));
  });

  it('applies className to form element', () => {
    const form = createMockForm();

    render(
      <InertiaForm form={form} url="/users" className="my-form">
        <button type="submit">Submit</button>
      </InertiaForm>,
    );

    const formEl = screen.getByRole('button', { name: 'Submit' }).closest('form');
    expect(formEl).toHaveClass('my-form');
  });

  it('calls onBefore callback before submission', () => {
    const form = createMockForm();
    const onBefore = vi.fn();

    render(
      <InertiaForm form={form} url="/users" onBefore={onBefore}>
        <button type="submit">Submit</button>
      </InertiaForm>,
    );

    fireEvent.submit(screen.getByRole('button', { name: 'Submit' }).closest('form')!);

    expect(onBefore).toHaveBeenCalled();
  });

  it('calls form.patch when method is patch', () => {
    const form = createMockForm();

    render(
      <InertiaForm form={form} url="/users/1" method="patch">
        <button type="submit">Patch</button>
      </InertiaForm>,
    );

    fireEvent.submit(screen.getByRole('button', { name: 'Patch' }).closest('form')!);

    expect(form.patch).toHaveBeenCalledWith('/users/1', expect.any(Object));
  });

  it('calls form.get when method is get', () => {
    const form = createMockForm();

    render(
      <InertiaForm form={form} url="/users" method="get">
        <button type="submit">Search</button>
      </InertiaForm>,
    );

    fireEvent.submit(screen.getByRole('button', { name: 'Search' }).closest('form')!);

    expect(form.get).toHaveBeenCalledWith('/users', expect.any(Object));
  });

  it('aborts submission when onBefore returns false', () => {
    const form = createMockForm();
    const onBefore = vi.fn(() => false);

    render(
      <InertiaForm form={form} url="/users" onBefore={onBefore}>
        <button type="submit">Submit</button>
      </InertiaForm>,
    );

    fireEvent.submit(screen.getByRole('button', { name: 'Submit' }).closest('form')!);

    expect(onBefore).toHaveBeenCalled();
    expect(form.post).not.toHaveBeenCalled();
  });
});
