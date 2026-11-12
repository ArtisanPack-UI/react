import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import {
  Avatar,
  AvatarGroup,
  avatarColor,
  avatarInitials,
  type AvatarProps,
} from '../../components/data/Avatar/Avatar';

const declaredProps: (keyof AvatarProps)[] = [
  'name',
  'src',
  'alt',
  'initials',
  'icon',
  'size',
  'shape',
  'color',
  'status',
  'statusLabel',
  'classes',
];

describe('Avatar', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Avatar, 'Avatar', { declared: { props: declaredProps, events: [] } });
  });

  it('renders initials as role=img named after the person', () => {
    const { container } = render(<Avatar name="Olivia Rhye" />);
    const root = screen.getByRole('img', { name: 'Olivia Rhye' });
    expect(root).toHaveClass('apui-avatar');
    expect(root).toHaveAttribute('data-size', 'md');
    expect(root).toHaveAttribute('data-shape', 'circle');
    expect(container.querySelector('[data-part="initials"]')).toHaveTextContent('OR');
  });

  it('takes initials from the first and last word, keeping multibyte letters', () => {
    expect(avatarInitials('Olivia Rhye')).toBe('OR');
    expect(avatarInitials('  Ana María de la Peña ')).toBe('AP');
    expect(avatarInitials('émile')).toBe('É');
    expect(avatarInitials('')).toBe('');
  });

  it('hashes the color from the name, the same way as Livewire and Vue', () => {
    // Code points of "Olivia Rhye" sum to 1052; 1052 % 7 = 2 → accent.
    expect(avatarColor('Olivia Rhye')).toBe('accent');
    expect(avatarColor('')).toBe('neutral');
    render(<Avatar name="Olivia Rhye" color="info" />);
    expect(screen.getByRole('img')).toHaveAttribute('data-color', 'info');
  });

  it('puts a decorative image over the initials, and drops unsafe sources', () => {
    const { container, rerender } = render(<Avatar name="Olivia Rhye" src="/a.jpg" />);
    const image = container.querySelector('img[data-part="image"]')!;
    expect(image).toHaveAttribute('src', '/a.jpg');
    expect(image).toHaveAttribute('alt', '');
    expect(container.querySelector('[data-part="initials"]')).not.toBeNull();

    rerender(<Avatar name="X" src="javascript:alert(1)" />);
    expect(container.querySelector('img')).toBeNull();
  });

  it('is decorative with the user icon without a name', () => {
    const { container } = render(<Avatar />);
    const root = container.querySelector('.apui-avatar')!;
    expect(root).toHaveAttribute('aria-hidden', 'true');
    expect(root).not.toHaveAttribute('role');
    expect(root).toHaveAttribute('data-color', 'neutral');
    expect(root.querySelector(':scope > svg')).not.toBeNull();
  });

  it('announces the status in words', () => {
    const { container, rerender } = render(<Avatar name="Olivia Rhye" status="away" />);
    expect(screen.getByRole('img', { name: 'Olivia Rhye (Away)' })).toBeInTheDocument();
    expect(container.querySelector('[data-part="status"]')).toHaveAttribute('data-status', 'away');
    rerender(<Avatar name="Ana" status="online" statusLabel="En línea" />);
    expect(screen.getByRole('img', { name: 'Ana (En línea)' })).toBeInTheDocument();
  });

  it('groups avatars and collapses the rest past max', () => {
    const { container } = render(
      <AvatarGroup
        label="Members"
        max={2}
        size="sm"
        avatars={[
          { name: 'Olivia Rhye' },
          { name: 'Phoenix Baker' },
          { name: 'Lana Steiner' },
          { name: 'Demi Wilkinson' },
        ]}
      />,
    );
    expect(screen.getByRole('group', { name: 'Members' })).toHaveClass('apui-avatar-group');
    expect(container.querySelectorAll('.apui-avatar[data-size="sm"]')).toHaveLength(3);
    expect(screen.getByRole('img', { name: '2 more' })).toHaveTextContent('+2');
  });
});
