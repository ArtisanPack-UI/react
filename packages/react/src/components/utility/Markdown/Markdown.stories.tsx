import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Markdown } from './Markdown';

const notes = `## Viewing checklist

Bring **photo ID** and proof of income.

- [x] Confirm time with agent
- [ ] Measure the living room
- [ ] Ask about \`heating costs\`

> Viewings run 30 minutes.

| Unit | Rent |
|---|---:|
| 2B | $1,400 |
| 4A | $1,650 |
`;

const meta: Meta<typeof Markdown> = {
  title: 'Utility/Markdown',
  component: Markdown,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'GitHub-flavored Markdown in the shared prose styles, the same HTML in every stack. Raw HTML is escaped and unsafe URLs are dropped. Write and split modes add Write, Preview and Split tabs over a Textarea.',
      },
    },
  },
  argTypes: {
    mode: { control: 'select', options: ['preview', 'write', 'split'] },
    sanitize: { control: 'boolean' },
  },
  args: { source: notes },
};

export default meta;
type Story = StoryObj<typeof Markdown>;

export const Preview: Story = {};

export const Split: Story = {
  render: (args) => {
    const [source, setSource] = useState(args.source ?? '');
    return <Markdown {...args} source={source} onSourceChange={setSource} mode="split" />;
  },
};

export const Write: Story = { args: { mode: 'write' } };

export const RawHtml: Story = {
  args: {
    source:
      'Press <kbd>Esc</kbd> to close. <script>alert(1)</script> and [a link](javascript:alert(1)).',
    sanitize: false,
  },
};
