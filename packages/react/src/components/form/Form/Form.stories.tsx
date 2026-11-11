import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Textarea } from '../Textarea/Textarea';
import { Form } from './Form';

const meta: Meta<typeof Form> = {
  title: 'Form/Form',
  component: Form,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A native form: fields stack with the field gap and an actions row ends it, primary action last.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Form>;

export const Default: Story = {
  render: () => (
    <Form
      aria-label="Invite member"
      onSubmit={(event) => event.preventDefault()}
      actions={
        <>
          <Button variant="ghost">Cancel</Button>
          <Button type="submit">Send invite</Button>
        </>
      }
    >
      <Input label="Email" type="email" required />
      <Textarea label="Message" rows={3} />
    </Form>
  ),
};

export const Divided: Story = {
  render: () => (
    <Form
      aria-label="Listing"
      divided
      onSubmit={(event) => event.preventDefault()}
      actions={<Button type="submit">Publish listing</Button>}
    >
      <Input label="Postal code" />
    </Form>
  ),
};
