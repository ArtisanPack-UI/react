import { createRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import {
  Accordion,
  AccordionItem,
  type AccordionItemData,
  type AccordionProps,
} from '../../components/layout/Accordion/Accordion';

const declaredProps: (keyof AccordionProps)[] = [
  'value',
  'defaultValue',
  'items',
  'multiple',
  'collapsible',
  'variant',
  'headingLevel',
  'disabled',
  'classes',
];

const ITEMS: AccordionItemData[] = [
  { value: 'live', title: 'Live', content: 'Live panel' },
  { value: 'owners', title: 'Owners', content: 'Owners panel' },
  { value: 'files', title: 'Files', content: 'Files panel', disabled: true },
];

function Composed(props: Omit<AccordionProps, 'items'>) {
  return (
    <Accordion {...props}>
      <AccordionItem value="live" title="Live">
        Live panel
      </AccordionItem>
      <>
        <AccordionItem value="owners" title="Owners">
          Owners panel
        </AccordionItem>
        <AccordionItem value="files" title="Files" disabled>
          Files panel
        </AccordionItem>
      </>
    </Accordion>
  );
}

const trigger = (name: string) => screen.getByRole('button', { name });
const interact = (fire: () => void) =>
  act(async () => {
    fire();
  });
/** A real click focuses the trigger first; the machine handles clicks while focused. */
const click = (name: string) =>
  interact(() => {
    fireEvent.focus(trigger(name));
    fireEvent.click(trigger(name));
  });
const withoutIds = (html: string) => html.replace(/_R_[0-9a-zA-Z]+_/g, '#');

describe('Accordion', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Accordion, 'Accordion', {
      declared: { props: declaredProps, events: ['onValueChange'] },
      ignoreEffects: ['defaultValue'],
    });
  });

  it('renders the same markup from items as from composition', () => {
    expect(withoutIds(renderToStaticMarkup(<Accordion items={ITEMS} />))).toBe(
      withoutIds(renderToStaticMarkup(<Composed />)),
    );
  });

  it('renders the parts with the spec names and headings at headingLevel', () => {
    const { container } = render(<Composed defaultValue={['live']} headingLevel={4} />);
    const root = container.querySelector('.apui-accordion')!;
    expect(root.getAttribute('data-variant')).toBe('default');
    expect(root.hasAttribute('data-collapsible')).toBe(true);
    expect(root.hasAttribute('data-multiple')).toBe(false);
    expect(
      container.querySelectorAll('h4[data-scope="accordion"][data-part="title"]'),
    ).toHaveLength(3);
    const live = trigger('Live');
    expect(live.getAttribute('data-part')).toBe('trigger');
    expect(live.getAttribute('aria-expanded')).toBe('true');
    const panel = document.getElementById(live.getAttribute('aria-controls')!)!;
    expect(panel.getAttribute('data-part')).toBe('content');
    expect(panel.getAttribute('role')).toBe('region');
    expect(panel.hidden).toBe(false);
    expect(live.querySelector('[data-part="chevron"]')?.getAttribute('aria-hidden')).toBe('true');
    expect((trigger('Files') as HTMLButtonElement).disabled).toBe(true);
  });

  it('opens one item at a time and reports value-change', async () => {
    const onValueChange = vi.fn();
    render(<Composed defaultValue={['live']} onValueChange={onValueChange} />);
    await click('Owners');
    expect(onValueChange).toHaveBeenLastCalledWith(['owners']);
    expect(trigger('Owners').getAttribute('aria-expanded')).toBe('true');
    expect(trigger('Live').getAttribute('aria-expanded')).toBe('false');
    await click('Owners');
    expect(onValueChange).toHaveBeenLastCalledWith([]);
  });

  it('keeps several items open with multiple', async () => {
    render(<Composed multiple defaultValue={['live']} />);
    await click('Owners');
    expect(trigger('Live').getAttribute('aria-expanded')).toBe('true');
    expect(trigger('Owners').getAttribute('aria-expanded')).toBe('true');
  });

  it('follows a controlled value', () => {
    const { rerender } = render(<Composed value={['live']} />);
    expect(trigger('Live').getAttribute('aria-expanded')).toBe('true');
    rerender(<Composed value={['owners']} />);
    expect(trigger('Owners').getAttribute('aria-expanded')).toBe('true');
    expect(trigger('Live').getAttribute('aria-expanded')).toBe('false');
  });

  it('disables every item', () => {
    render(<Composed disabled />);
    expect((trigger('Live') as HTMLButtonElement).disabled).toBe(true);
  });

  it('sets classes per part and forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <Accordion ref={ref} items={ITEMS} variant="flush" classes={{ root: 'r', trigger: 't' }} />,
    );
    expect(ref.current).toBe(container.querySelector('.apui-accordion'));
    expect(ref.current?.className).toBe('apui-accordion r');
    expect(ref.current?.getAttribute('data-variant')).toBe('flush');
    expect(trigger('Live').className).toBe('t');
  });

  it('puts native AccordionItem attributes on the item root, not the panel', () => {
    const { container } = render(
      <Accordion classes={{ item: 'i', content: 'c' }}>
        <AccordionItem value="live" title="Live" className="own" data-testid="live-item">
          Live panel
        </AccordionItem>
      </Accordion>,
    );
    const item = container.querySelector<HTMLElement>('[data-part="item"]')!;
    expect(item.className).toBe('own i');
    expect(item.getAttribute('data-testid')).toBe('live-item');
    const panel = container.querySelector<HTMLElement>('[data-part="content"]')!;
    expect(panel.className).toBe('c');
    expect(panel.hasAttribute('data-testid')).toBe(false);
  });

  it('throws when an AccordionItem renders on its own', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<AccordionItem value="x" title="X" />)).toThrow();
    spy.mockRestore();
  });
});
