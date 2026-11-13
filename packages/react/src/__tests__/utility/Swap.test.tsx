import { createRef, useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Swap, type SwapProps } from '../../components/utility/Swap/Swap';

const declaredProps: (keyof SwapProps)[] = [
  'checked',
  'defaultChecked',
  'label',
  'onIcon',
  'offIcon',
  'transition',
  'size',
  'disabled',
  'classes',
];

const part = (root: ParentNode, name: string) =>
  root.querySelector(`[data-scope="swap"][data-part="${name}"]`) as HTMLElement | null;

describe('Swap', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Swap, 'Swap', {
      declared: { props: declaredProps, events: ['onCheckedChange'] },
      ignoreEffects: ['defaultChecked'],
    });
  });

  it('renders a named checkbox over the on and off contents', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(<Swap ref={ref} label="Dark mode" />);
    const root = container.querySelector('.apui-swap') as HTMLElement;
    expect(root.tagName).toBe('LABEL');
    expect(root).toHaveAttribute('data-size', 'md');
    expect(root).toHaveAttribute('data-transition', 'fade');
    expect(root).toHaveAttribute('data-state', 'unchecked');
    const control = screen.getByRole('checkbox', { name: 'Dark mode' });
    expect(ref.current).toBe(control);
    expect(control).toHaveAttribute('data-part', 'control');
    expect(control).not.toBeChecked();
    expect(part(root, 'on')).toHaveAttribute('aria-hidden', 'true');
    expect(part(root, 'on')!.querySelector('svg')).not.toBeNull();
    expect(part(root, 'off')!.querySelector('svg')).not.toBeNull();
  });

  it('toggles uncontrolled and reports the change', () => {
    const onCheckedChange = vi.fn();
    const { container } = render(<Swap label="Dark mode" onCheckedChange={onCheckedChange} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(container.querySelector('.apui-swap')).toHaveAttribute('data-state', 'checked');
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('goes back to its initial state when its form resets', async () => {
    const afterReset = () =>
      act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
    for (const initial of [false, true]) {
      const { container, rerender, unmount } = render(
        <form>
          <Swap label="Dark mode" defaultChecked={initial} />
        </form>,
      );
      const box = screen.getByRole('checkbox') as HTMLInputElement;
      const root = container.querySelector('.apui-swap')!;
      fireEvent.click(box);
      expect(box.checked).toBe(!initial);
      expect(root.getAttribute('data-state')).toBe(initial ? 'unchecked' : 'checked');
      act(() => container.querySelector('form')!.reset());
      await afterReset();
      expect(box.checked).toBe(initial);
      expect(root.getAttribute('data-state')).toBe(initial ? 'checked' : 'unchecked');
      // A later render doesn't bring the stale state back.
      rerender(
        <form>
          <Swap label="Dark mode" defaultChecked={initial} size="lg" />
        </form>,
      );
      expect(box.checked).toBe(initial);
      expect(root.getAttribute('data-state')).toBe(initial ? 'checked' : 'unchecked');
      unmount();
    }
  });

  it('keeps a controlled swap on its checked value after a form reset', async () => {
    const { container } = render(
      <form>
        <Swap label="Dark mode" checked onCheckedChange={() => {}} />
      </form>,
    );
    const box = screen.getByRole('checkbox') as HTMLInputElement;
    act(() => container.querySelector('form')!.reset());
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(box.checked).toBe(true);
    expect(container.querySelector('.apui-swap')!.getAttribute('data-state')).toBe('checked');
  });

  it('follows a controlled checked', () => {
    function Controlled() {
      const [dark, setDark] = useState(true);
      return <Swap label="Dark mode" checked={dark} onCheckedChange={setDark} />;
    }
    render(<Controlled />);
    const control = screen.getByRole('checkbox');
    expect(control).toBeChecked();
    fireEvent.click(control);
    expect(control).not.toBeChecked();
  });

  it('puts native attributes on the checkbox and className on the root', () => {
    const { container } = render(
      <Swap
        label="Dark mode"
        name="dark"
        className="ms-2"
        disabled
        size="lg"
        transition="rotate"
      />,
    );
    const root = container.querySelector('.apui-swap') as HTMLElement;
    expect(root).toHaveClass('ms-2');
    expect(root).toHaveAttribute('data-disabled', '');
    expect(root).toHaveAttribute('data-size', 'lg');
    expect(root).toHaveAttribute('data-transition', 'rotate');
    expect(screen.getByRole('checkbox')).toHaveAttribute('name', 'dark');
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('renders on and off nodes in place of the icons', () => {
    const { container } = render(<Swap label="Menu" on={<b>On</b>} off={<i>Off</i>} />);
    expect(part(container, 'on')!.querySelector('b')).not.toBeNull();
    expect(part(container, 'off')!.querySelector('i')).not.toBeNull();
  });
});
