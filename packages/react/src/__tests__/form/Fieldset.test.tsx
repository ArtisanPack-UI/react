import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Fieldset, type FieldsetProps } from '../../components/form/Fieldset/Fieldset';

const declaredProps: (keyof FieldsetProps)[] = [
  'variant',
  'title',
  'description',
  'disabled',
  'classes',
];

describe('Fieldset', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Fieldset, 'Fieldset', {
      declared: { props: declaredProps, events: [] },
    });
  });

  it('renders a native fieldset named by its legend', () => {
    const { container } = render(
      <Fieldset title="Contact" description="Who to reach.">
        <input aria-label="Email" />
      </Fieldset>,
    );
    const root = container.firstElementChild!;
    expect(root.tagName).toBe('FIELDSET');
    expect(root).toHaveAttribute('data-variant', 'panel');
    expect(screen.getByRole('group', { name: /^Contact/ })).toBe(root);
    expect(
      [...root.querySelectorAll('[data-scope="fieldset"]')].map((el) =>
        el.getAttribute('data-part'),
      ),
    ).toEqual(['legend', 'title', 'description']);
  });

  it('renders no legend without a title or description', () => {
    const { container } = render(<Fieldset>Body</Fieldset>);
    expect(container.querySelector('legend')).toBeNull();
  });

  it('disables every control inside', () => {
    const { container } = render(
      <Fieldset title="A" disabled variant="plain">
        <input aria-label="X" />
      </Fieldset>,
    );
    expect(container.firstElementChild).toHaveAttribute('data-disabled', '');
    expect(container.firstElementChild).toHaveAttribute('data-variant', 'plain');
    expect(screen.getByLabelText('X')).toBeDisabled();
  });
});
