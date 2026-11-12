import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Loading, type LoadingProps } from '../../components/feedback/Loading/Loading';

const declaredProps: (keyof LoadingProps)[] = [
  'variant',
  'size',
  'color',
  'label',
  'overlay',
  'delay',
  'classes',
];

describe('Loading', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Loading, 'Loading', { declared: { props: declaredProps, events: [] } });
  });

  it('is a status with a visually hidden label by default', () => {
    const { container } = render(<Loading />);
    const root = screen.getByRole('status');
    expect(root).toHaveClass('apui-loading');
    expect(root).toHaveAttribute('data-variant', 'spinner');
    expect(root).toHaveAttribute('data-size', 'md');
    expect(root).toHaveAttribute('data-color', 'primary');
    expect(root.style.getPropertyValue('--apui-_delay')).toBe('300ms');
    const label = container.querySelector('[data-part="label"]')!;
    expect(label).toHaveClass('apui-sr-only');
    expect(label).toHaveTextContent('Loading');
    expect(container.querySelector('[data-part="indicator"]')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('shows children as visible text, and translates the label', () => {
    const { container, rerender } = render(<Loading>Saving changes…</Loading>);
    expect(container.querySelector('[data-part="label"]')).not.toHaveClass('apui-sr-only');
    expect(screen.getByRole('status')).toHaveTextContent('Saving changes…');
    rerender(<Loading label="Chargement" />);
    expect(screen.getByRole('status')).toHaveTextContent('Chargement');
  });

  it('draws three dots, an overlay and the delay', () => {
    const { container } = render(<Loading variant="dots" overlay delay={0} />);
    const root = container.firstElementChild as HTMLElement;
    expect(container.querySelectorAll('[data-part="indicator"] > span')).toHaveLength(3);
    expect(root).toHaveAttribute('data-overlay', '');
    expect(root.style.getPropertyValue('--apui-_delay')).toBe('0ms');
  });
});
