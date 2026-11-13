import { createRef } from 'react';
import { render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import {
  registerDirectionalIcons,
  registerIcons,
  resetIcons,
} from '@artisanpack-ui/behavior/icons';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Icon, type IconProps } from '../../components/utility/Icon/Icon';

const declaredProps: (keyof IconProps)[] = [
  'name',
  'variant',
  'size',
  'color',
  'label',
  'mirror',
  'classes',
];

const root = (container: HTMLElement) => container.querySelector('.apui-icon') as HTMLElement;

afterEach(() => resetIcons());

describe('Icon', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Icon, 'Icon', { declared: { props: declaredProps, events: [] } });
  });

  it('renders a decorative registry glyph at md by default', () => {
    const ref = createRef<HTMLSpanElement>();
    const { container } = render(<Icon ref={ref} name="house" />);
    const icon = root(container);
    expect(ref.current).toBe(icon);
    expect(icon.tagName).toBe('SPAN');
    expect(icon).toHaveAttribute('data-scope', 'icon');
    expect(icon).toHaveAttribute('data-variant', 'plain');
    expect(icon).toHaveAttribute('data-size', 'md');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).not.toHaveAttribute('role');
    expect(icon).not.toHaveAttribute('data-color');
    const svg = icon.querySelector('svg[data-scope="icon"][data-part="svg"]')!;
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    expect(svg).toHaveAttribute('stroke-width', '1.5');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg.innerHTML).toContain('<path');
  });

  it('is a named image with a label', () => {
    const { container } = render(<Icon name="circle-alert" label="Payment failed" />);
    const icon = root(container);
    expect(icon).toHaveAttribute('role', 'img');
    expect(icon).toHaveAttribute('aria-label', 'Payment failed');
    expect(icon).not.toHaveAttribute('aria-hidden');
  });

  it('keeps a caller aria-label or aria-labelledby and stays exposed', () => {
    const { container, rerender } = render(<Icon name="circle-alert" aria-label="Error" />);
    expect(root(container)).toHaveAttribute('aria-label', 'Error');
    expect(root(container)).toHaveAttribute('role', 'img');
    expect(root(container)).not.toHaveAttribute('aria-hidden');
    rerender(<Icon name="circle-alert" aria-labelledby="msg" />);
    expect(root(container)).toHaveAttribute('aria-labelledby', 'msg');
    expect(root(container)).toHaveAttribute('role', 'img');
    expect(root(container)).not.toHaveAttribute('aria-hidden');
    // label still wins, and an unnamed icon is still hidden.
    rerender(<Icon name="circle-alert" label="Payment failed" aria-label="Error" />);
    expect(root(container)).toHaveAttribute('aria-label', 'Payment failed');
    rerender(<Icon name="circle-alert" />);
    expect(root(container)).toHaveAttribute('aria-hidden', 'true');
    expect(root(container)).not.toHaveAttribute('role');
  });

  it('writes size, color and the tile variant', () => {
    const { container } = render(<Icon name="wallet" variant="tile" color="success" size="xl" />);
    const icon = root(container);
    expect(icon).toHaveClass('apui-icon', 'apui-icon-tile');
    expect(icon).toHaveAttribute('data-variant', 'tile');
    expect(icon).toHaveAttribute('data-size', 'xl');
    expect(icon).toHaveAttribute('data-color', 'success');
  });

  it('mirrors directional icons unless mirror says otherwise', () => {
    const mirrored = (props: IconProps) =>
      root(render(<Icon {...props} />).container).hasAttribute('data-mirror');
    expect(mirrored({ name: 'arrow-right' })).toBe(true);
    expect(mirrored({ name: 'house' })).toBe(false);
    expect(mirrored({ name: 'arrow-right', mirror: false })).toBe(false);
    expect(mirrored({ name: 'house', mirror: true })).toBe(true);
    registerIcons({ send: '<path d="M4 12h16" />' });
    registerDirectionalIcons(['send']);
    expect(mirrored({ name: 'send' })).toBe(true);
  });

  it('draws children in place of the name', () => {
    const { container } = render(
      <Icon name="arrow-right" label="Grid">
        <svg viewBox="0 0 24 24">
          <rect width="18" height="18" x="3" y="3" />
        </svg>
      </Icon>,
    );
    const icon = root(container);
    expect(icon.querySelector('rect')).not.toBeNull();
    expect(icon.querySelector('[data-part="svg"]')).toBeNull();
    expect(icon).not.toHaveAttribute('data-mirror');
  });

  it('renders nothing inside for an unknown name, and takes classes', () => {
    const { container } = render(
      <Icon name="not-registered" className="x" classes={{ root: 'r', svg: 's' }} />,
    );
    expect(root(container)).toHaveClass('apui-icon', 'r', 'x');
    expect(root(container).querySelector('svg')).toBeNull();
    const { container: other } = render(<Icon name="house" classes={{ svg: 's' }} />);
    expect(other.querySelector('svg')).toHaveClass('s');
  });
});
