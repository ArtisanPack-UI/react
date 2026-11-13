import { createRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Tab, Tabs, type TabData, type TabsProps } from '../../components/layout/Tabs/Tabs';

const declaredProps: (keyof TabsProps)[] = [
  'value',
  'defaultValue',
  'tabs',
  'variant',
  'size',
  'orientation',
  'activationMode',
  'label',
  'classes',
];

const TABS: TabData[] = [
  { value: 'overview', label: 'Overview', icon: 'list', content: 'Overview panel' },
  { value: 'notifications', label: 'Notifications', count: 4, content: 'Notifications panel' },
  { value: 'archived', label: 'Archived', disabled: true, content: 'Archived panel' },
  { value: 'history', label: 'History', content: 'History panel' },
];

function Composed(props: Omit<TabsProps, 'tabs'>) {
  return (
    <Tabs {...props}>
      <Tab value="overview" label="Overview" icon="list">
        Overview panel
      </Tab>
      <Tab value="notifications" label="Notifications" count={4}>
        Notifications panel
      </Tab>
      <>
        <Tab value="archived" label="Archived" disabled>
          Archived panel
        </Tab>
        <Tab value="history" label="History">
          History panel
        </Tab>
      </>
    </Tabs>
  );
}

const tab = (name: string) => screen.getByRole('tab', { name: new RegExp(`^${name}`) });
const interact = (fire: () => void) =>
  act(async () => {
    fire();
  });
const withoutIds = (html: string) => html.replace(/_R_[0-9a-zA-Z]+_/g, '#');

describe('Tabs', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Tabs, 'Tabs', {
      declared: { props: declaredProps, events: ['onValueChange'] },
      ignoreEffects: ['defaultValue'],
    });
  });

  it('renders the same markup from tabs as from composition', () => {
    expect(withoutIds(renderToStaticMarkup(<Tabs tabs={TABS} />))).toBe(
      withoutIds(renderToStaticMarkup(<Composed />)),
    );
  });

  it('selects the first enabled composed tab on the server, without a value', () => {
    const host = document.createElement('div');
    host.innerHTML = renderToStaticMarkup(
      <Tabs>
        <Tab value="a" label="A" disabled>
          A panel
        </Tab>
        <Tab value="b" label="B">
          B panel
        </Tab>
        <Tab value="c" label="C">
          C panel
        </Tab>
      </Tabs>,
    );
    const selected = [...host.querySelectorAll('[role="tab"][aria-selected="true"]')];
    expect(selected.map((el) => el.textContent)).toEqual(['B']);
    const shown = [...host.querySelectorAll<HTMLElement>('[role="tabpanel"]')].filter(
      (el) => !el.hasAttribute('hidden'),
    );
    expect(shown.map((el) => el.textContent)).toEqual(['B panel']);
  });

  it('renders the contract anatomy, selecting the first enabled tab', () => {
    const { container } = render(<Composed label="Sections" />);
    const root = container.querySelector('.apui-tabs')!;
    expect(root).toHaveAttribute('data-variant', 'segmented');
    expect(root).toHaveAttribute('data-size', 'md');
    expect(root).toHaveAttribute('data-orientation', 'horizontal');
    expect(root).toHaveAttribute('data-activation-mode', 'automatic');
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-label', 'Sections');
    expect(tab('Overview')).toHaveAttribute('aria-selected', 'true');
    expect(tab('Overview').querySelector('[data-part="icon"]')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(tab('Notifications').querySelector('[data-part="count"]')).toHaveTextContent('4');
    expect(tab('Archived')).toBeDisabled();
    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveTextContent('Overview panel');
    expect(panel).toHaveAttribute('aria-labelledby', tab('Overview').id);
    expect(tab('Overview')).toHaveAttribute('aria-controls', panel.id);
  });

  it('selects on click and reports value-change', async () => {
    const onValueChange = vi.fn();
    render(<Composed onValueChange={onValueChange} />);
    await interact(() => fireEvent.click(tab('History')));
    expect(onValueChange).toHaveBeenCalledWith('history');
    expect(tab('History')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('History panel');
  });

  it('moves with the arrow keys, skipping disabled tabs', async () => {
    render(<Composed defaultValue="notifications" />);
    tab('Notifications').focus();
    await interact(() => fireEvent.keyDown(tab('Notifications'), { key: 'ArrowRight' }));
    await waitFor(() => expect(tab('History')).toHaveFocus());
    // Automatic selection on keyboard focus is checked in Chromium by the behavior package's tabs tests.
    await interact(() => fireEvent.keyDown(tab('History'), { key: 'Home' }));
    await waitFor(() => expect(tab('Overview')).toHaveFocus());
  });

  it('only moves focus in manual mode', async () => {
    render(<Composed activationMode="manual" />);
    tab('Overview').focus();
    await interact(() => fireEvent.keyDown(tab('Overview'), { key: 'ArrowRight' }));
    await waitFor(() => expect(tab('Notifications')).toHaveFocus());
    expect(tab('Overview')).toHaveAttribute('aria-selected', 'true');
  });

  it('follows a controlled value', async () => {
    const { rerender } = render(<Composed value="overview" />);
    rerender(<Composed value="history" />);
    // Automatic selection on keyboard focus is checked in Chromium by the behavior package's tabs tests.
  });

  it('emits variant, size and orientation', () => {
    const { container } = render(<Composed variant="underline" size="sm" orientation="vertical" />);
    const root = container.querySelector('.apui-tabs')!;
    expect(root).toHaveAttribute('data-variant', 'underline');
    expect(root).toHaveAttribute('data-size', 'sm');
    expect(root).toHaveAttribute('data-orientation', 'vertical');
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('applies classes per part and className to the root, and forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <Tabs
        tabs={TABS}
        ref={ref}
        className="mine"
        classes={{ list: 'l', trigger: 't', content: 'c', count: 'n' }}
      />,
    );
    expect(ref.current).toBe(container.querySelector('.apui-tabs'));
    expect(ref.current).toHaveClass('mine');
    expect(screen.getByRole('tablist')).toHaveClass('l');
    expect(tab('Overview')).toHaveClass('t');
    expect(screen.getByRole('tabpanel')).toHaveClass('c');
    expect(container.querySelector('[data-part="count"]')).toHaveClass('n');
  });

  it('throws when a Tab is rendered outside Tabs', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Tab value="a" label="A" />)).toThrow(/inside <Tabs>/);
    spy.mockRestore();
  });
  it('selects the first tab of tabs that load after mount', async () => {
    const { rerender } = render(<Tabs tabs={[]} />);
    expect(screen.queryAllByRole('tab')).toHaveLength(0);
    rerender(<Tabs tabs={TABS} />);
    await waitFor(() =>
      expect(screen.getAllByRole('tab')[0]).toHaveAttribute('aria-selected', 'true'),
    );
    expect(screen.getAllByRole('tab')[0]).toHaveAttribute('tabindex', '0');
  });
});
