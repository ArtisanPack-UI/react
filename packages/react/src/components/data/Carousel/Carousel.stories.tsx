import type { Meta, StoryObj } from '@storybook/react-vite';
import { Carousel } from './Carousel';
import type { CarouselSlide } from './Carousel';

const meta: Meta<typeof Carousel> = {
  title: 'Data Display/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Image and content carousel with autoplay, navigation arrows, and slide indicators. Accepts custom slide renderers for full layout control.',
      },
    },
  },
  argTypes: {
    autoplay: {
      control: 'boolean',
    },
    interval: {
      control: 'number',
    },
    showIndicators: {
      control: 'boolean',
    },
    showArrows: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Carousel>;

const colorSlides: CarouselSlide[] = [
  {
    content: (
      <div className="flex items-center justify-center h-64 bg-primary text-primary-content text-2xl font-bold">
        Slide 1
      </div>
    ),
  },
  {
    content: (
      <div className="flex items-center justify-center h-64 bg-secondary text-secondary-content text-2xl font-bold">
        Slide 2
      </div>
    ),
  },
  {
    content: (
      <div className="flex items-center justify-center h-64 bg-accent text-accent-content text-2xl font-bold">
        Slide 3
      </div>
    ),
  },
];

export const Default: Story = {
  args: {
    slides: colorSlides,
  },
};

const imageSlides: CarouselSlide[] = [
  {
    content: (
      <div className="flex items-center justify-center h-64 bg-base-200">
        <svg className="w-24 h-24 text-base-content/20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
        </svg>
      </div>
    ),
  },
  {
    content: (
      <div className="flex items-center justify-center h-64 bg-base-300">
        <svg className="w-24 h-24 text-base-content/20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      </div>
    ),
  },
  {
    content: (
      <div className="flex items-center justify-center h-64 bg-base-200">
        <svg className="w-24 h-24 text-base-content/20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
          <path d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
        </svg>
      </div>
    ),
  },
];

export const WithImages: Story = {
  args: {
    slides: imageSlides,
  },
};

export const Autoplay: Story = {
  args: {
    slides: colorSlides,
    autoplay: true,
    interval: 2000,
  },
};

export const NoIndicators: Story = {
  args: {
    slides: colorSlides,
    showIndicators: false,
  },
};

export const NoArrows: Story = {
  args: {
    slides: colorSlides,
    showArrows: false,
  },
};
