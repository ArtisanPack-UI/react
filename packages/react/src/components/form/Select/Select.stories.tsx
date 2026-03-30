import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'Form/Select',
  component: Select,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Select>;

const fruitOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
];

export const Default: Story = {
  args: {
    label: 'Fruit',
    placeholder: 'Pick a fruit',
    options: fruitOptions,
    optionValue: 'value',
    optionLabel: 'label',
  },
};

export const WithHint: Story = {
  args: {
    label: 'Country',
    hint: 'Select your country of residence.',
    placeholder: 'Choose...',
    options: [
      { value: 'us', label: 'United States' },
      { value: 'uk', label: 'United Kingdom' },
      { value: 'ca', label: 'Canada' },
    ],
    optionValue: 'value',
    optionLabel: 'label',
  },
};

export const WithError: Story = {
  args: {
    label: 'Category',
    error: 'Please select a category.',
    options: fruitOptions,
    optionValue: 'value',
    optionLabel: 'label',
  },
};

export const Inline: Story = {
  args: {
    label: 'Sort by',
    inline: true,
    options: [
      { value: 'name', label: 'Name' },
      { value: 'date', label: 'Date' },
      { value: 'price', label: 'Price' },
    ],
    optionValue: 'value',
    optionLabel: 'label',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled',
    disabled: true,
    options: fruitOptions,
    optionValue: 'value',
    optionLabel: 'label',
  },
};
