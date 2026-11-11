import { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { ColorPicker, type ColorPickerProps } from '../../components/form/ColorPicker/ColorPicker';

const declaredProps: (keyof ColorPickerProps)[] = [
  'value',
  'defaultValue',
  'format',
  'alpha',
  'swatches',
  'size',
  'label',
  'hint',
  'error',
  'invalid',
  'disabled',
  'required',
  'open',
  'defaultOpen',
  'portal',
  'triggerLabel',
  'areaLabel',
  'hueLabel',
  'alphaLabel',
  'formatLabel',
  'eyeDropperLabel',
  'swatchesLabel',
  'classes',
];
const declaredEvents: (keyof ColorPickerProps)[] = [
  'onValueChange',
  'onOpenChange',
  'onFormatChange',
];

const part = (name: string) =>
  document.querySelector(`[data-scope="color-picker"][data-part="${name}"]`)!;

describe('ColorPicker', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(ColorPicker, 'ColorPicker', {
      declared: { props: declaredProps, events: declaredEvents },
      // The fixture sets value and open, which win over the defaults; covered below.
      ignoreEffects: ['defaultValue', 'defaultOpen'],
    });
  });

  it('renders the field with the text value outside the popover', () => {
    render(
      <ColorPicker
        id="c"
        label="Primary"
        hint="H"
        error="E"
        required
        defaultValue="#1F74BF"
        portal={false}
      />,
    );
    const control = screen.getByLabelText(/Primary/) as HTMLInputElement;
    expect(control).toHaveAttribute('data-part', 'control');
    expect(control.value).toBe('#1f74bf');
    expect(control).toHaveAttribute('aria-describedby', 'c-hint c-error');
    expect(control).toHaveAttribute('aria-invalid', 'true');
    expect(control.closest('[data-part="box"]')).not.toBeNull();
    expect(part('root')).toHaveClass('apui-color-picker');
    expect(part('root')).toHaveAttribute('data-format', 'hex');
    const trigger = screen.getByRole('button', { name: 'Choose a color' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(part('content')).toHaveAttribute('hidden');
  });

  it('opens the popover with the area, sliders, format select and swatches', async () => {
    const onOpenChange = vi.fn();
    render(
      <ColorPicker
        label="Accent"
        defaultValue="#1f74bf"
        swatches={['#1f74bf', '#0b9488']}
        portal={false}
        onOpenChange={onOpenChange}
      />,
    );
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Choose a color' }));
    });
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('dialog', { name: 'Choose a color' })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'Saturation and brightness' })).toHaveAttribute(
      'aria-valuetext',
    );
    expect(screen.getByRole('slider', { name: 'Hue' }).getAttribute('aria-valuetext')).toMatch(
      /°$/,
    );
    expect(screen.getByRole('slider', { name: 'Opacity' })).toHaveAttribute(
      'aria-valuetext',
      '100%',
    );
    expect(screen.getByRole('combobox', { name: 'Format' })).toHaveValue('hex');
    expect(screen.getByRole('group', { name: 'Swatches' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '#1F74BF' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('reports a chosen swatch, typed text and a format switch', async () => {
    const onValueChange = vi.fn();
    const onFormatChange = vi.fn();
    render(
      <ColorPicker
        label="Accent"
        defaultValue="#1f74bf"
        swatches={['#0b9488']}
        defaultOpen
        portal={false}
        onValueChange={onValueChange}
        onFormatChange={onFormatChange}
      />,
    );
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: '#0B9488' }));
    });
    expect(onValueChange).toHaveBeenLastCalledWith('#0b9488');

    const control = screen.getByLabelText('Accent') as HTMLInputElement;
    await act(async () => {
      fireEvent.input(control, { target: { value: 'rgb(201 47 51)' } });
      fireEvent.keyDown(control, { key: 'Enter' });
    });
    expect(onValueChange).toHaveBeenLastCalledWith('#c92f33');

    await act(async () => {
      fireEvent.change(screen.getByRole('combobox', { name: 'Format' }), {
        target: { value: 'oklch' },
      });
    });
    expect(onFormatChange).toHaveBeenCalledWith('oklch');
    expect(onValueChange.mock.lastCall![0]).toMatch(/^oklch\(/);
    expect(part('root')).toHaveAttribute('data-format', 'oklch');
  });

  it('keeps a swatch and a slider key press when controlled', async () => {
    function Controlled() {
      const [value, setValue] = useState('#1f74bf');
      return (
        <>
          <ColorPicker
            label="Accent"
            value={value}
            onValueChange={setValue}
            swatches={['#0b9488']}
            defaultOpen
            portal={false}
          />
          <output>{value}</output>
        </>
      );
    }
    render(<Controlled />);
    const control = screen.getByLabelText('Accent') as HTMLInputElement;
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: '#0B9488' }));
    });
    expect(screen.getByRole('status')).toHaveTextContent('#0b9488');
    expect(control.value).toBe('#0b9488');

    const hue = screen.getByRole('slider', { name: 'Hue' });
    await act(async () => {
      hue.focus();
      fireEvent.keyDown(hue, { key: 'ArrowRight' });
    });
    const next = screen.getByRole('status').textContent;
    expect(next).not.toBe('#0b9488');
    expect(control.value).toBe(next);
  });

  it('leaves out the opacity slider without alpha and translates labels', () => {
    render(
      <ColorPicker
        label="Brand"
        alpha={false}
        defaultValue="#1f74bf80"
        defaultOpen
        portal={false}
        triggerLabel="Elegir color"
        hueLabel="Tono"
      />,
    );
    expect(screen.queryByRole('slider', { name: 'Opacity' })).toBeNull();
    expect(screen.getByRole('slider', { name: 'Tono' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Elegir color' })).toBeInTheDocument();
    expect((screen.getByLabelText('Brand') as HTMLInputElement).value).toBe('#1f74bf');
  });

  it('hides the eyedropper without the EyeDropper API', () => {
    render(<ColorPicker label="Brand" defaultOpen portal={false} />);
    expect(part('eye-dropper-trigger')).toHaveAttribute('hidden');
    expect(part('eye-dropper-trigger')).toHaveAttribute(
      'aria-label',
      'Pick a color from the screen',
    );
  });

  it('disables the field and the popover controls', () => {
    render(<ColorPicker label="Locked" disabled defaultValue="#000000" />);
    expect(screen.getByLabelText('Locked')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Choose a color' })).toBeDisabled();
  });
});
