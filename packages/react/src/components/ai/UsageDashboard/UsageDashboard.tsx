/** @module ai/UsageDashboard */

import { useEffect, useState } from 'react';
import { Stat } from '../../data/Stat/Stat';
import { Table, type TableColumn } from '../../data/Table/Table';
import { Alert } from '../../feedback/Alert/Alert';
import { Loading } from '../../feedback/Loading/Loading';
import { Heading } from '../../layout/Heading/Heading';
import { Stack } from '../../layout/Stack/Stack';
import { Text } from '../../layout/Text/Text';
import { fillTemplate } from '../../../internal/choice';
import type { AiApiClient, AiUsageResponse } from '../types';
import { errorMessage } from '../errorMessage';

/** The text a {@link UsageDashboard} shows. Translate it through `labels`. */
export interface UsageDashboardLabels {
  /** While the first load runs. */
  loading: string;
  /** Over the last figures when a refresh fails. */
  refreshFailed: string;
  /** When a request fails without a message. */
  error: string;
  /** The requests total and column. */
  requests: string;
  /** The input tokens total. */
  inputTokens: string;
  /** The output tokens total. */
  outputTokens: string;
  /** The cost total and column. */
  cost: string;
  /** The per-feature table's title. */
  byFeature: string;
  /** The per-feature table's feature column. */
  feature: string;
  /** The per-feature table's input tokens column. */
  input: string;
  /** The per-feature table's output tokens column. */
  output: string;
  /** The per-feature table's empty state. */
  noFeatureUsage: string;
  /** The daily table's title. */
  daily: string;
  /** The daily table's day column. */
  day: string;
  /** The daily table's tokens column. */
  tokens: string;
  /** The daily table's empty state. */
  noDailyUsage: string;
  /** The polling note; `:seconds` is the interval in seconds. */
  live: string;
}

/** The English defaults for {@link UsageDashboardLabels}. */
export const USAGE_DASHBOARD_LABELS: UsageDashboardLabels = {
  loading: 'Loading usage…',
  refreshFailed: "Couldn't refresh usage. Showing the last figures loaded.",
  error: 'Something went wrong.',
  requests: 'Requests',
  inputTokens: 'Input tokens',
  outputTokens: 'Output tokens',
  cost: 'Cost',
  byFeature: 'By feature',
  feature: 'Feature',
  input: 'Input',
  output: 'Output',
  noFeatureUsage: 'No feature usage in this range.',
  daily: 'Daily',
  day: 'Day',
  tokens: 'Tokens',
  noDailyUsage: 'No daily usage in this range.',
  live: 'Live · refreshing every :seconds s',
};

/**
 * Props for {@link UsageDashboard}.
 */
export interface UsageDashboardProps {
  /** API client wrapping the artisanpack-ui/ai JSON endpoints. */
  client: AiApiClient;
  /** Optional `from` date (YYYY-MM-DD) passed as a query param. */
  from?: string;
  /** Optional `to` date (YYYY-MM-DD) passed as a query param. */
  to?: string;
  /**
   * Poll interval in milliseconds for live updates. Defaults to `0` (no polling).
   * Set to `15000` for a 15-second refresh — the underlying `/usage` endpoint
   * is cheap enough for this and mirrors the Livewire dashboard cadence.
   */
  refreshInterval?: number;
  /** Optional heading rendered above the dashboard. */
  heading?: string;
  /** The dashboard's text, for translation; missing keys keep their English defaults. */
  labels?: Partial<UsageDashboardLabels>;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value);
}

function formatCost(value: number): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);
}

type FeatureRow = AiUsageResponse['by_feature'][number];
type DailyRow = AiUsageResponse['daily'][number];

const renderNumber = (value: unknown) => formatNumber(value as number);
const renderCost = (value: unknown) => formatCost(value as number);

function featureColumns(text: UsageDashboardLabels): TableColumn<FeatureRow>[] {
  return [
    { key: 'feature_key', label: text.feature },
    { key: 'requests', label: text.requests, numeric: true, render: renderNumber },
    { key: 'input_tokens', label: text.input, numeric: true, render: renderNumber },
    { key: 'output_tokens', label: text.output, numeric: true, render: renderNumber },
    { key: 'cost', label: text.cost, numeric: true, render: renderCost },
  ];
}

function dailyColumns(text: UsageDashboardLabels): TableColumn<DailyRow>[] {
  return [
    { key: 'period', label: text.day },
    { key: 'requests', label: text.requests, numeric: true, render: renderNumber },
    { key: 'total_tokens', label: text.tokens, numeric: true, render: renderNumber },
    { key: 'cost', label: text.cost, numeric: true, render: renderCost },
  ];
}

/**
 * Aggregated dashboard fed by GET `/usage`. Renders totals, per-feature
 * breakdown, and daily buckets, with optional polling for live updates
 * via {@link UsageDashboardProps.refreshInterval}.
 */
export function UsageDashboard({
  client,
  from,
  to,
  refreshInterval = 0,
  heading,
  labels,
}: UsageDashboardProps) {
  const text = { ...USAGE_DASHBOARD_LABELS, ...labels };
  const [usage, setUsage] = useState<AiUsageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  // The failure itself, so its message is formatted with the current labels.
  const [failure, setFailure] = useState<{ reason: unknown } | null>(null);
  const error = failure ? errorMessage(failure.reason, text.error) : null;

  // A new client or date range makes the current figures wrong, so drop them
  // rather than show the previous range's totals under a failed reload.
  useEffect(() => {
    setUsage(null);
    setFailure(null);
    setLoading(true);
  }, [client, from, to]);

  useEffect(() => {
    // `active` belongs to this run of the effect: any change to the client,
    // range or interval starts a new run and retires this one's responses.
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const poll = async () => {
      try {
        const response = await client.getUsage({ from, to });
        if (!active) return;
        setUsage(response);
        setFailure(null);
      } catch (err) {
        if (!active) return;
        setFailure({ reason: err });
      } finally {
        if (active) {
          setLoading(false);
          // Schedule the next poll only once this one has settled, so a slow
          // response is never superseded by the poll after it.
          if (refreshInterval > 0) timer = setTimeout(poll, refreshInterval);
        }
      }
    };

    poll();

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [client, from, to, refreshInterval]);

  if (loading && !usage) {
    return <Loading size="sm">{text.loading}</Loading>;
  }

  if (error && !usage) {
    return <Alert color="error" description={error} />;
  }

  if (!usage) {
    return null;
  }

  return (
    <Stack gap="6" data-testid="ai-usage-dashboard">
      {heading ? <Heading level={2}>{heading}</Heading> : null}

      {error ? <Alert color="warning" title={text.refreshFailed} description={error} /> : null}

      <Stack orientation="horizontal" gap="4" wrap>
        <Stat label={text.requests} value={formatNumber(usage.totals.requests)} />
        <Stat label={text.inputTokens} value={formatNumber(usage.totals.input_tokens)} />
        <Stat label={text.outputTokens} value={formatNumber(usage.totals.output_tokens)} />
        <Stat label={text.cost} value={formatCost(usage.totals.cost)} />
      </Stack>

      <Table
        title={text.byFeature}
        headers={featureColumns(text)}
        rows={usage.by_feature}
        keyBy="feature_key"
        density="compact"
        emptyText={text.noFeatureUsage}
      />

      <Table
        title={text.daily}
        headers={dailyColumns(text)}
        rows={usage.daily}
        keyBy="period"
        density="compact"
        emptyText={text.noDailyUsage}
      />

      {refreshInterval > 0 ? (
        <Text size="xs" tone="muted" role="status" aria-live="polite">
          {fillTemplate(text.live, { seconds: Math.round(refreshInterval / 1000) })}
        </Text>
      ) : null}
    </Stack>
  );
}
