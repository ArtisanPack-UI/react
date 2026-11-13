import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CodeEditor } from './CodeEditor';

const meta: Meta<typeof CodeEditor> = {
  title: 'Form/CodeEditor',
  component: CodeEditor,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Editable code in a native textarea with line numbers, tabs, a language select, diagnostics and a status bar. Tab indents; Escape, then Tab, leaves.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CodeEditor>;

export const Default: Story = {
  args: {
    label: 'Custom CSS',
    hint: 'Added after the theme styles.',
    language: 'CSS',
    rows: 8,
    defaultValue: '.listing {\n  color: var(--apui-text-default);\n}',
  },
};

export const FilesAndLanguages: Story = {
  render: () => {
    const [sources, setSources] = useState<Record<string, string>>({
      'format-price.ts': "export const currency = 'USD';",
      'listing.blade.php': '<x-artisanpack-card />',
    });
    const [file, setFile] = useState('format-price.ts');
    const [language, setLanguage] = useState('typescript');
    return (
      <CodeEditor
        label="Source"
        tabs={Object.keys(sources)}
        tab={file}
        onTabChange={setFile}
        languages={[
          { value: 'typescript', label: 'TypeScript' },
          { value: 'php', label: 'PHP' },
        ]}
        language={language}
        onLanguageChange={setLanguage}
        value={sources[file]}
        onValueChange={(value) => setSources({ ...sources, [file]: value })}
      />
    );
  },
};

export const Diagnostics: Story = {
  args: {
    label: 'Source',
    language: 'TypeScript',
    defaultValue: "const fraction: number = '0';",
    diagnostics: [
      { line: 1, column: 26, message: "Type 'string' is not assignable to type 'number'." },
      { line: 1, message: 'Unused variable.', severity: 'warning' },
    ],
  },
};
