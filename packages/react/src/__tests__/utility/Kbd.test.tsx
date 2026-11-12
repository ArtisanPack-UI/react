import { createRef } from 'react';
import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Kbd, type KbdProps } from '../../components/utility/Kbd/Kbd';

const declaredProps: (keyof KbdProps)[] = ['keys', 'size', 'platform', 'labels', 'classes'];

const keysOf = (root: Element) =>
  [...root.querySelectorAll('kbd[data-part="key"]')].map((key) => key.textContent);

describe('Kbd', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('matches the design-system manifest', async () => {
    await expectReactParity(Kbd, 'Kbd', { declared: { props: declaredProps, events: [] } });
  });

  it('renders a shortcut as a kbd of kbd elements', () => {
    const ref = createRef<HTMLElement>();
    const { container } = render(<Kbd ref={ref} keys={['mod', 'shift', 'p']} platform="other" />);
    const combo = container.firstElementChild!;
    expect(ref.current).toBe(combo);
    expect(combo.tagName).toBe('KBD');
    expect(combo.className).toBe('apui-kbd-combo');
    expect(combo.getAttribute('data-part')).toBe('combo');
    expect(keysOf(combo)).toEqual(['Ctrl', 'Shift', 'P']);
    for (const key of combo.querySelectorAll('kbd')) {
      expect(key.className).toBe('apui-kbd');
      expect(key.getAttribute('data-size')).toBe('md');
    }
  });

  it('shows Apple keys with hidden names on macOS', () => {
    const { container } = render(<Kbd keys={['mod', 'shift', 'k']} platform="mac" size="sm" />);
    const keys = container.querySelectorAll('kbd[data-part="key"]');
    expect(keys[0]!.querySelector('[aria-hidden="true"]')!.textContent).toBe('⌘');
    expect(keys[0]!.querySelector('.apui-sr-only')!.textContent).toBe('Command');
    expect(keys[1]!.textContent).toBe('⇧Shift');
    expect(keys[2]!.textContent).toBe('K');
    expect(keys[2]!.getAttribute('data-size')).toBe('sm');
  });

  it('measures the platform after mount when auto', () => {
    vi.stubGlobal('navigator', { ...navigator, platform: 'MacIntel' });
    const { container } = render(<Kbd keys={['mod', 'k']} />);
    expect(keysOf(container)[0]).toBe('⌘Command');
  });

  it('translates symbol names', () => {
    const { container } = render(<Kbd keys={['enter']} labels={{ enter: 'Entrée' }} />);
    expect(container.querySelector('.apui-sr-only')!.textContent).toBe('Entrée');
  });

  it('renders children as one key without keys', () => {
    const { container } = render(<Kbd size="sm">Esc</Kbd>);
    const key = container.firstElementChild!;
    expect(key.tagName).toBe('KBD');
    expect(key.className).toBe('apui-kbd');
    expect(key.getAttribute('data-part')).toBe('key');
    expect(key.getAttribute('data-size')).toBe('sm');
    expect(key.textContent).toBe('Esc');
  });
});
