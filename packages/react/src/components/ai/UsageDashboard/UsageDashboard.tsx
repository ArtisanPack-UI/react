/** @module ai/UsageDashboard */

import { useEffect, useState } from 'react';
import { Stat } from '../../data/Stat/Stat';
import { Table, type TableColumn } from '../../data/Table/Table';
import { Alert } from '../../feedback/Alert/Alert';
import { Loading } from '../../feedback/Loading/Loading';
import { Heading } from '../../layout/Heading/Heading';
import { Stack } from '../../layout/Stack/Stack';
import { Text } from '../../layout/Text/Text';
import type { AiApiClient, AiUsageResponse } from '../types';
import { errorMessage } from '../errorMessage';

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

const featureColumns: TableColumn<FeatureRow>[] = [
  { key: 'feature_key', label: 'Feature' },
  { key: 'requests', label: 'Requests', numeric: true, render: (v) => formatNumber(v as number) },
  { key: 'input_tokens', label: 'Input', numeric: true, render: (v) => formatNumber(v as number) },
  {
    key: 'output_tokens',
    label: 'Output',
    numeric: true,
    render: (v) => formatNumber(v as number),
  },
  { key: 'cost', label: 'Cost', numeric: true, render: (v) => formatCost(v as number) },
];

const dailyColumns: TableColumn<DailyRow>[] = [
  { key: 'period', label: 'Day' },
  { key: 'requests', label: 'Requests', numeric: true, render: (v) => formatNumber(v as number) },
  { key: 'total_tokens', label: 'Tokens', numeric: true, render: (v) => formatNumber(v as number) },
  { key: 'cost', label: 'Cost', numeric: true, render: (v) => formatCost(v as number) },
];

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
}: UsageDashboardProps) {
  const [usage, setUsage] = useState<AiUsageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // A new client or date range makes the current figures wrong, so drop them
  // rather than show the previous range's totals under a failed reload.
  useEffect(() => {
    setUsage(null);
    setError(null);
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
        setError(null);
      } catch (err) {
        if (!active) return;
        setError(errorMessage(err));
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
    return <Loading size="sm">Loading usage…</Loading>;
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

      {error ? (
        <Alert
          color="warning"
          title="Couldn't refresh usage. Showing the last figures loaded."
          description={error}
        />
      ) : null}

      <Stack orientation="horizontal" gap="4" wrap>
        <Stat label="Requests" value={formatNumber(usage.totals.requests)} />
        <Stat label="Input tokens" value={formatNumber(usage.totals.input_tokens)} />
        <Stat label="Output tokens" value={formatNumber(usage.totals.output_tokens)} />
        <Stat label="Cost" value={formatCost(usage.totals.cost)} />
      </Stack>

      <Table
        title="By feature"
        headers={featureColumns}
        rows={usage.by_feature}
        keyBy="feature_key"
        density="compact"
        emptyText="No feature usage in this range."
      />

      <Table
        title="Daily"
        headers={dailyColumns}
        rows={usage.daily}
        keyBy="period"
        density="compact"
        emptyText="No daily usage in this range."
      />

      {refreshInterval > 0 ? (
        <Text size="xs" tone="muted" role="status" aria-live="polite">
          Live · refreshing every {Math.round(refreshInterval / 1000)}s
        </Text>
      ) : null}
    </Stack>
  );
}
