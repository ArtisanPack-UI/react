/** @module ai/SettingsPage */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from '../../feedback/Alert/Alert';
import { Loading } from '../../feedback/Loading/Loading';
import { Button } from '../../form/Button/Button';
import { Fieldset } from '../../form/Fieldset/Fieldset';
import { Form } from '../../form/Form/Form';
import { Input } from '../../form/Input/Input';
import { Password } from '../../form/Password/Password';
import { Select } from '../../form/Select/Select';
import { Textarea } from '../../form/Textarea/Textarea';
import { Card } from '../../layout/Card/Card';
import { Heading } from '../../layout/Heading/Heading';
import { Stack } from '../../layout/Stack/Stack';
import { Text } from '../../layout/Text/Text';
import type {
  AiApiClient,
  AiConnectionTestResult,
  AiFeatureOverride,
  AiSettingsResponse,
  AiSettingsUpdate,
} from '../types';
import { AiApiError } from '../createAiApiClient';
import { errorMessage } from '../errorMessage';

/**
 * Props for {@link SettingsPage}.
 */
export interface SettingsPageProps {
  /** API client wrapping the artisanpack-ui/ai JSON endpoints. */
  client: AiApiClient;
  /** Provider IDs shown in the provider dropdown. */
  providers?: string[];
  /** Optional heading rendered above the form. */
  heading?: string;
}

type FormErrors = Record<string, string[]>;

/** Joins a field's validation messages into the single string the field components take. */
function fieldError(errors: FormErrors, field: string): string | undefined {
  return errors[field]?.join(' ');
}

interface FormState {
  provider: string;
  api_key: string;
  base_url: string;
  default_model: string;
  overrides: AiFeatureOverride[];
}

const emptyForm: FormState = {
  provider: 'openai',
  api_key: '',
  base_url: '',
  default_model: '',
  overrides: [],
};

function toFormState(response: AiSettingsResponse): FormState {
  return {
    provider: response.credentials.provider,
    api_key: '',
    base_url: response.credentials.base_url ?? '',
    default_model: response.credentials.default_model ?? '',
    overrides: response.feature_overrides,
  };
}

/**
 * The credential fields shared by save and test-connection. A blank API key is
 * omitted, which the API reads as "keep the stored key".
 */
function toCredentials(form: FormState): Omit<AiSettingsUpdate, 'feature_overrides'> {
  return {
    provider: form.provider,
    ...(form.api_key === '' ? {} : { api_key: form.api_key }),
    base_url: form.base_url === '' ? null : form.base_url,
    default_model: form.default_model === '' ? null : form.default_model,
  };
}

function toUpdatePayload(form: FormState): AiSettingsUpdate {
  return {
    ...toCredentials(form),
    feature_overrides: form.overrides.map((override) => ({
      feature_key: override.feature_key,
      model: override.model,
      instructions: override.instructions,
    })),
  };
}

/**
 * Admin form backed by GET/PUT `/settings` and POST `/test-connection`.
 * Renders provider credentials, per-feature model/instruction overrides,
 * and a probe button that surfaces `test-connection` results inline.
 */
export function SettingsPage({
  client,
  providers = ['openai', 'anthropic', 'ollama'],
  heading,
}: SettingsPageProps) {
  const [initial, setInitial] = useState<AiSettingsResponse | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<string | null>(null);
  const [statusVariant, setStatusVariant] = useState<'success' | 'error'>('success');
  const [testResult, setTestResult] = useState<AiConnectionTestResult | null>(null);
  // Bumped on every load, so a slower earlier load can't overwrite a newer one.
  const loadSeqRef = useRef(0);
  // Bumped whenever the credentials change, so a probe only reports on the
  // credentials it actually tested.
  const testSeqRef = useRef(0);

  /** Retires any in-flight probe and clears its result. */
  const invalidateTest = useCallback(() => {
    testSeqRef.current++;
    setTestResult(null);
    setTesting(false);
  }, []);

  const loadSettings = useCallback(async () => {
    const seq = ++loadSeqRef.current;
    invalidateTest();
    setLoading(true);
    setLoadError(null);
    setInitial(null);
    try {
      const response = await client.getSettings();
      if (seq !== loadSeqRef.current) return;
      invalidateTest();
      setInitial(response);
      setForm(toFormState(response));
    } catch (err) {
      if (seq !== loadSeqRef.current) return;
      setLoadError(errorMessage(err));
    } finally {
      if (seq === loadSeqRef.current) setLoading(false);
    }
  }, [client, invalidateTest]);

  useEffect(() => {
    const counter = loadSeqRef;
    loadSettings();
    return () => {
      counter.current++;
    };
  }, [loadSettings]);

  const apiKeyPresent = initial?.credentials.api_key_present ?? false;
  const isOllama = form.provider === 'ollama';

  const updateCredentials = useCallback(
    (patch: Partial<Pick<FormState, 'provider' | 'api_key' | 'base_url' | 'default_model'>>) => {
      invalidateTest();
      setForm((prev) => ({ ...prev, ...patch }));
    },
    [invalidateTest],
  );

  const handleProviderChange = useCallback(
    (provider: string) => {
      // Reset the typed key + last probe result so we don't silently ship
      // an OpenAI key to an Ollama base URL (or the other way around).
      updateCredentials({ provider, api_key: '' });
    },
    [updateCredentials],
  );

  const updateOverride = useCallback(
    (key: string, patch: Partial<Pick<AiFeatureOverride, 'model' | 'instructions'>>) => {
      setForm((prev) => ({
        ...prev,
        overrides: prev.overrides.map((override) =>
          override.feature_key === key ? { ...override, ...patch } : override,
        ),
      }));
    },
    [],
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setSaving(true);
      setErrors({});
      setStatus(null);
      try {
        const response = await client.updateSettings(toUpdatePayload(form));
        invalidateTest();
        setInitial(response);
        setForm(toFormState(response));
        setStatus('Settings saved.');
        setStatusVariant('success');
      } catch (err) {
        setStatusVariant('error');
        if (err instanceof AiApiError && err.status === 422) {
          const body = err.body as { errors?: FormErrors; message?: string };
          setErrors(body?.errors ?? {});
          setStatus(body?.message ?? err.message);
        } else {
          setStatus(errorMessage(err));
        }
      } finally {
        setSaving(false);
      }
    },
    [client, form, invalidateTest],
  );

  const handleTest = useCallback(async () => {
    const seq = ++testSeqRef.current;
    setTesting(true);
    setTestResult(null);
    let result: AiConnectionTestResult;
    try {
      result = await client.testConnection(toCredentials(form));
    } catch (err) {
      if (err instanceof AiApiError) {
        const body = err.body as AiConnectionTestResult | null;
        result = body ?? { result: 'error', message: err.message };
      } else {
        result = { result: 'error', message: errorMessage(err) };
      }
    }
    if (seq !== testSeqRef.current) return;
    setTestResult(result);
    setTesting(false);
  }, [client, form]);

  if (loading) {
    return <Loading size="sm">Loading AI settings…</Loading>;
  }

  if (loadError !== null || initial === null) {
    return (
      <Alert
        color="error"
        title="The AI settings couldn't be loaded."
        description={loadError ?? undefined}
        actions={
          <Button variant="outline" color="neutral" size="sm" onClick={loadSettings}>
            Retry
          </Button>
        }
      />
    );
  }

  return (
    <Form
      onSubmit={handleSubmit}
      data-testid="ai-settings-page"
      noValidate
      actions={
        <Button type="submit" color="primary" loading={saving}>
          Save settings
        </Button>
      }
    >
      {heading ? <Heading level={2}>{heading}</Heading> : null}

      {status ? (
        <Alert color={statusVariant === 'error' ? 'error' : 'success'} description={status} />
      ) : null}

      <Fieldset title="Credentials" disabled={saving}>
        <Select
          label="Provider"
          options={providers}
          value={form.provider}
          onValueChange={(provider) => handleProviderChange(String(provider))}
          error={fieldError(errors, 'provider')}
        />

        {!isOllama ? (
          <Password
            label="API key"
            hint={apiKeyPresent ? 'Leave blank to keep the stored key.' : undefined}
            autocomplete="new-password"
            value={form.api_key}
            onValueChange={(api_key) => updateCredentials({ api_key })}
            placeholder={apiKeyPresent ? '••••••••' : 'sk-…'}
            error={fieldError(errors, 'api_key')}
          />
        ) : null}

        <Input
          type="url"
          label="Base URL"
          hint={isOllama ? 'Required for Ollama.' : 'Optional.'}
          required={isOllama}
          value={form.base_url}
          onValueChange={(base_url) => updateCredentials({ base_url })}
          placeholder={isOllama ? 'http://localhost:11434' : 'https://api.example.com/v1'}
          error={fieldError(errors, 'base_url')}
        />

        <Input
          label="Default model"
          value={form.default_model}
          onValueChange={(default_model) => updateCredentials({ default_model })}
          placeholder="gpt-4o-mini"
          error={fieldError(errors, 'default_model')}
        />

        <Stack orientation="horizontal" gap="2" align="center" wrap>
          <Button
            variant="outline"
            color="neutral"
            size="sm"
            onClick={handleTest}
            loading={testing}
          >
            Test connection
          </Button>
          {testResult ? (
            <Text
              as="span"
              size="sm"
              role="status"
              tone={testResult.result === 'ok' ? 'success' : 'error'}
            >
              {testResult.message ?? (testResult.result === 'ok' ? 'OK' : 'Failed')}
            </Text>
          ) : null}
        </Stack>
      </Fieldset>

      {form.overrides.length > 0 ? (
        <Fieldset title="Per-feature overrides" disabled={saving}>
          {form.overrides.map((override) => (
            <Card
              key={override.feature_key}
              title={`${override.package} · ${override.feature_key}`}
            >
              <Stack gap="3">
                <Input
                  size="sm"
                  label="Model"
                  value={override.model ?? ''}
                  onValueChange={(model) =>
                    updateOverride(override.feature_key, { model: model === '' ? null : model })
                  }
                  placeholder="inherit default"
                />
                <Textarea
                  label="Instructions"
                  rows={3}
                  value={override.instructions ?? ''}
                  onValueChange={(instructions) =>
                    updateOverride(override.feature_key, {
                      instructions: instructions === '' ? null : instructions,
                    })
                  }
                />
              </Stack>
            </Card>
          ))}
        </Fieldset>
      ) : null}
    </Form>
  );
}
