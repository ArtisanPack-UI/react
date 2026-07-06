import { describe, it, expect, vi } from 'vitest';
import { AiApiError, createAiApiClient } from '../../components/ai/createAiApiClient';

function mockFetch(handler: (input: string, init?: RequestInit) => Response | Promise<Response>) {
  return vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString();
    return Promise.resolve(handler(url, init));
  }) as unknown as typeof fetch;
}

describe('createAiApiClient', () => {
  it('GETs settings from the configured base URL', async () => {
    const fetchImpl = mockFetch((url) => {
      expect(url).toBe('/api/artisanpack-ai/settings');
      return new Response(
        JSON.stringify({
          credentials: {
            provider: 'openai',
            api_key_present: false,
            base_url: null,
            default_model: null,
          },
          feature_overrides: [],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    });

    const client = createAiApiClient({ baseUrl: '/api/artisanpack-ai/', fetchImpl });
    const response = await client.getSettings();

    expect(response.credentials.provider).toBe('openai');
  });

  it('serializes usage query params', async () => {
    const fetchImpl = mockFetch((url) => {
      expect(url).toBe('/api/artisanpack-ai/usage?from=2026-07-01&to=2026-07-31');
      return new Response(
        JSON.stringify({ range: { from: '', to: '' }, totals: {}, by_feature: [], daily: [] }),
        { status: 200 },
      );
    });

    const client = createAiApiClient({ baseUrl: '/api/artisanpack-ai', fetchImpl });
    await client.getUsage({ from: '2026-07-01', to: '2026-07-31' });
  });

  it('rejects non-2xx responses with AiApiError including the parsed body', async () => {
    const fetchImpl = mockFetch(
      () =>
        new Response(
          JSON.stringify({ message: 'Validation failed.', errors: { api_key: ['Required.'] } }),
          {
            status: 422,
            headers: { 'Content-Type': 'application/json' },
          },
        ),
    );

    const client = createAiApiClient({ baseUrl: '/api/artisanpack-ai', fetchImpl });

    await expect(client.updateSettings({ provider: 'openai' })).rejects.toMatchObject({
      name: 'AiApiError',
      status: 422,
    });

    try {
      await client.updateSettings({ provider: 'openai' });
    } catch (err) {
      expect(err).toBeInstanceOf(AiApiError);
      expect((err as AiApiError).body).toMatchObject({ errors: { api_key: ['Required.'] } });
    }
  });

  it('URL-encodes the feature key when toggling', async () => {
    const fetchImpl = mockFetch((url, init) => {
      expect(url).toBe('/api/artisanpack-ai/features/summarize.post/toggle');
      expect(init?.method).toBe('POST');
      return new Response(
        JSON.stringify({ feature: { key: 'summarize.post', package: 'core', enabled: true } }),
        {
          status: 200,
        },
      );
    });

    const client = createAiApiClient({ baseUrl: '/api/artisanpack-ai', fetchImpl });
    await client.toggleFeature('summarize.post', true);
  });
});
