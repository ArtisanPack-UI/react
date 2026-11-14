import type { ChangeEvent } from 'react';
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { coerceFieldValue, useInertiaForm } from '../../form/useInertiaForm';

const mockForm: Record<string, unknown> = {};

vi.mock('@inertiajs/react', () => ({
  useForm: () => mockForm,
}));

const change = (value: string) =>
  ({ target: { value } }) as unknown as ChangeEvent<HTMLInputElement>;

describe('useInertiaForm', () => {
  beforeEach(() => {
    for (const key of Object.keys(mockForm)) delete mockForm[key];
    Object.assign(mockForm, {
      data: { name: 'Jane', age: 30, plan: 2, active: true },
      errors: { name: 'Required' },
      setData: vi.fn(),
    });
  });

  it('binds name, value and error', () => {
    const { result } = renderHook(() =>
      useInertiaForm({ name: 'Jane', age: 30, plan: 2, active: true }),
    );
    const props = result.current.field('name');
    expect(props).toMatchObject({ name: 'name', value: 'Jane', error: 'Required' });
  });

  it('writes a text field as text', () => {
    const { result } = renderHook(() => useInertiaForm({ name: '', age: 0 }));
    result.current.field('name').onChange(change('John'));
    expect(mockForm.setData).toHaveBeenCalledWith('name', 'John');
  });

  it('keeps a number field a number, as from a numeric Select or number input', () => {
    const { result } = renderHook(() => useInertiaForm({ plan: 2, age: 30 }));
    result.current.field('plan').onChange(change('3'));
    expect(mockForm.setData).toHaveBeenLastCalledWith('plan', 3);
    result.current.field('age').onChange(change('-1.5'));
    expect(mockForm.setData).toHaveBeenLastCalledWith('age', -1.5);
  });

  it('lets a number field be cleared, and keeps text that is not a number', () => {
    const { result } = renderHook(() => useInertiaForm({ age: 30 }));
    result.current.field('age').onChange(change(''));
    expect(mockForm.setData).toHaveBeenLastCalledWith('age', '');
    result.current.field('age').onChange(change('abc'));
    expect(mockForm.setData).toHaveBeenLastCalledWith('age', 'abc');
  });

  it('has no onBlur without Precognition', () => {
    const { result } = renderHook(() => useInertiaForm({ name: '' }));
    expect(result.current.field('name')).not.toHaveProperty('onBlur');
  });

  it('validates the field on blur once the form uses Precognition', () => {
    const validate = vi.fn();
    mockForm.validate = validate;
    const { result } = renderHook(() => useInertiaForm({ name: '' }));
    const props = result.current.field('name');
    props.onBlur?.();
    expect(validate).toHaveBeenCalledWith('name');
    expect(validate.mock.contexts[0]).toBe(mockForm);
  });

  it('binds checked for a checkbox', () => {
    const { result } = renderHook(() => useInertiaForm({ active: true }));
    const props = result.current.checkbox('active');
    expect(props.checked).toBe(true);
    props.onChange({ target: { checked: false } } as unknown as ChangeEvent<HTMLInputElement>);
    expect(mockForm.setData).toHaveBeenCalledWith('active', false);
  });
});

describe('coerceFieldValue', () => {
  it('converts only when the current value is a number', () => {
    expect(coerceFieldValue(1, '2')).toBe(2);
    expect(coerceFieldValue(1, ' ')).toBe(' ');
    expect(coerceFieldValue('1', '2')).toBe('2');
    expect(coerceFieldValue(null, '2')).toBe('2');
    expect(coerceFieldValue(undefined, '2')).toBe('2');
  });
});
