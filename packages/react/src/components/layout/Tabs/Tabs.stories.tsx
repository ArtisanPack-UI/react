import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tab, Tabs } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Layout/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Switches between views of the same content: a tablist of triggers and one panel per tab. Arrow keys move between tabs and follow the text direction; activation is automatic or manual.',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['segmented', 'underline'] },
    size: { control: 'select', options: ['sm', 'md'] },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    activationMode: { control: 'select', options: ['automatic', 'manual'] },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  args: { label: 'Account' },
  render: function Render(args) {
    const [section, setSection] = useState('profile');
    return (
      <Tabs {...args} value={section} onValueChange={setSection}>
        <Tab value="profile" label="Profile" icon="user">
          Your name, photo and contact details.
        </Tab>
        <Tab value="notifications" label="Notifications" icon="mail">
          Choose what we email you about.
        </Tab>
        <Tab value="security" label="Security" icon="lock">
          Password and two-factor authentication.
        </Tab>
      </Tabs>
    );
  },
};

export const Underline: Story = {
  args: { variant: 'underline', activationMode: 'manual' },
  render: (args) => (
    <Tabs {...args}>
      <Tab value="overview" label="Overview">
        Your portfolio at a glance.
      </Tab>
      <Tab value="notifications" label="Notifications" count={4}>
        Four unread notifications.
      </Tab>
      <Tab value="history" label="Trade history">
        Every trade in the last year.
      </Tab>
      <Tab value="archived" label="Archived" disabled />
    </Tabs>
  ),
};

export const FromData: Story = {
  args: {
    size: 'sm',
    label: 'Range',
    defaultValue: 'week',
    tabs: [
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week' },
      { value: 'month', label: 'Month' },
      { value: 'year', label: 'Year' },
    ],
  },
};
