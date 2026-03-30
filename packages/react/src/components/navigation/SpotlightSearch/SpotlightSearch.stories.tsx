import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { SpotlightSearch } from './SpotlightSearch';
import type { SpotlightItem } from './SpotlightSearch';

const onSelectAction = fn();

const meta: Meta<typeof SpotlightSearch> = {
  title: 'Navigation/SpotlightSearch',
  component: SpotlightSearch,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SpotlightSearch>;

const sampleItems: SpotlightItem[] = [
  { key: 'home', label: 'Home', description: 'Go to the home page' },
  { key: 'about', label: 'About', description: 'Learn about us' },
  { key: 'contact', label: 'Contact', description: 'Get in touch' },
  { key: 'settings', label: 'Settings', description: 'Manage preferences' },
  { key: 'profile', label: 'Profile', description: 'View your profile' },
];

const groupedItems: SpotlightItem[] = [
  { key: 'home', label: 'Home', group: 'Pages' },
  { key: 'about', label: 'About', group: 'Pages' },
  { key: 'settings', label: 'Settings', group: 'Account' },
  { key: 'profile', label: 'Profile', group: 'Account' },
  { key: 'billing', label: 'Billing', group: 'Account' },
  { key: 'docs', label: 'Documentation', group: 'Resources' },
];

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button className="btn btn-primary" onClick={() => setOpen(true)}>
          Open Spotlight
        </button>
        <SpotlightSearch
          open={open}
          onClose={() => setOpen(false)}
          items={sampleItems}
          onSelect={onSelectAction}
          shortcut={false}
        />
      </>
    );
  },
};

export const WithGroups: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button className="btn btn-primary" onClick={() => setOpen(true)}>
          Open Spotlight with Groups
        </button>
        <SpotlightSearch
          open={open}
          onClose={() => setOpen(false)}
          items={groupedItems}
          onSelect={onSelectAction}
          shortcut={false}
        />
      </>
    );
  },
};

export const CustomPlaceholder: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button className="btn btn-primary" onClick={() => setOpen(true)}>
          Open Spotlight
        </button>
        <SpotlightSearch
          open={open}
          onClose={() => setOpen(false)}
          items={sampleItems}
          onSelect={onSelectAction}
          placeholder="Type a command or search..."
          shortcut={false}
        />
      </>
    );
  },
};
