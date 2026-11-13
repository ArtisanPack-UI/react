import { createRef, useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import {
  Combobox,
  type ComboboxProps,
  type ComboboxValue,
} from '../../components/form/Combobox/Combobox';

const declaredProps: (keyof ComboboxProps)[] = [
  'size',
  'options',
  'label',
  'hint',
  'error',
  'invalid',
  'disabled',
  'required',
  'placeholder',
  'name',
  'value',
  'defaultValue',
  'multiple',
  'max',
  'allowCreate',
  'remote',
  'search',
  'loading',
  'clearable',
  'open',
  'defaultOpen',
  'portal',
  'leadingIcon',
  'emptyLabel',
  'loadingLabel',
  'createLabel',
  'removeLabel',
  'removedLabel',
  'clearLabel',
  'triggerLabel',
  'classes',
];
const declaredEvents: (keyof ComboboxProps)[] = [
  'onValueChange',
  'onSearchChange',
  'onOpenChange',
  'onCreate',
];

const PROPERTIES = [
  { value: 'lakeview', label: 'Lakeview Lofts', description: 'United States, Chicago' },
  { value: 'lakeside', label: 'Lakeside Commons', color: 'success' as const },
  { value: 'harbor', label: 'Harbor Point' },
];

const part = (root: ParentNode, name: string) =>
  root.querySelector(`[data-scope="combobox"][data-part="${name}"]`);
const parts = (root: ParentNode, name: string) =>
  [...root.querySelectorAll(`[data-scope="combobox"][data-part="${name}"]`)] as HTMLElement[];
const input = () => screen.getByRole('combobox') as HTMLInputElement;
const visible = (root: ParentNode) =>
  parts(root, 'item')
    .filter((el) => !el.hidden)
    .map((el) => el.getAttribute('data-value'));

/** Fires an event and lets the machine settle: Zag sends its updates in a microtask. */
const interact = (fire: () => void) =>
  act(async () => {
    fire();
  });

const typeInto = (text: string) =>
  interact(() => fireEvent.change(input(), { target: { value: text } }));

describe('Combobox', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Combobox, 'Combobox', {
      declared: { props: declaredProps, events: declaredEvents },
      // These change what the listbox offers or does once someone types,
      // chooses or removes, not the first render: max (only once reached),
      // defaultOpen (the fixture already renders open), defaultValue (an
      // uncontrolled start the sample can't match), and labels shown only in
      // states the base render isn't in (loading, chips, the clear button,
      // an announcement).
      ignoreEffects: [
        'max',
        'defaultOpen',
        'defaultValue',
        'loadingLabel',
        'removeLabel',
        'removedLabel',
        'clearLabel',
        // Hidden inputs render only for a value, and the base render has none.
        'name',
      ],
    });
  });

  it('renders the field anatomy with Zag parts renamed box and control', () => {
    const { container } = render(
      <Combobox
        label="Property"
        options={PROPERTIES}
        required
        hint="Start typing."
        error="Choose a property."
        leadingIcon="search"
        portal={false}
      />,
    );
    const root = container.firstElementChild!;
    expect(root).toHaveClass('apui-combobox');
    expect(root).toHaveAttribute('data-size', 'md');
    expect(root).toHaveAttribute('data-invalid', '');
    expect(part(root, 'box')!.contains(input())).toBe(true);
    expect(input()).toHaveAttribute('data-part', 'control');
    expect(input()).toHaveAttribute('aria-describedby', expect.stringMatching(/-hint .*-error$/));
    expect(screen.getByRole('combobox', { name: /Property/ })).toBe(input());
    expect(part(root, 'required')).toHaveAttribute('aria-hidden', 'true');
    expect(part(root, 'trigger')).toHaveAttribute('aria-label', 'Show options');
    expect(part(root, 'content')).toHaveAttribute('role', 'listbox');
  });

  it('filters as you type, marks the matches and reports the search', async () => {
    const onSearchChange = vi.fn();
    const { container } = render(
      <Combobox
        label="Property"
        options={PROPERTIES}
        portal={false}
        onSearchChange={onSearchChange}
      />,
    );
    await interact(() => input().focus());
    await typeInto('lake');
    expect(onSearchChange).toHaveBeenLastCalledWith('lake');
    expect(visible(container)).toEqual(['lakeview', 'lakeside']);
    expect(parts(container, 'mark').map((el) => el.textContent)).toEqual(['Lake', 'Lake']);
    expect(part(container, 'item-description')).toHaveTextContent('United States, Chicago');
  });

  it('shows the empty text with the search, or the loading text', async () => {
    const { container, rerender } = render(
      <Combobox label="Property" options={PROPERTIES} portal={false} />,
    );
    await interact(() => input().focus());
    await typeInto('zzz');
    expect(part(container, 'empty')).toHaveTextContent('No matches for “zzz”.');
    expect(part(container, 'empty')).not.toHaveAttribute('hidden');
    rerender(<Combobox label="Property" options={PROPERTIES} portal={false} loading />);
    expect(part(container, 'empty')).toHaveTextContent('Loading…');
    expect(part(container, 'spinner')).not.toBeNull();
    expect(container.firstElementChild).toHaveAttribute('data-loading', '');
  });

  it("doesn't filter with remote", async () => {
    const { container } = render(
      <Combobox label="Owner" options={PROPERTIES} portal={false} remote />,
    );
    await interact(() => input().focus());
    await typeInto('zzz');
    expect(visible(container)).toEqual(['lakeview', 'lakeside', 'harbor']);
  });

  it('chooses with the keyboard', async () => {
    const onValueChange = vi.fn();
    render(
      <Combobox
        label="Property"
        options={PROPERTIES}
        portal={false}
        onValueChange={onValueChange}
      />,
    );
    await interact(() => input().focus());
    await typeInto('harb');
    await interact(() => fireEvent.keyDown(input(), { key: 'Enter' }));
    expect(onValueChange).toHaveBeenLastCalledWith('harbor');
    expect(input().value).toBe('Harbor Point');
  });

  describe('tags: multiple with create', () => {
    function Tags(props: Partial<ComboboxProps>) {
      const [value, setValue] = useState<ComboboxValue>(['lakeside']);
      return (
        <Combobox
          label="Tags"
          options={PROPERTIES}
          portal={false}
          multiple
          allowCreate
          value={value}
          onValueChange={setValue}
          {...props}
        />
      );
    }

    it('renders chips with their color and remove buttons', () => {
      const { container } = render(<Tags />);
      const chip = part(container, 'chip')!;
      expect(container.firstElementChild).toHaveAttribute('data-multiple', '');
      expect(chip).toHaveTextContent('Lakeside Commons');
      expect(chip).toHaveAttribute('data-color', 'success');
      expect(part(chip, 'chip-remove')).toHaveAttribute('aria-label', 'Remove Lakeside Commons');
    });

    it('creates a value, adds the chip and calls onCreate', async () => {
      const onCreate = vi.fn();
      const { container } = render(<Tags onCreate={onCreate} />);
      await interact(() => input().focus());
      await typeInto('Rooftop');
      const create = container.querySelector('[data-create]')!;
      expect(create).toHaveTextContent('Create “Rooftop”');
      await interact(() => fireEvent.keyDown(input(), { key: 'Enter' }));
      expect(onCreate).toHaveBeenCalledWith('Rooftop');
      expect(parts(container, 'chip').map((el) => el.getAttribute('data-value'))).toEqual([
        'lakeside',
        'Rooftop',
      ]);
    });

    it("doesn't offer to create an existing value, ignoring case", async () => {
      const { container } = render(<Tags />);
      await interact(() => input().focus());
      await typeInto('harbor point');
      expect(container.querySelector('[data-create]')).toBeNull();
    });

    it('removes chips with their button and with Backspace, and announces it', async () => {
      const { container } = render(
        <Tags value={undefined} defaultValue={['lakeview', 'harbor']} />,
      );
      await interact(() => fireEvent.click(part(container, 'chip-remove')!));
      expect(parts(container, 'chip').map((el) => el.getAttribute('data-value'))).toEqual([
        'harbor',
      ]);
      expect(part(container, 'status')).toHaveTextContent('Removed Lakeview Lofts.');
      await interact(() => fireEvent.keyDown(input(), { key: 'Backspace' }));
      expect(parts(container, 'chip')).toHaveLength(0);
      expect(part(container, 'status')).toHaveTextContent('Removed Harbor Point.');
    });

    it('disables the other options once max is reached', async () => {
      const { container } = render(<Tags max={1} />);
      await interact(() => input().focus());
      await interact(() => fireEvent.keyDown(input(), { key: 'ArrowDown' }));
      const harbor = container.querySelector('[data-value="harbor"]')!;
      expect(harbor).toHaveAttribute('aria-disabled', 'true');
    });

    it('takes translated labels', () => {
      const { container } = render(
        <Tags
          removeLabel="Retirer {label}"
          triggerLabel="Afficher"
          clearable
          clearLabel="Effacer"
        />,
      );
      expect(part(container, 'chip-remove')).toHaveAttribute(
        'aria-label',
        'Retirer Lakeside Commons',
      );
      expect(part(container, 'trigger')).toHaveAttribute('aria-label', 'Afficher');
      expect(part(container, 'clear-trigger')).toHaveAttribute('aria-label', 'Effacer');
    });
  });

  describe('form submission', () => {
    const submitted = (form: HTMLFormElement) => [...new FormData(form).entries()];

    it('submits the value through a hidden input, never the text input', async () => {
      const { container } = render(
        <form>
          <Combobox
            name="property"
            label="Property"
            options={PROPERTIES}
            defaultValue="lakeside"
            portal={false}
          />
        </form>,
      );
      const form = container.querySelector('form')!;
      expect(submitted(form)).toEqual([['property', 'lakeside']]);
      expect(input()).not.toHaveAttribute('name');
      await interact(() => input().focus());
      await typeInto('harb');
      await interact(() => fireEvent.keyDown(input(), { key: 'Enter' }));
      expect(submitted(form)).toEqual([['property', 'harbor']]);
    });

    it('submits one hidden input per value with multiple, and none while empty', async () => {
      function Tags() {
        const [tags, setTags] = useState<ComboboxValue>(['lakeview', 'Garden']);
        return (
          <form>
            <Combobox
              name="tags[]"
              label="Tags"
              multiple
              options={PROPERTIES}
              value={tags}
              onValueChange={setTags}
            />
          </form>
        );
      }
      const { container } = render(<Tags />);
      const form = container.querySelector('form')!;
      expect(submitted(form)).toEqual([
        ['tags[]', 'lakeview'],
        ['tags[]', 'Garden'],
      ]);
      for (const button of parts(container, 'chip-remove').reverse()) {
        await interact(() => fireEvent.click(button));
      }
      expect(submitted(form)).toEqual([]);
    });
  });

  it('forwards the ref and className to the root', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Combobox ref={ref} className="extra" label="Property" options={PROPERTIES} />);
    expect(ref.current).toHaveClass('apui-combobox', 'extra');
  });
});
