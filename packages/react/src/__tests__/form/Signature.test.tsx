import { createRef, useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Signature, type SignatureProps } from '../../components/form/Signature/Signature';

const declaredProps: (keyof SignatureProps)[] = [
  'mode',
  'modes',
  'penColor',
  'label',
  'hint',
  'error',
  'invalid',
  'disabled',
  'required',
  'placeholder',
  'value',
  'defaultValue',
  'modesLabel',
  'drawLabel',
  'typeLabel',
  'uploadLabel',
  'padLabel',
  'typedLabel',
  'uploadTriggerLabel',
  'undoLabel',
  'clearLabel',
  'clearedLabel',
  'classes',
];
const declaredEvents: (keyof SignatureProps)[] = ['onValueChange'];

const part = (root: Element, name: string) =>
  root.querySelector(`[data-scope="signature"][data-part="${name}"]`);

// jsdom has no canvas: give the pad a context that records nothing.
let getContext: typeof HTMLCanvasElement.prototype.getContext;
beforeAll(() => {
  getContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = (() => null) as never;
});
afterAll(() => {
  HTMLCanvasElement.prototype.getContext = getContext;
});

describe('Signature', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Signature, 'Signature', {
      declared: { props: declaredProps, events: declaredEvents },
      // Shown only after an action, or only with optional parts.
      ignoreEffects: ['clearedLabel'],
    });
  });

  it('renders the contract anatomy with every part in order', () => {
    const { container } = render(
      <Signature label="Signature" required hint="Olivia Rhye" error="Sign to accept." />,
    );
    const root = container.firstElementChild!;
    expect(root).toHaveClass('apui-signature');
    expect(root).toHaveAttribute('role', 'group');
    expect(root).toHaveAttribute('data-mode', 'draw');
    expect(root).toHaveAttribute('data-pen-color', 'default');
    expect(root).toHaveAttribute('data-invalid', '');
    expect(
      [...root.querySelectorAll('[data-scope="signature"]')].map((el) =>
        el.getAttribute('data-part'),
      ),
    ).toEqual([
      'label',
      'required',
      'modes',
      'mode',
      'mode',
      'mode',
      'pad',
      'line',
      'mark',
      'ink',
      'typed',
      'upload',
      'tools',
      'undo',
      'clear',
      'placeholder',
      'hint',
      'error',
      'status',
    ]);
    expect(root.getAttribute('aria-labelledby')).toBe(part(root, 'label')!.id);
    expect(root.getAttribute('aria-describedby')).toBe(
      `${part(root, 'hint')!.id} ${part(root, 'error')!.id}`,
    );
    expect(part(root, 'ink')).toHaveAttribute('role', 'img');
    expect(part(root, 'typed')).toHaveAttribute('aria-required', 'true');
  });

  it('always offers type mode and switches with toggle buttons', () => {
    const { container } = render(<Signature modes={['draw']} aria-label="Sign" />);
    const buttons = [...container.querySelectorAll('[data-part="mode"]')];
    expect(buttons.map((b) => b.textContent)).toEqual(['Draw', 'Type']);
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(buttons[1]!);
    expect(buttons[1]).toHaveAttribute('aria-pressed', 'true');
    expect(container.firstElementChild).toHaveAttribute('data-mode', 'type');
    expect(part(container, 'ink')).toHaveAttribute('hidden');
    expect(part(container, 'typed')).not.toHaveAttribute('hidden');
    expect(part(container, 'tools')).toHaveAttribute('hidden');
  });

  it('starts over when the mode changes and clears through Clear', () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <Signature value="data:image/png;base64,AA" onValueChange={onValueChange} />,
    );
    const clear = part(container, 'clear')!;
    expect(clear).not.toBeDisabled();
    fireEvent.click(clear);
    expect(onValueChange).toHaveBeenLastCalledWith('');
    fireEvent.click(screen.getByRole('button', { name: 'Type' }));
    expect(onValueChange).toHaveBeenCalledTimes(2);
  });

  it('puts the value on a named hidden input and class on the root', () => {
    function Controlled() {
      const [value] = useState('data:image/png;base64,AA');
      return <Signature name="signature" className="mt-4" value={value} data-test="x" />;
    }
    const { container } = render(<Controlled />);
    const hidden = container.querySelector('input[type="hidden"]') as HTMLInputElement;
    expect(hidden.name).toBe('signature');
    expect(hidden.value).toBe('data:image/png;base64,AA');
    expect(container.firstElementChild).toHaveClass('apui-signature', 'mt-4');
    expect(container.firstElementChild).toHaveAttribute('data-test', 'x');
  });

  it('translates the built-in strings and announces a clear', async () => {
    const { container } = render(
      <Signature
        defaultValue="data:image/png;base64,AA"
        clearLabel="Erase"
        clearedLabel="Erased."
        placeholder="Sign here"
      />,
    );
    expect(part(container, 'clear')).toHaveTextContent('Erase');
    expect(part(container, 'placeholder')).toHaveTextContent('Sign here');
    expect(part(container, 'undo')).toHaveAttribute('aria-label', 'Undo stroke');
    fireEvent.click(part(container, 'clear')!);
    await act(() => new Promise((resolve) => requestAnimationFrame(() => resolve(undefined))));
    expect(part(container, 'status')).toHaveTextContent('Erased.');
  });

  it('disables every control', () => {
    const { container } = render(<Signature disabled aria-label="Sign" />);
    expect(container.firstElementChild).toHaveAttribute('data-disabled', '');
    for (const button of container.querySelectorAll('button')) expect(button).toBeDisabled();
    expect(part(container, 'typed')).toBeDisabled();
  });

  it('forwards the ref to the root', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Signature ref={ref} aria-label="Sign" />);
    expect(ref.current).toHaveClass('apui-signature');
  });
});
