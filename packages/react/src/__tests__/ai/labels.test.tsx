import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import {
  FEATURE_TOGGLES_LABELS,
  FeatureToggles,
  SETTINGS_PAGE_LABELS,
  SettingsPage,
  USAGE_DASHBOARD_LABELS,
  UsageDashboard,
} from '../../components/ai';
import { createMockClient, deferred } from './testClient';
import type { AiSettingsResponse, AiUsageResponse } from '../../components/ai/types';

const settings: AiSettingsResponse = {
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

const usage: AiUsageResponse = {
  range: { from: '2026-07-01', to: '2026-07-31' },
  totals: { requests: 1, input_tokens: 2, output_tokens: 3, total_tokens: 5, cost: 0.1 },
  by_feature: [],
  daily: [],
};

describe('AI component labels', () => {
  it('exports complete English defaults', () => {
    for (const labels of [SETTINGS_PAGE_LABELS, USAGE_DASHBOARD_LABELS, FEATURE_TOGGLES_LABELS]) {
      for (const value of Object.values(labels)) expect(value).not.toBe('');
    }
  });

  it('translates the SettingsPage loading state', () => {
    const client = createMockClient({ getSettings: vi.fn(() => deferred<never>().promise) });
    render(<SettingsPage client={client} labels={{ loading: 'Chargement…' }} />);
    expect(screen.getByText('Chargement…')).toBeInTheDocument();
  });

  it("translates the SettingsPage form, and keeps a missing key's default", async () => {
    const client = createMockClient({
      getSettings: vi.fn().mockResolvedValue(settings),
      updateSettings: vi.fn().mockResolvedValue(settings),
    });
    render(
      <SettingsPage
        client={client}
        labels={{
          credentials: 'Identifiants',
          provider: 'Fournisseur',
          apiKey: 'Clé API',
          apiKeyStored: 'Laissez vide pour garder la clé.',
          baseUrl: 'URL de base',
          baseUrlOptional: 'Facultatif.',
          defaultModel: 'Modèle par défaut',
          testConnection: 'Tester la connexion',
          overrides: 'Par fonctionnalité',
          model: 'Modèle',
          modelPlaceholder: 'hérite',
          instructions: 'Consignes',
          save: 'Enregistrer',
          saved: 'Enregistré.',
        }}
      />,
    );
    expect(await screen.findByRole('group', { name: 'Identifiants' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Fournisseur' })).toBeInTheDocument();
    expect(screen.getByLabelText('Clé API')).toBeInTheDocument();
    expect(screen.getByText('Laissez vide pour garder la clé.')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'URL de base' })).toBeInTheDocument();
    expect(screen.getByText('Facultatif.')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Modèle par défaut' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tester la connexion' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Par fonctionnalité' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Modèle' })).toHaveAttribute(
      'placeholder',
      'hérite',
    );
    expect(screen.getByRole('textbox', { name: 'Consignes' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }));
    expect(await screen.findByText('Enregistré.')).toBeInTheDocument();
  });

  it('translates the SettingsPage load failure, retry and error fallback', async () => {
    const client = createMockClient({ getSettings: vi.fn().mockRejectedValue(null) });
    render(
      <SettingsPage
        client={client}
        labels={{ loadFailed: 'Échec du chargement.', retry: 'Réessayer', error: 'Erreur.' }}
      />,
    );
    expect(await screen.findByText('Échec du chargement.')).toBeInTheDocument();
    expect(screen.getByText('Erreur.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Réessayer' })).toBeInTheDocument();
  });

  it('translates the connection test results without a server message', async () => {
    const client = createMockClient({
      getSettings: vi.fn().mockResolvedValue(settings),
      testConnection: vi.fn().mockResolvedValue({ result: 'ok' }),
    });
    render(<SettingsPage client={client} labels={{ testOk: 'Connecté' }} />);
    fireEvent.click(await screen.findByRole('button', { name: 'Test connection' }));
    expect(await screen.findByText('Connecté')).toBeInTheDocument();
  });

  it('shows the testFailed label for a failure without a message', async () => {
    const client = createMockClient({
      getSettings: vi.fn().mockResolvedValue(settings),
      testConnection: vi.fn().mockRejectedValue(new Error('')),
    });
    render(<SettingsPage client={client} labels={{ testFailed: 'Échec' }} />);
    fireEvent.click(await screen.findByRole('button', { name: 'Test connection' }));
    expect(await screen.findByText('Échec')).toBeInTheDocument();
  });

  it('translates the UsageDashboard loading state', () => {
    const client = createMockClient({ getUsage: vi.fn(() => deferred<never>().promise) });
    render(<UsageDashboard client={client} labels={{ loading: 'Chargement…' }} />);
    expect(screen.getByText('Chargement…')).toBeInTheDocument();
  });

  it('translates the UsageDashboard totals, tables, headers and live note', async () => {
    const client = createMockClient({
      getUsage: vi.fn().mockResolvedValue({
        ...usage,
        by_feature: [
          {
            feature_key: 'summarize',
            requests: 1,
            input_tokens: 2,
            output_tokens: 3,
            total_tokens: 5,
            cost: 0.1,
          },
        ],
      }),
    });
    render(
      <UsageDashboard
        client={client}
        refreshInterval={15_000}
        labels={{
          requests: 'Requêtes',
          inputTokens: 'Jetons entrants',
          byFeature: 'Par fonctionnalité',
          feature: 'Fonctionnalité',
          noDailyUsage: 'Rien par jour.',
          live: 'En direct · toutes les :seconds s',
        }}
      />,
    );
    expect(await screen.findByText('Jetons entrants')).toBeInTheDocument();
    const byFeature = screen.getByRole('table', { name: 'Par fonctionnalité' });
    expect(within(byFeature).getByRole('columnheader', { name: 'Fonctionnalité' })).toBeTruthy();
    expect(within(byFeature).getByRole('columnheader', { name: 'Requêtes' })).toBeTruthy();
    expect(within(byFeature).getByRole('columnheader', { name: 'Cost' })).toBeTruthy();
    expect(screen.getByText('Rien par jour.')).toBeInTheDocument();
    expect(screen.getByText('En direct · toutes les 15 s')).toBeInTheDocument();
  });

  it('translates the UsageDashboard error fallback', async () => {
    const client = createMockClient({ getUsage: vi.fn().mockRejectedValue(null) });
    render(<UsageDashboard client={client} labels={{ error: 'Erreur.' }} />);
    expect(await screen.findByText('Erreur.')).toBeInTheDocument();
  });

  it('translates the FeatureToggles loading, empty and error states', async () => {
    const pending = createMockClient({ getFeatures: vi.fn(() => deferred<never>().promise) });
    const { unmount } = render(
      <FeatureToggles client={pending} labels={{ loading: 'Chargement…' }} />,
    );
    expect(screen.getByText('Chargement…')).toBeInTheDocument();
    unmount();

    const empty = createMockClient({ getFeatures: vi.fn().mockResolvedValue({ features: [] }) });
    const second = render(<FeatureToggles client={empty} labels={{ empty: 'Aucune.' }} />);
    expect(await screen.findByText('Aucune.')).toBeInTheDocument();
    second.unmount();

    const failing = createMockClient({ getFeatures: vi.fn().mockRejectedValue(null) });
    render(<FeatureToggles client={failing} labels={{ error: 'Erreur.' }} />);
    expect(await screen.findByText('Erreur.')).toBeInTheDocument();
  });
});
