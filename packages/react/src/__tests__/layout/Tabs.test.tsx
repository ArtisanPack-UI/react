import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Tabs } from '../../components/layout/Tabs/Tabs';
import type { TabItem } from '../../components/layout/Tabs/Tabs';

const sampleTabs: TabItem[] = [
  { name: 'tab1', label: 'Tab 1', content: <div>Content 1</div> },
  { name: 'tab2', label: 'Tab 2', content: <div>Content 2</div> },
  { name: 'tab3', label: 'Tab 3', content: <div>Content 3</div> },
];

describe('Tabs', () => {
  it('renders all tab labels', () => {
    render(<Tabs tabs={sampleTabs} />);
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
  });

  it('renders first tab content by default', () => {
    render(<Tabs tabs={sampleTabs} />);
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('renders defaultTab content', () => {
    render(<Tabs tabs={sampleTabs} defaultTab="tab2" />);
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('switches tab on click', () => {
    render(<Tabs tabs={sampleTabs} />);
    fireEvent.click(screen.getByText('Tab 2'));
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('calls onChange callback', () => {
    const onChange = vi.fn();
    render(<Tabs tabs={sampleTabs} onChange={onChange} />);
    fireEvent.click(screen.getByText('Tab 2'));
    expect(onChange).toHaveBeenCalledWith('tab2');
  });

  it('marks active tab with tab-active class', () => {
    render(<Tabs tabs={sampleTabs} />);
    expect(screen.getByText('Tab 1').closest('button')).toHaveClass('tab-active');
    expect(screen.getByText('Tab 2').closest('button')).not.toHaveClass('tab-active');
  });

  it('sets correct ARIA attributes', () => {
    render(<Tabs tabs={sampleTabs} />);
    const tab1 = screen.getByText('Tab 1').closest('button');
    expect(tab1).toHaveAttribute('role', 'tab');
    expect(tab1).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toBeInTheDocument();
  });

  it('disables tab when disabled prop is set', () => {
    const tabs: TabItem[] = [
      ...sampleTabs.slice(0, 2),
      { name: 'tab3', label: 'Tab 3', content: <div>Content 3</div>, disabled: true },
    ];
    render(<Tabs tabs={tabs} />);
    expect(screen.getByText('Tab 3').closest('button')).toBeDisabled();
  });

  it('navigates with arrow keys (horizontal)', () => {
    const onChange = vi.fn();
    render(<Tabs tabs={sampleTabs} onChange={onChange} />);
    const tabList = screen.getByRole('tablist');
    fireEvent.keyDown(tabList, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith('tab2');
  });

  it('navigates with arrow keys (vertical)', () => {
    const onChange = vi.fn();
    render(<Tabs tabs={sampleTabs} onChange={onChange} vertical />);
    const tabList = screen.getByRole('tablist');
    fireEvent.keyDown(tabList, { key: 'ArrowDown' });
    expect(onChange).toHaveBeenCalledWith('tab2');
  });

  it('applies variant class', () => {
    render(<Tabs tabs={sampleTabs} variant="lifted" />);
    expect(screen.getByRole('tablist')).toHaveClass('tabs-lifted');
  });

  it('applies size class', () => {
    render(<Tabs tabs={sampleTabs} size="lg" />);
    expect(screen.getByRole('tablist')).toHaveClass('tabs-lg');
  });

  it('applies color class to active tab', () => {
    render(<Tabs tabs={sampleTabs} color="primary" />);
    const activeTab = screen.getByText('Tab 1').closest('button');
    expect(activeTab).toHaveClass('tab-primary');
  });

  it('does not apply color class to inactive tab', () => {
    render(<Tabs tabs={sampleTabs} color="primary" />);
    const inactiveTab = screen.getByText('Tab 2').closest('button');
    expect(inactiveTab).not.toHaveClass('tab-primary');
  });

  it('renders vertical layout', () => {
    const { container } = render(<Tabs tabs={sampleTabs} vertical />);
    expect(container.firstChild).toHaveClass('flex');
    expect(screen.getByRole('tablist')).toHaveClass('tabs-vertical');
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('renders vertical-right layout with content before tabs', () => {
    const { container } = render(<Tabs tabs={sampleTabs} verticalRight />);
    expect(container.firstChild).toHaveClass('flex');
    // tabpanel should come before tablist in DOM
    const children = Array.from((container.firstChild as HTMLElement).children);
    expect(children[0]).toHaveAttribute('role', 'tabpanel');
    expect(children[1]).toHaveAttribute('role', 'tablist');
  });

  it('applies custom tabListClassName', () => {
    render(<Tabs tabs={sampleTabs} tabListClassName="custom-tablist" />);
    expect(screen.getByRole('tablist')).toHaveClass('custom-tablist');
  });

  it('applies custom panelClassName', () => {
    render(<Tabs tabs={sampleTabs} panelClassName="custom-panel" />);
    expect(screen.getByRole('tabpanel')).toHaveClass('custom-panel');
  });

  it('applies custom activeTabClassName', () => {
    render(<Tabs tabs={sampleTabs} activeTabClassName="custom-active" />);
    const activeTab = screen.getByText('Tab 1').closest('button');
    expect(activeTab).toHaveClass('custom-active');
  });

  it('renders tab icons', () => {
    const tabs: TabItem[] = [
      { name: 'tab1', label: 'Tab 1', content: <div>Content</div>, icon: <span data-testid="icon">★</span> },
    ];
    render(<Tabs tabs={tabs} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Tabs ref={ref} tabs={sampleTabs} />);
    expect(ref).toHaveBeenCalled();
  });
});
