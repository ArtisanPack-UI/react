import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from './DropdownMenu';

const meta: Meta<typeof DropdownMenu> = {
  title: 'Layout/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A list of actions or options anchored to a trigger button: action, checkbox and radio items, in groups with labels. Arrow keys move, typeahead jumps, Escape closes. Replaces Dropdown.',
      },
    },
  },
  argTypes: {
    align: { control: 'select', options: ['start', 'center', 'end'] },
    surface: { control: 'select', options: ['overlay', 'glass'] },
  },
};

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = {
  args: { label: 'Options' },
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuGroup label="Listing">
        <DropdownMenuItem value="edit" icon="pencil" shortcut="E">
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem value="duplicate" icon="copy">
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem value="archive" disabled>
          Archive
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem value="delete" icon="trash" color="error">
        Delete
      </DropdownMenuItem>
    </DropdownMenu>
  ),
};

export const Options: Story = {
  render: function Render(args) {
    const [showGrid, setShowGrid] = useState(true);
    const [sort, setSort] = useState('newest');
    return (
      <DropdownMenu
        {...args}
        label="View"
        align="end"
        items={[
          { type: 'checkbox', value: 'grid', label: 'Show grid', checked: showGrid },
          { type: 'separator' },
          {
            type: 'group',
            label: 'Sort by',
            items: [
              { type: 'radio', value: 'newest', label: 'Newest', checked: sort === 'newest' },
              { type: 'radio', value: 'price', label: 'Price', checked: sort === 'price' },
            ],
          },
        ]}
        onCheckedChange={({ value, checked }) => {
          if (value === 'grid') setShowGrid(checked);
          else if (checked) setSort(value);
        }}
      />
    );
  },
};

/** Rendered open and in place, as the quality gates render it. */
export const InPlace: Story = {
  args: {
    open: true,
    portal: false,
    label: 'Options',
    items: [
      {
        type: 'group',
        label: 'Listing',
        items: [
          { value: 'edit', label: 'Edit', icon: 'pencil', shortcut: 'E' },
          { value: 'duplicate', label: 'Duplicate', icon: 'copy' },
          { value: 'archive', label: 'Archive', disabled: true },
        ],
      },
      { type: 'separator' },
      { type: 'checkbox', value: 'grid', label: 'Show grid', checked: true },
      { type: 'separator' },
      { value: 'delete', label: 'Delete', icon: 'trash', color: 'error' },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: 320 }}>
        <Story />
      </div>
    ),
  ],
};
