import { act, fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  SpotlightSearch,
  type SpotlightItem,
} from '../../components/navigation/SpotlightSearch/SpotlightSearch';

const items: SpotlightItem[] = [
  { key: 'home', label: 'Go to Home', group: 'Pages', icon: 'house' },
  { key: 'reports', label: 'Reports', group: 'Pages', keywords: ['analytics'] },
  { key: 'settings', label: 'Open Settings', description: 'Preferences', group: 'Actions' },
];

const part = (name: string) =>
  document.querySelector(`[data-scope="spotlight"][data-part="${name}"]`);
const panel = () => document.querySelector('.apui-spotlight') as HTMLElement;
const query = () => part('query') as HTMLInputElement;
const shown = () =>
  [...document.querySelectorAll('[data-part="item"]:not([hidden])')].map((el) =>
    el.getAttribute('data-value'),
  );

/** Fires an event and lets the machines settle: Zag sends its updates in a microtask. */
const interact = (fire: () => void) =>
  act(async () => {
    fire();
  });

const typeQuery = (text: string) =>
  interact(() => fireEvent.change(query(), { target: { value: text } }));

describe('SpotlightSearch (deprecated alias of Spotlight)', () => {
  it('renders a Spotlight with the items grouped, and warns once', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<SpotlightSearch open onClose={vi.fn()} portal={false} items={items} />);
    expect(panel()).not.toHaveAttribute('hidden');
    expect(shown()).toEqual(['home', 'reports', 'settings']);
    const groups = [...document.querySelectorAll('[data-part="item-group-label"]')].map(
      (el) => el.textContent,
    );
    expect(groups).toEqual(['Pages', 'Actions']);
    expect(document.querySelector('.modal, .menu, .input')).toBeNull();
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('SpotlightSearch is deprecated; use Spotlight.'),
    );
    warn.mockRestore();
  });

  it('filters with the 1.x word filter across label, description and keywords', async () => {
    render(<SpotlightSearch open onClose={vi.fn()} portal={false} items={items} />);
    await typeQuery('prefer');
    expect(shown()).toEqual(['settings']);
    await typeQuery('analytics');
    expect(shown()).toEqual(['reports']);
  });

  it('applies filterFn and maxResults', async () => {
    render(
      <SpotlightSearch
        open
        onClose={vi.fn()}
        portal={false}
        items={items}
        maxResults={1}
        filterFn={(item, q) => item.key.startsWith(q)}
      />,
    );
    expect(shown()).toEqual(['home']);
    await typeQuery('s');
    expect(shown()).toEqual(['settings']);
  });

  it('maps emptyMessage to the empty state', async () => {
    render(
      <SpotlightSearch
        open
        onClose={vi.fn()}
        portal={false}
        items={items}
        emptyMessage="Nothing here"
      />,
    );
    await typeQuery('zzz');
    expect(part('empty')).toHaveTextContent('Nothing here');
    expect(part('empty')).not.toHaveAttribute('hidden');
  });

  it('calls onSelect with the original item and onClose', async () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    render(
      <SpotlightSearch open onClose={onClose} onSelect={onSelect} portal={false} items={items} />,
    );
    await interact(() => fireEvent.click(document.querySelector('[data-value="reports"]')!));
    expect(onSelect).toHaveBeenCalledWith(items[1]);
    expect(onClose).toHaveBeenCalled();
  });

  it('turns the shortcut off with shortcut={false}', async () => {
    const onClose = vi.fn();
    render(
      <SpotlightSearch open onClose={onClose} portal={false} items={items} shortcut={false} />,
    );
    await interact(() => fireEvent.keyDown(window, { key: 'k', code: 'KeyK', ctrlKey: true }));
    await interact(() => fireEvent.keyDown(window, { key: 'k', code: 'KeyK', metaKey: true }));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes with the shortcut by default', async () => {
    const onClose = vi.fn();
    render(<SpotlightSearch open onClose={onClose} portal={false} items={items} />);
    await interact(() => fireEvent.keyDown(window, { key: 'k', code: 'KeyK', ctrlKey: true }));
    await interact(() => fireEvent.keyDown(window, { key: 'k', code: 'KeyK', metaKey: true }));
    expect(onClose).toHaveBeenCalled();
  });
});
