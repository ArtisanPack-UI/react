import type { Meta, StoryObj } from '@storybook/react-vite';
import { Collapse } from './Collapse';

const meta: Meta<typeof Collapse> = {
  title: 'Layout/Collapse',
  component: Collapse,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A single disclosure: a button that shows and hides one region, such as advanced settings, or a read-more that clamps long text behind a fade.',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['section', 'read-more'] },
  },
};

export default meta;
type Story = StoryObj<typeof Collapse>;

export const Section: Story = {
  args: {
    label: 'Advanced settings',
    children: 'Custom URL and search engine visibility.',
  },
};

export const ReadMore: Story = {
  args: {
    variant: 'read-more',
    children:
      'Twenty-four bright apartments around a shared garden courtyard, five minutes from the tram. Most units face south with private balconies. The building was renovated in 2024 with new windows, heat pumps and a rooftop terrace.',
  },
};

export const Disabled: Story = {
  args: { label: 'Advanced settings', disabled: true, children: 'Hidden.' },
};
