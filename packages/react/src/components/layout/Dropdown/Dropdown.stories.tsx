import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dropdown, DropdownItem } from './Dropdown';
import { Button } from '../../form/Button/Button';

const meta: Meta<typeof Dropdown> = {
  title: 'Layout/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
  args: {
    label: 'Options',
    children: (
      <>
        <DropdownItem>Edit</DropdownItem>
        <DropdownItem>Duplicate</DropdownItem>
        <DropdownItem>Delete</DropdownItem>
      </>
    ),
  },
};

export const WithTrigger: Story = {
  args: {
    trigger: <Button label="Actions" color="primary" />,
    children: (
      <>
        <DropdownItem>View</DropdownItem>
        <DropdownItem>Edit</DropdownItem>
        <DropdownItem disabled>Archive</DropdownItem>
      </>
    ),
  },
};

export const End: Story = {
  render: () => (
    <div className="flex justify-end">
      <Dropdown label="Align End" end>
        <DropdownItem>Option 1</DropdownItem>
        <DropdownItem>Option 2</DropdownItem>
      </Dropdown>
    </div>
  ),
};

export const Hover: Story = {
  args: {
    label: 'Hover Me',
    hover: true,
    children: (
      <>
        <DropdownItem>Quick Action 1</DropdownItem>
        <DropdownItem>Quick Action 2</DropdownItem>
      </>
    ),
  },
};
