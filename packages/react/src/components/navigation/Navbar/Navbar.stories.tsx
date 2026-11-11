import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../form/Button/Button';
import { Input } from '../../form/Input/Input';
import { Navbar, NavbarItem } from './Navbar';

const meta: Meta<typeof Navbar> = {
  title: 'Navigation/Navbar',
  component: Navbar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The top bar: a brand, primary links or a search, and account actions, as a full-width bar or an island. Glass is a surface.',
      },
    },
  },
  argTypes: {
    layout: { control: 'select', options: ['bar', 'island'] },
    surface: { control: 'select', options: ['default', 'glass'] },
  },
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Bar: Story = {
  args: { sticky: false },
  render: (args) => (
    <Navbar
      {...args}
      brand={<a href="#home">Horizon</a>}
      actions={
        <>
          <Button variant="ghost" color="neutral" size="sm">
            Sign in
          </Button>
          <Button size="sm">Get started</Button>
        </>
      }
    >
      <NavbarItem href="#properties" current>
        Properties
      </NavbarItem>
      <NavbarItem href="#analytics">Analytics</NavbarItem>
      <NavbarItem href="#tools">Tools &amp; calculators</NavbarItem>
    </Navbar>
  ),
};

export const IslandOnGlass: Story = {
  args: { layout: 'island', surface: 'glass', sticky: false, brand: 'Socials' },
  render: (args) => (
    <div style={{ padding: 16, background: 'linear-gradient(135deg, #7da2c9, #f2c14e)' }}>
      <Navbar
        {...args}
        search={
          <Input
            type="search"
            size="sm"
            leadingIcon="search"
            placeholder="Search"
            aria-label="Search"
          />
        }
        actions={
          <Button size="sm" leadingIcon="plus">
            New page
          </Button>
        }
      />
    </div>
  ),
};
