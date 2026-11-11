import type { Meta, StoryObj } from '@storybook/react-vite';
import { File } from './File';

const meta: Meta<typeof File> = {
  title: 'Form/File',
  component: File,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Uploads files by dropping or browsing: a native file input over a drop zone, and a list with sizes, progress, errors and remove buttons.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof File>;

export const Dropzone: Story = {
  args: {
    label: 'Listing photos',
    title: 'Drop photos here or browse',
    hint: 'JPG or PNG, up to 20 MB each, 12 files max',
    multiple: true,
    accept: 'image/jpeg,image/png',
  },
};

export const WithFiles: Story = {
  args: {
    label: 'Listing photos',
    multiple: true,
    value: [
      { name: 'lakeview-lofts-exterior.jpg', size: 2400000 },
      { name: 'courtyard-garden.jpg', size: 1250000, progress: 64 },
      { name: 'floor-plan.heic', size: 830000, error: "HEIC isn't supported. Use JPG or PNG." },
    ],
  },
};

export const Compact: Story = {
  args: {
    variant: 'compact',
    title: 'Upload a contract',
    hint: 'PDF up to 10 MB',
    accept: 'application/pdf',
  },
};

export const Invalid: Story = {
  args: { label: 'Documents', required: true, error: 'Add at least one document.' },
};
