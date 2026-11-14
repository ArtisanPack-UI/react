import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Modal } from '../../components/layout/Modal/Modal';

const panel = () => document.querySelector('.apui-dialog') as HTMLElement;
const part = (name: string) => panel().querySelector(`[data-scope="dialog"][data-part="${name}"]`);

/** Fires an event and lets the machine settle: Zag sends its updates in a microtask. */
const interact = (fire: () => void) =>
  act(async () => {
    fire();
  });

/** Presses Escape once focus has moved into the panel, where the machine listens. */
const pressEscape = async () => {
  await waitFor(() => expect(panel()).toContainElement(document.activeElement as HTMLElement));
  await interact(() => fireEvent.keyDown(document.activeElement!, { key: 'Escape' }));
};

describe('Modal (deprecated alias of Dialog)', () => {
  it('renders a Dialog and warns once', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <Modal open onClose={vi.fn()} portal={false} title="Confirm">
        Are you sure?
      </Modal>,
    );
    const dialog = screen.getByRole('dialog', { name: 'Confirm' });
    expect(dialog).toBe(panel());
    expect(dialog).toHaveClass('apui-dialog');
    expect(dialog).not.toHaveClass('modal-box');
    expect(document.querySelector('.modal, .modal-box, .btn')).toBeNull();
    expect(part('body')).toHaveTextContent('Are you sure?');
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Modal is deprecated; use Dialog.'));
    warn.mockRestore();
  });

  it('maps subtitle to the description and actions to the footer', () => {
    render(
      <Modal
        open
        onClose={vi.fn()}
        portal={false}
        title="Confirm"
        subtitle="This can't be undone."
        actions={<button type="button">Save</button>}
      />,
    );
    expect(part('description')).toHaveTextContent("This can't be undone.");
    expect(screen.getByRole('dialog')).toHaveAccessibleDescription("This can't be undone.");
    expect(part('footer')).toContainElement(screen.getByRole('button', { name: 'Save' }));
  });

  it('hides the panel when closed', () => {
    render(<Modal open={false} onClose={vi.fn()} portal={false} title="T" />);
    expect(panel()).toHaveAttribute('hidden');
  });

  it('calls onClose from the close button', async () => {
    const onClose = vi.fn();
    render(<Modal open onClose={onClose} portal={false} title="T" />);
    await interact(() => fireEvent.click(screen.getByRole('button', { name: 'Close' })));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose on Escape', async () => {
    const onClose = vi.fn();
    render(<Modal open onClose={onClose} portal={false} title="T" />);
    await pressEscape();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('maps persistent to an alertdialog without a close button that ignores Escape', async () => {
    const onClose = vi.fn();
    render(<Modal open onClose={onClose} portal={false} persistent title="Delete?" />);
    const dialog = screen.getByRole('alertdialog', { name: 'Delete?' });
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
    await pressEscape();
    expect(onClose).not.toHaveBeenCalled();
    expect(dialog).not.toHaveAttribute('hidden');
  });

  it('maps glass to the glass surface and ignores bottom', () => {
    render(<Modal open onClose={vi.fn()} portal={false} glass bottom title="T" />);
    expect(panel()).toHaveAttribute('data-surface', 'glass');
    expect(panel()).not.toHaveAttribute('bottom');
  });

  it("passes Dialog's own props through", () => {
    render(<Modal open onClose={vi.fn()} portal={false} size="lg" className="extra" title="T" />);
    expect(panel()).toHaveAttribute('data-size', 'lg');
    expect(panel()).toHaveClass('extra');
  });
});
