import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Drawer } from './Drawer';
import { Button } from '../../form/Button/Button';

const meta: Meta<typeof Drawer> = {
  title: 'Layout/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Slide-out drawer panel anchored to the left or right edge of the viewport. Accepts a side slot for navigation or form content.',
      },
    },
  },
  argTypes: {
    end: {
      control: 'boolean',
    },
    persistent: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

const handleLinkClick = (e: React.MouseEvent) => e.preventDefault();

export const Default: Story = {
  args: {
    end: false,
    persistent: false,
  },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        end={args.end}
        persistent={args.persistent}
        side={
          <ul className="menu bg-base-200 min-h-full w-60 p-4">
            <li>
              <a href="/home" onClick={handleLinkClick}>
                Home
              </a>
            </li>
            <li>
              <a href="/about" onClick={handleLinkClick}>
                About
              </a>
            </li>
            <li>
              <a href="/contact" onClick={handleLinkClick}>
                Contact
              </a>
            </li>
          </ul>
        }
      >
        <div className="p-4">
          <Button label="Open Drawer" color="primary" onClick={() => setOpen(true)} />
          <p className="mt-4">Main content area. The drawer slides in from the left.</p>
        </div>
      </Drawer>
    );
  },
};

export const EndSide: Story = {
  args: {
    end: true,
    persistent: false,
  },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        end={args.end}
        persistent={args.persistent}
        side={
          <ul className="menu bg-base-200 min-h-full w-60 p-4">
            <li>
              <a href="/settings" onClick={handleLinkClick}>
                Settings
              </a>
            </li>
            <li>
              <a href="/profile" onClick={handleLinkClick}>
                Profile
              </a>
            </li>
            <li>
              <a href="/logout" onClick={handleLinkClick}>
                Logout
              </a>
            </li>
          </ul>
        }
      >
        <div className="p-4">
          <Button label="Open Right Drawer" color="secondary" onClick={() => setOpen(true)} />
          <p className="mt-4">The drawer opens from the right side.</p>
        </div>
      </Drawer>
    );
  },
};
