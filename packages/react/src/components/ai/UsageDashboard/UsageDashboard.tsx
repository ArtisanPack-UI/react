/** @module ai/UsageDashboard */

import { useCallback, useEffect, useRef, useState } from 'react';
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
    return (
      <div className="flex items-center gap-2" role="status" aria-live="polite">
        <span className="loading loading-spinner loading-sm" aria-hidden="true" />
        <span>Loading usage…</span>
      </div>
    );
  }

  if (error && !usage) {
    return (
      <div role="alert" className="alert alert-error">
        <span>{error}</span>
      </div>
    );
  }

  if (!usage) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6" data-testid="ai-usage-dashboard">
      {heading ? <h2 className="text-lg font-semibold">{heading}</h2> : null}

      <div className="stats stats-vertical sm:stats-horizontal shadow">
        <div className="stat">
          <div className="stat-title">Requests</div>
          <div className="stat-value">{formatNumber(usage.totals.requests)}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Input tokens</div>
          <div className="stat-value">{formatNumber(usage.totals.input_tokens)}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Output tokens</div>
          <div className="stat-value">{formatNumber(usage.totals.output_tokens)}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Cost</div>
          <div className="stat-value">{formatCost(usage.totals.cost)}</div>
        </div>
      </div>

      <section aria-labelledby="ai-usage-by-feature">
        <h3 id="ai-usage-by-feature" className="mb-2 font-medium">
          By feature
        </h3>
        {usage.by_feature.length === 0 ? (
          <p className="text-sm text-base-content/70">No feature usage in this range.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th className="text-right">Requests</th>
                  <th className="text-right">Input</th>
                  <th className="text-right">Output</th>
                  <th className="text-right">Cost</th>
                </tr>
              </thead>
              <tbody>
                {usage.by_feature.map((row) => (
                  <tr key={row.feature_key}>
                    <td>{row.feature_key}</td>
                    <td className="text-right">{formatNumber(row.requests)}</td>
                    <td className="text-right">{formatNumber(row.input_tokens)}</td>
                    <td className="text-right">{formatNumber(row.output_tokens)}</td>
                    <td className="text-right">{formatCost(row.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section aria-labelledby="ai-usage-daily">
        <h3 id="ai-usage-daily" className="mb-2 font-medium">
          Daily
        </h3>
        {usage.daily.length === 0 ? (
          <p className="text-sm text-base-content/70">No daily usage in this range.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Day</th>
                  <th className="text-right">Requests</th>
                  <th className="text-right">Tokens</th>
                  <th className="text-right">Cost</th>
                </tr>
              </thead>
              <tbody>
                {usage.daily.map((row) => (
                  <tr key={row.period}>
                    <td>{row.period}</td>
                    <td className="text-right">{formatNumber(row.requests)}</td>
                    <td className="text-right">{formatNumber(row.total_tokens)}</td>
                    <td className="text-right">{formatCost(row.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {refreshInterval > 0 ? (
        <p className="text-xs text-base-content/50" role="status" aria-live="polite">
          Live · refreshing every {Math.round(refreshInterval / 1000)}s
        </p>
      ) : null}
    </div>
  );
}
