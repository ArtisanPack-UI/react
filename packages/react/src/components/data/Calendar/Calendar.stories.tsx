import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Calendar, type CalendarEvent, type CalendarProps, type CalendarView } from './Calendar';

const events: CalendarEvent[] = [
  {
    id: 1,
    start: '2026-11-02T09:00',
    end: '2026-11-02T10:00',
    title: 'Team meeting',
    color: 'error',
    category: 'Marketing',
    description: 'Weekly sync with the marketing team.',
  },
  {
    id: 2,
    start: '2026-11-03T10:00',
    end: '2026-11-03T12:00',
    title: 'Marketing course',
    color: 'info',
    category: 'Learning',
  },
  {
    id: 3,
    start: '2026-11-03T13:00',
    title: 'Lunch · Edgehill Grill',
    color: 'success',
    category: 'Personal',
  },
  { id: 4, start: '2026-11-05', title: 'Anna’s birthday', color: 'accent', category: 'People' },
  {
    id: 5,
    start: '2026-11-09T11:00',
    title: 'Upgrade Slack plan',
    color: 'secondary',
    category: 'Admin',
  },
  {
    id: 6,
    start: '2026-11-12T11:00',
    title: 'Viewing · Lakeview',
    color: 'primary',
    category: 'Viewings',
  },
  {
    id: 7,
    start: '2026-11-12T16:00',
    title: 'Hubstaff broadcast',
    color: 'info',
    category: 'Learning',
  },
  {
    id: 8,
    start: '2026-11-12T18:00',
    title: 'Board dinner',
    color: 'success',
    category: 'Personal',
  },
  {
    id: 9,
    start: '2026-11-13T09:30',
    title: 'Meet a new intern',
    color: 'accent',
    category: 'People',
  },
  {
    id: 10,
    start: '2026-11-17',
    title: 'Facebook campaign',
    color: 'error',
    category: 'Marketing',
  },
  {
    id: 11,
    start: '2026-11-19T10:00',
    end: '2026-11-19T11:30',
    title: 'Design review',
    color: 'primary',
    category: 'Viewings',
  },
  {
    id: 12,
    start: '2026-11-24',
    title: 'Open house · Grove',
    color: 'success',
    category: 'Personal',
  },
  { id: 13, start: '2026-11-26', title: 'Thanksgiving', color: 'neutral', category: 'Holidays' },
];

const base = { events, date: '2026-11-07', today: '2026-11-07', weekStartsOn: 1 };

/**
 * Owns the date and view, seeded from the story's args (and reseeded when a
 * control changes them), so previous, next, the view tabs and "+N more" work
 * in every story.
 */
function StatefulCalendar(args: CalendarProps) {
  const [seed, setSeed] = useState({ view: args.view, date: args.date });
  const [view, setView] = useState<CalendarView>(args.view ?? 'month');
  const [date, setDate] = useState(args.date);
  if (seed.view !== args.view || seed.date !== args.date) {
    setSeed({ view: args.view, date: args.date });
    setView(args.view ?? 'month');
    setDate(args.date);
  }
  return (
    <Calendar
      {...args}
      view={view}
      date={date}
      onViewChange={(next) => {
        setView(next);
        args.onViewChange?.(next);
      }}
      onDateChange={(next) => {
        setDate(next);
        args.onDateChange?.(next);
      }}
    />
  );
}

const meta: Meta<typeof Calendar> = {
  title: 'Data Display/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Events on a month grid, a week, a day or an agenda list. Tints are by category and never the only cue: each event is named by its title, category and full time, and the legend keeps the key visible.',
      },
    },
  },
  argTypes: {
    view: { control: 'select', options: ['month', 'week', 'day', 'agenda'] },
  },
  render: (args) => <StatefulCalendar {...args} />,
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Month: Story = { args: { ...base, creatable: true } };

export const Week: Story = { args: { ...base, view: 'week', date: '2026-11-12' } };

export const Day: Story = { args: { ...base, view: 'day', date: '2026-11-12' } };

export const Agenda: Story = { args: { ...base, view: 'agenda' } };

export const Controlled: Story = {
  render: (args) => {
    const [view, setView] = useState<CalendarView>('month');
    const [date, setDate] = useState('2026-11-07');
    return (
      <Calendar {...args} view={view} onViewChange={setView} date={date} onDateChange={setDate} />
    );
  },
  args: base,
};

export const RightToLeft: Story = {
  render: (args) => (
    <div dir="rtl">
      <StatefulCalendar {...args} />
    </div>
  ),
  args: base,
};
