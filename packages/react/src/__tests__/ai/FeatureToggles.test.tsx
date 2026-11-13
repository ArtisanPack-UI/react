import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { FeatureToggles } from '../../components/ai/FeatureToggles/FeatureToggles';
import { createMockClient, deferred } from './testClient';
import type { AiFeature } from '../../components/ai/types';

const features: AiFeature[] = [
  {
    key: 'summarize',
    package: 'core',
    label: 'Summarize',
    description: 'Short summaries',
    enabled: true,
  },
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

    const summarizeToggle = screen.getByRole('switch', { name: 'Summarize' }) as HTMLInputElement;
    const chatToggle = screen.getByRole('switch', { name: 'Chat' }) as HTMLInputElement;
    expect(summarizeToggle.checked).toBe(true);
    expect(chatToggle.checked).toBe(false);
  });

  it('flips a toggle via POST /features/{key}/toggle and fires onToggle', async () => {
    const toggle = vi
      .fn()
      .mockResolvedValue({ feature: { key: 'chat', package: 'core', enabled: true } });
    const client = createMockClient({
      getFeatures: vi.fn().mockResolvedValue({ features }),
      toggleFeature: toggle,
    });
    const onToggle = vi.fn();

    render(<FeatureToggles client={client} onToggle={onToggle} />);

    const chatToggle = (await screen.findByRole('switch', { name: 'Chat' })) as HTMLInputElement;
    await act(async () => {
      fireEvent.click(chatToggle);
    });

    expect(toggle).toHaveBeenCalledWith('chat', true);
    await waitFor(() =>
      expect(onToggle).toHaveBeenCalledWith({ key: 'chat', package: 'core', enabled: true }),
    );
  });

  it('rolls the switch back and surfaces the error when the API rejects', async () => {
    const client = createMockClient({
      getFeatures: vi.fn().mockResolvedValue({ features }),
      toggleFeature: vi.fn().mockRejectedValue(new Error('Boom')),
    });

    render(<FeatureToggles client={client} />);

    const summarizeToggle = (await screen.findByRole('switch', {
      name: 'Summarize',
    })) as HTMLInputElement;
    await act(async () => {
      fireEvent.click(summarizeToggle);
    });

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Boom'));
    expect((screen.getByRole('switch', { name: 'Summarize' }) as HTMLInputElement).checked).toBe(
      true,
    );
  });

  it('clears a stale error after a subsequent successful toggle', async () => {
    const toggleFeature = vi
      .fn()
      .mockRejectedValueOnce(new Error('Boom'))
      .mockResolvedValueOnce({ feature: { key: 'chat', package: 'core', enabled: true } });
    const client = createMockClient({
      getFeatures: vi.fn().mockResolvedValue({ features }),
      toggleFeature,
    });

    render(<FeatureToggles client={client} />);

    const summarizeToggle = await screen.findByRole('switch', { name: 'Summarize' });
    await act(async () => {
      fireEvent.click(summarizeToggle);
    });
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Boom'));

    const chatToggle = screen.getByRole('switch', { name: 'Chat' });
    await act(async () => {
      fireEvent.click(chatToggle);
    });

    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());
  });

  it('renders empty state when no features are registered', async () => {
    const client = createMockClient({
      getFeatures: vi.fn().mockResolvedValue({ features: [] }),
    });

    render(<FeatureToggles client={client} />);

    expect(await screen.findByText('No AI features registered.')).toBeInTheDocument();
  });

  it('keeps the switch on when onToggle throws after a successful save', async () => {
    const client = createMockClient({
      getFeatures: vi.fn().mockResolvedValue({ features }),
      toggleFeature: vi
        .fn()
        .mockResolvedValue({ feature: { key: 'chat', package: 'core', enabled: true } }),
    });
    const onToggle = vi.fn(() => {
      throw new Error('callback failed');
    });
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<FeatureToggles client={client} onToggle={onToggle} />);
    const chatToggle = (await screen.findByRole('switch', { name: 'Chat' })) as HTMLInputElement;
    await act(async () => {
      fireEvent.click(chatToggle);
    });

    await waitFor(() => expect(onToggle).toHaveBeenCalled());
    expect(chatToggle.checked).toBe(true);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it("hides the previous client's features and ignores its late toggle results", async () => {
    const pendingToggle = deferred<never>();
    const first = createMockClient({
      getFeatures: vi.fn().mockResolvedValue({ features }),
      toggleFeature: vi.fn().mockReturnValue(pendingToggle.promise),
    });
    const secondFeatures = deferred<{ features: AiFeature[] }>();
    const second = createMockClient({
      getFeatures: vi.fn().mockReturnValue(secondFeatures.promise),
    });

    const { rerender } = render(<FeatureToggles client={first} />);
    const chatToggle = await screen.findByRole('switch', { name: 'Chat' });
    await act(async () => {
      fireEvent.click(chatToggle);
    });

    rerender(<FeatureToggles client={second} />);
    expect(screen.queryByRole('switch')).not.toBeInTheDocument();

    await act(async () => {
      secondFeatures.resolve({ features: [{ ...features[1], enabled: true }] });
    });
    const secondChat = (await screen.findByRole('switch', { name: 'Chat' })) as HTMLInputElement;

    await act(async () => {
      pendingToggle.reject(new Error('stale failure'));
    });

    expect(secondChat.checked).toBe(true);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
