import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { SettingsPage } from '../../components/ai/SettingsPage/SettingsPage';
import { AiApiError } from '../../components/ai/createAiApiClient';
import { createMockClient, deferred } from './testClient';
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
    expect(screen.getByText(/leave blank to keep the stored key/i)).toBeInTheDocument();
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
      fireEvent.click(screen.getByRole('button', { name: 'Save settings' }));
    });

    await waitFor(() => expect(update).toHaveBeenCalled());
    const payload = update.mock.calls[0][0];
    expect(payload.default_model).toBe('gpt-4o');
    // A blank key field means "keep the stored key", so the key is omitted.
    expect(payload).not.toHaveProperty('api_key');
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
      fireEvent.click(screen.getByRole('button', { name: 'Save settings' }));
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
    expect(lastCall).not.toHaveProperty('api_key');
  });

  it('renders a network error inside an error alert, not a success alert', async () => {
    const client = createMockClient({
      getSettings: vi.fn().mockResolvedValue(baseResponse),
      updateSettings: vi.fn().mockRejectedValue(new Error('Network down')),
    });

    render(<SettingsPage client={client} />);
    await screen.findByDisplayValue('gpt-4o-mini');

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Save settings' }));
    });

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Network down');
    expect(alert).toHaveAttribute('data-color', 'error');
  });

  it('shows a retry instead of an editable form when settings fail to load', async () => {
    const getSettings = vi
      .fn()
      .mockRejectedValueOnce(new Error('Server unavailable'))
      .mockResolvedValueOnce(baseResponse);
    const updateSettings = vi.fn();
    const client = createMockClient({ getSettings, updateSettings });

    render(<SettingsPage client={client} />);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Server unavailable');
    expect(screen.queryByRole('button', { name: 'Save settings' })).not.toBeInTheDocument();
    expect(screen.queryByTestId('ai-settings-page')).not.toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    });

    expect(await screen.findByDisplayValue('gpt-4o-mini')).toBeInTheDocument();
    expect(getSettings).toHaveBeenCalledTimes(2);
    expect(updateSettings).not.toHaveBeenCalled();
  });

  it('sends a typed api_key and locks the fields while a save is pending', async () => {
    const save = deferred<AiSettingsResponse>();
    const updateSettings = vi.fn().mockReturnValue(save.promise);
    const client = createMockClient({
      getSettings: vi.fn().mockResolvedValue(baseResponse),
      updateSettings,
    });

    render(<SettingsPage client={client} />);
    await screen.findByDisplayValue('gpt-4o-mini');

    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'sk-new' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Save settings' }));
    });

    expect(updateSettings.mock.calls[0][0].api_key).toBe('sk-new');
    expect(screen.getByDisplayValue('gpt-4o-mini')).toBeDisabled();
    expect(screen.getByRole('combobox')).toBeDisabled();

    await act(async () => {
      save.resolve(baseResponse);
    });

    expect(await screen.findByText('Settings saved.')).toBeInTheDocument();
    expect(screen.getByDisplayValue('gpt-4o-mini')).not.toBeDisabled();
  });

  it('discards a connection result for credentials that changed mid-test', async () => {
    const probe = deferred<{ result: 'ok'; message: string }>();
    const client = createMockClient({
      getSettings: vi.fn().mockResolvedValue(baseResponse),
      testConnection: vi.fn().mockReturnValue(probe.promise),
    });

    render(<SettingsPage client={client} />);
    await screen.findByDisplayValue('gpt-4o-mini');

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Test connection/ }));
    });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'ollama' } });

    await act(async () => {
      probe.resolve({ result: 'ok', message: 'Connected' });
    });

    expect(screen.queryByText('Connected')).not.toBeInTheDocument();
  });

  it('keeps the form hidden when settings reject with a non-Error value', async () => {
    const client = createMockClient({ getSettings: vi.fn().mockRejectedValue(null) });

    render(<SettingsPage client={client} />);

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    expect(screen.queryByTestId('ai-settings-page')).not.toBeInTheDocument();
  });

  it('discards a connection result when the client changes mid-test', async () => {
    const probe = deferred<{ result: 'ok'; message: string }>();
    const first = createMockClient({
      getSettings: vi.fn().mockResolvedValue(baseResponse),
      testConnection: vi.fn().mockReturnValue(probe.promise),
    });
    const second = createMockClient({ getSettings: vi.fn().mockResolvedValue(baseResponse) });

    const { rerender } = render(<SettingsPage client={first} />);
    await screen.findByDisplayValue('gpt-4o-mini');
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Test connection/ }));
    });

    rerender(<SettingsPage client={second} />);
    await screen.findByDisplayValue('gpt-4o-mini');
    await act(async () => {
      probe.resolve({ result: 'ok', message: 'Connected' });
    });

    expect(screen.queryByText('Connected')).not.toBeInTheDocument();
  });

  it('discards a connection result when a save replaces the credentials mid-test', async () => {
    const probe = deferred<{ result: 'ok'; message: string }>();
    const client = createMockClient({
      getSettings: vi.fn().mockResolvedValue(baseResponse),
      updateSettings: vi.fn().mockResolvedValue({
        ...baseResponse,
        credentials: { ...baseResponse.credentials, provider: 'anthropic' },
      }),
      testConnection: vi.fn().mockReturnValue(probe.promise),
    });

    render(<SettingsPage client={client} />);
    await screen.findByDisplayValue('gpt-4o-mini');
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Test connection/ }));
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Save settings' }));
    });
    await screen.findByText('Settings saved.');
    await act(async () => {
      probe.resolve({ result: 'ok', message: 'Connected' });
    });

    expect(screen.queryByText('Connected')).not.toBeInTheDocument();
  });
});
