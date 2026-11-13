import type { Meta, StoryObj } from '@storybook/react-vite';
import { Heading } from './Heading';

const meta: Meta<typeof Heading> = {
  title: 'Layout/Heading',
  component: Heading,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A title from the type scale. level sets the semantic h1–h6, size the visual size; the eyebrow labels the section.',
      },
    },
  },
  argTypes: {
    level: { control: 'select', options: [1, 2, 3, 4, 5, 6] },
    size: { control: 'select', options: [undefined, 1, 2, 3, 4, 5, 6] },
  },
  args: { children: 'The Grove at Greenfield' },
};

export default meta;
type Story = StoryObj<typeof Heading>;

export const Default: Story = {};

export const Levels: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      {([1, 2, 3, 4, 5, 6] as const).map((level) => (
        <Heading key={level} level={level}>
          The Grove at Greenfield
        </Heading>
      ))}
    </div>
  ),
};

export const Eyebrow: Story = {
  args: { eyebrow: 'Portfolio', children: 'Every property, one calm place' },
};
