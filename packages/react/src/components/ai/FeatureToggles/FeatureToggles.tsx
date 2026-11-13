/** @module ai/FeatureToggles */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from '../../feedback/Alert/Alert';
import { EmptyState } from '../../feedback/EmptyState/EmptyState';
import { Loading } from '../../feedback/Loading/Loading';
import { Toggle } from '../../form/Toggle/Toggle';
import { Card } from '../../layout/Card/Card';
import { Heading } from '../../layout/Heading/Heading';
import { Stack } from '../../layout/Stack/Stack';
import { Text } from '../../layout/Text/Text';
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
  // Bumped whenever `client` changes or the component unmounts, so a request
  // started against an earlier client can never write into the current state.
  const generationRef = useRef(0);

  useEffect(() => {
    const counter = generationRef;
    const generation = ++counter.current;
    setFeatures(null);
    setError(null);
    setPending({});
    client
      .getFeatures()
      .then((response) => {
        if (generation === generationRef.current) setFeatures(response.features);
      })
      .catch((err: Error) => {
        if (generation === generationRef.current) setError(err.message);
      });
    return () => {
      counter.current++;
    };
  }, [client]);

  const handleToggle = useCallback(
    async (feature: AiFeature) => {
      const generation = generationRef.current;
      const isCurrent = () => generation === generationRef.current;
      const target = !feature.enabled;
      setPending((prev) => ({ ...prev, [feature.key]: true }));
      setFeatures(
        (prev) => prev?.map((f) => (f.key === feature.key ? { ...f, enabled: target } : f)) ?? prev,
      );

      let response: Awaited<ReturnType<AiApiClient['toggleFeature']>>;
      try {
        response = await client.toggleFeature(feature.key, target);
      } catch (err) {
        if (isCurrent()) {
          // Roll back on failure.
          setFeatures(
            (prev) =>
              prev?.map((f) => (f.key === feature.key ? { ...f, enabled: feature.enabled } : f)) ??
              prev,
          );
          setError((err as Error).message);
        }
        return;
      } finally {
        if (isCurrent()) {
          setPending((prev) => {
            const next = { ...prev };
            delete next[feature.key];
            return next;
          });
        }
      }

      if (!isCurrent()) return;
      setError(null);
      // Outside the request's try: the server has saved the change, so a
      // throwing callback must not roll the switch back or show as a failure.
      try {
        onToggle?.(response.feature);
      } catch (callbackError) {
        console.error('FeatureToggles: onToggle threw', callbackError);
      }
    },
    [client, onToggle],
  );

  const headingNode = heading ? <Heading level={2}>{heading}</Heading> : null;

  if (error && !features) {
    return (
      <Stack gap="3">
        {headingNode}
        <Alert color="error" description={error} />
      </Stack>
    );
  }

  if (!features) {
    return (
      <Stack gap="3">
        {headingNode}
        <Loading size="sm">Loading features…</Loading>
      </Stack>
    );
  }

  if (features.length === 0) {
    return (
      <Stack gap="3">
        {headingNode}
        <EmptyState size="sm" title="No AI features registered." />
      </Stack>
    );
  }

  return (
    <Stack gap="3" data-testid="ai-feature-toggles">
      {headingNode}
      {error ? <Alert color="error" description={error} /> : null}
      <Stack gap="2" role="list">
        {features.map((feature) => (
          <Card
            key={feature.key}
            role="listitem"
            footer={
              <Text as="span" size="xs" tone="muted">
                {feature.package} · {feature.key}
              </Text>
            }
          >
            <Toggle
              color="primary"
              label={feature.label}
              description={feature.description || undefined}
              checked={feature.enabled}
              disabled={pending[feature.key] === true}
              onCheckedChange={() => handleToggle(feature)}
            />
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
