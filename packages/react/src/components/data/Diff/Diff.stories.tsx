import type { Meta, StoryObj } from '@storybook/react-vite';
import { Diff } from './Diff';

const before = `{
  id: 4127,
  name: "Grove Greenfield",
  beds: 3,
  price: 220000,
  rent: 1600,
  currency: "USD",
  available: "2027-01-01",
}`;

const after = `{
  id: 4127,
  name: "Grove Greenfield",
  beds: 3,
  price: 220000,
  rent: 1650,
  deposit: 3300,
  currency: "USD",
  available: "2027-01-15",
}`;

const meta: Meta<typeof Diff> = {
  title: 'Data Display/Diff',
  component: Diff,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The changes between two versions of a text, unified or side by side, with the changed words marked. Signs and counts carry the meaning in text; the code stays LTR.',
      },
    },
  },
  argTypes: {
    view: { control: 'select', options: ['unified', 'split'] },
  },
  args: { oldContent: before, newContent: after, fileName: 'listings/grove-greenfield.json' },
};

export default meta;
type Story = StoryObj<typeof Diff>;

export const Unified: Story = {};

export const Split: Story = { args: { view: 'split', fileName: 'Version 3 → Version 4' } };

export const WithoutWordLevel: Story = { args: { wordLevel: false, context: 1 } };

export const WithActions: Story = {
  args: {
    actions: (
      <button type="button" onClick={() => navigator.clipboard?.writeText(after)}>
        Copy
      </button>
    ),
  },
};
