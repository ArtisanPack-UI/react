import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';

const countries = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico' },
];

const meta: Meta<typeof Select> = {
  title: 'Form/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Chooses one value from a short list with the native select, in the shared field anatomy (label, hint, error).',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: { label: 'Country', options: countries },
};

export const StringOptions: Story = {
  args: { label: 'Time zone', options: ['UTC', 'America/New_York', 'Europe/Paris'] },
};

export const WithChildren: Story = {
  render: () => (
    <Select label="Plan" leadingIcon="user">
      <option value="starter">Starter</option>
      <option value="team">Team</option>
      <option value="enterprise" disabled>
        Enterprise (contact us)
      </option>
    </Select>
  ),
};

export const WithHintAndError: Story = {
  args: {
    label: 'Time zone',
    hint: 'Used for reports and reminders.',
    error: 'Choose a time zone.',
    options: ['UTC', 'America/New_York', 'Europe/Paris'],
    required: true,
  },
};

export const Disabled: Story = {
  args: { label: 'Region', options: ['North America'], disabled: true },
};
