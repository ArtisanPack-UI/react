import type React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Navbar } from './Navbar';

const meta: Meta<typeof Navbar> = {
  title: 'Navigation/Navbar',
  component: Navbar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Top navigation bar with start, center, and end slots for brand, links, and actions. Supports a frosted-glass backdrop effect.',
      },
    },
  },
  argTypes: {
    glass: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Navbar>;

const baseNavbarArgs = {
  start: <span className="text-xl font-bold">ArtisanPack</span>,
  center: (
    <div className="flex gap-4">
      <a className="link link-hover" href="#" onClick={(e: React.MouseEvent) => e.preventDefault()}>
        Home
      </a>
      <a className="link link-hover" href="#" onClick={(e: React.MouseEvent) => e.preventDefault()}>
        About
      </a>
      <a className="link link-hover" href="#" onClick={(e: React.MouseEvent) => e.preventDefault()}>
        Contact
      </a>
    </div>
  ),
  end: (
    <div className="avatar placeholder">
      <div className="bg-neutral text-neutral-content w-10 rounded-full">
        <span>JM</span>
      </div>
    </div>
  ),
};

export const Default: Story = {
  args: {
    ...baseNavbarArgs,
  },
};

export const WithGlass: Story = {
  args: {
    ...baseNavbarArgs,
    glass: true,
  },
  decorators: [
    (Story) => (
      <div className="bg-gradient-to-r from-primary to-secondary p-8 rounded-lg">
        <Story />
      </div>
    ),
  ],
};

export const CustomContent: Story = {
  args: {
    start: (
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
          <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.432z" />
        </svg>
        <span className="text-xl font-bold">Brand</span>
      </div>
    ),
    end: (
      <div className="flex items-center gap-2">
        <button className="btn btn-ghost btn-sm">Login</button>
        <button className="btn btn-primary btn-sm">Sign Up</button>
      </div>
    ),
  },
};
