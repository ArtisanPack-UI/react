import type { Meta, StoryObj } from '@storybook/react-vite';
import { Diff } from './Diff';

const meta: Meta<typeof Diff> = {
  title: 'Data Display/Diff',
  component: Diff,
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['inline', 'side-by-side'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Diff>;

const oldContent = `const x = 1;
const y = 2;
const z = 3;

function add(a, b) {
  return a + b;
}`;

const newContent = `const x = 1;
const y = 3;
const z = 3;
const w = 4;

function add(a, b) {
  const result = a + b;
  return result;
}`;

export const InlineMode: Story = {
  args: {
    oldContent,
    newContent,
    mode: 'inline',
  },
};

export const SideBySide: Story = {
  args: {
    oldContent,
    newContent,
    mode: 'side-by-side',
  },
};

export const CustomLabels: Story = {
  args: {
    oldContent: 'const greeting = "hello";',
    newContent: 'const greeting = "Hello, World!";',
    oldLabel: 'Before',
    newLabel: 'After',
  },
};
