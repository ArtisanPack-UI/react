/**
 * @module ai
 *
 * React components + hooks for consuming the artisanpack-ui/ai JSON API.
 * Shipped as the `@artisanpack-ui/react/ai` subpath.
 *
 * @example
 * ```tsx
 * import { createAiApiClient, SettingsPage, UsageDashboard, FeatureToggles } from '@artisanpack-ui/react/ai';
 *
 * const client = createAiApiClient({ baseUrl: '/api/artisanpack-ai' });
 *
 * <SettingsPage client={client} heading="AI Settings" />
 * <UsageDashboard client={client} refreshInterval={15_000} />
 * <FeatureToggles client={client} heading="AI Features" />
 * ```
 */

export { SettingsPage } from './SettingsPage/SettingsPage';
export type { SettingsPageProps } from './SettingsPage/SettingsPage';

export { UsageDashboard } from './UsageDashboard/UsageDashboard';
export type { UsageDashboardProps } from './UsageDashboard/UsageDashboard';

export { FeatureToggles } from './FeatureToggles/FeatureToggles';
export type { FeatureTogglesProps } from './FeatureToggles/FeatureToggles';

export { createAiApiClient, AiApiError } from './createAiApiClient';
export type { CreateAiApiClientOptions } from './createAiApiClient';

export { useStreamingText } from './useStreamingText';
export type { UseStreamingTextResult } from './useStreamingText';

export type {
  AiApiClient,
  AiCredentials,
  AiFeature,
  AiFeatureOverride,
  AiSettingsResponse,
  AiSettingsUpdate,
  AiConnectionTestResult,
  AiUsageTotals,
  AiUsageByFeature,
  AiUsageDaily,
  AiUsageResponse,
  AiValidationError,
} from './types';
