import type { Meta, StoryObj } from '@storybook/react-vite';
import { DatePicker } from './DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Form/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Date and time input supporting date, datetime-local, time, month, and week types. Includes label, hint, error, icon slots, and inline layout.',
      },
    },
  },
  argTypes: {
    dateType: {
      control: 'select',
      options: ['date', 'datetime-local', 'time', 'month', 'week'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  args: {},
};

export const WithLabel: Story = {
  args: {
    label: 'Start Date',
  },
};

export const DateTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <DatePicker label="Date" dateType="date" />
      <DatePicker label="Date & Time" dateType="datetime-local" />
      <DatePicker label="Time" dateType="time" />
      <DatePicker label="Month" dateType="month" />
      <DatePicker label="Week" dateType="week" />
    </div>
  ),
};

export const WithError: Story = {
  args: {
    label: 'Due Date',
    error: 'Please select a valid date.',
  },
};

export const WithIcons: Story = {
  args: {
    label: 'Event Date',
    icon: <span aria-hidden="true">📅</span>,
    iconRight: <span aria-hidden="true">🔽</span>,
  },
};

export const InlineLabel: Story = {
  args: {
    label: 'Date',
    inline: true,
  },
};
