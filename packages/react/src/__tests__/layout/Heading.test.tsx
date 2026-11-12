import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Heading, type HeadingProps } from '../../components/layout/Heading/Heading';

const declaredProps: (keyof HeadingProps)[] = ['level', 'size', 'eyebrow', 'classes'];

describe('Heading', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Heading, 'Heading', {
      declared: { props: declaredProps, events: [] },
    });
  });

  it('renders an h2 by default, with size following level', () => {
    render(<Heading>Listings</Heading>);
    const heading = screen.getByRole('heading', { level: 2, name: 'Listings' });
    expect(heading).toHaveClass('apui-heading');
    expect(heading).toHaveAttribute('data-level', '2');
    expect(heading).toHaveAttribute('data-size', '2');
  });

  it('sets level and size apart, as numbers or strings', () => {
    const { rerender } = render(
      <Heading level={3} size={5}>
        Recent activity
      </Heading>,
    );
    expect(screen.getByRole('heading', { level: 3 })).toHaveAttribute('data-size', '5');
    rerender(<Heading level="1">Title</Heading>);
    expect(screen.getByRole('heading', { level: 1 })).toHaveAttribute('data-size', '1');
  });

  it('renders the eyebrow as a paragraph just before the heading', () => {
    const { container } = render(
      <Heading eyebrow="Portfolio" classes={{ eyebrow: 'x' }}>
        Every property
      </Heading>,
    );
    const eyebrow = container.querySelector('p[data-scope="heading"][data-part="eyebrow"]')!;
    expect(eyebrow).toHaveTextContent('Portfolio');
    expect(eyebrow).toHaveClass('x');
    expect(eyebrow.nextElementSibling?.tagName).toBe('H2');
  });
});
