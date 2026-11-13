import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Text, type TextProps } from '../../components/layout/Text/Text';

const declaredProps: (keyof TextProps)[] = [
  'as',
  'size',
  'tone',
  'weight',
  'truncate',
  'clamp',
  'classes',
];

describe('Text', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Text, 'Text', { declared: { props: declaredProps, events: [] } });
  });

  it('renders a paragraph with the default size, tone and weight', () => {
    render(<Text>Body copy</Text>);
    const text = screen.getByText('Body copy');
    expect(text.tagName).toBe('P');
    expect(text).toHaveClass('apui-text');
    expect(text).toHaveAttribute('data-size', 'md');
    expect(text).toHaveAttribute('data-tone', 'default');
    expect(text).toHaveAttribute('data-weight', 'regular');
  });

  it('renders as a span with size, tone and weight', () => {
    render(
      <Text as="span" size="lead" tone="error" weight="semibold">
        Failed
      </Text>,
    );
    const text = screen.getByText('Failed');
    expect(text.tagName).toBe('SPAN');
    expect(text).toHaveAttribute('data-size', 'lead');
    expect(text).toHaveAttribute('data-tone', 'error');
    expect(text).toHaveAttribute('data-weight', 'semibold');
  });

  it('copies string content to title when it is cut, keeping an explicit title', () => {
    const { rerender } = render(<Text truncate>ARK Genomic & Co</Text>);
    expect(screen.getByText('ARK Genomic & Co')).toHaveAttribute('title', 'ARK Genomic & Co');
    expect(screen.getByText('ARK Genomic & Co')).toHaveAttribute('data-truncate', '');
    rerender(
      <Text truncate title="Full">
        Short
      </Text>,
    );
    expect(screen.getByText('Short')).toHaveAttribute('title', 'Full');
  });

  it('joins text-only children into the title of cut text', () => {
    const count = 3;
    const { container } = render(
      <Text clamp={2}>
        {count} items in {'cart'}
      </Text>,
    );
    expect(container.firstElementChild).toHaveAttribute('title', '3 items in cart');
    const mixed = render(
      <Text truncate>
        {count} <strong>items</strong>
      </Text>,
    );
    expect(mixed.container.firstElementChild!.hasAttribute('title')).toBe(false);
  });

  it('clamps to a number of lines', () => {
    render(
      <Text clamp={3} style={{ color: 'red' }}>
        Long
      </Text>,
    );
    const text = screen.getByText('Long');
    expect(text).toHaveAttribute('data-clamp', '3');
    expect(text.style.getPropertyValue('--apui-text-clamp')).toBe('3');
    expect(text.style.color).toBe('red');
  });
});
