import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Pagination } from '../../components/navigation/Pagination/Pagination';

describe('Pagination', () => {
  it('renders page buttons', () => {
    render(<Pagination currentPage={1} totalPages={5} />);
    expect(screen.getByLabelText('Page 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 5')).toBeInTheDocument();
  });

  it('renders previous and next buttons', () => {
    render(<Pagination currentPage={3} totalPages={5} />);
    expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
    expect(screen.getByLabelText('Next page')).toBeInTheDocument();
  });

  it('marks current page with btn-active', () => {
    render(<Pagination currentPage={3} totalPages={5} />);
    expect(screen.getByLabelText('Page 3')).toHaveClass('btn-active');
  });

  it('marks current page with aria-current', () => {
    render(<Pagination currentPage={3} totalPages={5} />);
    expect(screen.getByLabelText('Page 3')).toHaveAttribute('aria-current', 'page');
  });

  it('calls onChange when page is clicked', () => {
    const onChange = vi.fn();
    render(<Pagination currentPage={3} totalPages={5} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('Page 4'));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('calls onChange with prev page', () => {
    const onChange = vi.fn();
    render(<Pagination currentPage={3} totalPages={5} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('Previous page'));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('calls onChange with next page', () => {
    const onChange = vi.fn();
    render(<Pagination currentPage={3} totalPages={5} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('Next page'));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('disables previous button on first page', () => {
    render(<Pagination currentPage={1} totalPages={5} />);
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<Pagination currentPage={5} totalPages={5} />);
    expect(screen.getByLabelText('Next page')).toBeDisabled();
  });

  it('does not call onChange for current page', () => {
    const onChange = vi.fn();
    render(<Pagination currentPage={3} totalPages={5} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('Page 3'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('shows ellipsis for large page ranges', () => {
    render(<Pagination currentPage={5} totalPages={10} siblings={1} />);
    const ellipsisButtons = screen.getAllByText('…');
    expect(ellipsisButtons.length).toBeGreaterThan(0);
  });

  it('applies size classes', () => {
    render(<Pagination currentPage={1} totalPages={3} size="lg" />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      expect(btn).toHaveClass('btn-lg');
    });
  });

  it('disables all buttons when disabled', () => {
    render(<Pagination currentPage={2} totalPages={3} disabled />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });

  it('renders custom previous/next labels', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={3}
        previousLabel="Prev"
        nextLabel="Next"
      />,
    );
    expect(screen.getByText('Prev')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('renders single page', () => {
    render(<Pagination currentPage={1} totalPages={1} />);
    expect(screen.getByLabelText('Page 1')).toHaveClass('btn-active');
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
    expect(screen.getByLabelText('Next page')).toBeDisabled();
  });

  it('has aria-label on the nav', () => {
    render(<Pagination currentPage={1} totalPages={3} />);
    expect(screen.getByLabelText('Pagination')).toBeInTheDocument();
  });

  it('renders nothing when totalPages is 0', () => {
    render(<Pagination currentPage={1} totalPages={0} />);
    expect(screen.queryByLabelText('Page 1')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
    expect(screen.getByLabelText('Next page')).toBeDisabled();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Pagination ref={ref} currentPage={1} totalPages={3} />);
    expect(ref).toHaveBeenCalled();
  });
});
