import { createRef } from 'react';
import { renderToString } from 'react-dom/server';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Range, formatRangeValue, type RangeProps } from '../../components/form/Range/Range';

const declaredProps: (keyof RangeProps)[] = [
  'min',
  'max',
  'step',
  'value',
  'defaultValue',
  'dual',
  'showValue',
  'format',
  'marks',
  'color',
  'size',
  'label',
  'hint',
  'error',
  'invalid',
  'disabled',
  'thumbLabels',
  'classes',
];
const declaredEvents: (keyof RangeProps)[] = ['onValueChange'];

describe('Range', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Range, 'Range', {
      declared: { props: declaredProps, events: declaredEvents },
      // The thumb names show only with dual, and the fixture's value overrides defaultValue.
      ignoreEffects: ['thumbLabels', 'defaultValue'],
    });
  });

  it('renders the contract anatomy with the fill position inline', () => {
    const { container } = render(
      <Range
        id="r"
        label="Radius"
        max={50}
        value={20}
        format="{value} km"
        hint="Hint"
        error="Bad"
        marks={[
          { value: 0, label: '0 km' },
          { value: 50, label: '50 km' },
        ]}
      />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass('apui-range');
    expect(root).toHaveAttribute('data-size', 'md');
    expect(root).toHaveAttribute('data-color', 'primary');
    expect(root).toHaveAttribute('data-show-value', 'focus');
    expect(root.style.getPropertyValue('--apui-_from')).toBe('0%');
    expect(root.style.getPropertyValue('--apui-_to')).toBe('40%');
    const slider = screen.getByRole('slider', { name: 'Radius' });
    expect(slider).toHaveAttribute('aria-valuetext', '20 km');
    expect(slider).toHaveAttribute('data-thumb', 'end');
    expect(slider).toHaveAttribute('aria-describedby', 'r-hint r-error');
    expect(container.querySelector('[data-part="bubble"]')).toHaveTextContent('20 km');
    const marks = container.querySelectorAll<HTMLElement>('[data-part="mark"]');
    expect(marks[1].style.getPropertyValue('--apui-_at')).toBe('100%');
  });

  it('defaults to the midpoint and reports numbers', () => {
    const onValueChange = vi.fn();
    const { container } = render(<Range label="A" onValueChange={onValueChange} />);
    const slider = screen.getByRole('slider') as HTMLInputElement;
    expect(slider.value).toBe('50');
    fireEvent.change(slider, { target: { value: '70' } });
    expect(onValueChange).toHaveBeenCalledWith(70);
    expect((container.firstElementChild as HTMLElement).style.getPropertyValue('--apui-_to')).toBe(
      '70%',
    );
  });

  it('names dual thumbs and keeps them from crossing', () => {
    const onValueChange = vi.fn();
    render(
      <Range
        label="Price"
        dual
        defaultValue={[20, 60]}
        thumbLabels={{ start: 'Desde' }}
        onValueChange={onValueChange}
      />,
    );
    const [start, end] = screen.getAllByRole('slider') as HTMLInputElement[];
    expect(start).toHaveAccessibleName('Price Desde');
    expect(end).toHaveAccessibleName('Price Maximum');
    fireEvent.change(start, { target: { value: '80' } });
    expect(onValueChange).toHaveBeenLastCalledWith([60, 60]);
    fireEvent.change(end, { target: { value: '10' } });
    expect(onValueChange).toHaveBeenLastCalledWith([60, 60]);
  });

  it('omits the bubble when showValue is never', () => {
    const { container } = render(<Range label="A" showValue="never" />);
    expect(container.querySelector('[data-part="bubble"]')).toBeNull();
  });

  it('formats with a template', () => {
    expect(formatRangeValue(200, '${value}k')).toBe('$200k');
    expect(formatRangeValue(3)).toBe('3');
  });

  it('forwards the ref and renders on the server', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Range ref={ref} label="A" />);
    expect(ref.current).toBe(screen.getByRole('slider'));
    expect(renderToString(<Range label="B" />)).toContain('class="apui-range"');
  });

  it('posts dual thumbs into one array and names each thumb once', () => {
    const { container } = render(
      <Range dual name="price" aria-label="Price" aria-required min={0} max={100} />,
    );
    const [start, end] = [...container.querySelectorAll('input')];
    expect(start).toHaveAttribute('name', 'price[]');
    expect(end).toHaveAttribute('name', 'price[]');
    expect(start).not.toHaveAttribute('aria-label');
    expect(end).not.toHaveAttribute('aria-label');
    expect(start).toHaveAttribute('aria-required', 'true');
    expect(end).not.toHaveAttribute('aria-required');
    expect(screen.getAllByRole('slider').map((el) => el.getAttribute('aria-labelledby'))).toEqual([
      `${start.id}-aria-label ${start.id}-start-label`,
      `${start.id}-aria-label ${start.id}-end-label`,
    ]);
    expect(screen.getByRole('slider', { name: 'Price Minimum' })).toBe(start);
    expect(screen.getByRole('slider', { name: 'Price Maximum' })).toBe(end);
    const form = document.createElement('form');
    form.append(start.cloneNode(), end.cloneNode());
    expect(new FormData(form).getAll('price[]')).toEqual(['0', '100']);
  });

  it('keeps name and aria-label on the one input without dual', () => {
    render(<Range name="radius" aria-label="Radius" />);
    const control = screen.getByRole('slider', { name: 'Radius' });
    expect(control).toHaveAttribute('name', 'radius');
  });
});
