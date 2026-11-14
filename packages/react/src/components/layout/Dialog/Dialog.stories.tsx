import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../form/Button/Button';
import { Input } from '../../form/Input/Input';
import { Dialog } from './Dialog';

const meta: Meta<typeof Dialog> = {
  title: 'Layout/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A modal window for a focused task or a confirmation. Traps focus, locks scroll and hides the page behind it; Escape, the close button and the backdrop close it, and focus returns to the trigger. Replaces Modal.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    role: { control: 'select', options: ['dialog', 'alertdialog'] },
    surface: { control: 'select', options: ['overlay', 'glass'] },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    return (
      <Dialog
        {...args}
        open={open}
        onOpenChange={setOpen}
        footer={
          <>
            <Button variant="outline" color="neutral" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Send invite</Button>
          </>
        }
      >
        <Input type="email" label="Email" />
      </Dialog>
    );
  },
  args: {
    trigger: 'Invite member',
    title: 'Invite member',
    description: "They'll get an email with a link to join the project.",
  },
};

export const Confirm: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button color="error" variant="soft" onClick={() => setOpen(true)}>
          Delete listing
        </Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          role="alertdialog"
          size="sm"
          color="error"
          icon="trash"
          title="Delete Cedarwood Estates?"
          description="The listing and its 3 open offers will be removed. This can't be undone."
          footer={
            <>
              <Button variant="outline" color="neutral" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button color="error" onClick={() => setOpen(false)}>
                Delete listing
              </Button>
            </>
          }
        />
      </>
    );
  },
};

export const Glass: Story = {
  args: {
    trigger: 'Open',
    surface: 'glass',
    icon: 'user',
    title: 'Invite member',
    description: 'Members can edit every listing.',
    children: "They'll get an email with a link to join the project.",
  },
};

/** Rendered open and in place, as the quality gates render it. */
export const InPlace: Story = {
  args: {
    open: true,
    modal: false,
    portal: false,
    icon: 'user',
    title: 'Invite member',
    description: 'Members can edit every listing.',
    children: "They'll get an email with a link to join the project.",
    footer: <Button>Send invite</Button>,
  },
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', minHeight: 320 }}>
        <Story />
      </div>
    ),
  ],
};
