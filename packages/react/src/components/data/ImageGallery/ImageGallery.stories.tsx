import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ImageGallery, type ImageGalleryImage } from './ImageGallery';

const photo = (fill: string, ground: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300"><rect width="400" height="300" fill="${fill}"/><rect y="150" width="400" height="150" fill="${ground}"/></svg>`,
  )}`;

const images: ImageGalleryImage[] = [
  {
    src: photo('#f6d9a8', '#5d7f9f'),
    alt: 'Sunrise over the ridge',
    caption: 'Sunrise over the ridge',
  },
  {
    src: photo('#cfe3e0', '#3f6b57'),
    alt: 'Courtyard garden with benches',
    caption: 'Courtyard garden',
  },
  {
    src: photo('#e8b49a', '#4a4a6a'),
    alt: 'The west facade at dusk',
    caption: 'Evening, west façade',
  },
  { src: photo('#e4eef6', '#6f8fab'), alt: 'Lake view from unit 4A', caption: 'Lake view from 4A' },
  { src: photo('#f4e2c4', '#9c6a43'), alt: 'Rooftop terrace with lounge chairs' },
  { src: photo('#1d2b44', '#25334d'), alt: 'The street at night', caption: 'Street at night' },
];

const meta: Meta<typeof ImageGallery> = {
  title: 'Data Display/ImageGallery',
  component: ImageGallery,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A grid of images that opens a lightbox: a dark dialog with the image, a counter and caption, previous and next buttons, thumbnails, and arrow keys that follow the text direction.',
      },
    },
  },
  args: { images },
};

export default meta;
type Story = StoryObj<typeof ImageGallery>;

export const Default: Story = {};

export const Featured: Story = { args: { featured: true, columns: 4, downloadable: true } };

export const PlainGrid: Story = { args: { lightbox: false, columns: 3 } };

export const Controlled: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);
    return (
      <ImageGallery
        {...args}
        open={open}
        onOpenChange={setOpen}
        index={index}
        onIndexChange={setIndex}
      />
    );
  },
};

export const OpenInPlace: Story = {
  args: { defaultOpen: true, defaultIndex: 2, portal: false, modal: false },
};
