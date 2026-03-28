import { describe, it, expect } from 'vitest';
import { resolveColor, resolveContentColor, resolveAllColors } from '../color-resolver';
import { colors } from '../colors';

describe('resolveColor', () => {
  it('returns default hex value when window is undefined (SSR)', () => {
    // In vitest node environment, window/document are not available by default
    // unless configured with jsdom. Since tokens uses node env, this tests SSR fallback.
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
});

describe('resolveContentColor', () => {
  it('returns default content color when window is undefined', () => {
    expect(resolveContentColor('primary')).toBe(colors.primaryContent);
    expect(resolveContentColor('error')).toBe(colors.errorContent);
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
});
