/** @module ai/types */

/** Public credential payload returned from GET `/settings`. Never contains the plaintext API key. */
export interface AiCredentials {
  provider: string;
  api_key_present: boolean;
  base_url: string | null;
  default_model: string | null;
}

/** Per-feature override row returned from GET `/settings`. */
export interface AiFeatureOverride {
  feature_key: string;
  package: string;
  model: string | null;
  instructions: string | null;
}

/** Combined settings payload from GET `/settings`. */
export interface AiSettingsResponse {
  credentials: AiCredentials;
  feature_overrides: AiFeatureOverride[];
}

/** Body for PUT `/settings`. `api_key` is optional; omit to keep the stored key. */
export interface AiSettingsUpdate {
  provider: string;
  api_key?: string | null;
  base_url?: string | null;
  default_model?: string | null;
  feature_overrides?: Array<Pick<AiFeatureOverride, 'feature_key' | 'model' | 'instructions'>>;
}

/** Feature row returned from GET `/features`. */
export interface AiFeature {
  key: string;
  package: string;
  label: string;
  description: string | null;
  enabled: boolean;
}

/** Response from POST `/test-connection`. */
export interface AiConnectionTestResult {
  result: 'ok' | 'error';
  message?: string;
  provider?: string;
  model?: string | null;
}

/** Usage totals block from GET `/usage`. */
export interface AiUsageTotals {
  requests: number;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  cost: number;
}

/** Per-feature usage row. */
export interface AiUsageByFeature {
  feature_key: string;
  requests: number;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  cost: number;
}

/** Daily usage bucket. */
export interface AiUsageDaily {
  period: string;
  requests: number;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  cost: number;
}

/** Full response body of GET `/usage`. */
export interface AiUsageResponse {
  range: { from: string; to: string };
  totals: AiUsageTotals;
  by_feature: AiUsageByFeature[];
  daily: AiUsageDaily[];
}

/** Validation error envelope returned by 422 responses. */
export interface AiValidationError {
  message: string;
  errors: Record<string, string[]>;
}

/**
 * Minimal HTTP client contract. Callers inject their own fetch wrapper
 * (typically pre-configured with base URL, CSRF token, and Accept: application/json).
 */
export interface AiApiClient {
  getSettings(): Promise<AiSettingsResponse>;
  updateSettings(body: AiSettingsUpdate): Promise<AiSettingsResponse>;
  testConnection(
    body: Omit<AiSettingsUpdate, 'feature_overrides'>,
  ): Promise<AiConnectionTestResult>;
  getFeatures(): Promise<{ features: AiFeature[] }>;
  toggleFeature(
    key: string,
    enabled?: boolean,
  ): Promise<{ feature: Pick<AiFeature, 'key' | 'package' | 'enabled'> }>;
  getUsage(params?: { from?: string; to?: string }): Promise<AiUsageResponse>;
}
