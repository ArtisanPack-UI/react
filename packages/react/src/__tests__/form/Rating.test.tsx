import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Rating, type RatingProps } from '../../components/form/Rating/Rating';

const declaredProps: (keyof RatingProps)[] = [
  'value',
  'defaultValue',
  'max',
  'readonly',
  'disabled',
  'size',
  'count',
  'label',
  'valueLabel',
  'countLabel',
  'classes',
];
const declaredEvents: (keyof RatingProps)[] = ['onValueChange'];

describe('Rating', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Rating, 'Rating', {
      declared: { props: declaredProps, events: declaredEvents },
      // The fixture sets value, which wins over defaultValue; covered below.
      ignoreEffects: ['defaultValue'],
    });
  });

  it('is one image with a text alternative when read-only', () => {
    const { container } = render(<Rating readonly value={4.2} count={17} />);
    const root = screen.getByRole('img', { name: '4.2 out of 5' });
    expect(root).toHaveAttribute('data-readonly');
    expect(container.querySelectorAll('[data-part="star"][data-filled]')).toHaveLength(4);
    expect(container.querySelector('[data-part="value"]')).toHaveTextContent('4.2');
    expect(container.querySelector('[data-part="count"]')).toHaveTextContent('(17 reviews)');
    expect(screen.queryAllByRole('radio')).toHaveLength(0);
  });

  it('rounds to the nearest half star', () => {
    const { container } = render(<Rating readonly value={3.4} />);
    expect(container.querySelectorAll('[data-part="star"][data-filled]')).toHaveLength(3);
    expect(container.querySelectorAll('[data-part="star"][data-half]')).toHaveLength(1);
  });

  it('uses the singular count for one review', () => {
    const { container } = render(<Rating readonly value={5} count={1} />);
    expect(container.querySelector('[data-part="count"]')).toHaveTextContent('(1 review)');
  });

  it('is a radiogroup of named native radios as an input', () => {
    const onValueChange = vi.fn();
    render(<Rating label="Rate the viewing" defaultValue={2} onValueChange={onValueChange} />);
    const group = screen.getByRole('radiogroup', { name: 'Rate the viewing' });
    const radios = screen.getAllByRole('radio') as HTMLInputElement[];
    expect(group).toHaveAttribute('data-size', 'md');
    expect(radios).toHaveLength(5);
    expect(new Set(radios.map((radio) => radio.name)).size).toBe(1);
    expect(screen.getByRole('radio', { name: '2 out of 5' })).toBeChecked();
    fireEvent.click(screen.getByRole('radio', { name: '4 out of 5' }));
    expect(onValueChange).toHaveBeenCalledWith(4);
    expect(screen.getByRole('radio', { name: '4 out of 5' })).toBeChecked();
  });

  it('fills the label templates', () => {
    const { container } = render(
      <Rating max={10} count={3} valueLabel="Note :value sur :max" countLabel=":count avis" />,
    );
    expect(screen.getAllByRole('radio')).toHaveLength(10);
    expect(screen.getByRole('radio', { name: 'Note 2 sur 10' })).toBeInTheDocument();
    expect(container.querySelector('[data-part="count"]')).toHaveTextContent('3 avis');
  });

  it('disables every radio', () => {
    render(<Rating disabled />);
    for (const radio of screen.getAllByRole('radio')) expect(radio).toBeDisabled();
  });
});
