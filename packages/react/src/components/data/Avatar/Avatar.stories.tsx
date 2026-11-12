import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, AvatarGroup } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Data/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A person or organization as an image, initials or an icon. Initials take a color hashed from the name; the status is announced in words.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    shape: { control: 'select', options: ['circle', 'square'] },
    status: { control: 'select', options: [undefined, 'online', 'away', 'offline'] },
  },
  args: { name: 'Olivia Rhye' },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Initials: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Avatar key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

export const StatusAndShape: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Avatar name="Olivia Rhye" status="online" />
      <Avatar name="Phoenix Baker" status="away" />
      <Avatar name="Lana Steiner" status="offline" />
      <Avatar name="Apexify" shape="square" color="neutral" />
      <Avatar />
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <AvatarGroup
      label="Project members"
      size="sm"
      max={4}
      avatars={[
        { name: 'Olivia Rhye' },
        { name: 'Phoenix Baker' },
        { name: 'Lana Steiner' },
        { name: 'Demi Wilkinson' },
        { name: 'Candice Wu' },
        { name: 'Drew Cano' },
      ]}
    />
  ),
};
