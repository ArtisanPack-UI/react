import { StrictMode } from 'react';
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createToaster } from '@artisanpack-ui/react/feedback';
import { useFlashMessages } from '../../feedback/useFlashMessages';

const mockUsePage = vi.fn();

vi.mock('@inertiajs/react', () => ({
  usePage: () => mockUsePage(),
}));

/** A page as Inertia gives it: a new object per visit. */
const visit = (flash: Record<string, unknown> | undefined, url = '/items') => ({
  component: 'Items/Index',
  props: { flash },
  url,
});

function setup() {
  const toaster = createToaster({ duration: 0 });
  const create = vi.spyOn(toaster, 'create');
  return { toaster, create };
}

describe('useFlashMessages', () => {
  beforeEach(() => {
    mockUsePage.mockReset();
  });

  it('shows each of the four flash types as a toast of that color', () => {
    const { toaster, create } = setup();
    mockUsePage.mockReturnValue(
      visit({ success: 'Saved', error: 'Failed', warning: 'Careful', info: 'FYI' }),
    );
    renderHook(() => useFlashMessages({ toaster }));
    expect(create.mock.calls.map(([options]) => options)).toEqual([
      { title: 'Saved', color: 'success' },
      { title: 'Failed', color: 'error' },
      { title: 'Careful', color: 'warning' },
      { title: 'FYI', color: 'info' },
    ]);
    expect(toaster.store.getVisibleToasts().map((entry) => entry.title)).toEqual(
      expect.arrayContaining(['Saved', 'Failed', 'Careful', 'FYI']),
    );
  });

  it.each(['success', 'error', 'warning', 'info'] as const)('shows a lone %s message', (type) => {
    const { toaster, create } = setup();
    mockUsePage.mockReturnValue(visit({ [type]: 'Message' }));
    renderHook(() => useFlashMessages({ toaster }));
    expect(create).toHaveBeenCalledOnce();
    expect(create).toHaveBeenCalledWith({ title: 'Message', color: type });
  });

  it('shows nothing for an empty or missing flash, or for empty and non-string values', () => {
    const { toaster, create } = setup();
    mockUsePage.mockReturnValue(visit({}));
    const { rerender } = renderHook(() => useFlashMessages({ toaster }));
    mockUsePage.mockReturnValue(visit(undefined));
    rerender();
    mockUsePage.mockReturnValue(visit({ success: '', error: null, custom: 'Ignored' }));
    rerender();
    expect(create).not.toHaveBeenCalled();
  });

  it("shows a visit's messages once under Strict Mode's double effects", () => {
    const { toaster, create } = setup();
    mockUsePage.mockReturnValue(visit({ success: 'Saved', error: 'Failed' }));
    renderHook(() => useFlashMessages({ toaster }), { wrapper: StrictMode });
    expect(create).toHaveBeenCalledTimes(2);
  });

  it('ignores a new flash object carrying the same messages on the same visit', () => {
    const { toaster, create } = setup();
    const page = visit({ success: 'Saved' });
    mockUsePage.mockReturnValue(page);
    const { rerender } = renderHook(() => useFlashMessages({ toaster }));
    // A new page object would be a new visit; keep the page, change the flash object.
    mockUsePage.mockReturnValue(Object.assign(page, { props: { flash: { success: 'Saved' } } }));
    rerender();
    expect(create).toHaveBeenCalledOnce();
  });

  it('shows a message added later on the same visit', () => {
    const { toaster, create } = setup();
    const page = visit({ success: 'Saved' });
    mockUsePage.mockReturnValue(page);
    const { rerender } = renderHook(() => useFlashMessages({ toaster }));
    mockUsePage.mockReturnValue(
      Object.assign(page, { props: { flash: { success: 'Saved', info: 'Synced' } } }),
    );
    rerender();
    expect(create.mock.calls.map(([options]) => options.title)).toEqual(['Saved', 'Synced']);
  });

  it('shows the same message again after another visit', () => {
    const { toaster, create } = setup();
    mockUsePage.mockReturnValue(visit({ success: 'Saved' }));
    const { rerender } = renderHook(() => useFlashMessages({ toaster }));
    mockUsePage.mockReturnValue(visit({ success: 'Saved' }));
    rerender();
    expect(create).toHaveBeenCalledTimes(2);
  });

  it('remembers a visit across a remount', () => {
    const { toaster, create } = setup();
    const page = visit({ success: 'Saved' });
    mockUsePage.mockReturnValue(page);
    renderHook(() => useFlashMessages({ toaster })).unmount();
    renderHook(() => useFlashMessages({ toaster }));
    expect(create).toHaveBeenCalledOnce();
  });
});

describe('useFlashMessages duration', () => {
  it('passes a duration to each toast', () => {
    const { toaster, create } = setup();
    mockUsePage.mockReturnValue(visit({ success: 'Saved' }));
    renderHook(() => useFlashMessages({ toaster, duration: 2500 }));
    expect(create).toHaveBeenCalledWith({ title: 'Saved', color: 'success', duration: 2500 });
  });
});
