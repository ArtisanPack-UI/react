import type { Meta, StoryObj } from '@storybook/react-vite';
import { ColorPicker } from './ColorPicker';

const meta: Meta<typeof ColorPicker> = {
  title: 'Form/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A color field: a swatch that opens a popover (area, hue and opacity sliders, format select, eyedropper, swatches), and a text value that is always available for typing.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ColorPicker>;

const brand = [
  '#1f74bf',
  '#0b9488',
  '#1f6f3d',
  '#de9d16',
  '#e88761',
  '#c92f33',
  '#91256c',
  '#23272b',
];

export const Default: Story = {
  args: { label: 'Primary color', defaultValue: '#1f74bf' },
};

export const WithSwatches: Story = {
  args: { label: 'Accent color', hint: 'Brand swatches', swatches: brand, defaultValue: '#de9d16' },
};

export const Open: Story = {
  args: { label: 'Primary color', defaultValue: '#1f74bf', swatches: brand, defaultOpen: true },
};

export const Oklch: Story = {
  args: { label: 'Accent color', format: 'oklch', defaultValue: '#de9d16', swatches: brand },
};

export const Opaque: Story = {
  args: { label: 'Brand color', alpha: false, defaultValue: '#c92f33' },
};

export const Invalid: Story = {
  args: { label: 'Brand color', defaultValue: '#c92f33', error: 'Enter a color, such as #1f74bf.' },
};

export const Disabled: Story = {
  args: { label: 'Locked color', defaultValue: '#23272b', disabled: true },
};
