import { describe, it, expect } from 'vitest';
import { spacing, spacingAliases } from '../spacing';

describe('spacing', () => {
  it('defines zero and pixel values', () => {
    expect(spacing[0]).toBe('0');
    expect(spacing.px).toBe('1px');
  });

  it('follows 0.25rem base unit for integer steps', () => {
    expect(spacing[1]).toBe('0.25rem');
    expect(spacing[2]).toBe('0.5rem');
    expect(spacing[4]).toBe('1rem');
    expect(spacing[8]).toBe('2rem');
    expect(spacing[16]).toBe('4rem');
  });

  it('includes fractional steps', () => {
    expect(spacing[0.5]).toBe('0.125rem');
    expect(spacing[1.5]).toBe('0.375rem');
    expect(spacing[2.5]).toBe('0.625rem');
    expect(spacing[3.5]).toBe('0.875rem');
  });

  it('includes large values', () => {
    expect(spacing[64]).toBe('16rem');
    expect(spacing[96]).toBe('24rem');
  });
});

describe('spacingAliases', () => {
  it('maps named sizes to spacing values', () => {
    expect(spacingAliases.xs).toBe(spacing[1]);
    expect(spacingAliases.sm).toBe(spacing[2]);
    expect(spacingAliases.md).toBe(spacing[4]);
    expect(spacingAliases.lg).toBe(spacing[6]);
    expect(spacingAliases.xl).toBe(spacing[8]);
    expect(spacingAliases['2xl']).toBe(spacing[12]);
    expect(spacingAliases['3xl']).toBe(spacing[16]);
  });
});
