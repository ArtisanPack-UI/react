import { renderToStaticMarkup } from 'react-dom/server';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Drawer, type DrawerProps } from '../../components/layout/Drawer/Drawer';

const declaredProps: (keyof DrawerProps)[] = [
  'open',
  'defaultOpen',
  'side',
  'size',
  'surface',
  'title',
  'description',
  'footer',
  'trigger',
  'modal',
  'portal',
  'hideClose',
  'closeLabel',
  'classes',
];

const part = (root: ParentNode, name: string) =>
  root.querySelector(`[data-scope="drawer"][data-part="${name}"]`);

const panel = () => document.querySelector('.apui-drawer') as HTMLElement;

const interact = (fire: () => void) =>
  act(async () => {
    fire();
  });

describe('Drawer', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Drawer, 'Drawer', {
      declared: { props: declaredProps, events: ['onOpenChange'] },
      ignoreEffects: ['defaultOpen'],
    });
  });

  it('renders every part on the server with portal off', () => {
    const html = renderToStaticMarkup(
      <Drawer
        open
        portal={false}
        modal={false}
        side="bottom"
        trigger="Filters"
        title="Filters"
        description="218 properties match"
        footer="Show results"
      >
        Body
      </Drawer>,
    );
    const host = document.createElement('div');
    host.innerHTML = html;
    for (const name of [
      'trigger',
      'backdrop',
      'positioner',
      'content',
      'handle',
      'header',
      'title',
      'description',
      'close-trigger',
      'body',
      'footer',
    ]) {
      expect(part(host, name), name).not.toBeNull();
    }
  });

  it('renders the contract anatomy, scoped drawer, at the end by default', () => {
    render(
      <Drawer open portal={false} title="Filters" description="218 match" footer="Apply">
        Body
      </Drawer>,
    );
    const root = panel();
    expect(root.tagName).toBe('ASIDE');
    expect(root).toHaveAttribute('data-part', 'content');
    expect(root).toHaveAttribute('data-scope', 'drawer');
    expect(root).toHaveAttribute('role', 'dialog');
    expect(root).toHaveAttribute('aria-modal', 'true');
    expect(root).toHaveAttribute('data-side', 'end');
    expect(root).toHaveAttribute('data-size', 'md');
    expect(root).toHaveAttribute('data-surface', 'overlay');
    expect(root.parentElement).toHaveAttribute('data-part', 'positioner');
    expect(root.parentElement).toHaveAttribute('data-side', 'end');
    expect(part(root, 'handle')).toBeNull();
    expect([...root.children].map((el) => el.getAttribute('data-part'))).toEqual([
      'header',
      'body',
      'footer',
    ]);
    expect(screen.getByRole('dialog', { name: 'Filters' })).toHaveAccessibleDescription(
      '218 match',
    );
  });

  it('renders the bottom sheet with a decorative handle first', () => {
    render(<Drawer open portal={false} side="bottom" title="Share" />);
    expect(panel()).toHaveAttribute('data-side', 'bottom');
    expect(panel().firstElementChild).toHaveAttribute('data-part', 'handle');
    expect(part(panel(), 'handle')).toHaveAttribute('aria-hidden', 'true');
  });

  it('opens from the trigger, closes on Escape and returns focus', async () => {
    const onOpenChange = vi.fn();
    render(<Drawer trigger="Filters" title="Filters" onOpenChange={onOpenChange} />);
    const trigger = screen.getByRole('button', { name: 'Filters' });
    expect(trigger).toHaveAttribute('data-scope', 'drawer');
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    trigger.focus();
    await interact(() => fireEvent.click(trigger));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    const drawer = await screen.findByRole('dialog', { name: 'Filters' });
    await waitFor(() => expect(drawer).toContainElement(document.activeElement as HTMLElement));
    await interact(() => fireEvent.keyDown(document.activeElement!, { key: 'Escape' }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(panel()).toHaveAttribute('hidden');
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('closes from the close button, named by closeLabel', async () => {
    const onOpenChange = vi.fn();
    render(
      <Drawer
        defaultOpen
        portal={false}
        title="T"
        closeLabel="Fermer"
        onOpenChange={onOpenChange}
      />,
    );
    await interact(() => fireEvent.click(screen.getByRole('button', { name: 'Fermer' })));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(panel()).toHaveAttribute('hidden');
  });

  it('emits side, size and surface, drops aria-modal when not modal, and hides the close button', () => {
    render(
      <Drawer
        open
        portal={false}
        side="start"
        size="lg"
        surface="glass"
        modal={false}
        hideClose
        title="T"
      />,
    );
    expect(panel()).toHaveAttribute('data-side', 'start');
    expect(panel()).toHaveAttribute('data-size', 'lg');
    expect(panel()).toHaveAttribute('data-surface', 'glass');
    expect(panel()).toHaveAttribute('aria-modal', 'false');
    expect(part(panel(), 'close-trigger')).toBeNull();
  });

  it('portals to the body by default and puts classes on their parts', () => {
    render(
      <Drawer
        defaultOpen
        title="T"
        className="extra"
        classes={{ root: 'r', body: 'b', handle: 'h' }}
        side="bottom"
      >
        Body
      </Drawer>,
    );
    expect(panel().closest('body')).toBe(document.body);
    expect(panel()).toHaveClass('apui-drawer', 'r', 'extra');
    expect(part(panel(), 'body')).toHaveClass('b');
    expect(part(panel(), 'handle')).toHaveClass('h');
  });

  it('uses no DaisyUI classes', () => {
    const { container } = render(
      <Drawer open portal={false} trigger="Open" title="T">
        Body
      </Drawer>,
    );
    expect(container.innerHTML).not.toMatch(
      /\b(drawer-side|drawer-toggle|drawer-overlay|bg-base-100)\b/,
    );
  });
});
