import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Calendar } from './Calendar';
import type { CalendarEvent } from './Calendar';

const meta: Meta<typeof Calendar> = {
  title: 'Data Display/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Interactive calendar for date selection and event display. Supports min/max dates, weekend highlighting, custom day rendering, and DaisyUI color variants.',
      },
    },
  },
  argTypes: {
    color: {
      control: 'select',
      options: [
        undefined,
        'primary',
        'secondary',
        'accent',
        'success',
        'warning',
        'error',
        'info',
        'neutral',
      ],
    },
    weekStartsOnSunday: {
      control: 'boolean',
    },
    highlightWeekends: {
      control: 'boolean',
    },
    highlightToday: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  args: {},
};

const sampleEvents: CalendarEvent[] = [
  { id: '1', title: 'Team Meeting', date: '2026-03-15', color: 'primary' },
  { id: '2', title: 'Deadline', date: '2026-03-20', color: 'error' },
  { id: '3', title: 'Launch Day', date: '2026-03-25', color: 'success' },
  { id: '4', title: 'Conference', date: '2026-03-28', endDate: '2026-03-30', color: 'info' },
];

export const WithEvents: Story = {
  args: {
    events: sampleEvents,
  },
};

export const WithSelectedDate: Story = {
  render: () => {
    const [selected, setSelected] = useState<Date>(new Date(2026, 2, 15));
    return <Calendar value={selected} onChange={setSelected} events={sampleEvents} />;
  },
};

export const ColorVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Calendar color="primary" />
      <Calendar color="secondary" />
      <Calendar color="accent" />
      <Calendar color="success" />
      <Calendar color="warning" />
      <Calendar color="error" />
      <Calendar color="info" />
      <Calendar color="neutral" />
    </div>
  ),
};

export const WithMinMaxDates: Story = {
  args: {
    minDate: new Date(2026, 2, 10),
    maxDate: new Date(2026, 2, 25),
  },
};
