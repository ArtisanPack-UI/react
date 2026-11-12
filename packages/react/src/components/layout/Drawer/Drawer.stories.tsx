import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../form/Button/Button';
import { Input } from '../../form/Input/Input';
import { Toggle } from '../../form/Toggle/Toggle';
import { Drawer } from './Drawer';

const meta: Meta<typeof Drawer> = {
  title: 'Layout/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A panel that slides in from an edge for filters, details or secondary tasks, on the dialog machine. The side follows the reading direction: end is on the right in LTR and on the left in RTL. bottom is a full-width sheet.',
      },
    },
  },
  argTypes: {
    side: { control: 'select', options: ['end', 'start', 'bottom'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    surface: { control: 'select', options: ['overlay', 'glass'] },
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Default: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    return (
      <Drawer
        {...args}
        open={open}
        onOpenChange={setOpen}
        footer={
          <>
            <Button variant="ghost" color="neutral">
              Reset
            </Button>
            <Button onClick={() => setOpen(false)}>Show 218 results</Button>
          </>
        }
      >
        <Input label="Location" leadingIcon="search" />
        <Toggle label="Only show pet friendly" />
      </Drawer>
    );
  },
  args: {
    trigger: 'Filters',
    title: 'Filters',
    description: '218 properties match',
  },
};

export const Start: Story = {
  ...Default,
  args: { ...Default.args, side: 'start' },
};

export const BottomSheet: Story = {
  args: {
    side: 'bottom',
    trigger: 'Share',
    title: 'Share listing',
    children: (
      <>
        <Button variant="outline" color="neutral" leadingIcon="copy">
          Copy link
        </Button>
        <Button variant="outline" color="neutral" leadingIcon="mail">
          Email
        </Button>
      </>
    ),
  },
};
