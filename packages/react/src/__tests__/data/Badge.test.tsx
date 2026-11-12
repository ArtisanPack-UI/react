import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Badge, type BadgeProps } from '../../components/data/Badge/Badge';

const declaredProps: (keyof BadgeProps)[] = [
  'variant',
  'color',
  'size',
  'dot',
  'leadingIcon',
  'classes',
];

describe('Badge', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Badge, 'Badge', { declared: { props: declaredProps, events: [] } });
  });

  it('renders a soft neutral md badge with a label part', () => {
    const { container } = render(<Badge>Draft</Badge>);
    const root = container.querySelector('.apui-badge')!;
    expect(root.tagName).toBe('SPAN');
    expect(root).toHaveAttribute('data-variant', 'soft');
    expect(root).toHaveAttribute('data-color', 'neutral');
    expect(root).toHaveAttribute('data-size', 'md');
    expect(root.querySelector('[data-scope="badge"][data-part="label"]')).toHaveTextContent(
      'Draft',
    );
  });

  it('emits variant, color and size', () => {
    const { container } = render(
      <Badge variant="solid" color="success" size="lg">
        Paid
      </Badge>,
    );
    const root = container.querySelector('.apui-badge')!;
    expect(root).toHaveAttribute('data-variant', 'solid');
    expect(root).toHaveAttribute('data-color', 'success');
    expect(root).toHaveAttribute('data-size', 'lg');
  });

  it('renders a decorative dot and icon, and arrows mirror', () => {
    const { container } = render(
      <Badge dot leadingIcon="arrow-right">
        Up
      </Badge>,
    );
    const dot = container.querySelector('[data-part="dot"]')!;
    const icon = container.querySelector('[data-part="icon"]')!;
    expect(dot).toHaveAttribute('aria-hidden', 'true');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).toHaveAttribute('data-mirror', '');
    expect(icon.querySelector('svg')).not.toBeNull();
  });

  it('takes an icon node over leadingIcon, part classes and a ref', () => {
    const ref = createRef<HTMLSpanElement>();
    const { container } = render(
      <Badge ref={ref} leadingIcon="check" icon={<b>!</b>} classes={{ label: 'x' }} id="b1">
        New
      </Badge>,
    );
    expect(container.querySelector('[data-part="icon"] b')).not.toBeNull();
    expect(container.querySelector('[data-part="icon"] svg')).toBeNull();
    expect(container.querySelector('[data-part="label"]')).toHaveClass('x');
    expect(ref.current).toBe(screen.getByText('New').parentElement);
  });
});
