import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Dropdown, DropdownItem } from '../../components/layout/Dropdown/Dropdown';

const panel = () => document.querySelector('.apui-dropdown-menu') as HTMLElement;

/** Fires an event and lets the machine settle: Zag sends its updates in a microtask. */
const interact = (fire: () => void) =>
  act(async () => {
    fire();
  });

describe('Dropdown (deprecated alias of DropdownMenu)', () => {
  it('renders a DropdownMenu with the old default label and warns once', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <Dropdown open portal={false}>
        <DropdownItem>Edit</DropdownItem>
      </Dropdown>,
    );
    expect(screen.getByRole('button', { name: 'Options' })).toHaveAttribute('data-part', 'trigger');
    expect(panel()).toHaveAttribute('role', 'menu');
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toBeInTheDocument();
    expect(document.querySelector('.dropdown, .dropdown-content, .btn, .menu')).toBeNull();
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('Dropdown is deprecated; use DropdownMenu.'),
    );
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('DropdownItem is deprecated; use DropdownMenuItem.'),
    );
    warn.mockRestore();
  });

  it('maps end to align="end" and ignores top and hover', () => {
    render(
      <Dropdown open portal={false} end top hover label="Actions">
        <DropdownItem>Edit</DropdownItem>
      </Dropdown>,
    );
    expect(panel()).toHaveAttribute('data-align', 'end');
    expect(panel()).not.toHaveAttribute('top');
    expect(panel()).not.toHaveAttribute('hover');
    expect(screen.getByRole('button', { name: 'Actions' })).toBeInTheDocument();
  });

  it("uses a custom trigger element's content as the label", () => {
    render(
      <Dropdown portal={false} trigger={<button type="button">Menu</button>}>
        <DropdownItem>Edit</DropdownItem>
      </Dropdown>,
    );
    const trigger = screen.getByRole('button', { name: 'Menu' });
    expect(trigger).toHaveAttribute('data-part', 'trigger');
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
  });

  it('opens from the trigger and reports open-change', async () => {
    const onOpenChange = vi.fn();
    render(
      <Dropdown portal={false} onOpenChange={onOpenChange}>
        <DropdownItem>Edit</DropdownItem>
      </Dropdown>,
    );
    await interact(() => fireEvent.click(screen.getByRole('button', { name: 'Options' })));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(panel()).toHaveAttribute('data-state', 'open');
  });

  it("calls an item's onClick when it's clicked", async () => {
    const onClick = vi.fn();
    render(
      <Dropdown open portal={false}>
        <DropdownItem onClick={onClick}>Edit</DropdownItem>
      </Dropdown>,
    );
    await interact(() => fireEvent.click(screen.getByRole('menuitem', { name: 'Edit' })));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("calls an item's onClick when it's chosen with Enter", async () => {
    const onClick = vi.fn();
    render(
      <Dropdown portal={false}>
        <DropdownItem onClick={onClick}>Edit</DropdownItem>
      </Dropdown>,
    );
    const trigger = screen.getByRole('button', { name: 'Options' });
    trigger.focus();
    await interact(() => fireEvent.keyDown(trigger, { key: 'ArrowDown' }));
    await waitFor(() => expect(panel()).toHaveFocus());
    await interact(() => fireEvent.keyDown(panel(), { key: 'Enter' }));
    await waitFor(() => expect(onClick).toHaveBeenCalledOnce());
  });

  it("doesn't call a disabled item's onClick", async () => {
    const onClick = vi.fn();
    render(
      <Dropdown open portal={false}>
        <DropdownItem disabled onClick={onClick}>
          Archive
        </DropdownItem>
      </Dropdown>,
    );
    const item = screen.getByRole('menuitem', { name: 'Archive' });
    expect(item).toHaveAttribute('data-disabled');
    await interact(() => fireEvent.click(item));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("reports an item's value through the menu's onSelect", async () => {
    const onSelect = vi.fn();
    render(
      <Dropdown open portal={false} onSelect={onSelect}>
        <DropdownItem value="edit">Edit</DropdownItem>
      </Dropdown>,
    );
    await interact(() => fireEvent.click(screen.getByRole('menuitem', { name: 'Edit' })));
    expect(onSelect).toHaveBeenCalledWith('edit');
  });
});
