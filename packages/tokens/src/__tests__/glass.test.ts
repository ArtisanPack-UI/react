import { describe, it, expect } from 'vitest';
import {
  glassTokens,
  glassFrostedTokens,
  glassLiquidTokens,
  glassTransparentTokens,
  glassTokensDark,
  glassStyles,
  glassClassName,
} from '../glass';

describe('glassTokens', () => {
  it('defines base glass token values', () => {
    expect(glassTokens.blur).toBe('12px');
    expect(glassTokens.opacity).toBe(0.7);
    expect(glassTokens.borderWidth).toBe('1px');
  });
});

describe('glassFrostedTokens', () => {
  it('defines frosted variant values', () => {
    expect(glassFrostedTokens.blur).toBe('16px');
    expect(glassFrostedTokens.opacity).toBe(0.8);
    expect(glassFrostedTokens.saturation).toBe('180%');
  });
});

describe('glassLiquidTokens', () => {
  it('defines liquid variant values', () => {
    expect(glassLiquidTokens.blur).toBe('24px');
    expect(glassLiquidTokens.opacity).toBe(0.6);
  });
});

describe('glassTransparentTokens', () => {
  it('defines transparent variant values', () => {
    expect(glassTransparentTokens.blur).toBe('8px');
    expect(glassTransparentTokens.opacity).toBe(0.3);
  });
});

describe('glassTokensDark', () => {
  it('has higher opacity than light mode base', () => {
    expect(glassTokensDark.base.opacity).toBeGreaterThan(glassTokens.opacity);
  });

  it('has higher frosted blur than light mode', () => {
    expect(parseInt(glassTokensDark.frosted.blur)).toBeGreaterThan(
      parseInt(glassFrostedTokens.blur),
    );
  });
});

describe('glassStyles', () => {
  it('returns base glass styles by default', () => {
    const styles = glassStyles();
    expect(styles.background).toContain('rgba(255, 255, 255');
    expect(styles.backdropFilter).toContain('blur(12px)');
  });

  it('returns frosted styles when preset is frosted', () => {
    const styles = glassStyles({ preset: 'frosted' });
    expect(styles.backdropFilter).toContain('saturate');
    expect(styles.backdropFilter).toContain('blur(16px)');
  });

  it('returns liquid styles with box-shadow', () => {
    const styles = glassStyles({ preset: 'liquid' });
    expect(styles.backdropFilter).toContain('blur(24px)');
    expect(styles.boxShadow).toContain('inset');
  });

  it('returns transparent styles', () => {
    const styles = glassStyles({ preset: 'transparent' });
    expect(styles.backdropFilter).toContain('blur(8px)');
    expect(styles.background).toContain('0.3');
  });

  it('applies dark mode adjustments', () => {
    const light = glassStyles({ preset: 'base' });
    const dark = glassStyles({ preset: 'base', dark: true });
    expect(light.background).toContain('255, 255, 255');
    expect(dark.background).toContain('30, 30, 30');
  });
});

describe('glassClassName', () => {
  it('returns base glass class by default', () => {
    expect(glassClassName()).toBe('glass');
  });

  it('returns preset-specific class', () => {
    expect(glassClassName({ preset: 'frosted' })).toBe('glass-frosted');
    expect(glassClassName({ preset: 'liquid' })).toBe('glass-liquid');
    expect(glassClassName({ preset: 'transparent' })).toBe('glass-transparent');
  });

  it('appends tint class when tint is specified', () => {
    expect(glassClassName({ tint: 'primary' })).toBe('glass glass-tint-primary');
    expect(glassClassName({ preset: 'frosted', tint: 'error' })).toBe(
      'glass-frosted glass-tint-error',
    );
  });

  it('appends tint opacity class when tintOpacity is specified', () => {
    const result = glassClassName({ tint: 'primary', tintOpacity: 0.3 });
    expect(result).toContain('glass-tint-opacity-30');
  });

  it('clamps tint opacity between 10 and 100', () => {
    expect(glassClassName({ tint: 'primary', tintOpacity: 0.01 })).toContain(
      'glass-tint-opacity-10',
    );
    expect(glassClassName({ tint: 'primary', tintOpacity: 1.5 })).toContain(
      'glass-tint-opacity-100',
    );
  });
});
