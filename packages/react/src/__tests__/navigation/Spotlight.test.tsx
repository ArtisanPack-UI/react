import { useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import {
  Spotlight,
  type SpotlightGroup,
  type SpotlightProps,
} from '../../components/navigation/Spotlight/Spotlight';

const declaredProps: (keyof SpotlightProps)[] = [
  'open',
  'defaultOpen',
  'groups',
  'search',
  'remote',
  'loading',
  'shortcut',
  'recent',
  'label',
  'placeholder',
  'emptyLabel',
  'loadingLabel',
  'recentLabel',
  'closeLabel',
  'navigateLabel',
  'selectLabel',
  'trigger',
  'footer',
  'modal',
  'portal',
  'classes',
];

const groups: SpotlightGroup[] = [
  {
    id: 'pages',
    label: 'Pages',
    items: [
      { label: 'Reports', href: '#reports', icon: 'file-text', description: 'Monthly' },
      {
        value: 'settings',
        label: 'Settings',
        icon: 'settings',
        color: 'primary',
        keywords: ['preferences'],
      },
    ],
  },
  {
    id: 'actions',
    label: 'Actions',
    items: [
      { value: 'add', label: 'Add property', shortcut: '⌘ N' },
      { value: 'archive', label: 'Archive', disabled: true },
    ],
  },
];

const part = (root: ParentNode, name: string) =>
  root.querySelector(`[data-scope="spotlight"][data-part="${name}"]`);

const panel = () => document.querySelector('.apui-spotlight') as HTMLElement;
const query = () => part(document, 'query') as HTMLInputElement;
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

beforeEach(() => {
  localStorage.clear();
});

describe('Spotlight', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Spotlight, 'Spotlight', {
      declared: { props: declaredProps, events: ['onOpenChange', 'onSelect', 'onSearchChange'] },
      // remote changes filtering, recentLabel names stored choices: neither shows in a static render.
      ignoreEffects: ['defaultOpen', 'remote', 'recent', 'recentLabel'],
    });
  });

  it('renders every part on the server with portal off', () => {
    const html = renderToStaticMarkup(
      <Spotlight open portal={false} modal={false} trigger="Search" groups={groups} />,
    );
    const host = document.createElement('div');
    host.innerHTML = html;
    for (const name of [
      'trigger',
      'backdrop',
      'positioner',
      'content',
      'search',
      'icon',
      'query',
      'close-trigger',
      'results',
      'item-group',
      'item-group-label',
      'item',
      'tile',
      'item-text',
      'item-description',
      'shortcut',
      'item-indicator',
      'empty',
      'loading',
      'footer',
    ]) {
      expect(part(host, name), name).not.toBeNull();
    }
  });

  it('renders the contract anatomy: a named dialog holding a combobox and a listbox', () => {
    render(<Spotlight open portal={false} groups={groups} />);
    const root = panel();
    expect(root).toHaveAttribute('data-part', 'content');
    expect(root).toHaveAttribute('role', 'dialog');
    expect(root).toHaveAttribute('aria-modal', 'true');
    expect(root).toHaveAttribute('aria-label', 'Search');
    expect(root.parentElement).toHaveAttribute('data-part', 'positioner');
    expect([...root.children].map((el) => el.getAttribute('data-part'))).toEqual([
      'search',
      'results',
      'footer',
    ]);
    expect(query()).toHaveAttribute('role', 'combobox');
    expect(query()).toHaveAttribute('aria-keyshortcuts', 'Meta+K Control+K');
    expect(query()).toHaveAttribute('placeholder', 'Search…');
    expect(query()).toHaveAttribute('aria-controls', part(root, 'results')!.id);
    expect(part(root, 'results')).toHaveAttribute('role', 'listbox');
    expect(screen.getByRole('group', { name: 'Pages' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Esc, Close' })).toHaveTextContent('Esc');
  });

  it('renders items: link, tile, description, color, shortcut keys and disabled', () => {
    render(<Spotlight open portal={false} groups={groups} />);
    const link = document.querySelector('[data-value="#reports"]')!;
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '#reports');
    expect(link).toHaveAttribute('role', 'option');
    expect(part(link, 'tile')!.querySelector('svg')).not.toBeNull();
    expect(part(link, 'item-description')).toHaveTextContent('Monthly');
    expect(document.querySelector('[data-value="settings"]')).toHaveAttribute(
      'data-color',
      'primary',
    );
    expect(
      [...document.querySelectorAll('[data-value="add"] [data-part="shortcut"] kbd')].map(
        (kbd) => kbd.textContent,
      ),
    ).toEqual(['⌘', 'N']);
    expect(document.querySelector('[data-value="archive"]')).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('filters by every word across label, description and keywords, and shows the empty state', async () => {
    const onSearchChange = vi.fn();
    render(<Spotlight open portal={false} groups={groups} onSearchChange={onSearchChange} />);
    await typeQuery('prefer');
    expect(shown()).toEqual(['settings']);
    expect(document.querySelectorAll('[data-part="item-group"]')).toHaveLength(1);
    expect(onSearchChange).toHaveBeenLastCalledWith('prefer');
    await typeQuery('zzz');
    expect(shown()).toEqual([]);
    expect(part(document, 'empty')).not.toHaveAttribute('hidden');
  });

  it('leaves the results unfiltered with remote, and marks them busy while loading', async () => {
    render(<Spotlight open portal={false} groups={groups} remote loading />);
    await typeQuery('zzz');
    expect(shown()).toEqual(['#reports', 'settings', 'add', 'archive']);
    expect(part(document, 'results')).toHaveAttribute('aria-busy', 'true');
    expect(part(document, 'loading')).not.toHaveAttribute('hidden');
    expect(part(document, 'empty')).toHaveAttribute('hidden');
  });

  it('opens from the trigger, which shows the shortcut keys', async () => {
    const onOpenChange = vi.fn();
    render(
      <Spotlight portal={false} trigger="Search" groups={groups} onOpenChange={onOpenChange} />,
    );
    const trigger = part(document, 'trigger') as HTMLElement;
    expect(trigger).toHaveClass('apui-button');
    expect(trigger).toHaveAttribute('data-variant', 'outline');
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).toHaveAttribute('aria-keyshortcuts', 'Meta+K Control+K');
    expect(part(trigger, 'shortcut')).not.toBeNull();
    expect(panel()).toHaveAttribute('hidden');
    await interact(() => fireEvent.click(trigger));
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(panel()).not.toHaveAttribute('hidden');
  });

  it('toggles with the shortcut', async () => {
    const onOpenChange = vi.fn();
    render(
      <Spotlight portal={false} groups={groups} shortcut="ctrl+k" onOpenChange={onOpenChange} />,
    );
    await interact(() => fireEvent.keyDown(window, { key: 'k', code: 'KeyK', ctrlKey: true }));
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    await interact(() => fireEvent.keyDown(window, { key: 'k', code: 'KeyK', ctrlKey: true }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('reports a click on an item, closes, and remembers it first next time', async () => {
    const onSelect = vi.fn();
    function Controlled() {
      const [open, setOpen] = useState(true);
      return (
        <>
          <button onClick={() => setOpen(true)}>Reopen</button>
          <Spotlight
            id="palette"
            recent
            portal={false}
            groups={groups}
            open={open}
            onOpenChange={setOpen}
            onSelect={onSelect}
          />
        </>
      );
    }
    render(<Controlled />);
    await interact(() => fireEvent.click(document.querySelector('[data-value="add"]')!));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0]![0]).toMatchObject({ value: 'add', label: 'Add property' });
    expect(panel()).toHaveAttribute('hidden');
    expect(JSON.parse(localStorage.getItem('apui-spotlight-recent:palette')!)[0]).toMatchObject({
      value: 'add',
    });
    await interact(() => fireEvent.click(screen.getByText('Reopen')));
    expect(shown()[0]).toBe('recent:add');
    expect(screen.getByRole('group', { name: 'Recent' })).toBeInTheDocument();
  });

  it("marks the query's matches in each label, ignoring case and accents", async () => {
    render(<Spotlight open portal={false} groups={groups} />);
    await typeQuery('REP');
    expect(part(document.querySelector('[data-value="#reports"]')!, 'item-text')!.innerHTML).toBe(
      '<mark>Rep</mark>orts<span data-scope="spotlight" data-part="item-description">Monthly</span>',
    );
    await typeQuery('');
    expect(document.querySelectorAll('mark')).toHaveLength(0);
  });

  it('ends every result with the Enter glyph, hidden from assistive technology', () => {
    render(<Spotlight open portal={false} groups={groups} />);
    const indicators = document.querySelectorAll(
      '[data-part="item"] > [data-part="item-indicator"]',
    );
    expect(indicators).toHaveLength(4);
    expect(indicators[0]).toHaveAttribute('aria-hidden', 'true');
    expect(indicators[0]!.querySelector('svg')).not.toBeNull();
  });

  it('keeps no recent choices unless recent is on', async () => {
    render(<Spotlight open portal={false} groups={groups} />);
    await interact(() => fireEvent.click(document.querySelector('[data-value="add"]')!));
    expect(localStorage.length).toBe(0);
  });

  it('activates the first result when rendered open', async () => {
    render(<Spotlight open portal={false} modal={false} groups={groups} />);
    await act(async () => {
      await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    });
    expect(document.querySelector('[data-highlighted]')).toHaveAttribute('data-value', '#reports');
    expect(document.querySelector('[data-value="#reports"]')).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('never renders an unsafe link: a javascript: href becomes a plain option', () => {
    render(
      <Spotlight
        open
        portal={false}
        groups={[
          {
            label: 'Links',
            items: [
              { value: 'evil', label: 'Evil', href: 'javascript:alert(1)' },
              { value: 'ok', label: 'OK', href: '/reports' },
            ],
          },
        ]}
      />,
    );
    const evil = document.querySelector('[data-value="evil"]')!;
    expect(evil.tagName).toBe('DIV');
    expect(evil).not.toHaveAttribute('href');
    expect(document.querySelector('[href^="javascript"]')).toBeNull();
    expect(document.querySelector('[data-value="ok"]')).toHaveAttribute('href', '/reports');
  });

  it('takes translated strings as props', () => {
    render(
      <Spotlight
        open
        portal={false}
        groups={[]}
        label="Rechercher"
        placeholder="Rechercher…"
        emptyLabel="Aucun résultat."
        loadingLabel="Recherche…"
        closeLabel="Fermer"
        navigateLabel="Naviguer"
        selectLabel="Ouvrir"
      />,
    );
    expect(panel()).toHaveAttribute('aria-label', 'Rechercher');
    expect(query()).toHaveAttribute('placeholder', 'Rechercher…');
    expect(screen.getByRole('button', { name: 'Esc, Fermer' })).toBeInTheDocument();
    expect(part(document, 'empty')).toHaveTextContent('Aucun résultat.');
    expect(part(document, 'loading')).toHaveTextContent('Recherche…');
    expect(part(document, 'footer')).toHaveTextContent('Naviguer');
    expect(part(document, 'footer')).toHaveTextContent('Ouvrir');
  });

  it('puts classes on their parts and className on the panel', () => {
    render(
      <Spotlight
        open
        portal={false}
        groups={groups}
        className="extra"
        classes={{ root: 'r', results: 'res', item: 'it', footer: 'ft' }}
      />,
    );
    expect(panel()).toHaveClass('apui-spotlight', 'r', 'extra');
    expect(part(document, 'results')).toHaveClass('res');
    expect(part(document, 'item')).toHaveClass('it');
    expect(part(document, 'footer')).toHaveClass('ft');
  });

  it('portals to the body by default', () => {
    const { container } = render(<Spotlight open groups={groups} />);
    expect(container.querySelector('.apui-spotlight')).toBeNull();
    expect(document.body.querySelector('.apui-spotlight')).not.toBeNull();
  });
});
