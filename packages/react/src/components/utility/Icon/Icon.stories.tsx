import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from './Icon';

const meta: Meta<typeof Icon> = {
  title: 'Utility/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: [
        undefined,
        'primary',
        'secondary',
        'accent',
        'success',
        'warning',
        'error',
        'info',
        'neutral',
      ],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

const checkPath =
  'M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z';

export const Default: Story = {
  args: {
    path: checkPath,
    viewBox: '0 0 20 20',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <div className="flex flex-col items-center gap-1">
        <Icon path={checkPath} size="xs" viewBox="0 0 20 20" />
        <span className="text-xs">xs</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Icon path={checkPath} size="sm" viewBox="0 0 20 20" />
        <span className="text-xs">sm</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Icon path={checkPath} size="md" viewBox="0 0 20 20" />
        <span className="text-xs">md</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Icon path={checkPath} size="lg" viewBox="0 0 20 20" />
        <span className="text-xs">lg</span>
      </div>
    </div>
  ),
};

export const ColorVariants: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Icon path={checkPath} color="primary" viewBox="0 0 20 20" />
      <Icon path={checkPath} color="secondary" viewBox="0 0 20 20" />
      <Icon path={checkPath} color="accent" viewBox="0 0 20 20" />
      <Icon path={checkPath} color="success" viewBox="0 0 20 20" />
      <Icon path={checkPath} color="warning" viewBox="0 0 20 20" />
      <Icon path={checkPath} color="error" viewBox="0 0 20 20" />
      <Icon path={checkPath} color="info" viewBox="0 0 20 20" />
    </div>
  ),
};

export const WithChildren: Story = {
  render: () => (
    <Icon size="lg" viewBox="0 0 24 24">
      <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
      <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.432z" />
    </Icon>
  ),
};

export const Decorative: Story = {
  args: {
    path: checkPath,
    viewBox: '0 0 20 20',
    color: 'success',
    size: 'lg',
  },
};

export const Accessible: Story = {
  args: {
    path: checkPath,
    viewBox: '0 0 20 20',
    label: 'Checkmark icon',
    color: 'success',
    size: 'lg',
  },
};
