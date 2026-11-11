import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Combobox, type ComboboxOption, type ComboboxValue } from './Combobox';

const properties: ComboboxOption[] = [
  { value: 'lakeview', label: 'Lakeview Lofts', description: 'United States, Chicago' },
  { value: 'lakeside', label: 'Lakeside Commons', description: 'Canada, Toronto' },
  {
    value: 'silver-lake',
    label: 'Silver Lake Bungalows',
    description: 'United States, Los Angeles',
  },
  { value: 'harbor', label: 'Harbor Point', description: 'United States, Boston' },
];

const meta: Meta<typeof Combobox> = {
  title: 'Form/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A text input that filters a listbox, in the shared field anatomy. multiple shows chips; with allowCreate it is the tags input. remote hands the search to the app.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof Combobox>;

export const Default: Story = {
  args: { label: 'Property', leadingIcon: 'search', options: properties },
};

export const OpenWithMatches: Story = {
  args: {
    label: 'Property',
    leadingIcon: 'search',
    options: properties,
    search: 'Lake',
    allowCreate: true,
    open: true,
    portal: false,
  },
};

export const Tags: Story = {
  render: () => {
    const [tags, setTags] = useState<ComboboxValue>(['Downtown']);
    const [options, setOptions] = useState<ComboboxOption[]>([
      { value: 'Downtown', label: 'Downtown' },
      { value: 'Garden', label: 'Garden', color: 'success' },
      { value: 'Gated community', label: 'Gated community', color: 'info' },
    ]);
    return (
      <Combobox
        label="Listing tags"
        placeholder="Add a tag…"
        hint="Press Enter to add, Backspace to remove the last tag."
        multiple
        allowCreate
        options={options}
        value={tags}
        onValueChange={setTags}
        onCreate={(value) => setOptions((current) => [...current, { value, label: value }])}
      />
    );
  },
};

export const Remote: Story = {
  render: () => {
    const [query, setQuery] = useState('');
    const matches = properties.filter(
      (option) =>
        typeof option !== 'string' && option.label!.toLowerCase().includes(query.toLowerCase()),
    );
    return (
      <Combobox
        label="Owner"
        placeholder="Search people…"
        remote
        options={matches}
        onSearchChange={setQuery}
        empty={
          <>
            No properties match. Check the spelling or <a href="#add">add a property</a>.
          </>
        }
      />
    );
  },
};

export const WithHintAndError: Story = {
  args: {
    label: 'Owner',
    options: properties,
    required: true,
    hint: 'The person responsible for the listing.',
    error: 'Choose an owner from the list.',
  },
};

export const Loading: Story = {
  args: { label: 'Owner', options: [], remote: true, loading: true },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16, maxInlineSize: 320 }}>
      <Combobox size="sm" label="Small" options={properties} />
      <Combobox size="md" label="Medium" options={properties} />
      <Combobox size="lg" label="Large" options={properties} clearable defaultValue="harbor" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { label: 'Property', options: properties, disabled: true, defaultValue: 'lakeview' },
};
