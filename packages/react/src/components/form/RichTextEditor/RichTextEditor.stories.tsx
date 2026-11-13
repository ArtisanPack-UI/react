import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RichTextEditor } from './RichTextEditor';

const meta: Meta<typeof RichTextEditor> = {
  title: 'Form/RichTextEditor',
  component: RichTextEditor,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Formatted text with a toolbar over the shared prose styles, on the built-in contentEditable engine. Livewire runs TinyMCE behind the same toolbar.',
      },
    },
  },
  argTypes: {
    toolbar: { control: 'select', options: ['default', 'compact', 'minimal'] },
    output: { control: 'select', options: ['html', 'markdown'] },
  },
};

export default meta;
type Story = StoryObj<typeof RichTextEditor>;

export const Default: Story = {
  args: {
    label: 'Description',
    hint: 'Shown on the listing page.',
    counter: true,
    defaultValue:
      '<h3>About The Grove</h3><p>Twenty-four bright apartments around a <strong>shared garden courtyard</strong>.</p><ul><li>In-unit laundry</li><li>Rooftop terrace</li></ul>',
  },
};

export const Compact: Story = {
  args: {
    toolbar: 'compact',
    label: 'Note to buyer',
    placeholder: 'Write a note for the buyer…',
  },
};

export const Markdown: Story = {
  render: () => {
    const [summary, setSummary] = useState('## Highlights\n\n- In-unit laundry');
    return (
      <div style={{ display: 'grid', gap: '1rem' }}>
        <RichTextEditor
          output="markdown"
          maxLength={500}
          label="Summary"
          value={summary}
          onValueChange={setSummary}
        />
        <pre>{summary}</pre>
      </div>
    );
  },
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <RichTextEditor label="Invalid" error="Write at least 40 characters." required />
      <RichTextEditor label="Read-only" readonly defaultValue="<p>Locked while reviewed.</p>" />
      <RichTextEditor label="Disabled" disabled defaultValue="<p>Not editable.</p>" />
    </div>
  ),
};
