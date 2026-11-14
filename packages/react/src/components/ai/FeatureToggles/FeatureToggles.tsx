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
import { errorMessage } from '../errorMessage';

/** The text a {@link FeatureToggles} shows. Translate it through `labels`. */
export interface FeatureTogglesLabels {
  /** While the features load. */
  loading: string;
  /** The empty state's title, when no features are registered. */
  empty: string;
  /** When a request fails without a message. */
  error: string;
}

/** The English defaults for {@link FeatureTogglesLabels}. */
export const FEATURE_TOGGLES_LABELS: FeatureTogglesLabels = {
  loading: 'Loading features…',
  empty: 'No AI features registered.',
  error: 'Something went wrong.',
};

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
  /** The list's text, for translation; missing keys keep their English defaults. */
  labels?: Partial<FeatureTogglesLabels>;
}

/**
 * Per-feature enable/disable list backed by GET `/features` and
 * POST `/features/{key}/toggle`. Each row optimistically flips its own
 * switch and rolls back on API failure.
 */
export function FeatureToggles({ client, heading, onToggle, labels }: FeatureTogglesProps) {
  const text = { ...FEATURE_TOGGLES_LABELS, ...labels };
  const [features, setFeatures] = useState<AiFeature[] | null>(null);
  // The failure itself, so its message is formatted with the current labels.
  const [failure, setFailure] = useState<{ reason: unknown } | null>(null);
  const error = failure ? errorMessage(failure.reason, text.error) : null;
  const [pending, setPending] = useState<Record<string, boolean>>({});
  // Bumped whenever `client` changes or the component unmounts, so a request
  // started against an earlier client can never write into the current state.
  const generationRef = useRef(0);

  useEffect(() => {
    const counter = generationRef;
    const generation = ++counter.current;
    setFeatures(null);
    setFailure(null);
    setPending({});
    client
      .getFeatures()
      .then((response) => {
        if (generation === generationRef.current) setFeatures(response.features);
      })
      .catch((err: unknown) => {
        if (generation === generationRef.current) setFailure({ reason: err });
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
          setFailure({ reason: err });
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
      setFailure(null);
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
        <Loading size="sm">{text.loading}</Loading>
      </Stack>
    );
  }

  if (features.length === 0) {
    return (
      <Stack gap="3">
        {headingNode}
        <EmptyState size="sm" title={text.empty} />
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
