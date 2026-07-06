/** @module ai/mockClient */

import type { AiApiClient, AiSettingsResponse, AiUsageResponse, AiFeature } from './types';

/**
 * In-memory {@link AiApiClient} for Storybook stories and demos. All methods
 * resolve after a short delay so loading states are visible.
 *
 * @internal
 */
export function createStorybookMockClient(): AiApiClient {
  let settings: AiSettingsResponse = {
    credentials: {
      provider: 'openai',
      api_key_present: true,
      base_url: null,
      default_model: 'gpt-4o-mini',
    },
    feature_overrides: [
      { feature_key: 'summarize', package: 'core', model: null, instructions: null },
      { feature_key: 'chat', package: 'core', model: 'gpt-4o', instructions: 'Be concise.' },
    ],
  };

  let features: AiFeature[] = [
    { key: 'summarize', package: 'core', label: 'Summarize', description: 'AI-generated summaries', enabled: true },
    { key: 'chat', package: 'core', label: 'Chat', description: 'Assistant chat surface', enabled: false },
  ];

  const usage: AiUsageResponse = {
    range: { from: '2026-07-01T00:00:00+00:00', to: '2026-07-31T23:59:59+00:00' },
    totals: { requests: 42, input_tokens: 12_000, output_tokens: 4_800, total_tokens: 16_800, cost: 1.24 },
    by_feature: [
      { feature_key: 'summarize', requests: 30, input_tokens: 9_000, output_tokens: 3_000, total_tokens: 12_000, cost: 0.9 },
      { feature_key: 'chat', requests: 12, input_tokens: 3_000, output_tokens: 1_800, total_tokens: 4_800, cost: 0.34 },
    ],
    daily: [
      { period: '2026-07-04', requests: 20, input_tokens: 6_000, output_tokens: 2_000, total_tokens: 8_000, cost: 0.6 },
      { period: '2026-07-05', requests: 22, input_tokens: 6_000, output_tokens: 2_800, total_tokens: 8_800, cost: 0.64 },
    ],
  };

  const delay = <T,>(value: T) => new Promise<T>((resolve) => setTimeout(() => resolve(value), 200));

  return {
    getSettings: () => delay(settings),
    updateSettings: (body) => {
      settings = {
        credentials: {
          provider: body.provider,
          api_key_present: settings.credentials.api_key_present || !!body.api_key,
          base_url: body.base_url ?? null,
          default_model: body.default_model ?? null,
        },
        feature_overrides:
          body.feature_overrides?.map((row) => ({
            feature_key: row.feature_key,
            package: settings.feature_overrides.find((o) => o.feature_key === row.feature_key)?.package ?? 'core',
            model: row.model ?? null,
            instructions: row.instructions ?? null,
          })) ?? settings.feature_overrides,
      };
      return delay(settings);
    },
    testConnection: (body) =>
      delay({ result: 'ok' as const, message: `Connected to ${body.provider}`, provider: body.provider }),
    getFeatures: () => delay({ features }),
    toggleFeature: (key, enabled) => {
      features = features.map((f) => (f.key === key ? { ...f, enabled: enabled ?? !f.enabled } : f));
      const updated = features.find((f) => f.key === key)!;
      return delay({ feature: { key: updated.key, package: updated.package, enabled: updated.enabled } });
    },
    getUsage: () => delay(usage),
  };
}
