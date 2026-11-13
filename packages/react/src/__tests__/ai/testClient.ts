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

/** A promise plus the functions that settle it, for scripting request timing. */
export function deferred<T>(): {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason: unknown) => void;
} {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}
