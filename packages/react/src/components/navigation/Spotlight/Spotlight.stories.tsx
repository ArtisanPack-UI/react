import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spotlight, type SpotlightGroup } from './Spotlight';

const groups: SpotlightGroup[] = [
  {
    label: 'Properties',
    items: [
      {
        value: 'grove',
        label: 'The Grove at Greenfield',
        description: 'Spain, Barcelona · Draft',
        icon: 'house',
        color: 'primary',
      },
      {
        value: 'golden-hour',
        label: 'Golden Hour Apartments',
        description: 'United States, Denver',
        icon: 'house',
        color: 'primary',
      },
    ],
  },
  {
    label: 'Pages',
    items: [
      { label: 'Analytics › Reports', href: '#reports', icon: 'file-text', keywords: ['growth'] },
      { label: 'Settings', href: '#settings', icon: 'settings' },
    ],
  },
  {
    label: 'Actions',
    items: [
      { value: 'add', label: 'Add property', icon: 'plus', color: 'success', shortcut: '⌘ N' },
      { value: 'import', label: 'Import listings from CSV', icon: 'upload' },
    ],
  },
];

const meta: Meta<typeof Spotlight> = {
  title: 'Navigation/Spotlight',
  component: Spotlight,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A command palette: search across pages, records and actions. ⌘K (Ctrl+K elsewhere) toggles it; the arrow keys move, Enter opens, Escape closes. A modal dialog holding a combobox whose listbox of grouped results is always open. Replaces SpotlightSearch.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Spotlight>;

export const Default: Story = {
  args: {
    trigger: 'Search',
    groups,
  },
};

/** Rendered open in place, as the quality gates render it. */
export const InPlace: Story = {
  args: {
    open: true,
    modal: false,
    portal: false,
    recent: false,
    groups,
  },
};

/** The page fetches results from `onSearchChange` and passes them back with `remote` and `loading`. */
export const ServerSearch: Story = {
  render: function Render(args) {
    const [search, setSearch] = useState('');
    const [results, setResults] = useState<SpotlightGroup[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (!search.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      const timer = setTimeout(() => {
        const needle = search.toLowerCase();
        setResults(
          groups
            .map((group) => ({
              ...group,
              items: group.items.filter((item) => item.label.toLowerCase().includes(needle)),
            }))
            .filter((group) => group.items.length),
        );
        setLoading(false);
      }, 400);
      return () => clearTimeout(timer);
    }, [search]);

    return (
      <Spotlight
        {...args}
        groups={results}
        search={search}
        onSearchChange={setSearch}
        remote
        loading={loading}
      />
    );
  },
  args: {
    trigger: 'Search listings',
    placeholder: 'Search listings…',
  },
};
