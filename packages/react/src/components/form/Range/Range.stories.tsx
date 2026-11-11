import type { Meta, StoryObj } from '@storybook/react-vite';
import { Range } from './Range';

const meta: Meta<typeof Range> = {
  title: 'Form/Range',
  component: Range,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A slider for one value, or two thumbs (dual) for a range; native inputs over a drawn track, with a value bubble and marks.',
      },
    },
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info'],
    },
    size: { control: 'select', options: ['sm', 'md'] },
    showValue: { control: 'select', options: ['never', 'focus', 'always'] },
  },
};

export default meta;
type Story = StoryObj<typeof Range>;

export const Default: Story = {
  args: {
    label: 'Search radius',
    max: 50,
    defaultValue: 20,
    format: '{value} km',
    marks: [
      { value: 0, label: '0 km' },
      { value: 25, label: '25 km' },
      { value: 50, label: '50 km' },
    ],
  },
};

export const Dual: Story = {
  args: {
    label: 'Price',
    dual: true,
    min: 100,
    max: 700,
    step: 10,
    defaultValue: [200, 450],
    format: '${value}k',
    showValue: 'always',
  },
};

export const ColorsAndStates: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <Range label="Volume" defaultValue={80} color="success" />
      <Range label="Opacity" defaultValue={30} size="sm" />
      <Range label="Locked" defaultValue={50} disabled />
    </div>
  ),
};
