import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Divider, type DividerProps } from '../../components/layout/Divider/Divider';

const declaredProps: (keyof DividerProps)[] = [
  'orientation',
  'label',
  'align',
  'strength',
  'decorative',
  'classes',
];

describe('Divider', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Divider, 'Divider', { declared: { props: declaredProps, events: [] } });
  });

  it('renders an hr for a plain horizontal rule', () => {
    const { container } = render(<Divider />);
    const hr = container.querySelector('hr.apui-divider')!;
    expect(hr.getAttribute('data-orientation')).toBe('horizontal');
    expect(hr.getAttribute('data-strength')).toBe('subtle');
    expect(screen.getByRole('separator')).toBe(hr);
  });

  it('renders a vertical separator div', () => {
    render(<Divider orientation="vertical" strength="strong" />);
    const separator = screen.getByRole('separator');
    expect(separator.tagName).toBe('DIV');
    expect(separator.getAttribute('aria-orientation')).toBe('vertical');
    expect(separator.getAttribute('data-strength')).toBe('strong');
  });

  it('names a labelled divider by its label, from the prop or children', () => {
    render(<Divider label="or continue with" align="start" />);
    const separator = screen.getByRole('separator', { name: 'or continue with' });
    expect(separator.getAttribute('data-align')).toBe('start');
    expect(separator.querySelector('[data-scope="divider"][data-part="label"]')).toBeTruthy();
  });

  it('takes children as the label', () => {
    render(<Divider>Older activity</Divider>);
    expect(screen.getByRole('separator', { name: 'Older activity' })).toBeTruthy();
  });

  it('hides a decorative divider from assistive technology', () => {
    const { container } = render(<Divider decorative />);
    expect(container.querySelector('hr')?.getAttribute('aria-hidden')).toBe('true');
    expect(screen.queryByRole('separator')).toBeNull();
  });

  it('reads a decorative label as plain text', () => {
    render(<Divider decorative label="Or" />);
    expect(screen.queryByRole('separator')).toBeNull();
    expect(screen.getByText('Or')).toBeTruthy();
  });

  it('forwards the ref and merges classes', () => {
    const ref = createRef<HTMLElement>();
    render(<Divider ref={ref} className="x" classes={{ root: 'r' }} />);
    expect(ref.current?.className).toBe('apui-divider r x');
  });

  it('prefers the label prop over children, and falls back to it when children are empty', () => {
    const both = render(<Divider label="Prop">Slot</Divider>);
    expect(both.container.querySelector('[data-part="label"]')!.textContent).toBe('Prop');
    both.unmount();
    const empty = render(<Divider label="or">{null}</Divider>);
    expect(empty.container.querySelector('[data-part="label"]')!.textContent).toBe('or');
    expect(empty.container.querySelector('hr')).toBeNull();
  });
});
