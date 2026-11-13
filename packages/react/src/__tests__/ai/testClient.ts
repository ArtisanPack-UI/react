import { vi } from 'vitest';
import type { AiApiClient } from '../../components/ai/types';

/**
 * Build a fully-mocked {@link AiApiClient} with vi.fn() implementations for each
 * method. Callers override individual methods with `.mockResolvedValueOnce(...)`
 * to script the responses their test needs.
 */
export function createMockClient(overrides: Partial<AiApiClient> = {}): AiApiClient {
  return {
    getSettings: vi.fn(),
    updateSettings: vi.fn(),
    testConnection: vi.fn(),
    getFeatures: vi.fn(),
    toggleFeature: vi.fn(),
    getUsage: vi.fn(),
    ...overrides,
  } as AiApiClient;
}
