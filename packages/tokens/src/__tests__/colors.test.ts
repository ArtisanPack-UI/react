import { describe, it, expect } from 'vitest';
import { colors, colorsDark, colorCssVars, daisyColorMap, daisyColors } from '../colors';

describe('colors', () => {
  it('defines all DaisyUI semantic colors', () => {
    expect(colors.primary).toBe('#3b82f6');
    expect(colors.secondary).toBe('#64748b');
    expect(colors.accent).toBe('#f59e0b');
    expect(colors.neutral).toBe('#737373');
    expect(colors.info).toBe('#0ea5e9');
    expect(colors.success).toBe('#22c55e');
    expect(colors.warning).toBe('#f97316');
    expect(colors.error).toBe('#ef4444');
  });

  it('defines content colors for all semantic colors', () => {
    expect(colors.primaryContent).toBeDefined();
    expect(colors.secondaryContent).toBeDefined();
    expect(colors.accentContent).toBeDefined();
    expect(colors.neutralContent).toBeDefined();
  });

  it('defines base surface colors', () => {
    expect(colors.base100).toBe('#ffffff');
    expect(colors.base200).toBe('#f3f4f6');
    expect(colors.base300).toBe('#e5e7eb');
    expect(colors.baseContent).toBe('#1f2937');
  });
});

describe('colorsDark', () => {
  it('overrides base and neutral colors for dark mode', () => {
    expect(colorsDark.neutral).toBe('#191D24');
    expect(colorsDark.base100).toBe('#2A303C');
    expect(colorsDark.base200).toBe('#242933');
    expect(colorsDark.base300).toBe('#20252E');
    expect(colorsDark.baseContent).toBe('#A6ADBB');
  });
});

describe('colorCssVars', () => {
  it('maps color names to CSS custom property names', () => {
    expect(colorCssVars.primary).toBe('--color-primary');
    expect(colorCssVars.base100).toBe('--color-base-100');
    expect(colorCssVars.errorContent).toBe('--color-error-content');
  });
});

describe('daisyColorMap', () => {
  it('maps each DaisyUI color to its CSS var and default value', () => {
    for (const color of daisyColors) {
      const entry = daisyColorMap[color];
      expect(entry.cssVar).toMatch(/^--color-/);
      expect(entry.defaultValue).toMatch(/^#/);
    }
  });
});

describe('daisyColors', () => {
  it('lists all 8 DaisyUI color names', () => {
    expect(daisyColors).toHaveLength(8);
    expect(daisyColors).toContain('primary');
    expect(daisyColors).toContain('secondary');
    expect(daisyColors).toContain('accent');
    expect(daisyColors).toContain('neutral');
    expect(daisyColors).toContain('info');
    expect(daisyColors).toContain('success');
    expect(daisyColors).toContain('warning');
    expect(daisyColors).toContain('error');
  });
});
