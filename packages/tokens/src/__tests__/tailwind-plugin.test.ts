import { describe, it, expect } from 'vitest';
import type { TailwindPluginAPI } from '../tailwind-plugin';
import { themeTokens, createArtisanPackPlugin } from '../tailwind-plugin';

describe('themeTokens', () => {
  it('includes color tokens with CSS var fallbacks', () => {
    expect(themeTokens.colors.primary).toContain('var(--color-primary');
    expect(themeTokens.colors.primary).toContain('#3b82f6');
  });

  it('includes spacing tokens', () => {
    expect(themeTokens.spacing[4]).toBe('1rem');
    expect(themeTokens.spacing[8]).toBe('2rem');
  });

  it('includes font family tokens', () => {
    expect(themeTokens.fontFamily.sans).toContain('system-ui');
    expect(themeTokens.fontFamily.mono).toContain('monospace');
  });

  it('includes font size tokens', () => {
    expect(themeTokens.fontSize.base).toBe('1rem');
    expect(themeTokens.fontSize.lg).toBe('1.125rem');
  });

  it('includes border radius tokens', () => {
    expect(themeTokens.borderRadius.lg).toBe('0.5rem');
    expect(themeTokens.borderRadius.full).toBe('9999px');
  });

  it('includes shadow tokens including colored and glow variants', () => {
    expect(themeTokens.boxShadow.none).toBe('none');
    expect(themeTokens.boxShadow['color-primary']).toContain('59 130 246');
    expect(themeTokens.boxShadow['glow-sm']).toContain('8px');
  });

  it('includes duration tokens', () => {
    expect(themeTokens.transitionDuration[200]).toBe('200ms');
  });

  it('includes easing tokens', () => {
    expect(themeTokens.transitionTimingFunction.linear).toBe('linear');
    expect(themeTokens.transitionTimingFunction.spring).toContain('cubic-bezier');
  });
});

describe('createArtisanPackPlugin', () => {
  it('calls plugin(handler, config) matching Tailwind API shape', () => {
    let capturedHandler: ((api: TailwindPluginAPI) => void) | null = null;
    let capturedConfig: Record<string, unknown> | null = null;

    const mockPlugin = (
      handler: (api: TailwindPluginAPI) => void,
      config?: Record<string, unknown>,
    ) => {
      capturedHandler = handler;
      capturedConfig = config ?? null;
      return 'mock-plugin';
    };

    const result = createArtisanPackPlugin(mockPlugin);

    expect(result).toBe('mock-plugin');
    expect(capturedHandler).toBeTypeOf('function');
    expect(capturedConfig).toBeDefined();
    expect(capturedConfig).toHaveProperty('theme.extend');

    // Handler should be callable without errors
    capturedHandler!({});
  });
});
