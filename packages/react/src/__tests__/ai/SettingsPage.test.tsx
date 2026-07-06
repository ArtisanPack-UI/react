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
      updateSettings: vi.fn().mockRejectedValue(
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
});
