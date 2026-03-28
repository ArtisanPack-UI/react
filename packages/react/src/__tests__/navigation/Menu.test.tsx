import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Menu } from '../../components/navigation/Menu/Menu';
import type { MenuItemType } from '../../components/navigation/Menu/Menu';

const sampleItems: MenuItemType[] = [
  { key: 'home', label: 'Home' },
  { key: 'about', label: 'About' },
  { key: 'contact', label: 'Contact' },
];

describe('Menu', () => {
  it('renders all menu items', () => {
    render(<Menu items={sampleItems} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('renders with role="menu"', () => {
    render(<Menu items={sampleItems} />);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('calls onChange when item is clicked', () => {
    const onChange = vi.fn();
    render(<Menu items={sampleItems} onChange={onChange} />);
    fireEvent.click(screen.getByText('About'));
    expect(onChange).toHaveBeenCalledWith('about');
  });

  it('marks active item with aria-current', () => {
    render(<Menu items={sampleItems} activeKey="home" />);
    const homeBtn = screen.getByText('Home').closest('button');
    expect(homeBtn).toHaveAttribute('aria-current', 'page');
  });

  it('applies active class to active item', () => {
    render(<Menu items={sampleItems} activeKey="home" />);
    const homeBtn = screen.getByText('Home').closest('button');
    expect(homeBtn).toHaveClass('active');
  });

  it('does not mark inactive items as active', () => {
    render(<Menu items={sampleItems} activeKey="home" />);
    const aboutBtn = screen.getByText('About').closest('button');
    expect(aboutBtn).not.toHaveClass('active');
    expect(aboutBtn).not.toHaveAttribute('aria-current');
  });

  it('renders horizontal layout', () => {
    render(<Menu items={sampleItems} horizontal />);
    expect(screen.getByRole('menu')).toHaveClass('menu-horizontal');
  });

  it('applies size class', () => {
    render(<Menu items={sampleItems} size="lg" />);
    expect(screen.getByRole('menu')).toHaveClass('menu-lg');
  });

  it('applies compact class', () => {
    render(<Menu items={sampleItems} compact />);
    expect(screen.getByRole('menu')).toHaveClass('menu-compact');
  });

  it('renders menu title', () => {
    render(<Menu items={sampleItems} title="Navigation" />);
    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.getByText('Navigation').closest('li')).toHaveClass('menu-title');
  });

  it('disables items when disabled is set', () => {
    const items: MenuItemType[] = [
      { key: 'home', label: 'Home' },
      { key: 'disabled', label: 'Disabled', disabled: true },
    ];
    render(<Menu items={items} />);
    expect(screen.getByText('Disabled').closest('button')).toBeDisabled();
  });

  it('renders icons', () => {
    const items: MenuItemType[] = [
      { key: 'home', label: 'Home', icon: <span data-testid="icon">★</span> },
    ];
    render(<Menu items={items} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders nested sub-items', () => {
    const items: MenuItemType[] = [
      {
        key: 'parent',
        label: 'Parent',
        children: [
          { key: 'child1', label: 'Child 1' },
          { key: 'child2', label: 'Child 2' },
        ],
      },
    ];
    render(<Menu items={items} />);
    expect(screen.getByText('Parent')).toBeInTheDocument();
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });

  it('supports renderLink for router integration', () => {
    const items: MenuItemType[] = [
      {
        key: 'link',
        label: 'Link',
        renderLink: ({ className, children }) => (
          <a href="/test" className={className} data-testid="custom-link">
            {children}
          </a>
        ),
      },
    ];
    render(<Menu items={items} />);
    expect(screen.getByTestId('custom-link')).toBeInTheDocument();
    expect(screen.getByTestId('custom-link')).toHaveAttribute('href', '/test');
  });

  it('navigates with arrow keys (vertical)', () => {
    render(<Menu items={sampleItems} />);
    const menu = screen.getByRole('menu');
    const firstBtn = screen.getByText('Home').closest('button')!;
    firstBtn.focus();
    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(screen.getByText('About').closest('button'));
  });

  it('navigates with arrow keys (horizontal)', () => {
    render(<Menu items={sampleItems} horizontal />);
    const menu = screen.getByRole('menu');
    const firstBtn = screen.getByText('Home').closest('button')!;
    firstBtn.focus();
    fireEvent.keyDown(menu, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(screen.getByText('About').closest('button'));
  });

  it('wraps around with arrow keys', () => {
    render(<Menu items={sampleItems} />);
    const menu = screen.getByRole('menu');
    const lastBtn = screen.getByText('Contact').closest('button')!;
    lastBtn.focus();
    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(screen.getByText('Home').closest('button'));
  });

  it('navigates to first with Home key', () => {
    render(<Menu items={sampleItems} />);
    const menu = screen.getByRole('menu');
    const lastBtn = screen.getByText('Contact').closest('button')!;
    lastBtn.focus();
    fireEvent.keyDown(menu, { key: 'Home' });
    expect(document.activeElement).toBe(screen.getByText('Home').closest('button'));
  });

  it('navigates to last with End key', () => {
    render(<Menu items={sampleItems} />);
    const menu = screen.getByRole('menu');
    const firstBtn = screen.getByText('Home').closest('button')!;
    firstBtn.focus();
    fireEvent.keyDown(menu, { key: 'End' });
    expect(document.activeElement).toBe(screen.getByText('Contact').closest('button'));
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Menu ref={ref} items={sampleItems} />);
    expect(ref).toHaveBeenCalled();
  });

  it('applies color classes to active item', () => {
    render(<Menu items={sampleItems} activeKey="home" color="primary" />);
    const homeBtn = screen.getByText('Home').closest('button');
    expect(homeBtn).toHaveClass('bg-primary');
    expect(homeBtn).toHaveClass('text-primary-content');
  });
});
