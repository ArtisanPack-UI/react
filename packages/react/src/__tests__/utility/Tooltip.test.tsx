import { renderToStaticMarkup } from 'react-dom/server';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Button } from '../../components/form/Button/Button';
import { Tooltip, type TooltipProps } from '../../components/utility/Tooltip/Tooltip';

const declaredProps: (keyof TooltipProps)[] = [
  'content',
  'placement',
  'delay',
  'size',
  'shortcut',
  'open',
  'defaultOpen',
  'disabled',
  'portal',
  'classes',
];

const part = (root: ParentNode, name: string) =>
  root.querySelector(`[data-scope="tooltip"][data-part="${name}"]`);

const label = () => document.querySelector('.apui-tooltip') as HTMLElement;

const interact = (fire: () => void) =>
  act(async () => {
    fire();
  });

describe('Tooltip', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Tooltip, 'Tooltip', {
      declared: { props: declaredProps, events: ['onOpenChange'] },
      ignoreEffects: ['defaultOpen', 'delay'],
    });
  });

  it('renders every part on the server with portal off', () => {
    const html = renderToStaticMarkup(
      <Tooltip open portal={false} content="Archive" shortcut="⌘+E">
        Archive
      </Tooltip>,
    );
    const host = document.createElement('div');
    host.innerHTML = html;
    for (const name of ['trigger', 'positioner', 'content', 'arrow', 'kbd']) {
      expect(part(host, name), name).not.toBeNull();
    }
    expect(host.querySelectorAll('[data-part="kbd"]')).toHaveLength(2);
  });

  it('renders the label with role tooltip, placement, size and the shortcut keys', () => {
    render(
      <Tooltip open portal={false} content="Archive" shortcut="⌘+E" placement="bottom" size="lg">
        <button type="button">A</button>
      </Tooltip>,
    );
    const root = label();
    expect(root).toHaveAttribute('data-part', 'content');
    expect(root).toHaveAttribute('role', 'tooltip');
    expect(root).toHaveAttribute('data-placement', 'bottom');
    expect(root).toHaveAttribute('data-size', 'lg');
    expect(root).toHaveAttribute('data-state', 'open');
    expect(root.firstElementChild).toHaveAttribute('data-part', 'arrow');
    expect([...root.querySelectorAll('kbd')].map((el) => el.textContent)).toEqual(['⌘', 'E']);
    expect(root.textContent).toBe('Archive⌘E');
  });

  it('puts the trigger part on the child, keeping its id and name, and describes it while open', () => {
    render(
      <Tooltip open portal={false} content="Archive this listing">
        <Button id="archive" iconOnly leadingIcon="pencil" aria-label="Archive" />
      </Tooltip>,
    );
    const trigger = screen.getByRole('button', { name: 'Archive' });
    expect(trigger).toHaveAttribute('id', 'archive');
    expect(trigger).toHaveAttribute('data-scope', 'tooltip');
    expect(trigger).toHaveAttribute('data-part', 'trigger');
    expect(trigger).toHaveAccessibleDescription('Archive this listing');
    expect(document.querySelectorAll('[data-part="trigger"]')).toHaveLength(1);
  });

  it('wraps a text child in a focusable span', () => {
    render(
      <Tooltip portal={false} content="More">
        Help
      </Tooltip>,
    );
    const trigger = part(document, 'trigger') as HTMLElement;
    expect(trigger.tagName).toBe('SPAN');
    expect(trigger).toHaveAttribute('tabindex', '0');
    expect(trigger).toHaveTextContent('Help');
  });

  it('is hidden until hover or focus, and Escape hides it', async () => {
    const onOpenChange = vi.fn();
    render(
      <Tooltip portal={false} content="Archive" onOpenChange={onOpenChange}>
        <button type="button">A</button>
      </Tooltip>,
    );
    expect(label()).toHaveAttribute('hidden');
    const trigger = screen.getByRole('button', { name: 'A' });
    expect(trigger).not.toHaveAttribute('aria-describedby');
    await interact(() => fireEvent.keyDown(document.body, { key: 'Tab' }));
    await interact(() => fireEvent.focus(trigger));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(label()).not.toHaveAttribute('hidden');
    await interact(() => fireEvent.keyDown(document, { key: 'Escape' }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(label()).toHaveAttribute('hidden');
  });

  it('marks a disabled tooltip and merges the child classes', () => {
    render(
      <Tooltip open portal={false} disabled content="A" classes={{ trigger: 't', root: 'r' }}>
        <button type="button" className="own">
          A
        </button>
      </Tooltip>,
    );
    expect(label()).toHaveAttribute('data-disabled', '');
    expect(label()).toHaveClass('apui-tooltip', 'r');
    expect(screen.getByRole('button', { name: 'A' })).toHaveClass('own', 't');
  });

  it('uses no DaisyUI classes', () => {
    const { container } = render(
      <Tooltip open portal={false} content="A">
        <button type="button">A</button>
      </Tooltip>,
    );
    expect(container.innerHTML).not.toMatch(/\b(tooltip-open|tooltip-top|data-tip)\b/);
    expect(container.innerHTML).not.toMatch(/class="tooltip\b/);
  });
});
