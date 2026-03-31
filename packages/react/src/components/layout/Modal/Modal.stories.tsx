import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Modal } from './Modal';
import { Button } from '../../form/Button/Button';

const meta: Meta<typeof Modal> = {
  title: 'Layout/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Dialog overlay with title, subtitle, action buttons, persistent mode, glass backdrop, and bottom-sheet variant.',
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
        <Button label="Open Modal" color="primary" onClick={() => setOpen(true)} />
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
        <Button label="Open Modal" color="primary" onClick={() => setOpen(true)} />
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Confirm Delete"
          subtitle="This action cannot be undone."
          actions={
            <>
              <Button label="Cancel" color="ghost" onClick={() => setOpen(false)} />
              <Button label="Delete" color="error" onClick={() => setOpen(false)} />
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
        <Button label="Open Persistent Modal" color="warning" onClick={() => setOpen(true)} />
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Required Action"
          persistent
          actions={<Button label="I Understand" color="primary" onClick={() => setOpen(false)} />}
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
        <Button label="Open Bottom Sheet" color="accent" onClick={() => setOpen(true)} />
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Bottom Sheet"
          bottom
          actions={<Button label="Close" color="ghost" onClick={() => setOpen(false)} />}
        >
          <p>This modal slides up from the bottom on mobile.</p>
        </Modal>
      </>
    );
  },
};
