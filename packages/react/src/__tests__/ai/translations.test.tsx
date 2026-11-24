import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { TranslationProvider } from '../../i18n/translator';
import {
  FEATURE_TOGGLES_LABELS,
  FeatureToggles,
  SETTINGS_PAGE_LABELS,
  SettingsPage,
  USAGE_DASHBOARD_LABELS,
  UsageDashboard,
} from '../../components/ai';
import { createMockClient, deferred } from './testClient';
import type { AiUsageResponse } from '../../components/ai/types';

const messages = {
  'Loading AI settings…': 'Cargando ajustes de IA…',
  'Loading features…': 'Cargando funciones…',
  'No AI features registered.': 'No hay funciones de IA registradas.',
  Requests: 'Solicitudes',
};

const inSpanish = (ui: ReactNode) =>
  render(
    <TranslationProvider locale="es" messages={messages}>
      {ui}
    </TranslationProvider>,
  );

const usage: AiUsageResponse = {
  range: { from: '2026-07-01', to: '2026-07-31' },
  totals: { requests: 1234, input_tokens: 2, output_tokens: 3, total_tokens: 5, cost: 0.1 },
  by_feature: [],
  daily: [],
};

describe('AI translations', () => {
  it('keeps the exported English defaults', () => {
    expect(SETTINGS_PAGE_LABELS.loading).toBe('Loading AI settings…');
    expect(USAGE_DASHBOARD_LABELS.live).toBe('Live · refreshing every :seconds s');
    expect(FEATURE_TOGGLES_LABELS.empty).toBe('No AI features registered.');
  });

  it('translates the SettingsPage text, and labels win', () => {
    const client = createMockClient({ getSettings: vi.fn(() => deferred<never>().promise) });
    const { unmount } = inSpanish(<SettingsPage client={client} />);
    expect(screen.getByText('Cargando ajustes de IA…')).toBeInTheDocument();
    unmount();
    inSpanish(<SettingsPage client={client} labels={{ loading: 'Espere…' }} />);
    expect(screen.getByText('Espere…')).toBeInTheDocument();
  });

  it('translates the FeatureToggles empty state', async () => {
    const client = createMockClient({ getFeatures: vi.fn().mockResolvedValue({ features: [] }) });
    inSpanish(<FeatureToggles client={client} />);
    expect(await screen.findByText('No hay funciones de IA registradas.')).toBeInTheDocument();
  });

  it("formats the UsageDashboard figures in the provider's locale", async () => {
    const client = createMockClient({ getUsage: vi.fn().mockResolvedValue(usage) });
    render(
      <TranslationProvider locale="de" messages={{ Requests: 'Anfragen' }}>
        <UsageDashboard client={client} />
      </TranslationProvider>,
    );
    expect((await screen.findAllByText('Anfragen')).length).toBeGreaterThan(0);
    expect(screen.getByText('1.234')).toBeInTheDocument();
  });
});
