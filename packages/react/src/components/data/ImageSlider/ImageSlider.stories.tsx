import type { Meta, StoryObj } from '@storybook/react-vite';
import { ImageSlider, type ImageSliderImage } from './ImageSlider';

const photo = (fill: string, ground: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 360" width="840" height="360"><rect width="840" height="360" fill="${fill}"/><rect y="180" width="840" height="180" fill="${ground}"/></svg>`,
  )}`;

const images: ImageSliderImage[] = [
  {
    src: photo('#e4eef6', '#6f8fab'),
    alt: 'Lake view from the window of unit 4A',
    caption: 'Lake view from 4A',
    description: 'South-facing, 11th floor · Lakeview Lofts, Chicago',
  },
  {
    src: photo('#f6d9a8', '#5d7f9f'),
    alt: 'Sunrise over the ridge',
    caption: 'Sunrise over the ridge',
  },
  { src: photo('#cfe3e0', '#3f6b57'), alt: 'Courtyard garden with benches' },
  { src: photo('#1d2b44', '#25334d'), alt: 'The street at night', caption: 'Street at night' },
];

const meta: Meta<typeof ImageSlider> = {
  title: 'Data Display/ImageSlider',
  component: ImageSlider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'One large image per view with a glass caption, a counter, previous and next buttons, dots and optional thumbnails. Arrow keys on the dots follow the text direction.',
      },
    },
  },
  args: { images, label: 'Lakeview Lofts photos' },
};

export default meta;
type Story = StoryObj<typeof ImageSlider>;

export const Default: Story = {};

export const Thumbnails: Story = { args: { thumbnails: true, aspectRatio: '16 / 9' } };

export const Autoplay: Story = { args: { autoplay: true, interval: 4000 } };
