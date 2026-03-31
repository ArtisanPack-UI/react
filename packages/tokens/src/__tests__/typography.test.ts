import { describe, it, expect } from 'vitest';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
  letterSpacing,
  typographyPresets,
} from '../typography';

describe('fontFamilies', () => {
  it('defines sans, serif, and mono stacks', () => {
    expect(fontFamilies.sans).toContain('system-ui');
    expect(fontFamilies.serif).toContain('Georgia');
    expect(fontFamilies.mono).toContain('monospace');
  });
});

describe('fontSizes', () => {
  it('provides a scale from xs to 6xl', () => {
    expect(fontSizes.xs).toBe('0.75rem');
    expect(fontSizes.base).toBe('1rem');
    expect(fontSizes['6xl']).toBe('3.75rem');
  });

  it('increases monotonically through the scale', () => {
    expect(parseFloat(fontSizes.xs)).toBeLessThan(parseFloat(fontSizes.sm));
    expect(parseFloat(fontSizes.sm)).toBeLessThan(parseFloat(fontSizes.base));
    expect(parseFloat(fontSizes.base)).toBeLessThan(parseFloat(fontSizes.lg));
    expect(parseFloat(fontSizes.lg)).toBeLessThan(parseFloat(fontSizes.xl));
    expect(parseFloat(fontSizes.xl)).toBeLessThan(parseFloat(fontSizes['2xl']));
    expect(parseFloat(fontSizes['2xl'])).toBeLessThan(parseFloat(fontSizes['3xl']));
    expect(parseFloat(fontSizes['3xl'])).toBeLessThan(parseFloat(fontSizes['4xl']));
    expect(parseFloat(fontSizes['4xl'])).toBeLessThan(parseFloat(fontSizes['5xl']));
    expect(parseFloat(fontSizes['5xl'])).toBeLessThan(parseFloat(fontSizes['6xl']));
  });
});

describe('fontWeights', () => {
  it('ranges from thin (100) to black (900)', () => {
    expect(fontWeights.thin).toBe(100);
    expect(fontWeights.normal).toBe(400);
    expect(fontWeights.bold).toBe(700);
    expect(fontWeights.black).toBe(900);
  });
});

describe('lineHeights', () => {
  it('provides named line height values', () => {
    expect(lineHeights.none).toBe(1);
    expect(lineHeights.normal).toBe(1.5);
    expect(lineHeights.loose).toBe(2);
  });
});

describe('letterSpacing', () => {
  it('provides negative and positive tracking values', () => {
    expect(letterSpacing.tighter).toBe('-0.05em');
    expect(letterSpacing.normal).toBe('0em');
    expect(letterSpacing.widest).toBe('0.1em');
  });
});

describe('typographyPresets', () => {
  it('defines presets for h1 through h6 and body', () => {
    const keys = Object.keys(typographyPresets);
    expect(keys).toContain('h1');
    expect(keys).toContain('h6');
    expect(keys).toContain('body');
  });

  it('h1 is the largest heading', () => {
    const h1Size = parseFloat(typographyPresets.h1.fontSize);
    const h2Size = parseFloat(typographyPresets.h2.fontSize);
    expect(h1Size).toBeGreaterThan(h2Size);
  });

  it('body preset has normal weight', () => {
    expect(typographyPresets.body.fontWeight).toBe(400);
  });
});
