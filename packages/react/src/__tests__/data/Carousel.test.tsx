import { createRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import {
  Carousel,
  type CarouselProps,
  type CarouselSlide,
} from '../../components/data/Carousel/Carousel';

const declaredProps: (keyof CarouselProps)[] = [
  'slides',
  'perView',
  'index',
  'defaultIndex',
  'loop',
  'autoplay',
  'interval',
  'title',
  'headingLevel',
  'label',
  'previousLabel',
  'nextLabel',
  'indicatorLabel',
  'slideLabel',
  'playLabel',
  'pauseLabel',
  'classes',
];

const SLIDES: CarouselSlide[] = [1, 2, 3, 4].map((i) => ({
  image: `/photos/${i}.jpg`,
  alt: `Photo ${i}`,
  title: `Property ${i}`,
  description: `City ${i}`,
}));

const part = (root: ParentNode, name: string) =>
  root.querySelector(`[data-scope="carousel"][data-part="${name}"]`) as HTMLElement | null;
const parts = (root: ParentNode, name: string) => [
  ...root.querySelectorAll(`[data-scope="carousel"][data-part="${name}"]`),
];

// jsdom has no layout: give the carousel machine the observer and scrolling it calls.
beforeAll(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    },
  );
  Element.prototype.scrollTo = function scrollTo() {};
});

describe('Carousel', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Carousel, 'Carousel', {
      declared: { props: declaredProps, events: ['onIndexChange'] },
      // playLabel and pauseLabel only render with autoplay, which the parity render leaves off.
      ignoreEffects: ['defaultIndex', 'loop', 'interval', 'playLabel', 'pauseLabel'],
    });
  });

  it('renders every part on the server', () => {
    const host = document.createElement('div');
    host.innerHTML = renderToStaticMarkup(
      <Carousel slides={SLIDES} perView={3} title="Featured" autoplay />,
    );
    for (const name of [
      'root',
      'header',
      'title',
      'viewport',
      'item-group',
      'item',
      'prev-trigger',
      'next-trigger',
      'indicator-group',
      'indicator',
      'autoplay-trigger',
    ]) {
      expect(part(host, name), name).not.toBeNull();
    }
  });

  it('renders the carousel region with a Card per slide', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<Carousel ref={ref} slides={SLIDES} />);
    const root = container.querySelector('.apui-carousel') as HTMLElement;
    expect(ref.current).toBe(root);
    expect(root).toHaveAttribute('role', 'region');
    expect(root).toHaveAttribute('aria-roledescription', 'carousel');
    expect(root).toHaveAttribute('aria-label', 'Carousel');
    expect(root.style.getPropertyValue('--slides-per-page')).toBe('1');
    expect(root.style.getPropertyValue('--slide-spacing')).toBe('12px');
    const items = parts(root, 'item');
    expect(items).toHaveLength(4);
    expect(items[1]).toHaveAttribute('aria-roledescription', 'slide');
    expect(items[1]).toHaveAttribute('aria-label', '2 of 4');
    expect(items[0]!.querySelector('.apui-card img')).toHaveAttribute('alt', 'Photo 1');
    expect(items[1]).toHaveTextContent('Property 2');
    expect(part(root, 'item-group')).toHaveAttribute('tabindex', '0');
    expect(parts(root, 'indicator')).toHaveLength(4);
    expect(part(root, 'autoplay-trigger')).toBeNull();
  });

  it('peeks with perView above one and has one dot per start position', () => {
    const { container } = render(<Carousel slides={SLIDES} perView={3} />);
    const root = container.querySelector('.apui-carousel') as HTMLElement;
    expect(root.style.getPropertyValue('--slides-per-page')).toBe('3.15');
    expect(parts(root, 'indicator')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Go to slide 2' })).toHaveAttribute(
      'data-part',
      'indicator',
    );
    const { container: single } = render(<Carousel slides={SLIDES.slice(0, 2)} perView={3} />);
    expect(part(single, 'indicator-group')).toBeNull();
  });

  it('server-renders the dots and triggers the mounted carousel measures to', () => {
    // Five slides, three per view: three positions, the last at the end of the track.
    const five = [...SLIDES, { ...SLIDES[0]!, alt: 'Photo 5' }];
    const host = document.createElement('div');
    host.innerHTML = renderToStaticMarkup(<Carousel slides={five} perView={3} defaultIndex={2} />);
    const dots = parts(host, 'indicator');
    expect(dots).toHaveLength(3);
    expect(dots.map((dot) => dot.getAttribute('aria-current'))).toEqual([null, null, 'true']);
    expect(part(host, 'next-trigger')).toBeDisabled();
    expect(part(host, 'prev-trigger')).not.toBeDisabled();
  });

  it('puts a title and outline buttons in the header', () => {
    render(<Carousel slides={SLIDES} title="Featured properties" headingLevel={2} />);
    const region = screen.getByRole('region', { name: 'Featured properties' });
    const header = part(region, 'header')!;
    expect(header.querySelector('h2[data-part="title"]')).toHaveTextContent('Featured properties');
    const previous = screen.getByRole('button', { name: 'Previous slide' });
    expect(header).toContainElement(previous);
    expect(previous).toHaveAttribute('data-variant', 'outline');
    expect(previous).toBeDisabled();
  });

  it('overlays soft buttons on the viewport without a title', () => {
    render(<Carousel slides={SLIDES} label="Notes" loop />);
    const viewport = part(document, 'viewport')!;
    const next = screen.getByRole('button', { name: 'Next slide' });
    expect(viewport).toContainElement(next);
    expect(next).toHaveAttribute('data-variant', 'soft');
    expect(next).toHaveAttribute('aria-controls', part(document, 'item-group')!.id);
    expect(next.querySelector('[data-mirror]')).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Previous slide' })).not.toBeDisabled();
  });

  it('renders custom slides and 2.x content', () => {
    render(
      <Carousel
        slides={[{ text: 'One' }, { text: 'Two' }]}
        renderSlide={(slide, i) => <q data-i={i}>{slide.text}</q>}
      />,
    );
    expect(document.querySelectorAll('[data-part="item"] > q')).toHaveLength(2);
    expect(document.querySelector('q[data-i="1"]')).toHaveTextContent('Two');
    const { container } = render(<Carousel slides={[{ content: <em>Old</em> }]} />);
    expect(container.querySelector('[data-part="item"] > em')).toHaveTextContent('Old');
  });

  it('shows a pause button with autoplay and the dot shown is current', () => {
    render(<Carousel slides={SLIDES} autoplay defaultIndex={2} />);
    expect(screen.getByRole('button', { name: 'Stop slide rotation' })).toHaveAttribute(
      'data-part',
      'autoplay-trigger',
    );
    expect(part(document, 'item-group')).toHaveAttribute('aria-live', 'off');
    expect(parts(document, 'indicator').map((el) => el.getAttribute('aria-current'))).toEqual([
      null,
      null,
      'true',
      null,
    ]);
  });

  it('starts autoplay paused under reduced motion', async () => {
    const matchMedia = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: query.includes('reduce'),
      media: query,
      addEventListener() {},
      removeEventListener() {},
    })) as unknown as typeof window.matchMedia;
    try {
      render(<Carousel slides={SLIDES} autoplay />);
      await waitFor(() =>
        expect(screen.getByRole('button', { name: 'Start slide rotation' })).toBeInTheDocument(),
      );
    } finally {
      window.matchMedia = matchMedia;
    }
  });
});
