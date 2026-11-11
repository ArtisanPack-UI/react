import { createRef, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import {
  DatePicker,
  type DatePickerProps,
  type DatePickerValue,
} from '../../components/form/DatePicker/DatePicker';

const declaredProps: (keyof DatePickerProps)[] = [
  'value',
  'defaultValue',
  'mode',
  'time',
  'step',
  'timeZone',
  'locale',
  'min',
  'max',
  'disabledDates',
  'weekStartsOn',
  'format',
  'size',
  'label',
  'hint',
  'error',
  'invalid',
  'disabled',
  'readonly',
  'required',
  'placeholder',
  'name',
  'open',
  'defaultOpen',
  'portal',
  'footer',
  'triggerLabel',
  'previousLabel',
  'nextLabel',
  'calendarLabel',
  'timeLabel',
  'endLabel',
  'timeZoneLabel',
  'classes',
];

const part = (root: ParentNode, name: string) =>
  root.querySelector(`[data-scope="date-picker"][data-part="${name}"]`);

const root = () => document.querySelector('.apui-date-picker') as HTMLElement;

/** Fires an event and lets the machine settle: Zag sends its updates in a microtask. */
const interact = (fire: () => void) =>
  act(async () => {
    fire();
  });

describe('DatePicker', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(DatePicker, 'DatePicker', {
      declared: { props: declaredProps, events: ['onValueChange', 'onOpenChange'] },
      // These only show in time mode, with a real date, or once the calendar is used.
      ignoreEffects: [
        'defaultValue',
        'defaultOpen',
        'step',
        'timeZone',
        'min',
        'max',
        'disabledDates',
        'format',
        'timeLabel',
        'endLabel',
        'timeZoneLabel',
      ],
    });
  });

  it('renders every part on the server with portal off', () => {
    const html = renderToStaticMarkup(
      <DatePicker
        open
        portal={false}
        label="Move-in date"
        hint="MM/DD/YYYY"
        error="That date doesn't exist."
        required
        time
        timeZone="Europe/Madrid"
        footer="Thu, Nov 12"
        defaultValue="2031-03-12"
      />,
    );
    const host = document.createElement('div');
    host.innerHTML = html;
    for (const name of [
      'root',
      'label',
      'required',
      'box',
      'trigger',
      'control',
      'hint',
      'time-zone',
      'error',
      'positioner',
      'content',
      'view',
      'view-control',
      'prev-trigger',
      'range-text',
      'next-trigger',
      'table',
      'table-head',
      'table-row',
      'table-header',
      'table-body',
      'table-cell',
      'table-cell-trigger',
      'time',
      'time-label',
      'time-list',
      'time-option',
      'footer',
    ]) {
      expect(part(host, name), name).not.toBeNull();
    }
  });

  it('wires the label, the input and the calendar button', () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <DatePicker
        ref={ref}
        id="move-in"
        label="Move-in date"
        hint="MM/DD/YYYY"
        defaultValue="2026-11-12"
      />,
    );
    const input = screen.getByLabelText('Move-in date');
    expect(input).toBe(ref.current);
    expect(input).toHaveAttribute('data-part', 'control');
    expect(input).toHaveAttribute('placeholder', 'MM/DD/YYYY');
    expect(input).toHaveAccessibleDescription('MM/DD/YYYY');
    expect(input).toHaveValue('11/12/2026');
    const trigger = screen.getByRole('button', { name: 'Choose date' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-controls', 'move-in-content');
    expect(root()).toHaveAttribute('data-size', 'md');
    expect(root()).toHaveAttribute('data-mode', 'single');
  });

  it('renders the month as a grid with Intl names in the locale', () => {
    render(
      <DatePicker open portal={false} label="Date" locale="fr-FR" defaultValue="2026-11-12" />,
    );
    expect(screen.getByRole('grid')).toHaveAttribute('data-part', 'table');
    expect(part(document, 'range-text')).toHaveTextContent('novembre 2026');
    expect(part(document, 'table-header')).toHaveTextContent('lun.');
    const selected = document.querySelector('[data-part="table-cell-trigger"][data-selected]');
    expect(selected).toHaveAttribute('data-value', '2026-11-12');
    expect(selected!.parentElement).toHaveAttribute('aria-selected', 'true');
  });

  it('chooses a day and reports its ISO value', async () => {
    const onValueChange = vi.fn();
    function Controlled() {
      const [value, setValue] = useState<DatePickerValue>('2026-11-12');
      return (
        <DatePicker
          label="Date"
          portal={false}
          value={value}
          onValueChange={(next) => {
            onValueChange(next);
            setValue(next);
          }}
        />
      );
    }
    render(<Controlled />);
    await interact(() => fireEvent.click(screen.getByRole('button', { name: 'Choose date' })));
    await interact(() =>
      fireEvent.click(
        document.querySelector('[data-part="table-cell-trigger"][data-value="2026-11-20"]')!,
      ),
    );
    expect(onValueChange).toHaveBeenCalledWith('2026-11-20');
  });

  it('reports open-change from the trigger', async () => {
    const onOpenChange = vi.fn();
    render(<DatePicker label="Date" portal={false} onOpenChange={onOpenChange} />);
    await interact(() => fireEvent.click(screen.getByRole('button', { name: 'Choose date' })));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(part(document, 'content')).not.toHaveAttribute('hidden');
  });

  it('renders two inputs and two hidden values in range mode', () => {
    render(
      <DatePicker
        mode="range"
        name="stay"
        label="Stay"
        defaultValue={['2026-11-12', '2026-11-18']}
      />,
    );
    const inputs = document.querySelectorAll('input[data-part="control"]');
    expect(inputs).toHaveLength(2);
    expect(inputs[1]).toHaveAccessibleName('End date');
    const hidden = document.querySelectorAll('input[type="hidden"][name="stay[]"]');
    expect([...hidden].map((el) => (el as HTMLInputElement).value)).toEqual([
      '2026-11-12',
      '2026-11-18',
    ]);
  });

  it('adds the time listbox and the time zone in time mode', () => {
    render(
      <DatePicker
        open
        portal={false}
        time
        step={60}
        timeZone="Europe/Madrid"
        label="Viewing"
        defaultValue="2026-11-12T11:00"
      />,
    );
    const list = screen.getByRole('listbox', { name: 'Time' });
    expect(list.querySelectorAll('[role="option"]')).toHaveLength(24);
    expect(screen.getByRole('option', { name: '11:00' })).toHaveAttribute('aria-selected', 'true');
    expect(part(document, 'time-zone')).toHaveTextContent('Time zone: Europe/Madrid');
    expect(screen.getByRole('button', { name: 'Choose date and time' })).toBeInTheDocument();
    expect(screen.getByLabelText('Viewing')).toHaveValue('11/12/2026 11:00');
  });

  it('marks the field invalid with an error', () => {
    render(<DatePicker label="Closing date" error="That date doesn't exist." />);
    expect(root()).toHaveAttribute('data-invalid', '');
    expect(screen.getByLabelText('Closing date')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText('Closing date')).toHaveAccessibleDescription(
      "That date doesn't exist.",
    );
  });

  it('takes translated labels', () => {
    render(
      <DatePicker
        open
        portal={false}
        label="Date"
        triggerLabel="Choisir une date"
        previousLabel="Mois précédent"
        nextLabel="Mois suivant"
      />,
    );
    expect(screen.getByRole('button', { name: 'Choisir une date' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mois précédent' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mois suivant' })).toBeInTheDocument();
  });
});
