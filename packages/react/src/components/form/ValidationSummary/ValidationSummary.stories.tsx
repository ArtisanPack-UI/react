import type { Meta, StoryObj } from '@storybook/react-vite';
import { ValidationSummary } from './ValidationSummary';

const meta: Meta<typeof ValidationSummary> = {
  title: 'Form/ValidationSummary',
  component: ValidationSummary,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Lists every error in a form after a failed submit, each linked to its field. Errors are an alert and take focus; warnings are a status.',
      },
    },
  },
  argTypes: {
    color: { control: 'select', options: ['error', 'warning'] },
  },
};

export default meta;
type Story = StoryObj<typeof ValidationSummary>;

export const Errors: Story = {
  args: {
    errors: [
      { field: 'postal-code', message: 'Spanish postal codes have 5 digits.' },
      { field: 'photos', message: 'Add at least 2 more photos.' },
      { field: 'terms', message: 'Accept the listing terms.' },
    ],
  },
};

export const Warnings: Story = {
  args: {
    color: 'warning',
    errors: {
      description: 'Description is shorter than 80 characters.',
      'floor-plan': 'No floor plan uploaded.',
    },
  },
};
