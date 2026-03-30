import type { Meta, StoryObj } from '@storybook/react-vite';
import { File } from './File';

const meta: Meta<typeof File> = {
  title: 'Form/File',
  component: File,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof File>;

export const Default: Story = {
  args: {},
};

export const WithLabel: Story = {
  args: {
    label: 'Upload Document',
  },
};

export const DragAndDrop: Story = {
  args: {
    label: 'Upload Files',
    withDragDrop: true,
    dragDropText: 'Drag and drop files here or click to browse',
  },
};

export const WithProgress: Story = {
  args: {
    label: 'Uploading...',
    progress: 45,
  },
};

export const WithError: Story = {
  args: {
    label: 'Avatar',
    error: 'File size must be less than 2MB.',
  },
};

export const Multiple: Story = {
  args: {
    label: 'Gallery Images',
    multiple: true,
    hint: 'Select multiple files to upload.',
  },
};
