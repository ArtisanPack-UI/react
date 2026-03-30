import type { Meta, StoryObj } from '@storybook/react-vite';
import { Code } from './Code';

const meta: Meta<typeof Code> = {
  title: 'Data Display/Code',
  component: Code,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Code>;

const sampleCode = `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

const result = greet('World');
console.log(result);`;

export const Default: Story = {
  args: {
    code: sampleCode,
  },
};

export const WithLanguageLabel: Story = {
  args: {
    code: sampleCode,
    language: 'typescript',
  },
};

export const WithLineNumbers: Story = {
  args: {
    code: sampleCode,
    language: 'typescript',
    showLineNumbers: true,
  },
};

export const NotCopyable: Story = {
  args: {
    code: sampleCode,
    language: 'typescript',
    copyable: false,
  },
};

export const WithMaxHeight: Story = {
  args: {
    code: `${sampleCode}\n\n// More code below\nconst a = 1;\nconst b = 2;\nconst c = 3;\nconst d = 4;\nconst e = 5;\nconst f = 6;\nconst g = 7;\nconst h = 8;\nconst i = 9;\nconst j = 10;`,
    language: 'typescript',
    showLineNumbers: true,
    maxHeight: '200px',
  },
};

export const CustomLabel: Story = {
  args: {
    code: `export default {\n  database: 'sqlite',\n  host: 'localhost',\n  port: 3306,\n};`,
    label: 'config.ts',
    showLineNumbers: true,
  },
};
