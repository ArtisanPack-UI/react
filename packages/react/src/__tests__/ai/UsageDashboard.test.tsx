import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UsageDashboard } from '../../components/ai/UsageDashboard/UsageDashboard';
import { createMockClient } from './testClient';
import type { AiUsageResponse } from '../../components/ai/types';

const usage: AiUsageResponse = {
  range: { from: '2026-07-01T00:00:00+00:00', to: '2026-07-31T23:59:59+00:00' },
  totals: {
    requests: 12,
    input_tokens: 1000,
    output_tokens: 500,
    total_tokens: 1500,
    cost: 0.42,
  },
  by_feature: [
    {
      feature_key: 'summarize',
      requests: 8,
      input_tokens: 800,
      output_tokens: 300,
      total_tokens: 1100,
      cost: 0.3,
    },
  ],
  daily: [
    {
      period: '2026-07-01',
      requests: 5,
      input_tokens: 500,
      output_tokens: 250,
      total_tokens: 750,
      cost: 0.21,
    },
  ],
};

describe('UsageDashboard', () => {
  it('renders totals, by_feature, and daily buckets from GET /usage', async () => {
    const client = createMockClient({ getUsage: vi.fn().mockResolvedValue(usage) });

    render(<UsageDashboard client={client} heading="Usage" />);

    expect(await screen.findByText('Usage')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('summarize')).toBeInTheDocument();
    expect(screen.getByText('2026-07-01')).toBeInTheDocument();
  });

  it('forwards from/to as query params to the API client', async () => {
    const getUsage = vi.fn().mockResolvedValue(usage);
    const client = createMockClient({ getUsage });

    render(<UsageDashboard client={client} from="2026-07-01" to="2026-07-15" />);

    await screen.findByText('12');
    expect(getUsage).toHaveBeenCalledWith({ from: '2026-07-01', to: '2026-07-15' });
  });

  it('polls at refreshInterval for live updates', async () => {
    vi.useFakeTimers();
    const getUsage = vi.fn().mockResolvedValue(usage);
    const client = createMockClient({ getUsage });

    render(<UsageDashboard client={client} refreshInterval={1000} />);

    await vi.waitFor(() => expect(getUsage).toHaveBeenCalledTimes(1));

    await vi.advanceTimersByTimeAsync(3000);
    expect(getUsage).toHaveBeenCalledTimes(4);

    vi.useRealTimers();
  });

  it('surfaces a fetch error when the initial load fails', async () => {
    const client = createMockClient({ getUsage: vi.fn().mockRejectedValue(new Error('Nope')) });

    render(<UsageDashboard client={client} />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Nope');
  });
});
