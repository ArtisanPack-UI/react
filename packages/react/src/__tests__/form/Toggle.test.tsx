import { createRef, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Toggle, type ToggleProps } from '../../components/form/Toggle/Toggle';

const declaredProps: (keyof ToggleProps)[] = [
  'checked',
  'defaultChecked',
  'size',
  'color',
  'label',
  'description',
  'error',
  'invalid',
  'disabled',
  'required',
  'classes',
];
const declaredEvents: (keyof ToggleProps)[] = ['onCheckedChange'];

describe('Toggle', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Toggle, 'Toggle', {
      declared: { props: declaredProps, events: declaredEvents },
    });
  });

  it('renders a switch in the contract anatomy', () => {
    const { container } = render(
      <Toggle id="t" label="Dark mode" description="Follows the system." error="Bad" />,
    );
    const root = container.firstElementChild!;
    expect(root).toHaveClass('apui-toggle');
    expect(root).toHaveAttribute('data-size', 'md');
    expect(root).toHaveAttribute('data-color', 'primary');
    expect(root).toHaveAttribute('data-state', 'unchecked');
    expect([...root.children].map((el) => el.getAttribute('data-part'))).toEqual([
      'track',
      'label',
      'description',
      'error',
    ]);
    const control = screen.getByRole('switch', { name: 'Dark mode' });
    expect(control).toHaveAttribute('aria-describedby', 't-description t-error');
    expect(root.querySelector('[data-part="thumb"]')).toHaveAttribute('aria-hidden', 'true');
  });

  it('reports checked-change uncontrolled and updates data-state', () => {
    const onCheckedChange = vi.fn();
    const { container } = render(<Toggle label="A" onCheckedChange={onCheckedChange} />);
    fireEvent.click(screen.getByRole('switch'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(container.firstElementChild).toHaveAttribute('data-state', 'checked');
  });

  it('works controlled', () => {
    function Controlled() {
      const [on, setOn] = useState(true);
      return <Toggle label="A" checked={on} onCheckedChange={setOn} />;
    }
    render(<Controlled />);
    const control = screen.getByRole('switch');
    expect(control).toBeChecked();
    fireEvent.click(control);
    expect(control).not.toBeChecked();
  });

  it('sets disabled and invalid', () => {
    const { container } = render(<Toggle label="A" disabled invalid />);
    expect(screen.getByRole('switch')).toBeDisabled();
    expect(container.firstElementChild).toHaveAttribute('data-disabled', '');
    expect(screen.getByRole('switch')).toHaveAttribute('aria-invalid', 'true');
  });

  it('forwards the ref and renders on the server', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Toggle ref={ref} label="A" />);
    expect(ref.current).toBe(screen.getByRole('switch'));
    expect(renderToString(<Toggle label="B" defaultChecked />)).toContain('data-state="checked"');
  });
});
