import { describe, it, expect, vi } from 'vitest';
import { resolveColor, resolveContentColor, resolveAllColors } from '../color-resolver';
import { colors } from '../colors';

describe('resolveColor', () => {
  it('returns default hex value when window is undefined (SSR)', () => {
    expect(resolveColor('primary')).toBe(colors.primary);
    expect(resolveColor('success')).toBe(colors.success);
    expect(resolveColor('error')).toBe(colors.error);
  });

  it('returns default values for all DaisyUI colors', () => {
    expect(resolveColor('primary')).toBe('#3b82f6');
    expect(resolveColor('secondary')).toBe('#64748b');
    expect(resolveColor('accent')).toBe('#f59e0b');
    expect(resolveColor('neutral')).toBe('#737373');
    expect(resolveColor('info')).toBe('#0ea5e9');
    expect(resolveColor('success')).toBe('#22c55e');
    expect(resolveColor('warning')).toBe('#f97316');
    expect(resolveColor('error')).toBe('#ef4444');
  });

  it('reads CSS custom property value when running in a browser', () => {
    const mockElement = {
      style: {},
    } as HTMLElement;
    const mockGetComputedStyle = vi.fn().mockReturnValue({
      getPropertyValue: vi.fn((prop: string) => {
        if (prop === '--color-primary') return '#custom-primary';
        if (prop === '--color-success') return '#custom-success';
        return '';
      }),
    });

    vi.stubGlobal('window', {});
    vi.stubGlobal('document', { documentElement: mockElement });
    vi.stubGlobal('getComputedStyle', mockGetComputedStyle);

    try {
      expect(resolveColor('primary')).toBe('#custom-primary');
      expect(resolveColor('success')).toBe('#custom-success');
      // Falls back to default when CSS var is empty
      expect(resolveColor('error')).toBe(colors.error);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

describe('resolveContentColor', () => {
  it('returns default content color when window is undefined', () => {
    expect(resolveContentColor('primary')).toBe(colors.primaryContent);
    expect(resolveContentColor('error')).toBe(colors.errorContent);
  });

  it('reads content CSS custom property in browser', () => {
    const mockElement = {
      style: {},
    } as HTMLElement;
    const mockGetComputedStyle = vi.fn().mockReturnValue({
      getPropertyValue: vi.fn((prop: string) => {
        if (prop === '--color-primary-content') return '#custom-content';
        return '';
      }),
    });

    vi.stubGlobal('window', {});
    vi.stubGlobal('document', { documentElement: mockElement });
    vi.stubGlobal('getComputedStyle', mockGetComputedStyle);

    try {
      expect(resolveContentColor('primary')).toBe('#custom-content');
      // Falls back to default when CSS var is empty
      expect(resolveContentColor('error')).toBe(colors.errorContent);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

describe('resolveAllColors', () => {
  it('returns a record of all DaisyUI colors with default values', () => {
    const all = resolveAllColors();
    expect(all.primary).toBe(colors.primary);
    expect(all.secondary).toBe(colors.secondary);
    expect(all.accent).toBe(colors.accent);
    expect(all.neutral).toBe(colors.neutral);
    expect(all.info).toBe(colors.info);
    expect(all.success).toBe(colors.success);
    expect(all.warning).toBe(colors.warning);
    expect(all.error).toBe(colors.error);
    expect(Object.keys(all)).toHaveLength(8);
  });

  it('resolves all colors from CSS custom properties in browser', () => {
    const mockElement = {
      style: {},
    } as HTMLElement;
    const mockGetComputedStyle = vi.fn().mockReturnValue({
      getPropertyValue: vi.fn((prop: string) => {
        if (prop === '--color-primary') return '#browser-primary';
        return '';
      }),
    });

    vi.stubGlobal('window', {});
    vi.stubGlobal('document', { documentElement: mockElement });
    vi.stubGlobal('getComputedStyle', mockGetComputedStyle);

    try {
      const all = resolveAllColors();
      expect(all.primary).toBe('#browser-primary');
      // Others fall back to defaults
      expect(all.secondary).toBe(colors.secondary);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
