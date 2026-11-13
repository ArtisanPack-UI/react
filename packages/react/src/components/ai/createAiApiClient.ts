/** @module ai/createAiApiClient */

import type {
  AiApiClient,
  AiConnectionTestResult,
  AiFeature,
  AiSettingsResponse,
  AiSettingsUpdate,
  AiUsageResponse,
} from './types';

/**
 * Options for {@link createAiApiClient}.
 */
export interface CreateAiApiClientOptions {
  /** Base URL of the AI JSON API, e.g. `'/api/artisanpack-ai'`. */
  baseUrl: string;
  /** Optional `fetch` override (for tests or custom auth wrappers). */
  fetchImpl?: typeof fetch;
  /** Extra headers merged into every request (e.g. `{ 'X-CSRF-TOKEN': token }`). */
  headers?: Record<string, string>;
}

/**
 * Thrown when the AI API returns a non-2xx response. Includes the parsed body
 * so consumers can surface validation errors returned as `{ errors: ... }`.
 */
export class AiApiError extends Error {
  public readonly status: number;
  public readonly body: unknown;

  constructor(status: number, body: unknown, message: string) {
    super(message);
    this.name = 'AiApiError';
    this.status = status;
    this.body = body;
  }
}

/**
 * Create a small {@link AiApiClient} that wraps `fetch` calls to the
 * artisanpack-ui/ai JSON API endpoints. Non-2xx responses reject with
 * {@link AiApiError}.
 */
export function createAiApiClient(options: CreateAiApiClientOptions): AiApiClient {
  const { baseUrl, fetchImpl, headers: extraHeaders } = options;
  const doFetch = fetchImpl ?? globalThis.fetch;

  const trimmedBase = baseUrl.replace(/\/$/, '');

  async function request<T>(
    path: string,
    init: RequestInit = {},
    query?: Record<string, string | undefined>,
  ): Promise<T> {
    const searchParams = query
      ? new URLSearchParams(
          Object.entries(query).flatMap(([k, v]) =>
            v == null ? [] : [[k, v] as [string, string]],
          ),
        ).toString()
      : '';
    const search = searchParams === '' ? '' : `?${searchParams}`;
    // Only advertise a JSON request body on methods that actually carry one —
    // strict reverse-proxies and Sanctum form-request configs reject GET/DELETE
    // requests that ship a Content-Type without a body.
    const hasBody = init.body != null;
    const response = await doFetch(`${trimmedBase}${path}${search}`, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
        ...extraHeaders,
        ...init.headers,
      },
    });

    const raw = await response.text();
    let body: unknown = null;
    if (raw.length > 0) {
      try {
        body = JSON.parse(raw);
      } catch {
        body = raw;
      }
    }

    if (!response.ok) {
      const message =
        (body && typeof body === 'object' && 'message' in body && typeof body.message === 'string'
          ? body.message
          : null) ?? `AI API request to ${path} failed with status ${response.status}`;
      throw new AiApiError(response.status, body, message);
    }

    return body as T;
  }

  return {
    getSettings: () => request<AiSettingsResponse>('/settings'),
    updateSettings: (body: AiSettingsUpdate) =>
      request<AiSettingsResponse>('/settings', {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
    testConnection: (body) =>
      request<AiConnectionTestResult>('/test-connection', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    getFeatures: () => request<{ features: AiFeature[] }>('/features'),
    toggleFeature: (key: string, enabled?: boolean) =>
      request<{ feature: Pick<AiFeature, 'key' | 'package' | 'enabled'> }>(
        `/features/${encodeURIComponent(key)}/toggle`,
        {
          method: 'POST',
          body: JSON.stringify(enabled === undefined ? {} : { enabled }),
        },
      ),
    getUsage: (params) =>
      request<AiUsageResponse>('/usage', {}, { from: params?.from, to: params?.to }),
  };
}
