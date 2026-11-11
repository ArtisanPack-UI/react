import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DatePicker, type DatePickerValue } from './DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Form/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A text field with a calendar popover for a single date or a range; with `time` it is DateTime (date and time in one field). Typing a date always works; the calendar is an aid. Values are ISO strings.',
      },
    },
  },
  argTypes: {
    mode: { control: 'select', options: ['single', 'range'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    locale: { control: 'text' },
  },
  args: { label: 'Move-in date', hint: 'MM/DD/YYYY' },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<DatePickerValue>('2026-11-12');
    return <DatePicker {...args} value={value} onValueChange={setValue} />;
  },
};

export const Range: Story = {
  args: { label: 'Stay', hint: undefined, mode: 'range', disabledDates: ['2026-11-20'] },
  render: function Render(args) {
    const [value, setValue] = useState<DatePickerValue>(['2026-11-12', '2026-11-18']);
    return <DatePicker {...args} value={value} onValueChange={setValue} />;
  },
};

export const DateAndTime: Story = {
  args: { label: 'Viewing', hint: undefined, time: true, timeZone: 'Europe/Madrid' },
  render: function Render(args) {
    const [value, setValue] = useState<DatePickerValue>('2026-11-12T11:00');
    return <DatePicker {...args} value={value} onValueChange={setValue} />;
  },
};

export const OpenInPlace: Story = {
  args: { open: true, portal: false, defaultValue: '2026-11-12', footer: 'Thu, Nov 12' },
};

export const Invalid: Story = {
  args: { label: 'Closing date', error: "That date doesn't exist." },
};

export const Localized: Story = {
  args: {
    label: 'Date d’emménagement',
    hint: 'JJ/MM/AAAA',
    locale: 'fr-FR',
    triggerLabel: 'Choisir une date',
    previousLabel: 'Mois précédent',
    nextLabel: 'Mois suivant',
    calendarLabel: 'Calendrier',
    defaultValue: '2026-11-12',
  },
};

export const RightToLeft: Story = {
  args: { defaultValue: '2026-11-12', open: true, portal: false },
  decorators: [
    (Story) => (
      <div dir="rtl">
        <Story />
      </div>
    ),
  ],
};
