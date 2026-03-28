import { describe, it, expect } from 'vitest';
import { borderRadius, daisyRadius } from '../borders';

describe('borderRadius', () => {
  it('defines a scale from none to full', () => {
    expect(borderRadius.none).toBe('0');
    expect(borderRadius.sm).toBe('0.125rem');
    expect(borderRadius.full).toBe('9999px');
  });

  it('increases from sm to 3xl', () => {
    const ordered = ['sm', 'base', 'md', 'lg', 'xl', '2xl', '3xl'] as const;
    const values = ordered.map((k) => parseFloat(borderRadius[k]));
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThan(values[i - 1]);
    }
  });
});

describe('daisyRadius', () => {
  it('defines DaisyUI component-specific radius values', () => {
    expect(daisyRadius.box).toBe('1rem');
    expect(daisyRadius.btn).toBe('0.5rem');
    expect(daisyRadius.badge).toBe('1.9rem');
    expect(daisyRadius.tab).toBe('0.5rem');
  });
});
