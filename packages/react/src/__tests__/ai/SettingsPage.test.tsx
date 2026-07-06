import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { SettingsPage } from '../../components/ai/SettingsPage/SettingsPage';
import { AiApiError } from '../../components/ai/createAiApiClient';
import { createMockClient } from './testClient';
import type { AiSettingsResponse } from '../../components/ai/types';

const baseResponse: AiSettingsResponse = {
  credentials: {
    provider: 'openai',
    api_key_present: true,
    base_url: null,
    default_model: 'gpt-4o-mini',
  },
  feature_overrides: [
    { feature_key: 'summarize', package: 'core', model: null, instructions: null },
  ],
};

describe('SettingsPage', () => {
  it('loads and renders the current settings', async () => {
    const client = createMockClient({ getSettings: vi.fn().mockResolvedValue(baseResponse) });

    render(<SettingsPage client={client} heading="AI Settings" />);

    expect(await screen.findByRole('heading', { name: 'AI Settings' })).toBeInTheDocument();
    expect(screen.getByDisplayValue('gpt-4o-mini')).toBeInTheDocument();
    expect(screen.getByText(/leave blank to keep the stored key/)).toBeInTheDocument();
  });

  it('submits the form via PUT /settings and shows a success status', async () => {
    const update = vi.fn().mockResolvedValue({
      ...baseResponse,
      credentials: { ...baseResponse.credentials, default_model: 'gpt-4o' },
    });
    const client = createMockClient({
      getSettings: vi.fn().mockResolvedValue(baseResponse),
      updateSettings: update,
    });

    render(<SettingsPage client={client} />);

    const modelInput = (await screen.findByDisplayValue('gpt-4o-mini')) as HTMLInputElement;
    fireEvent.change(modelInput, { target: { value: 'gpt-4o' } });

    await act(async () => {
      fireEvent.submit(screen.getByTestId('ai-settings-page'));
    });

    await waitFor(() => expect(update).toHaveBeenCalled());
    const payload = update.mock.calls[0][0];
    expect(payload.default_model).toBe('gpt-4o');
    expect(payload.api_key).toBeNull();
    expect(await screen.findByText('Settings saved.')).toBeInTheDocument();
  });

  it('renders per-field validation errors returned from a 422', async () => {
    const client = createMockClient({
      getSettings: vi.fn().mockResolvedValue(baseResponse),
      updateSettings: vi
        .fn()
        .mockRejectedValue(
          new AiApiError(
            422,
            { message: 'Validation failed.', errors: { api_key: ['An API key is required.'] } },
            'Validation failed.',
          ),
        ),
    });

    render(<SettingsPage client={client} />);
    await screen.findByDisplayValue('gpt-4o-mini');

    await act(async () => {
      fireEvent.submit(screen.getByTestId('ai-settings-page'));
    });

    expect(await screen.findByText('An API key is required.')).toBeInTheDocument();
  });

  it('probes the provider via test-connection and surfaces the result', async () => {
    const client = createMockClient({
      getSettings: vi.fn().mockResolvedValue(baseResponse),
      testConnection: vi
        .fn()
        .mockResolvedValue({ result: 'ok', message: 'Connected', provider: 'openai' }),
    });

    render(<SettingsPage client={client} />);
    await screen.findByDisplayValue('gpt-4o-mini');

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Test connection/ }));
    });

    expect(await screen.findByText('Connected')).toBeInTheDocument();
  });

  it('clears the typed api_key and last probe result when switching providers', async () => {
    const testConnection = vi
      .fn()
      .mockResolvedValue({ result: 'ok', message: 'Connected', provider: 'openai' });
    const client = createMockClient({
      getSettings: vi.fn().mockResolvedValue(baseResponse),
      testConnection,
    });

    render(<SettingsPage client={client} />);
    await screen.findByDisplayValue('gpt-4o-mini');

    const apiKeyInput = screen.getByPlaceholderText('••••••••') as HTMLInputElement;
    fireEvent.change(apiKeyInput, { target: { value: 'sk-secret' } });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Test connection/ }));
    });
    await screen.findByText('Connected');

    const providerSelect = screen.getByRole('combobox') as HTMLSelectElement;
    fireEvent.change(providerSelect, { target: { value: 'ollama' } });

    // API key field is hidden for Ollama; probe result is cleared.
    expect(screen.queryByPlaceholderText('••••••••')).not.toBeInTheDocument();
    expect(screen.queryByText('Connected')).not.toBeInTheDocument();

    // Re-probe should not ship the stale OpenAI key to the ollama base URL.
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Test connection/ }));
    });
    const lastCall = testConnection.mock.calls.at(-1)?.[0];
    expect(lastCall.provider).toBe('ollama');
    expect(lastCall.api_key).toBeNull();
  });

  it('renders a network error inside an error alert, not a success alert', async () => {
    const client = createMockClient({
      getSettings: vi.fn().mockResolvedValue(baseResponse),
      updateSettings: vi.fn().mockRejectedValue(new Error('Network down')),
    });

    render(<SettingsPage client={client} />);
    await screen.findByDisplayValue('gpt-4o-mini');

    await act(async () => {
      fireEvent.submit(screen.getByTestId('ai-settings-page'));
    });

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Network down');
    expect(alert).toHaveClass('alert-error');
    expect(alert).not.toHaveClass('alert-success');
  });
});
