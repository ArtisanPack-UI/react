/** @module ai/SettingsPage */

import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  AiApiClient,
  AiConnectionTestResult,
  AiFeatureOverride,
  AiSettingsResponse,
  AiSettingsUpdate,
} from '../types';
import { AiApiError } from '../createAiApiClient';

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

function toUpdatePayload(form: FormState): AiSettingsUpdate {
  return {
    provider: form.provider,
    api_key: form.api_key === '' ? null : form.api_key,
    base_url: form.base_url === '' ? null : form.base_url,
    default_model: form.default_model === '' ? null : form.default_model,
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
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<AiConnectionTestResult | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    client
      .getSettings()
      .then((response) => {
        if (cancelled) return;
        setInitial(response);
        setForm(toFormState(response));
      })
      .catch((err: Error) => {
        if (!cancelled) setStatus(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [client]);

  const apiKeyPresent = initial?.credentials.api_key_present ?? false;
  const isOllama = form.provider === 'ollama';

  const overrideByKey = useMemo(() => {
    const map = new Map<string, AiFeatureOverride>();
    for (const override of form.overrides) {
      map.set(override.feature_key, override);
    }
    return map;
  }, [form.overrides]);

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
        setInitial(response);
        setForm(toFormState(response));
        setStatus('Settings saved.');
      } catch (err) {
        if (err instanceof AiApiError && err.status === 422) {
          const body = err.body as { errors?: FormErrors; message?: string };
          setErrors(body?.errors ?? {});
          setStatus(body?.message ?? err.message);
        } else {
          setStatus((err as Error).message);
        }
      } finally {
        setSaving(false);
      }
    },
    [client, form],
  );

  const handleTest = useCallback(async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const result = await client.testConnection({
        provider: form.provider,
        api_key: form.api_key === '' ? null : form.api_key,
        base_url: form.base_url === '' ? null : form.base_url,
        default_model: form.default_model === '' ? null : form.default_model,
      });
      setTestResult(result);
    } catch (err) {
      if (err instanceof AiApiError) {
        const body = err.body as AiConnectionTestResult | null;
        setTestResult(body ?? { result: 'error', message: err.message });
      } else {
        setTestResult({ result: 'error', message: (err as Error).message });
      }
    } finally {
      setTesting(false);
    }
  }, [client, form.api_key, form.base_url, form.default_model, form.provider]);

  if (loading) {
    return (
      <div className="flex items-center gap-2" role="status" aria-live="polite">
        <span className="loading loading-spinner loading-sm" aria-hidden="true" />
        <span>Loading AI settings…</span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6"
      data-testid="ai-settings-page"
      noValidate
    >
      {heading ? <h2 className="text-lg font-semibold">{heading}</h2> : null}

      {status ? (
        <div
          role="status"
          aria-live="polite"
          className={Object.keys(errors).length > 0 ? 'alert alert-error' : 'alert alert-success'}
        >
          <span>{status}</span>
        </div>
      ) : null}

      <fieldset className="flex flex-col gap-3">
        <legend className="text-base font-medium">Credentials</legend>

        <label className="form-control flex flex-col gap-1">
          <span className="label-text">Provider</span>
          <select
            className="select select-bordered"
            value={form.provider}
            onChange={(e) => setForm((prev) => ({ ...prev, provider: e.target.value }))}
          >
            {providers.map((provider) => (
              <option key={provider} value={provider}>
                {provider}
              </option>
            ))}
          </select>
          {errors.provider?.map((message) => (
            <span key={message} className="label-text-alt text-error">
              {message}
            </span>
          ))}
        </label>

        {!isOllama ? (
          <label className="form-control flex flex-col gap-1">
            <span className="label-text">
              API key {apiKeyPresent ? '(leave blank to keep the stored key)' : ''}
            </span>
            <input
              type="password"
              autoComplete="off"
              className="input input-bordered"
              value={form.api_key}
              onChange={(e) => setForm((prev) => ({ ...prev, api_key: e.target.value }))}
              placeholder={apiKeyPresent ? '••••••••' : 'sk-…'}
            />
            {errors.api_key?.map((message) => (
              <span key={message} className="label-text-alt text-error">
                {message}
              </span>
            ))}
          </label>
        ) : null}

        <label className="form-control flex flex-col gap-1">
          <span className="label-text">Base URL {isOllama ? '(required)' : '(optional)'}</span>
          <input
            type="url"
            className="input input-bordered"
            value={form.base_url}
            onChange={(e) => setForm((prev) => ({ ...prev, base_url: e.target.value }))}
            placeholder={isOllama ? 'http://localhost:11434' : 'https://api.example.com/v1'}
          />
          {errors.base_url?.map((message) => (
            <span key={message} className="label-text-alt text-error">
              {message}
            </span>
          ))}
        </label>

        <label className="form-control flex flex-col gap-1">
          <span className="label-text">Default model</span>
          <input
            type="text"
            className="input input-bordered"
            value={form.default_model}
            onChange={(e) => setForm((prev) => ({ ...prev, default_model: e.target.value }))}
            placeholder="gpt-4o-mini"
          />
          {errors.default_model?.map((message) => (
            <span key={message} className="label-text-alt text-error">
              {message}
            </span>
          ))}
        </label>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={handleTest}
            disabled={testing}
          >
            {testing ? 'Testing…' : 'Test connection'}
          </button>
          {testResult ? (
            <span
              role="status"
              className={testResult.result === 'ok' ? 'text-sm text-success' : 'text-sm text-error'}
            >
              {testResult.message ?? (testResult.result === 'ok' ? 'OK' : 'Failed')}
            </span>
          ) : null}
        </div>
      </fieldset>

      {form.overrides.length > 0 ? (
        <fieldset className="flex flex-col gap-3">
          <legend className="text-base font-medium">Per-feature overrides</legend>
          {form.overrides.map((override) => {
            const current = overrideByKey.get(override.feature_key) ?? override;
            return (
              <div key={override.feature_key} className="rounded-box border border-base-300 p-3">
                <div className="text-sm font-medium">
                  {override.package} · {override.feature_key}
                </div>
                <label className="form-control mt-2 flex flex-col gap-1">
                  <span className="label-text">Model</span>
                  <input
                    type="text"
                    className="input input-bordered input-sm"
                    value={current.model ?? ''}
                    onChange={(e) =>
                      updateOverride(override.feature_key, {
                        model: e.target.value === '' ? null : e.target.value,
                      })
                    }
                    placeholder="inherit default"
                  />
                </label>
                <label className="form-control mt-2 flex flex-col gap-1">
                  <span className="label-text">Instructions</span>
                  <textarea
                    className="textarea textarea-bordered"
                    rows={3}
                    value={current.instructions ?? ''}
                    onChange={(e) =>
                      updateOverride(override.feature_key, {
                        instructions: e.target.value === '' ? null : e.target.value,
                      })
                    }
                  />
                </label>
              </div>
            );
          })}
        </fieldset>
      ) : null}

      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save settings'}
        </button>
      </div>
    </form>
  );
}
