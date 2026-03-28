import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SpotlightSearch } from '../../components/navigation/SpotlightSearch/SpotlightSearch';
import type { SpotlightItem } from '../../components/navigation/SpotlightSearch/SpotlightSearch';

const sampleItems: SpotlightItem[] = [
  { key: 'home', label: 'Home', description: 'Go to homepage', group: 'Pages' },
  { key: 'about', label: 'About', description: 'Learn about us', group: 'Pages' },
  { key: 'settings', label: 'Settings', description: 'App settings', group: 'Actions' },
  { key: 'logout', label: 'Log out', group: 'Actions' },
];

describe('SpotlightSearch', () => {
  it('does not render when closed', () => {
    const { container } = render(
      <SpotlightSearch
        open={false}
        onClose={vi.fn()}
        items={sampleItems}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders when open', () => {
    render(
      <SpotlightSearch
        open={true}
        onClose={vi.fn()}
        items={sampleItems}
      />,
    );
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('renders all items when query is empty', () => {
    render(
      <SpotlightSearch
        open={true}
        onClose={vi.fn()}
        items={sampleItems}
      />,
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Log out')).toBeInTheDocument();
  });

  it('renders item descriptions', () => {
    render(
      <SpotlightSearch
        open={true}
        onClose={vi.fn()}
        items={sampleItems}
      />,
    );
    expect(screen.getByText('Go to homepage')).toBeInTheDocument();
  });

  it('renders group headers', () => {
    render(
      <SpotlightSearch
        open={true}
        onClose={vi.fn()}
        items={sampleItems}
      />,
    );
    expect(screen.getByText('Pages')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('filters items based on search query', () => {
    render(
      <SpotlightSearch
        open={true}
        onClose={vi.fn()}
        items={sampleItems}
      />,
    );
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'settings' } });
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
  });

  it('shows empty message when no results', () => {
    render(
      <SpotlightSearch
        open={true}
        onClose={vi.fn()}
        items={sampleItems}
        emptyMessage="Nothing found"
      />,
    );
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'zzzznotfound' } });
    expect(screen.getByText('Nothing found')).toBeInTheDocument();
  });

  it('calls onSelect when item is clicked', () => {
    const onSelect = vi.fn();
    render(
      <SpotlightSearch
        open={true}
        onClose={vi.fn()}
        items={sampleItems}
        onSelect={onSelect}
      />,
    );
    fireEvent.click(screen.getByText('Home'));
    expect(onSelect).toHaveBeenCalledWith(sampleItems[0]);
  });

  it('calls onClose when item is selected', () => {
    const onClose = vi.fn();
    render(
      <SpotlightSearch
        open={true}
        onClose={onClose}
        items={sampleItems}
        onSelect={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByText('Home'));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    render(
      <SpotlightSearch
        open={true}
        onClose={onClose}
        items={sampleItems}
      />,
    );
    fireEvent.click(screen.getByTestId('backdrop'));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose on Escape key', () => {
    const onClose = vi.fn();
    render(
      <SpotlightSearch
        open={true}
        onClose={onClose}
        items={sampleItems}
      />,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('navigates items with ArrowDown', () => {
    render(
      <SpotlightSearch
        open={true}
        onClose={vi.fn()}
        items={sampleItems}
      />,
    );
    const input = screen.getByRole('searchbox');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('navigates items with ArrowUp', () => {
    render(
      <SpotlightSearch
        open={true}
        onClose={vi.fn()}
        items={sampleItems}
      />,
    );
    const input = screen.getByRole('searchbox');
    // ArrowUp from -1 should wrap to last
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    const options = screen.getAllByRole('option');
    expect(options[options.length - 1]).toHaveAttribute('aria-selected', 'true');
  });

  it('selects item on Enter', () => {
    const onSelect = vi.fn();
    render(
      <SpotlightSearch
        open={true}
        onClose={vi.fn()}
        items={sampleItems}
        onSelect={onSelect}
      />,
    );
    const input = screen.getByRole('searchbox');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith(sampleItems[0]);
  });

  it('renders custom placeholder', () => {
    render(
      <SpotlightSearch
        open={true}
        onClose={vi.fn()}
        items={sampleItems}
        placeholder="Type a command..."
      />,
    );
    expect(screen.getByPlaceholderText('Type a command...')).toBeInTheDocument();
  });

  it('uses custom filterFn', () => {
    const filterFn = vi.fn().mockReturnValue(true);
    render(
      <SpotlightSearch
        open={true}
        onClose={vi.fn()}
        items={sampleItems}
        filterFn={filterFn}
      />,
    );
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(filterFn).toHaveBeenCalled();
  });

  it('limits results with maxResults', () => {
    const manyItems: SpotlightItem[] = Array.from({ length: 30 }, (_, i) => ({
      key: `item-${i}`,
      label: `Item ${i}`,
    }));
    render(
      <SpotlightSearch
        open={true}
        onClose={vi.fn()}
        items={manyItems}
        maxResults={5}
      />,
    );
    const options = screen.getAllByRole('option');
    expect(options.length).toBe(5);
  });

  it('supports renderLink for router integration', () => {
    const items: SpotlightItem[] = [
      {
        key: 'custom',
        label: 'Custom',
        renderLink: ({ className, children, onClick }) => (
          <a href="/custom" className={className} data-testid="custom-link" onClick={onClick}>
            {children}
          </a>
        ),
      },
    ];
    render(
      <SpotlightSearch
        open={true}
        onClose={vi.fn()}
        items={items}
      />,
    );
    expect(screen.getByTestId('custom-link')).toBeInTheDocument();
  });

  it('filters by keywords', () => {
    const items: SpotlightItem[] = [
      { key: 'search', label: 'Search', keywords: ['find', 'lookup'] },
      { key: 'other', label: 'Other' },
    ];
    render(
      <SpotlightSearch
        open={true}
        onClose={vi.fn()}
        items={items}
      />,
    );
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'lookup' } });
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.queryByText('Other')).not.toBeInTheDocument();
  });

  it('renders Esc kbd hint', () => {
    render(
      <SpotlightSearch
        open={true}
        onClose={vi.fn()}
        items={sampleItems}
      />,
    );
    expect(screen.getByText('Esc')).toBeInTheDocument();
  });

  it('has combobox role', () => {
    render(
      <SpotlightSearch
        open={true}
        onClose={vi.fn()}
        items={sampleItems}
      />,
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('has listbox role on results', () => {
    render(
      <SpotlightSearch
        open={true}
        onClose={vi.fn()}
        items={sampleItems}
      />,
    );
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });
});
