import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '../../layout/Card/Card';
import { Carousel, type CarouselSlide } from './Carousel';

const meta: Meta<typeof Carousel> = {
  title: 'Data Display/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Scroll-snapped slides with previous and next buttons and position dots, on the carousel machine ImageSlider uses. perView shows several with the next one peeking; a title puts the buttons in a header.',
      },
    },
  },
  argTypes: {
    perView: { control: { type: 'number', min: 1, max: 5 } },
    autoplay: { control: 'boolean' },
    loop: { control: 'boolean' },
    interval: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof Carousel>;

const image = (fill: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="${fill}"/></svg>`,
  )}`;

const properties: CarouselSlide[] = [
  {
    image: image('#9db8cf'),
    alt: 'Cedarwood Estates',
    title: 'Cedarwood Estates',
    description: 'United States, New York',
  },
  {
    image: image('#5f8f7c'),
    alt: 'Lakeview Lofts',
    title: 'Lakeview Lofts',
    description: 'United States, Chicago',
  },
  {
    image: image('#c98f5e'),
    alt: 'Tranquil Oaks',
    title: 'Tranquil Oaks',
    description: 'Canada, Toronto',
  },
  {
    image: image('#e9b77a'),
    alt: 'Golden Hour',
    title: 'Golden Hour',
    description: 'United States, Denver',
  },
];

export const MultiItem: Story = {
  args: { title: 'Featured properties', perView: 3, slides: properties },
};

const quotes = [
  { text: 'Weekly digests replaced three spreadsheets for our team.' },
  { text: 'Tenants find what they need without calling us.' },
  { text: 'Setup took an afternoon.' },
];

export const CustomSlides: Story = {
  render: () => (
    <Carousel
      label="Customer notes"
      slides={quotes}
      loop
      renderSlide={(quote) => <Card title={quote.text} />}
    />
  ),
};

export const Autoplay: Story = {
  args: { label: 'Featured', slides: properties, autoplay: true, loop: true },
};
