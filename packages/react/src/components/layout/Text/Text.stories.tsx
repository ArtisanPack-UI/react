import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from './Text';

const meta: Meta<typeof Text> = {
  title: 'Layout/Text',
  component: Text,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Body text with a size, tone and weight, cut to one line with truncate or to a number of lines with clamp.',
      },
    },
  },
  argTypes: {
    as: { control: 'select', options: ['p', 'span', 'div'] },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'lead'] },
    tone: { control: 'select', options: ['default', 'muted', 'success', 'warning', 'error'] },
    weight: { control: 'select', options: ['regular', 'medium', 'semibold'] },
  },
  args: { children: 'Twenty-four bright apartments around a garden courtyard.' },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 10 }}>
      {(['lead', 'lg', 'md', 'sm', 'xs'] as const).map((size) => (
        <Text key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

export const Truncate: Story = {
  args: {
    truncate: true,
    style: { maxWidth: 260 },
    children: 'ARK Genomic Revolution ETF — transaction declined by the issuing bank',
  },
};
