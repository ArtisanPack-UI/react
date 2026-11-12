import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from '../../data/Avatar/Avatar';
import { Badge } from '../../data/Badge/Badge';
import { List, ListItem } from './ListItem';

const meta: Meta<typeof ListItem> = {
  title: 'Layout/ListItem',
  component: ListItem,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A row with leading, title, description and trailing parts. href or interactive turns the title into a link or button covering the row. Rows go in a List.',
      },
    },
  },
  args: { title: 'Olivia Rhye', description: 'olivia@company.com' },
};

export default meta;
type Story = StoryObj<typeof ListItem>;

export const Default: Story = {};

export const People: Story = {
  render: () => (
    <List variant="bordered" style={{ maxWidth: 420 }}>
      <ListItem
        title="Olivia Rhye"
        description="olivia@company.com"
        leading={<Avatar name="Olivia Rhye" />}
        trailing={<Badge color="primary">Admin</Badge>}
      />
      <ListItem
        title="Phoenix Baker"
        description="phoenix@company.com"
        href="#"
        selected
        leading={<Avatar name="Phoenix Baker" />}
        trailing={<Badge>Editor</Badge>}
      />
      <ListItem
        title="Demi Wilkinson"
        description="Invitation pending"
        disabled
        leading={<Avatar name="Demi Wilkinson" />}
      />
    </List>
  ),
};

export const Notifications: Story = {
  render: () => (
    <List variant="divided" style={{ maxWidth: 420 }}>
      <ListItem
        interactive
        leadingIcon="mail"
        title="Offer received"
        description="Lakeview Lofts · $248,000"
        trailing="2m"
      />
      <ListItem
        interactive
        leadingIcon="calendar"
        title="Viewing booked"
        description="Thu, Nov 12 · 11:00"
        trailing="1h"
      />
    </List>
  ),
};
