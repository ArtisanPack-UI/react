import { createRef, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
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

  it('keeps a caller aria-label ahead of the title and the generic name', () => {
    const { rerender } = render(
      <Carousel slides={SLIDES} title="Featured" aria-label="Homes for sale" />,
    );
    expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'Homes for sale');
    rerender(<Carousel slides={SLIDES} title="Featured" label="Picked" aria-label="Homes" />);
    expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'Picked');
  });

  it('puts the autoplay button first in the Tab order, before the slides and buttons', () => {
    const { container } = render(<Carousel slides={SLIDES} autoplay title="Featured" />);
    const root = container.querySelector('.apui-carousel')!;
    expect(root.firstElementChild!.getAttribute('data-part')).toBe('autoplay-trigger');
    const focusable = [...root.querySelectorAll('button, [tabindex="0"]')];
    expect(focusable[0]!.getAttribute('data-part')).toBe('autoplay-trigger');
  });

  it('keys slides by a unique id, so reordered renderSlide state stays with its slide', () => {
    const slides = [
      { id: 'a', title: 'A' },
      { id: 'b', title: 'B' },
    ];
    function Host() {
      const [list, setList] = useState(slides);
      return (
        <>
          <button type="button" onClick={() => setList((current) => [current[1]!, current[0]!])}>
            Reorder
          </button>
          <Carousel
            slides={list}
            renderSlide={(slide) => <input aria-label={slide.title} defaultValue="" />}
          />
        </>
      );
    }
    const { container } = render(<Host />);
    const inputs = () => [...container.querySelectorAll('input')];
    fireEvent.change(inputs()[0]!, { target: { value: 'typed in A' } });
    fireEvent.click(screen.getByRole('button', { name: 'Reorder' }));
    expect(inputs()[1]!).toHaveAttribute('aria-label', 'A');
    expect(inputs()[1]!.value).toBe('typed in A');
    expect(inputs()[0]!.value).toBe('');
  });

  it('falls back to position keys without unique ids', () => {
    const { container, rerender } = render(
      <Carousel
        slides={[{ id: 'x' }, { id: 'x' }]}
        renderSlide={() => <input aria-label="n" defaultValue="" />}
      />,
    );
    fireEvent.change(container.querySelector('input')!, { target: { value: 'first' } });
    rerender(
      <Carousel
        slides={[{ id: 'x', title: 'B' }, { id: 'x' }]}
        renderSlide={() => <input aria-label="n" defaultValue="" />}
      />,
    );
    expect(container.querySelector('input')!.value).toBe('first');
  });

  /**
   * jsdom has no layout, so the machine would measure one position. Lay the
   * track out as 100px slides in a 100px view, enough for its snap points.
   */
  describe('navigation', () => {
    const restore: (() => void)[] = [];
    const partOf = (el: Element) =>
      el.getAttribute('data-scope') === 'carousel' ? el.getAttribute('data-part') : null;
    beforeAll(() => {
      const rect = Element.prototype.getBoundingClientRect;
      Element.prototype.getBoundingClientRect = function getBoundingClientRect(this: Element) {
        const name = partOf(this);
        if (name !== 'item' && name !== 'item-group') return rect.call(this);
        const left = name === 'item' ? Number(this.getAttribute('data-index')) * 100 : 0;
        return DOMRect.fromRect({ x: left, y: 0, width: 100, height: 80 });
      };
      restore.push(() => (Element.prototype.getBoundingClientRect = rect));
      const size = (name: 'offsetWidth' | 'scrollWidth', value: (el: HTMLElement) => number) => {
        const own = Object.getOwnPropertyDescriptor(HTMLElement.prototype, name);
        Object.defineProperty(HTMLElement.prototype, name, {
          configurable: true,
          get(this: HTMLElement) {
            return partOf(this) === 'item-group' ? value(this) : (own?.get?.call(this) ?? 0);
          },
        });
        restore.push(() =>
          own
            ? Object.defineProperty(HTMLElement.prototype, name, own)
            : delete (HTMLElement.prototype as unknown as Record<string, unknown>)[name],
        );
      };
      size('offsetWidth', () => 100);
      size('scrollWidth', (el) => el.children.length * 100);
    });
    afterAll(() => restore.splice(0).forEach((undo) => undo()));

    /** The machine measures a frame after mount. */
    const measured = () =>
      act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 20));
      });
    const click = (element: Element) =>
      act(async () => {
        fireEvent.click(element);
      });
    const current = (root: ParentNode) =>
      parts(root, 'indicator').findIndex((dot) => dot.getAttribute('aria-current') === 'true');

    it('moves with next, previous and the dots, calling onIndexChange', async () => {
      const onIndexChange = vi.fn();
      const { container } = render(<Carousel slides={SLIDES} onIndexChange={onIndexChange} />);
      await measured();
      const next = screen.getByRole('button', { name: 'Next slide' });
      const previous = screen.getByRole('button', { name: 'Previous slide' });
      expect(current(container)).toBe(0);
      await click(next);
      expect(current(container)).toBe(1);
      await click(parts(container, 'indicator')[3]!);
      expect(current(container)).toBe(3);
      expect(next).toBeDisabled();
      await click(previous);
      expect(current(container)).toBe(2);
      expect(onIndexChange.mock.calls).toEqual([[1], [3], [2]]);
    });

    it('wraps at the ends with loop', async () => {
      const onIndexChange = vi.fn();
      const { container } = render(<Carousel slides={SLIDES} loop onIndexChange={onIndexChange} />);
      await measured();
      await click(screen.getByRole('button', { name: 'Previous slide' }));
      expect(current(container)).toBe(3);
      expect(onIndexChange.mock.calls).toEqual([[3]]);
    });

    it('shows only what a controlled index says, and reports the move it asks for', async () => {
      const onIndexChange = vi.fn();
      const { container, rerender } = render(
        <Carousel slides={SLIDES} index={1} onIndexChange={onIndexChange} />,
      );
      await measured();
      expect(current(container)).toBe(1);
      await click(screen.getByRole('button', { name: 'Next slide' }));
      expect(onIndexChange.mock.calls).toEqual([[2]]);
      // The parent didn't take it, so the carousel stays where index says.
      expect(current(container)).toBe(1);
      rerender(<Carousel slides={SLIDES} index={3} onIndexChange={onIndexChange} />);
      expect(current(container)).toBe(3);
    });
  });
});
