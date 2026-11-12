import type { Meta, StoryObj } from '@storybook/react-vite';
import { Code } from './Code';

const snippet = `export function formatPrice(amount: number, currency = 'USD') {
  // Tabular figures line up in tables
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}`;

const meta: Meta<typeof Code> = {
  title: 'Data Display/Code',
  component: Code,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Read-only code with a header (file name, language, copy), optional line numbers and highlighted lines, or inline. No syntax highlighting; the code stays LTR and scrolls instead of wrapping.',
      },
    },
  },
  args: { code: snippet, fileName: 'format-price.ts', language: 'TypeScript' },
};

export default meta;
type Story = StoryObj<typeof Code>;

export const NumberedAndHighlighted: Story = { args: { numbered: true, highlight: [3] } };

export const Plain: Story = {
  args: {
    code: 'composer require artisanpack-ui/livewire-ui-components\nphp artisan vendor:publish --tag=artisanpack-tokens',
    fileName: 'Terminal',
    language: 'Shell',
  },
};

export const WithoutHeader: Story = {
  args: { fileName: undefined, language: undefined, copyable: false, label: 'formatPrice' },
};

export const Inline: Story = {
  render: () => (
    <p>
      Set <Code inline code='data-theme="dark"' /> on any element to switch that region.
    </p>
  ),
};
