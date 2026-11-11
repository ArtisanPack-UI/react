import type { Meta, StoryObj } from '@storybook/react-vite';
import { Rating } from './Rating';

const meta: Meta<typeof Rating> = {
  title: 'Form/Rating',
  component: Rating,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Shows a star score (one image with a text alternative, half stars) or collects one with native radios.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Rating>;

export const Display: Story = {
  args: { readonly: true, value: 4.2, count: 17 },
};

export const HalfStar: Story = {
  args: { readonly: true, value: 3.5, count: 128 },
};

export const Input: Story = {
  args: { label: 'Rate the viewing', size: 'lg', defaultValue: 4 },
};

export const Small: Story = {
  args: { readonly: true, size: 'sm', value: 5, count: 4 },
};
