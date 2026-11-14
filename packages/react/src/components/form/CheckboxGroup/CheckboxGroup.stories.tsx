import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckboxGroup } from './CheckboxGroup';

const meta: Meta<typeof CheckboxGroup> = {
  title: 'Form/CheckboxGroup',
  component: CheckboxGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A labeled set of related checkboxes with a shared hint and error, select all, columns and cards. The value is the array of checked values.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CheckboxGroup>;

export const Default: Story = {
  args: {
    label: 'Notify me about',
    selectAll: true,
    defaultValue: ['offers', 'prices'],
    options: [
      { value: 'offers', label: 'New offers', description: 'Within an hour of submission' },
      { value: 'prices', label: 'Price changes in saved searches' },
      { value: 'digest', label: 'Weekly analytics digest' },
      { value: 'news', label: 'Product news' },
    ],
  },
};

export const Columns: Story = {
  args: {
    label: 'Amenities',
    columns: 3,
    defaultValue: ['In-unit laundry', 'Rooftop terrace'],
    options: [
      'In-unit laundry',
      'Parking',
      'Rooftop terrace',
      'Gym',
      'Bike storage',
      'Pets allowed',
    ],
  },
};

export const Cards: Story = {
  args: {
    label: 'Channels',
    variant: 'cards',
    columns: 3,
    defaultValue: ['email'],
    options: [
      { value: 'email', label: 'Email', description: 'olivia@company.com' },
      { value: 'sms', label: 'SMS', description: '•••• 4821' },
      { value: 'push', label: 'Push', description: '2 devices' },
    ],
  },
};

export const Invalid: Story = {
  args: {
    label: 'Agreements',
    error: 'Accept both to publish.',
    options: ['I agree to the listing terms', 'I confirm I own or manage this property'],
  },
};
