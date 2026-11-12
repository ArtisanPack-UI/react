import { renderToStaticMarkup } from 'react-dom/server';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Button } from '../../components/form/Button/Button';
import { Popover, type PopoverProps } from '../../components/layout/Popover/Popover';

const declaredProps: (keyof PopoverProps)[] = [
  'open',
  'defaultOpen',
  'placement',
  'arrow',
  'title',
  'actions',
  'trigger',
  'portal',
  'classes',
];

const part = (root: ParentNode, name: string) =>
  root.querySelector(`[data-scope="popover"][data-part="${name}"]`);

const panel = () => document.querySelector('.apui-popover') as HTMLElement;

const interact = (fire: () => void) =>
  act(async () => {
    fire();
  });

describe('Popover', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Popover, 'Popover', {
      declared: { props: declaredProps, events: ['onOpenChange'] },
      ignoreEffects: ['defaultOpen'],
    });
  });

  it('renders every part on the server with portal off', () => {
    const html = renderToStaticMarkup(
      <Popover open portal={false} trigger="Share" title="Share report" actions="Copy link">
        Body
      </Popover>,
    );
    const host = document.createElement('div');
    host.innerHTML = html;
    for (const name of ['trigger', 'positioner', 'content', 'arrow', 'title', 'body', 'actions']) {
      expect(part(host, name), name).not.toBeNull();
    }
  });

  it('renders a labelled, non-modal dialog with the requested placement', () => {
    render(
      <Popover open portal={false} trigger="Share" title="Share report">
        Body
      </Popover>,
    );
    const root = panel();
    expect(root).toHaveAttribute('data-part', 'content');
    expect(root).toHaveAttribute('role', 'dialog');
    expect(root).not.toHaveAttribute('aria-modal');
    expect(root).toHaveAttribute('data-placement', 'bottom');
    expect([...root.children].map((el) => el.getAttribute('data-part'))).toEqual([
      'arrow',
      'title',
      'body',
    ]);
    expect(part(root, 'arrow')).toHaveAttribute('aria-hidden', 'true');
    expect(part(root, 'title')!.tagName).toBe('H3');
  });

  it('renders a text trigger as an outline Button that controls the panel', () => {
    render(<Popover portal={false} trigger="Share" title="Share report" />);
    const trigger = screen.getByRole('button', { name: 'Share' });
    expect(trigger).toHaveAttribute('data-part', 'trigger');
    expect(trigger).toHaveAttribute('data-variant', 'outline');
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-controls', panel().id);
  });

  it('uses an element trigger itself, keeping its id, name and handlers', async () => {
    const onClick = vi.fn();
    render(
      <Popover
        portal={false}
        title="About visits"
        trigger={
          <Button
            id="about"
            variant="ghost"
            iconOnly
            leadingIcon="info"
            aria-label="About visits"
            onClick={onClick}
          />
        }
      >
        Text
      </Popover>,
    );
    const trigger = screen.getByRole('button', { name: 'About visits' });
    expect(trigger).toHaveAttribute('id', 'about');
    expect(trigger).toHaveAttribute('data-variant', 'ghost');
    expect(trigger).toHaveAttribute('data-part', 'trigger');
    expect(document.querySelectorAll('[data-part="trigger"]')).toHaveLength(1);
    await interact(() => fireEvent.click(trigger));
    expect(onClick).toHaveBeenCalled();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('opens on click, moves focus in, and closes on Escape back to the trigger', async () => {
    const onOpenChange = vi.fn();
    render(
      <Popover portal={false} trigger="Share" title="Share report" onOpenChange={onOpenChange}>
        <button type="button">Copy</button>
      </Popover>,
    );
    const trigger = screen.getByRole('button', { name: 'Share' });
    trigger.focus();
    await interact(() => fireEvent.click(trigger));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    const dialog = await screen.findByRole('dialog', { name: 'Share report' });
    await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement));
    await interact(() => fireEvent.keyDown(document.activeElement!, { key: 'Escape' }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(panel()).toHaveAttribute('hidden');
  });

  it('emits placement and drops the arrow', () => {
    render(<Popover open portal={false} placement="end" arrow={false} title="T" />);
    expect(panel()).toHaveAttribute('data-placement', 'end');
    expect(part(panel(), 'arrow')).toBeNull();
  });

  it('names a title-less popover with aria-label', () => {
    render(<Popover open portal={false} aria-label="Visits" />);
    expect(screen.getByRole('dialog', { name: 'Visits' })).toBe(panel());
  });

  it('uses no DaisyUI classes', () => {
    const { container } = render(
      <Popover open portal={false} trigger="Share" title="T">
        Body
      </Popover>,
    );
    expect(container.innerHTML).not.toMatch(
      /\b(dropdown|dropdown-content|bg-base-100|rounded-box)\b/,
    );
  });
});
