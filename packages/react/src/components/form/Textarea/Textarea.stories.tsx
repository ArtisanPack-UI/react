import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Form/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Multi-line text entry in the field anatomy (label, box, hint, error), with an optional character counter.',
      },
    },
  },
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: { label: 'Notes', hint: 'Only your team sees these.', rows: 3 },
};

export const WithCounter: Story = {
  args: {
    label: 'Description',
    placeholder: 'Describe the property, nearby amenities and anything renters should know…',
    maxLength: 500,
    autoResize: true,
  },
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <Textarea label="Summary" error="Write at least 40 characters." defaultValue="Too short" />
      <Textarea label="Imported text" value="Imported from the March listing feed." readonly />
      <Textarea label="Internal notes" value="Locked while the listing is reviewed." disabled />
    </div>
  ),
};
