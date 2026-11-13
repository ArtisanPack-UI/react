/** @module ai/UsageDashboard */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Stat } from '../../data/Stat/Stat';
import { Table, type TableColumn } from '../../data/Table/Table';
import { Alert } from '../../feedback/Alert/Alert';
import { Loading } from '../../feedback/Loading/Loading';
import { Heading } from '../../layout/Heading/Heading';
import { Stack } from '../../layout/Stack/Stack';
import { Text } from '../../layout/Text/Text';
import type { AiApiClient, AiUsageResponse } from '../types';

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
  const cancelledRef = useRef(false);
  const requestSeqRef = useRef(0);

  const load = useCallback(async () => {
    const seq = ++requestSeqRef.current;
    try {
      const response = await client.getUsage({ from, to });
      // Discard responses that lost the race to a newer request — otherwise
      // a slow-poll response can clobber a fresher one under high latency.
      if (cancelledRef.current || seq !== requestSeqRef.current) return;
      setUsage(response);
      setError(null);
    } catch (err) {
      if (cancelledRef.current || seq !== requestSeqRef.current) return;
      setError((err as Error).message);
    } finally {
      if (!cancelledRef.current && seq === requestSeqRef.current) {
        setLoading(false);
      }
    }
  }, [client, from, to]);

  useEffect(() => {
    cancelledRef.current = false;
    setLoading(true);
    load();

    if (refreshInterval > 0) {
      const id = setInterval(load, refreshInterval);
      return () => {
        cancelledRef.current = true;
        clearInterval(id);
      };
    }

    return () => {
      cancelledRef.current = true;
    };
  }, [load, refreshInterval]);

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
