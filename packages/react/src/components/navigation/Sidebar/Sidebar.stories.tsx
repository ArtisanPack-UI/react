import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sidebar } from './Sidebar';

const meta: Meta<typeof Sidebar> = {
  title: 'Navigation/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

const handleLinkClick = (e: React.MouseEvent) => e.preventDefault();

const sampleMenuItems = (
  <>
    <li>
      <a href="/home" onClick={handleLinkClick}>
        Home
      </a>
    </li>
    <li>
      <a href="/dashboard" onClick={handleLinkClick}>
        Dashboard
      </a>
    </li>
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
  </>
);

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Sidebar
        open={open}
        onOpenChange={setOpen}
        sidebarContent={<ul className="menu">{sampleMenuItems}</ul>}
      >
        <div className="p-4">
          <button className="btn btn-primary" onClick={() => setOpen(true)}>
            Open Sidebar
          </button>
          <p className="mt-4">Main content area. The sidebar slides in from the left.</p>
        </div>
      </Sidebar>
    );
  },
};

export const RightSide: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Sidebar
        open={open}
        onOpenChange={setOpen}
        side="right"
        sidebarContent={<ul className="menu">{sampleMenuItems}</ul>}
      >
        <div className="p-4">
          <button className="btn btn-secondary" onClick={() => setOpen(true)}>
            Open Right Sidebar
          </button>
          <p className="mt-4">The sidebar opens from the right side.</p>
        </div>
      </Sidebar>
    );
  },
};

export const Overlay: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Sidebar
        open={open}
        onOpenChange={setOpen}
        overlay
        sidebarContent={<ul className="menu">{sampleMenuItems}</ul>}
      >
        <div className="p-4">
          <button className="btn btn-accent" onClick={() => setOpen(true)}>
            Open Overlay Sidebar
          </button>
          <p className="mt-4">The sidebar overlays the content instead of pushing it.</p>
        </div>
      </Sidebar>
    );
  },
};
