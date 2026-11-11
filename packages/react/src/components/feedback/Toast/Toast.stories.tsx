import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../form/Button/Button';
import { Toast } from './Toast';
import { Toaster, toast } from './Toaster';

const meta: Meta<typeof Toast> = {
  title: 'Feedback/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A brief, non-blocking message about something that just happened. Rendered on its own, a Toast is static; render a Toaster and call toast.create({ … }) for toasts that stack and time out.',
      },
    },
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info'],
    },
    variant: { control: 'select', options: ['default', 'inverse'] },
    surface: { control: 'select', options: ['overlay', 'glass'] },
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  args: {
    color: 'success',
    title: 'Listing saved',
    description: 'Cedarwood Estates is live now.',
  },
};

export const Static: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <Toast color="success" title="Listing saved" description="Cedarwood Estates is live now." />
      <Toast color="error" title="Upload failed" description="The file is larger than 10 MB." />
      <Toast
        variant="inverse"
        title="Listing archived"
        actions={
          <Button size="sm" variant="outline" color="neutral">
            Undo
          </Button>
        }
      />
    </div>
  ),
};

export const WithToaster: Story = {
  render: () => (
    <>
      <Toaster />
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button
          onClick={() =>
            toast.create({
              title: 'Listing archived',
              description: 'Cedarwood Estates is hidden from search.',
              action: { label: 'Undo', onClick: () => console.log('restored') },
            })
          }
        >
          Archive listing
        </Button>
        <Button
          variant="outline"
          color="neutral"
          onClick={() => toast.create({ title: 'Listing saved', color: 'success' })}
        >
          Save
        </Button>
        <Button
          variant="soft"
          color="error"
          onClick={() =>
            toast.create({ title: 'Upload failed', description: 'Try again.', color: 'error' })
          }
        >
          Fail
        </Button>
      </div>
    </>
  ),
};
