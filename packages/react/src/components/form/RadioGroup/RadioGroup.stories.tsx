import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioGroup } from './RadioGroup';

const meta: Meta<typeof RadioGroup> = {
  title: 'Form/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Chooses exactly one option from a small set: native radios in a fieldset, as plain radios, cards or joined segments.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

const visibility = [
  { value: 'public', label: 'Public', description: 'Anyone can find it in search.' },
  { value: 'unlisted', label: 'Unlisted', description: 'Only people with the link.' },
  { value: 'private', label: 'Private', description: 'Only you and co-owners.' },
  {
    value: 'archived',
    label: 'Archived',
    description: 'Unavailable while offers are open.',
    disabled: true,
  },
];

export const Default: Story = {
  args: { label: 'Listing visibility', options: visibility, defaultValue: 'public' },
};

export const Horizontal: Story = {
  args: {
    label: 'Billing period',
    orientation: 'horizontal',
    options: ['Monthly', 'Quarterly', 'Yearly'],
    defaultValue: 'Monthly',
  },
};

export const Cards: Story = {
  args: {
    label: 'Plan',
    variant: 'cards',
    orientation: 'horizontal',
    defaultValue: 'growth',
    options: [
      { value: 'starter', label: 'Starter', description: 'Up to 5 listings', meta: '$0 / month' },
      {
        value: 'growth',
        label: 'Growth',
        description: 'Up to 50 listings and analytics',
        meta: '$39 / month',
      },
      {
        value: 'portfolio',
        label: 'Portfolio',
        description: 'Unlimited listings, team seats',
        meta: '$129 / month',
      },
    ],
  },
};

export const Segmented: Story = {
  args: {
    label: 'View',
    variant: 'segmented',
    orientation: 'horizontal',
    options: ['List', 'Grid', 'Map'],
    defaultValue: 'Grid',
  },
};

export const WithError: Story = {
  args: { label: 'Plan', options: ['Starter', 'Growth'], required: true, error: 'Choose a plan.' },
};
