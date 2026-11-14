import { createRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  type DropdownMenuItemData,
  type DropdownMenuProps,
} from '../../components/layout/DropdownMenu/DropdownMenu';

const declaredProps: (keyof DropdownMenuProps)[] = [
  'open',
  'defaultOpen',
  'label',
  'items',
  'align',
  'surface',
  'portal',
  'classes',
];

const part = (root: ParentNode, name: string) =>
  root.querySelector(`[data-scope="dropdown-menu"][data-part="${name}"]`);

const panel = () => document.querySelector('.apui-dropdown-menu') as HTMLElement;
const trigger = () => screen.getByRole('button', { name: 'Options' });

/** Fires an event and lets the machine settle: Zag sends its updates in a microtask. */
const interact = (fire: () => void) =>
  act(async () => {
    fire();
  });

const ITEMS: DropdownMenuItemData[] = [
  {
    type: 'group',
    label: 'Listing',
    items: [
      { value: 'edit', label: 'Edit', icon: 'pencil', shortcut: 'E' },
      { value: 'duplicate', label: 'Duplicate', icon: 'copy' },
      { value: 'archive', label: 'Archive', disabled: true },
    ],
  },
  { type: 'separator' },
  { type: 'checkbox', value: 'grid', label: 'Show grid', checked: true },
  { type: 'separator' },
  { value: 'delete', label: 'Delete', icon: 'trash', color: 'error' },
];

function Composed(props: DropdownMenuProps) {
  return (
    <DropdownMenu {...props}>
      <DropdownMenuGroup label="Listing">
        <DropdownMenuItem value="edit" icon="pencil" shortcut="E">
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem value="duplicate" icon="copy">
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem value="archive" disabled>
          Archive
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem type="checkbox" value="grid" checked>
        Show grid
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem value="delete" icon="trash" color="error">
        Delete
      </DropdownMenuItem>
    </DropdownMenu>
  );
}

/** Markup with React's generated ids blanked, for comparing two renders. */
const withoutIds = (html: string) => html.replace(/_R_[0-9a-zA-Z]+_/g, '#');

describe('DropdownMenu', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(DropdownMenu, 'DropdownMenu', {
      declared: { props: declaredProps, events: ['onOpenChange', 'onSelect', 'onCheckedChange'] },
      ignoreEffects: ['defaultOpen'],
    });
  });

  it('renders every part on the server with portal off', () => {
    const host = document.createElement('div');
    host.innerHTML = renderToStaticMarkup(
      <DropdownMenu open portal={false} label="Options" items={ITEMS} />,
    );
    for (const name of [
      'trigger',
      'positioner',
      'content',
      'item-group',
      'item-group-label',
      'item',
      'icon',
      'item-text',
      'shortcut',
      'item-indicator',
      'separator',
    ]) {
      expect(part(host, name), name).not.toBeNull();
    }
  });

  it('renders the same markup from items as from composition', () => {
    const props = { open: true, portal: false, label: 'Options' };
    expect(withoutIds(renderToStaticMarkup(<DropdownMenu {...props} items={ITEMS} />))).toBe(
      withoutIds(renderToStaticMarkup(<Composed {...props} />)),
    );
  });

  it('renders the contract anatomy', () => {
    render(<DropdownMenu open portal={false} label="Options" items={ITEMS} />);
    const root = panel();
    expect(root).toHaveAttribute('data-part', 'content');
    expect(root).toHaveAttribute('role', 'menu');
    expect(root).toHaveAttribute('data-state', 'open');
    expect(root).toHaveAttribute('data-surface', 'overlay');
    expect(root).toHaveAttribute('data-align', 'start');
    expect(root.parentElement).toHaveAttribute('data-part', 'positioner');
    expect(screen.getByRole('menu', { name: 'Options' })).toBe(root);

    const group = screen.getByRole('group', { name: 'Listing' });
    expect(group).toHaveAttribute('data-part', 'item-group');

    const edit = screen.getByRole('menuitem', { name: /Edit/ });
    expect([...edit.children].map((el) => el.getAttribute('data-part'))).toEqual([
      'icon',
      'item-text',
      'shortcut',
    ]);
    expect(part(edit, 'shortcut')!.tagName).toBe('KBD');
    expect(screen.getByRole('menuitem', { name: 'Archive' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveAttribute('data-color', 'error');

    const grid = screen.getByRole('menuitemcheckbox', { name: 'Show grid' });
    expect(grid).toHaveAttribute('aria-checked', 'true');
    expect(part(grid, 'item-indicator')).not.toHaveAttribute('hidden');
    expect(root.querySelectorAll('hr[data-part="separator"]')).toHaveLength(2);
  });

  it('renders the trigger as an outline neutral button with a chevron', () => {
    render(<DropdownMenu portal={false} label="Options" items={ITEMS} />);
    const button = trigger();
    expect(button).toHaveAttribute('data-part', 'trigger');
    expect(button).toHaveAttribute('data-scope', 'dropdown-menu');
    expect(button).toHaveClass('apui-button');
    expect(button).toHaveAttribute('data-variant', 'outline');
    expect(button).toHaveAttribute('data-color', 'neutral');
    expect(button).toHaveAttribute('aria-haspopup', 'menu');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button.querySelector('[data-part="iconEnd"] svg')).not.toBeNull();
  });

  it('renders the panel hidden while closed, and portals by default', () => {
    const { container, unmount } = render(<DropdownMenu portal={false} label="Options" />);
    expect(panel()).toHaveAttribute('hidden');
    unmount();
    const portalled = render(<DropdownMenu label="Options" items={ITEMS} />);
    expect(portalled.container.querySelector('.apui-dropdown-menu')).toBeNull();
    expect(container.querySelector('.apui-dropdown-menu')).toBeNull();
    expect(panel()).toHaveAttribute('hidden');
  });

  it('opens from the trigger and reports open-change', async () => {
    const onOpenChange = vi.fn();
    render(<DropdownMenu label="Options" items={ITEMS} onOpenChange={onOpenChange} />);
    await interact(() => fireEvent.click(trigger()));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(panel()).not.toHaveAttribute('hidden');
    expect(trigger()).toHaveAttribute('aria-expanded', 'true');
  });

  it('moves through items with the arrow keys, skipping disabled ones, and selects with Enter', async () => {
    const onSelect = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <Composed label="Options" portal={false} onSelect={onSelect} onOpenChange={onOpenChange} />,
    );
    trigger().focus();
    await interact(() => fireEvent.keyDown(trigger(), { key: 'ArrowDown' }));
    await waitFor(() => expect(panel()).toHaveFocus());
    const highlighted = () => panel().querySelector('[data-highlighted]');
    expect(highlighted()).toHaveAttribute('data-value', 'edit');
    await interact(() => fireEvent.keyDown(panel(), { key: 'ArrowDown' }));
    expect(highlighted()).toHaveAttribute('data-value', 'duplicate');
    await interact(() => fireEvent.keyDown(panel(), { key: 'ArrowDown' }));
    expect(highlighted()).toHaveAttribute('data-value', 'grid');
    await interact(() => fireEvent.keyDown(panel(), { key: 'End' }));
    expect(highlighted()).toHaveAttribute('data-value', 'delete');
    await interact(() => fireEvent.keyDown(panel(), { key: 'Home' }));
    expect(highlighted()).toHaveAttribute('data-value', 'edit');
    await interact(() => fireEvent.keyDown(panel(), { key: 'Enter' }));
    await waitFor(() => expect(onSelect).toHaveBeenCalledWith('edit'));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    await waitFor(() => expect(trigger()).toHaveFocus());
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const onOpenChange = vi.fn();
    render(<Composed label="Options" portal={false} onOpenChange={onOpenChange} />);
    trigger().focus();
    await interact(() => fireEvent.keyDown(trigger(), { key: 'ArrowDown' }));
    await waitFor(() => expect(panel()).toHaveFocus());
    await interact(() => fireEvent.keyDown(panel(), { key: 'Escape' }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(panel()).toHaveAttribute('hidden');
    await waitFor(() => expect(trigger()).toHaveFocus());
  });

  it('calls the menu and the item onSelect for a clicked action item', async () => {
    const onSelect = vi.fn();
    const onItemSelect = vi.fn();
    render(
      <DropdownMenu defaultOpen portal={false} label="Options" onSelect={onSelect}>
        <DropdownMenuItem value="edit" onSelect={onItemSelect}>
          Edit
        </DropdownMenuItem>
      </DropdownMenu>,
    );
    await interact(() => fireEvent.click(screen.getByRole('menuitem', { name: 'Edit' })));
    expect(onSelect).toHaveBeenCalledWith('edit');
    expect(onItemSelect).toHaveBeenCalledWith('edit');
  });

  it('ignores clicks on disabled items', async () => {
    const onSelect = vi.fn();
    render(<Composed defaultOpen portal={false} label="Options" onSelect={onSelect} />);
    await interact(() => fireEvent.click(screen.getByRole('menuitem', { name: 'Archive' })));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('reports checked-change, not select, for checkbox and radio items', async () => {
    const onSelect = vi.fn();
    const onCheckedChange = vi.fn();
    const onItemChecked = vi.fn();
    render(
      <DropdownMenu
        defaultOpen
        portal={false}
        label="View"
        onSelect={onSelect}
        onCheckedChange={onCheckedChange}
        items={[
          { type: 'checkbox', value: 'grid', label: 'Show grid', checked: true },
          {
            type: 'group',
            label: 'Sort by',
            items: [
              { type: 'radio', value: 'newest', label: 'Newest', checked: true },
              { type: 'radio', value: 'price', label: 'Price', checked: false },
            ],
          },
        ]}
      >
        <DropdownMenuItem type="checkbox" value="map" onCheckedChange={onItemChecked}>
          Show map
        </DropdownMenuItem>
      </DropdownMenu>,
    );
    expect(screen.getByRole('menuitemradio', { name: 'Price' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
    await interact(() =>
      fireEvent.click(screen.getByRole('menuitemcheckbox', { name: 'Show grid' })),
    );
    expect(onCheckedChange).toHaveBeenLastCalledWith({ value: 'grid', checked: false });
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('reports a radio item as checked, and the item callback too', async () => {
    const onCheckedChange = vi.fn();
    const onItemChecked = vi.fn();
    render(
      <DropdownMenu defaultOpen portal={false} label="Sort" onCheckedChange={onCheckedChange}>
        <DropdownMenuItem type="radio" value="price" onCheckedChange={onItemChecked}>
          Price
        </DropdownMenuItem>
      </DropdownMenu>,
    );
    await interact(() => fireEvent.click(screen.getByRole('menuitemradio', { name: 'Price' })));
    expect(onCheckedChange).toHaveBeenCalledWith({ value: 'price', checked: true });
    expect(onItemChecked).toHaveBeenCalledWith(true);
  });

  it('keeps checked state with the owner', async () => {
    render(
      <DropdownMenu defaultOpen portal={false} label="View">
        <DropdownMenuItem type="checkbox" value="grid" checked={false}>
          Show grid
        </DropdownMenuItem>
      </DropdownMenu>,
    );
    const item = screen.getByRole('menuitemcheckbox', { name: 'Show grid' });
    expect(part(item, 'item-indicator')).toHaveAttribute('hidden');
    await interact(() => fireEvent.click(item));
    expect(item).toHaveAttribute('aria-checked', 'false');
  });

  it('jumps by typeahead', async () => {
    render(<Composed label="Options" portal={false} />);
    trigger().focus();
    await interact(() => fireEvent.keyDown(trigger(), { key: 'ArrowDown' }));
    await waitFor(() => expect(panel()).toHaveFocus());
    await interact(() => fireEvent.keyDown(panel(), { key: 'd' }));
    expect(panel().querySelector('[data-highlighted]')).toHaveAttribute('data-value', 'duplicate');
  });

  // jsdom doesn't move focus on Tab, so the test moves it as the browser would.
  it('closes when Tab moves focus out', async () => {
    const onOpenChange = vi.fn();
    render(
      <>
        <Composed label="Options" portal={false} onOpenChange={onOpenChange} />
        <button type="button">After</button>
      </>,
    );
    trigger().focus();
    await interact(() => fireEvent.keyDown(trigger(), { key: 'ArrowDown' }));
    await waitFor(() => expect(panel()).toHaveFocus());
    await interact(() => {
      fireEvent.keyDown(panel(), { key: 'Tab' });
      screen.getByRole('button', { name: 'After' }).focus();
    });
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(false));
    expect(panel()).toHaveAttribute('hidden');
  });

  it("keeps the consumer's handlers and style on items and the panel", async () => {
    const onItemClick = vi.fn();
    const onSelect = vi.fn();
    render(
      <DropdownMenu
        defaultOpen
        portal={false}
        label="Options"
        onSelect={onSelect}
        style={{ minWidth: 300 }}
      >
        <DropdownMenuItem value="edit" onClick={onItemClick} style={{ paddingLeft: 20 }}>
          Edit
        </DropdownMenuItem>
      </DropdownMenu>,
    );
    expect(panel()).toHaveStyle({ minWidth: '300px' });
    const item = screen.getByRole('menuitem', { name: 'Edit' });
    expect(item).toHaveStyle({ paddingLeft: '20px' });
    await interact(() => fireEvent.click(item));
    expect(onItemClick).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith('edit');
  });

  it('emits align and surface on the panel', () => {
    render(<DropdownMenu portal={false} label="Options" align="end" surface="glass" />);
    expect(panel()).toHaveAttribute('data-align', 'end');
    expect(panel()).toHaveAttribute('data-surface', 'glass');
  });

  it('labels a group only when it has a label', () => {
    render(
      <DropdownMenu open portal={false} label="Options">
        <DropdownMenuGroup>
          <DropdownMenuItem value="a">A</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenu>,
    );
    const group = screen.getByRole('group');
    expect(group).not.toHaveAttribute('aria-labelledby');
    expect(part(group, 'item-group-label')).toBeNull();
  });

  it('renders an icon node in place of a name', () => {
    render(
      <DropdownMenu open portal={false} label="Options">
        <DropdownMenuItem value="a" icon={<i data-testid="custom" />}>
          A
        </DropdownMenuItem>
      </DropdownMenu>,
    );
    expect(part(screen.getByRole('menuitem'), 'icon')).toContainElement(
      screen.getByTestId('custom'),
    );
  });

  it('applies classes per part and className to the panel, and forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <DropdownMenu
        ref={ref}
        open
        portal={false}
        label="Options"
        className="extra"
        classes={{ root: 'r', trigger: 't', item: 'i', itemText: 'x', separator: 's' }}
        items={[{ value: 'a', label: 'A' }, { type: 'separator' }]}
      />,
    );
    expect(panel()).toHaveClass('apui-dropdown-menu', 'r', 'extra');
    expect(ref.current).toBe(panel());
    expect(trigger()).toHaveClass('t');
    expect(part(panel(), 'item')).toHaveClass('i');
    expect(part(panel(), 'item-text')).toHaveClass('x');
    expect(part(panel(), 'separator')).toHaveClass('s');
  });

  it('throws when an item is rendered outside a menu', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<DropdownMenuItem value="a">A</DropdownMenuItem>)).toThrow(
      '<DropdownMenuItem> must be used inside <DropdownMenu>.',
    );
    error.mockRestore();
  });
});
