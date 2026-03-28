import { describe, it, expect } from 'vitest';
import { shadows, shadowsDark, coloredShadows, glowShadows } from '../shadows';

describe('shadows', () => {
  it('defines none as literal none', () => {
    expect(shadows.none).toBe('none');
  });

  it('defines elevation levels from sm to 2xl', () => {
    expect(shadows.sm).toContain('rgb(0 0 0');
    expect(shadows.md).toContain('rgb(0 0 0');
    expect(shadows.lg).toContain('rgb(0 0 0');
    expect(shadows.xl).toContain('rgb(0 0 0');
    expect(shadows['2xl']).toContain('rgb(0 0 0');
  });

  it('defines inner shadow', () => {
    expect(shadows.inner).toContain('inset');
  });
});

describe('shadowsDark', () => {
  it('has higher opacity than light mode equivalents', () => {
    // Dark sm has 0.2, light sm has 0.05
    expect(shadowsDark.sm).toContain('0.2');
    expect(shadows.sm).toContain('0.05');
  });
});

describe('coloredShadows', () => {
  it('defines colored shadows for all semantic colors', () => {
    expect(coloredShadows.primary).toContain('59 130 246');
    expect(coloredShadows.success).toContain('34 197 94');
    expect(coloredShadows.warning).toContain('249 115 22');
    expect(coloredShadows.error).toContain('239 68 68');
    expect(coloredShadows.info).toContain('14 165 233');
  });
});

describe('glowShadows', () => {
  it('defines three glow sizes', () => {
    expect(glowShadows.sm).toContain('8px');
    expect(glowShadows.md).toContain('16px');
    expect(glowShadows.lg).toContain('24px');
  });
});
