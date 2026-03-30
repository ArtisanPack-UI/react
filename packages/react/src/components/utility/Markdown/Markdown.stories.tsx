import type { Meta, StoryObj } from '@storybook/react-vite';
import { Markdown } from './Markdown';

const meta: Meta<typeof Markdown> = {
  title: 'Utility/Markdown',
  component: Markdown,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Markdown>;

export const Default: Story = {
  args: {
    source: `# Hello World

This is a simple markdown example with **bold text** and *italic text*.

- Item one
- Item two
- Item three`,
  },
};

export const Headings: Story = {
  args: {
    source: `# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6`,
  },
};

export const Lists: Story = {
  args: {
    source: `## Unordered List

- Apples
- Bananas
- Cherries

## Ordered List

1. First step
2. Second step
3. Third step`,
  },
};

export const FormattedText: Story = {
  args: {
    source: `This paragraph has **bold text**, *italic text*, and \`inline code\`.

Here is another paragraph with a combination of **bold and *nested italic*** formatting.`,
  },
};

export const Links: Story = {
  args: {
    source: `Visit [Google](https://google.com) or check out [GitHub](https://github.com).

Here is a link in a sentence: the [documentation](https://docs.example.com) has more details.`,
  },
};

export const Blockquote: Story = {
  args: {
    source: `> This is a blockquote. It can contain **bold** and *italic* text.

Regular paragraph after the blockquote.

> Another blockquote with a longer passage of text that demonstrates how blockquotes handle wrapping content.`,
  },
};
