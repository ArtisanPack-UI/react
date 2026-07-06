/** @module ai/FeatureToggles */

import { useCallback, useEffect, useState } from 'react';
import type { AiApiClient, AiFeature } from '../types';

/**
 * Props for {@link FeatureToggles}.
 */
export interface FeatureTogglesProps {
  /** API client wrapping the artisanpack-ui/ai JSON endpoints. */
  client: AiApiClient;
  /** Optional heading rendered above the list. */
  heading?: string;
  /** Callback fired after a successful toggle. */
  onToggle?: (feature: Pick<AiFeature, 'key' | 'package' | 'enabled'>) => void;
}

/**
 * Per-feature enable/disable list backed by GET `/features` and
 * POST `/features/{key}/toggle`. Each row optimistically flips its own
 * switch and rolls back on API failure.
 */
export function FeatureToggles({ client, heading, onToggle }: FeatureTogglesProps) {
  const [features, setFeatures] = useState<AiFeature[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let cancelled = false;
    client
      .getFeatures()
      .then((response) => {
        if (!cancelled) setFeatures(response.features);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [client]);

  const handleToggle = useCallback(
    async (feature: AiFeature) => {
      const target = !feature.enabled;
      setPending((prev) => ({ ...prev, [feature.key]: true }));
      setFeatures(
        (prev) => prev?.map((f) => (f.key === feature.key ? { ...f, enabled: target } : f)) ?? prev,
      );
      try {
        const response = await client.toggleFeature(feature.key, target);
        setError(null);
        onToggle?.(response.feature);
      } catch (err) {
        // Roll back on failure.
        setFeatures(
          (prev) =>
            prev?.map((f) => (f.key === feature.key ? { ...f, enabled: feature.enabled } : f)) ??
            prev,
        );
        setError((err as Error).message);
      } finally {
        setPending((prev) => {
          const next = { ...prev };
          delete next[feature.key];
          return next;
        });
      }
    },
    [client, onToggle],
  );

  const headingNode = heading ? <h2 className="text-lg font-semibold">{heading}</h2> : null;

  if (error && !features) {
    return (
      <div className="flex flex-col gap-3">
        {headingNode}
        <div role="alert" className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!features) {
    return (
      <div className="flex flex-col gap-3">
        {headingNode}
        <div className="flex items-center gap-2" role="status" aria-live="polite">
          <span className="loading loading-spinner loading-sm" aria-hidden="true" />
          <span>Loading features…</span>
        </div>
      </div>
    );
  }

  if (features.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        {headingNode}
        <div className="text-sm text-base-content/70" role="status">
          No AI features registered.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3" data-testid="ai-feature-toggles">
      {headingNode}
      {error ? (
        <div role="alert" className="alert alert-error">
          <span>{error}</span>
        </div>
      ) : null}
      <ul className="flex flex-col gap-2">
        {features.map((feature) => (
          <li
            key={feature.key}
            className="flex items-center justify-between gap-4 rounded-box border border-base-300 p-3"
          >
            <div className="flex flex-col">
              <span className="font-medium">{feature.label}</span>
              {feature.description ? (
                <span className="text-sm text-base-content/70">{feature.description}</span>
              ) : null}
              <span className="text-xs uppercase tracking-wide text-base-content/50">
                {feature.package} · {feature.key}
              </span>
            </div>
            <label className="cursor-pointer">
              <span className="sr-only">
                {feature.enabled ? 'Disable' : 'Enable'} {feature.label}
              </span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={feature.enabled}
                disabled={pending[feature.key] === true}
                onChange={() => handleToggle(feature)}
                aria-label={`Toggle ${feature.label}`}
              />
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
