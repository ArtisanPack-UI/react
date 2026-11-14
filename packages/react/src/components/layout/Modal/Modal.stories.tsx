import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Modal } from './Modal';
import { Button } from '../../form/Button/Button';

const meta: Meta<typeof Modal> = {
  title: 'Layout/Modal (deprecated)',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Deprecated alias of Dialog: subtitle maps to description, actions to footer, glass to the glass surface and persistent to an alertdialog without a close button. bottom is ignored.',
      },
    },
  },
  argTypes: {
    open: {
      control: 'boolean',
    },
    title: {
      control: 'text',
    },
    subtitle: {
      control: 'text',
    },
    persistent: {
      control: 'boolean',
    },
    glass: {
      control: 'boolean',
    },
    bottom: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button color="primary" onClick={() => setOpen(true)}>
          Open Modal
        </Button>
        <Modal open={open} onClose={() => setOpen(false)} title="Modal Title">
          <p>This is the modal body content.</p>
        </Modal>
      </>
    );
  },
};

export const WithActions: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button color="primary" onClick={() => setOpen(true)}>
          Open Modal
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Confirm Delete"
          subtitle="This action cannot be undone."
          actions={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button color="error" onClick={() => setOpen(false)}>
                Delete
              </Button>
            </>
          }
        >
          <p>Are you sure you want to delete this item?</p>
        </Modal>
      </>
    );
  },
};

export const Persistent: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button color="warning" onClick={() => setOpen(true)}>
          Open Persistent Modal
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Required Action"
          persistent
          actions={
            <Button color="primary" onClick={() => setOpen(false)}>
              I Understand
            </Button>
          }
        >
          <p>You must acknowledge this before continuing. Clicking outside will not close it.</p>
        </Modal>
      </>
    );
  },
};

export const Bottom: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button color="accent" onClick={() => setOpen(true)}>
          Open Bottom Sheet
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Bottom Sheet"
          bottom
          actions={
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Close
            </Button>
          }
        >
          <p>This modal slides up from the bottom on mobile.</p>
        </Modal>
      </>
    );
  },
};
