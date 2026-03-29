import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Carousel } from '../../components/data/Carousel/Carousel';
import type { CarouselSlide } from '../../components/data/Carousel/Carousel';

const slides: CarouselSlide[] = [
  { image: 'img1.jpg', alt: 'Slide 1', title: 'First Slide' },
  { image: 'img2.jpg', alt: 'Slide 2', title: 'Second Slide' },
  { image: 'img3.jpg', alt: 'Slide 3', title: 'Third Slide' },
];

describe('Carousel', () => {
  it('renders the first slide', () => {
    render(<Carousel slides={slides} />);
    expect(screen.getByAltText('Slide 1')).toBeInTheDocument();
    expect(screen.getByText('First Slide')).toBeInTheDocument();
  });

  it('renders nothing with empty slides', () => {
    const { container } = render(<Carousel slides={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('navigates to next slide on arrow click', () => {
    render(<Carousel slides={slides} />);
    fireEvent.click(screen.getByLabelText('Next slide'));
    expect(screen.getByAltText('Slide 2')).toBeInTheDocument();
  });

  it('navigates to previous slide on arrow click', () => {
    render(<Carousel slides={slides} />);
    fireEvent.click(screen.getByLabelText('Next slide'));
    fireEvent.click(screen.getByLabelText('Previous slide'));
    expect(screen.getByAltText('Slide 1')).toBeInTheDocument();
  });

  it('wraps around on next from last slide', () => {
    render(<Carousel slides={slides} />);
    fireEvent.click(screen.getByLabelText('Next slide'));
    fireEvent.click(screen.getByLabelText('Next slide'));
    fireEvent.click(screen.getByLabelText('Next slide'));
    expect(screen.getByAltText('Slide 1')).toBeInTheDocument();
  });

  it('renders indicator dots', () => {
    render(<Carousel slides={slides} />);
    const indicators = screen.getAllByLabelText(/Go to slide/);
    expect(indicators).toHaveLength(3);
  });

  it('navigates via indicator click', () => {
    render(<Carousel slides={slides} />);
    fireEvent.click(screen.getByLabelText('Go to slide 3'));
    expect(screen.getByAltText('Slide 3')).toBeInTheDocument();
  });

  it('hides arrows when showArrows is false', () => {
    render(<Carousel slides={slides} showArrows={false} />);
    expect(screen.queryByLabelText('Next slide')).not.toBeInTheDocument();
  });

  it('hides indicators when showIndicators is false', () => {
    render(<Carousel slides={slides} showIndicators={false} />);
    expect(screen.queryByLabelText(/Go to slide/)).not.toBeInTheDocument();
  });

  it('supports keyboard navigation', () => {
    render(<Carousel slides={slides} />);
    const carousel = screen.getByRole('region');
    fireEvent.keyDown(carousel, { key: 'ArrowRight' });
    expect(screen.getByAltText('Slide 2')).toBeInTheDocument();
    fireEvent.keyDown(carousel, { key: 'ArrowLeft' });
    expect(screen.getByAltText('Slide 1')).toBeInTheDocument();
  });

  it('renders custom content via renderSlide', () => {
    render(
      <Carousel
        slides={slides}
        renderSlide={(slide) => <div data-testid="custom">{String(slide.title)}</div>}
      />,
    );
    expect(screen.getByTestId('custom')).toBeInTheDocument();
  });

  it('has proper aria attributes', () => {
    render(<Carousel slides={slides} />);
    const region = screen.getByRole('region');
    expect(region).toHaveAttribute('aria-label', 'Carousel');
    expect(region).toHaveAttribute('aria-roledescription', 'carousel');
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Carousel ref={ref} slides={slides} />);
    expect(ref).toHaveBeenCalled();
  });
});
