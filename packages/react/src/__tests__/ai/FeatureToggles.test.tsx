import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { FeatureToggles } from '../../components/ai/FeatureToggles/FeatureToggles';
import { createMockClient } from './testClient';
import type { AiFeature } from '../../components/ai/types';

const features: AiFeature[] = [
  { key: 'summarize', package: 'core', label: 'Summarize', description: 'Short summaries', enabled: true },
  { key: 'chat', package: 'core', label: 'Chat', description: null, enabled: false },
];

describe('FeatureToggles', () => {
  it('renders each registered feature and its enabled state', async () => {
    const client = createMockClient({
      getFeatures: vi.fn().mockResolvedValue({ features }),
    });

    render(<FeatureToggles client={client} heading="AI Features" />);

    expect(await screen.findByText('Summarize')).toBeInTheDocument();
    expect(screen.getByText('Chat')).toBeInTheDocument();

    const summarizeToggle = screen.getByLabelText('Toggle Summarize') as HTMLInputElement;
    const chatToggle = screen.getByLabelText('Toggle Chat') as HTMLInputElement;
    expect(summarizeToggle.checked).toBe(true);
    expect(chatToggle.checked).toBe(false);
  });

  it('flips a toggle via POST /features/{key}/toggle and fires onToggle', async () => {
    const toggle = vi.fn().mockResolvedValue({ feature: { key: 'chat', package: 'core', enabled: true } });
    const client = createMockClient({
      getFeatures: vi.fn().mockResolvedValue({ features }),
      toggleFeature: toggle,
    });
    const onToggle = vi.fn();

    render(<FeatureToggles client={client} onToggle={onToggle} />);

    const chatToggle = (await screen.findByLabelText('Toggle Chat')) as HTMLInputElement;
    await act(async () => {
      fireEvent.click(chatToggle);
    });

    expect(toggle).toHaveBeenCalledWith('chat', true);
    await waitFor(() => expect(onToggle).toHaveBeenCalledWith({ key: 'chat', package: 'core', enabled: true }));
  });

  it('rolls the switch back and surfaces the error when the API rejects', async () => {
    const client = createMockClient({
      getFeatures: vi.fn().mockResolvedValue({ features }),
      toggleFeature: vi.fn().mockRejectedValue(new Error('Boom')),
    });

    render(<FeatureToggles client={client} />);

    const summarizeToggle = (await screen.findByLabelText('Toggle Summarize')) as HTMLInputElement;
    await act(async () => {
      fireEvent.click(summarizeToggle);
    });

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Boom'));
    expect((screen.getByLabelText('Toggle Summarize') as HTMLInputElement).checked).toBe(true);
  });

  it('renders empty state when no features are registered', async () => {
    const client = createMockClient({
      getFeatures: vi.fn().mockResolvedValue({ features: [] }),
    });

    render(<FeatureToggles client={client} />);

    expect(await screen.findByText('No AI features registered.')).toBeInTheDocument();
  });
});
