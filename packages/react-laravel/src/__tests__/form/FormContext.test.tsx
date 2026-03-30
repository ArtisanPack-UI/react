import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FormContextProvider, useFormContext } from '../../form/FormContext';
import type { InertiaFormProps } from '@inertiajs/react';

function TestConsumer() {
  const form = useFormContext<{ name: string }>();
  return <span data-testid="data">{JSON.stringify(form.data)}</span>;
}

function createMockForm(): InertiaFormProps<{ name: string }> {
  return {
    data: { name: 'Test' },
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
  } as unknown as InertiaFormProps<{ name: string }>;
}

describe('FormContext', () => {
  it('provides form data to consumers', () => {
    const form = createMockForm();

    render(
      <FormContextProvider form={form}>
        <TestConsumer />
      </FormContextProvider>,
    );

    expect(screen.getByTestId('data')).toHaveTextContent('{"name":"Test"}');
  });

  it('throws when used outside provider', () => {
    expect(() => {
      render(<TestConsumer />);
    }).toThrow('useFormContext must be used within an <InertiaForm> component');
  });
});
