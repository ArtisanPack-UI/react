import { createRef, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Dialog, type DialogProps } from '../../components/layout/Dialog/Dialog';

const declaredProps: (keyof DialogProps)[] = [
  'open',
  'defaultOpen',
  'size',
  'role',
  'surface',
  'color',
  'icon',
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
  root.querySelector(`[data-scope="dialog"][data-part="${name}"]`);

const panel = () => document.querySelector('.apui-dialog') as HTMLElement;

/** Fires an event and lets the machine settle: Zag sends its updates in a microtask. */
const interact = (fire: () => void) =>
  act(async () => {
    fire();
  });

describe('Dialog', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Dialog, 'Dialog', {
      declared: { props: declaredProps, events: ['onOpenChange'] },
      ignoreEffects: ['defaultOpen'],
    });
  });

  it('renders every part on the server with portal off', () => {
    const html = renderToStaticMarkup(
      <Dialog
        open
        portal={false}
        modal={false}
        trigger="Invite"
        title="Invite member"
        description="Members can edit every listing."
        icon="user"
        footer="Send invite"
      >
        Body
      </Dialog>,
    );
    const host = document.createElement('div');
    host.innerHTML = html;
    for (const name of [
      'trigger',
      'backdrop',
      'positioner',
      'content',
      'header',
      'icon',
      'title',
      'description',
      'close-trigger',
      'body',
      'footer',
    ]) {
      expect(part(host, name), name).not.toBeNull();
    }
  });

  it('renders the contract anatomy in order', () => {
    render(
      <Dialog
        open
        portal={false}
        title="Invite member"
        description="Members can edit every listing."
        icon="user"
        footer="Send invite"
      >
        Body
      </Dialog>,
    );
    const root = panel();
    expect(root).toHaveAttribute('data-part', 'content');
    expect(root).toHaveAttribute('role', 'dialog');
    expect(root).toHaveAttribute('aria-modal', 'true');
    expect(root).toHaveAttribute('data-state', 'open');
    expect(root).toHaveAttribute('data-size', 'md');
    expect(root).toHaveAttribute('data-surface', 'overlay');
    expect(root).not.toHaveAttribute('data-color');
    expect(root.parentElement).toHaveAttribute('data-part', 'positioner');
    expect(root.parentElement!.previousElementSibling).toHaveAttribute('data-part', 'backdrop');
    expect([...root.children].map((el) => el.getAttribute('data-part'))).toEqual([
      'header',
      'body',
      'footer',
    ]);
    expect([...part(root, 'header')!.children].map((el) => el.getAttribute('data-part'))).toEqual([
      'icon',
      'title',
      'description',
      'close-trigger',
    ]);
    expect(part(root, 'title')!.tagName).toBe('H2');
    expect(part(root, 'description')!.tagName).toBe('P');
    expect(screen.getByRole('dialog', { name: 'Invite member' })).toHaveAccessibleDescription(
      'Members can edit every listing.',
    );
    const close = screen.getByRole('button', { name: 'Close' });
    expect(close).toHaveClass('apui-button');
    expect(close).toHaveAttribute('data-variant', 'ghost');
    expect(close).toHaveAttribute('data-color', 'neutral');
    expect(close).toHaveAttribute('data-size', 'sm');
    expect(close).toHaveAttribute('data-icon-only', '');
  });

  it('renders the panel hidden while closed', () => {
    render(<Dialog portal={false} title="Invite member" />);
    expect(panel()).toHaveAttribute('hidden');
    expect(panel()).toHaveAttribute('data-state', 'closed');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('portals to the body by default', () => {
    const { container } = render(<Dialog defaultOpen title="Invite member" />);
    expect(container.querySelector('.apui-dialog')).toBeNull();
    expect(panel().closest('body')).toBe(document.body);
  });

  it('renders the trigger as an outline neutral button only when given', () => {
    const { rerender } = render(<Dialog portal={false} title="Invite member" />);
    expect(part(document, 'trigger')).toBeNull();
    rerender(<Dialog portal={false} title="Invite member" trigger="Invite" />);
    const trigger = screen.getByRole('button', { name: 'Invite' });
    expect(trigger).toHaveAttribute('data-part', 'trigger');
    expect(trigger).toHaveAttribute('data-variant', 'outline');
    expect(trigger).toHaveAttribute('data-color', 'neutral');
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens from the trigger, moves focus in, and reports open-change', async () => {
    const onOpenChange = vi.fn();
    render(<Dialog trigger="Invite" title="Invite member" onOpenChange={onOpenChange} />);
    await interact(() => fireEvent.click(screen.getByRole('button', { name: 'Invite' })));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    const dialog = await screen.findByRole('dialog', { name: 'Invite member' });
    expect(dialog).toHaveAttribute('data-state', 'open');
    await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement));
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const onOpenChange = vi.fn();
    render(<Dialog trigger="Invite" title="Invite member" onOpenChange={onOpenChange} />);
    const trigger = screen.getByRole('button', { name: 'Invite' });
    trigger.focus();
    await interact(() => fireEvent.click(trigger));
    const dialog = await screen.findByRole('dialog');
    await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement));
    await interact(() => fireEvent.keyDown(document.activeElement!, { key: 'Escape' }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(panel()).toHaveAttribute('hidden');
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('closes from the close button', async () => {
    const onOpenChange = vi.fn();
    render(<Dialog defaultOpen portal={false} title="Invite member" onOpenChange={onOpenChange} />);
    await interact(() => fireEvent.click(screen.getByRole('button', { name: 'Close' })));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(panel()).toHaveAttribute('hidden');
  });

  it('stays open when controlled and the owner keeps it open', async () => {
    const onOpenChange = vi.fn();
    render(<Dialog open portal={false} title="Invite member" onOpenChange={onOpenChange} />);
    await interact(() => fireEvent.click(screen.getByRole('button', { name: 'Close' })));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(panel()).not.toHaveAttribute('hidden');
  });

  it('follows a controlled open prop without reporting it', async () => {
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Open
          </button>
          <Dialog open={open} onOpenChange={setOpen} portal={false} title="Invite member" />
        </>
      );
    }
    render(<Harness />);
    expect(panel()).toHaveAttribute('hidden');
    await interact(() => fireEvent.click(screen.getByRole('button', { name: 'Open' })));
    expect(panel()).not.toHaveAttribute('hidden');
    await interact(() => fireEvent.click(screen.getByRole('button', { name: 'Close' })));
    expect(panel()).toHaveAttribute('hidden');
  });

  it('sets aria-modal from modal', () => {
    render(<Dialog open portal={false} modal={false} title="Invite member" />);
    expect(panel()).toHaveAttribute('aria-modal', 'false');
  });

  // Focus landing on the close button itself is covered in Chromium by the behavior
  // engine's tests; jsdom has no layout, so its focus trap falls back to the panel.
  it('renders an alertdialog and moves focus into it', async () => {
    render(<Dialog trigger="Delete" role="alertdialog" title="Delete listing?" />);
    await interact(() => fireEvent.click(screen.getByRole('button', { name: 'Delete' })));
    const dialog = screen.getByRole('alertdialog', { name: 'Delete listing?' });
    expect(dialog).toBe(panel());
    await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement));
  });

  it('emits size, surface and color', () => {
    render(<Dialog open portal={false} size="lg" surface="glass" color="error" title="T" />);
    expect(panel()).toHaveAttribute('data-size', 'lg');
    expect(panel()).toHaveAttribute('data-surface', 'glass');
    expect(panel()).toHaveAttribute('data-color', 'error');
  });

  it('renders an icon node in place of a name', () => {
    render(<Dialog open portal={false} icon={<i data-testid="custom" />} title="T" />);
    expect(part(panel(), 'icon')).toContainElement(screen.getByTestId('custom'));
  });

  it('names the close button with closeLabel', () => {
    render(<Dialog open portal={false} closeLabel="Fermer" title="T" />);
    expect(screen.getByRole('button', { name: 'Fermer' })).toHaveAttribute(
      'data-part',
      'close-trigger',
    );
  });

  it('names a title-less dialog with aria-label', () => {
    render(<Dialog open portal={false} aria-label="Quick add" />);
    const dialog = screen.getByRole('dialog', { name: 'Quick add' });
    expect(dialog).toBe(panel());
    expect(dialog).not.toHaveAttribute('aria-labelledby');
  });

  it("keeps the consumer's handlers and style on the panel", async () => {
    const onClick = vi.fn();
    const onKeyDown = vi.fn();
    render(
      <Dialog
        open
        portal={false}
        title="T"
        onClick={onClick}
        onKeyDown={onKeyDown}
        style={{ maxWidth: 300 }}
      />,
    );
    expect(panel()).toHaveStyle({ maxWidth: '300px' });
    await interact(() => fireEvent.click(panel()));
    await interact(() => fireEvent.keyDown(panel(), { key: 'a' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  it('closes on a backdrop click, but an alertdialog does not', async () => {
    const onOpenChange = vi.fn();
    const { unmount } = render(
      <Dialog trigger="Invite" title="Invite member" onOpenChange={onOpenChange} />,
    );
    await interact(() => fireEvent.click(screen.getByRole('button', { name: 'Invite' })));
    await screen.findByRole('dialog');
    const clickBackdrop = () => {
      const backdrop = part(document, 'backdrop')!;
      fireEvent.pointerDown(backdrop);
      fireEvent.pointerUp(backdrop);
      fireEvent.click(backdrop);
    };
    await waitFor(async () => {
      await interact(clickBackdrop);
      expect(onOpenChange).toHaveBeenLastCalledWith(false);
    });
    unmount();

    const onAlertChange = vi.fn();
    render(
      <Dialog trigger="Delete" role="alertdialog" title="Delete?" onOpenChange={onAlertChange} />,
    );
    await interact(() => fireEvent.click(screen.getByRole('button', { name: 'Delete' })));
    await screen.findByRole('alertdialog');
    await interact(clickBackdrop);
    await new Promise((resolve) => setTimeout(resolve, 50));
    await interact(clickBackdrop);
    expect(onAlertChange).not.toHaveBeenCalledWith(false);
    expect(panel()).not.toHaveAttribute('hidden');
  });

  it('hides the close button with hideClose', () => {
    render(<Dialog open portal={false} hideClose title="T" />);
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
  });

  it('omits the header, body and footer when empty', () => {
    render(<Dialog open portal={false} hideClose aria-label="Empty" />);
    expect(panel().children).toHaveLength(0);
  });

  it('applies classes per part and className to the panel', () => {
    render(
      <Dialog
        open
        portal={false}
        trigger="Invite"
        title="T"
        footer="F"
        className="extra"
        classes={{ root: 'r', trigger: 't', backdrop: 'b', header: 'h', footer: 'f' }}
      >
        Body
      </Dialog>,
    );
    expect(panel()).toHaveClass('apui-dialog', 'r', 'extra');
    expect(part(document, 'trigger')).toHaveClass('apui-button', 't');
    expect(part(document, 'backdrop')).toHaveClass('b');
    expect(part(panel(), 'header')).toHaveClass('h');
    expect(part(panel(), 'footer')).toHaveClass('f');
  });

  it('passes native attributes to the panel and forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Dialog ref={ref} open portal={false} title="T" data-testid="panel" />);
    expect(screen.getByTestId('panel')).toBe(panel());
    expect(ref.current).toBe(panel());
  });

  it('unmounts cleanly while open', () => {
    const { unmount } = render(<Dialog defaultOpen title="T" />);
    act(() => unmount());
    expect(document.querySelector('.apui-dialog')).toBeNull();
  });
});
