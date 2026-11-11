import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Step, Steps, type StepsProps } from '../../components/navigation/Steps/Steps';

const declaredProps: (keyof StepsProps)[] = [
  'steps',
  'value',
  'orientation',
  'clickable',
  'label',
  'completeLabel',
  'errorLabel',
  'classes',
];

const states = (container: HTMLElement) =>
  [...container.querySelectorAll('li[data-part="step"]')].map((li) =>
    li.getAttribute('data-state'),
  );

describe('Steps', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Steps, 'Steps', {
      declared: { props: declaredProps, events: ['onValueChange'] },
    });
  });

  it('composes an ordered list from Step children', () => {
    const { container } = render(
      <Steps value={2} label="Listing progress">
        <Step title="Basics" description="Title and type" />
        <Step title="Location" />
        <Step title="Pricing" />
      </Steps>,
    );
    const list = screen.getByRole('list', { name: 'Listing progress' });
    expect(list).toHaveClass('apui-steps');
    expect(list).toHaveAttribute('data-orientation', 'horizontal');
    expect(states(container)).toEqual(['complete', 'current', 'upcoming']);
    expect(container.querySelector('[aria-current="step"]')).toHaveTextContent('Location');
    expect(
      [...container.querySelector('li')!.children].map((el) => el.getAttribute('data-part')),
    ).toEqual(['marker', 'title', 'connector', 'description']);
  });

  it('marks complete and error steps with icons and hidden text', () => {
    const { container } = render(
      <Steps value={3}>
        <Step title="A" />
        <Step title="B" state="error" />
        <Step title="C" />
        <Step title="D" />
      </Steps>,
    );
    const markers = container.querySelectorAll('[data-part="marker"]');
    expect(states(container)).toEqual(['complete', 'error', 'current', 'upcoming']);
    expect(markers[0]!.querySelector('svg')).not.toBeNull();
    expect(markers[0]).toHaveTextContent('Completed');
    expect(markers[1]).toHaveTextContent('Error');
    expect(markers[2]).toHaveTextContent('3');
    expect(container.querySelectorAll('[data-part="connector"][aria-hidden="true"]')).toHaveLength(
      4,
    );
  });

  it('renders steps data as the same children', () => {
    const { container } = render(
      <Steps
        value={2}
        orientation="vertical"
        steps={[{ title: 'Cart', description: 'Two items' }, { title: 'Shipping' }]}
      />,
    );
    expect(container.querySelector('ol')).toHaveAttribute('data-orientation', 'vertical');
    expect(states(container)).toEqual(['complete', 'current']);
    expect(container.querySelector('[data-part="description"]')).toHaveTextContent('Two items');
  });

  it('turns completed steps into buttons when clickable', async () => {
    const onValueChange = vi.fn();
    render(
      <Steps
        value={3}
        clickable
        onValueChange={onValueChange}
        steps={[{ title: 'Cart' }, { title: 'Shipping' }, { title: 'Payment' }]}
      />,
    );
    expect(screen.getAllByRole('button')).toHaveLength(2);
    await userEvent.click(screen.getByRole('button', { name: 'Shipping' }));
    expect(onValueChange).toHaveBeenCalledWith(2);
  });

  it('takes translated state labels and per-part classes', () => {
    const { container } = render(
      <Steps
        value={2}
        completeLabel="Erledigt"
        classes={{ root: 'r', step: 's', title: 't' }}
        steps={[{ title: 'A' }, { title: 'B' }]}
      />,
    );
    expect(container.querySelector('[data-part="marker"]')).toHaveTextContent('Erledigt');
    expect(container.querySelector('ol')).toHaveClass('apui-steps', 'r');
    expect(container.querySelector('li')).toHaveClass('s');
    expect(container.querySelector('[data-part="title"]')).toHaveClass('t');
  });

  it('forwards the ref to the list', () => {
    const ref = createRef<HTMLOListElement>();
    render(<Steps ref={ref} steps={[{ title: 'A' }]} />);
    expect(ref.current?.tagName).toBe('OL');
  });
});
