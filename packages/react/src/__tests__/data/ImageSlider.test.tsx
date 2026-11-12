import { createRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { render, screen } from '@testing-library/react';
import { beforeAll, describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import {
  ImageSlider,
  type ImageSliderImage,
  type ImageSliderProps,
} from '../../components/data/ImageSlider/ImageSlider';

const declaredProps: (keyof ImageSliderProps)[] = [
  'images',
  'aspectRatio',
  'index',
  'defaultIndex',
  'loop',
  'autoplay',
  'interval',
  'thumbnails',
  'label',
  'previousLabel',
  'nextLabel',
  'indicatorLabel',
  'slideLabel',
  'counterLabel',
  'playLabel',
  'pauseLabel',
  'classes',
];

const IMAGES: ImageSliderImage[] = [
  { src: '/a.jpg', alt: 'Lobby', caption: 'The lobby', description: 'Ground floor' },
  { src: '/b.jpg', alt: 'Roof', caption: 'The roof terrace' },
  { src: '/c.jpg', alt: 'Street' },
];

const part = (root: ParentNode, name: string) =>
  root.querySelector(`[data-scope="image-slider"][data-part="${name}"]`) as HTMLElement | null;
const parts = (root: ParentNode, name: string) => [
  ...root.querySelectorAll(`[data-scope="image-slider"][data-part="${name}"]`),
];
const current = (name: string) =>
  parts(document, name).map((el) => el.getAttribute('aria-current'));
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

describe('ImageSlider', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(ImageSlider, 'ImageSlider', {
      declared: { props: declaredProps, events: ['onIndexChange'] },
      // playLabel and pauseLabel only render with autoplay, which the parity render leaves off.
      ignoreEffects: ['defaultIndex', 'loop', 'interval', 'playLabel', 'pauseLabel'],
    });
  });

  it('renders every part on the server', () => {
    const host = document.createElement('div');
    host.innerHTML = renderToStaticMarkup(<ImageSlider images={IMAGES} autoplay thumbnails />);
    for (const name of [
      'root',
      'viewport',
      'item-group',
      'item',
      'image',
      'caption',
      'title',
      'description',
      'progress-text',
      'prev-trigger',
      'next-trigger',
      'indicator-group',
      'indicator',
      'autoplay-trigger',
      'thumbs',
      'thumb',
    ]) {
      expect(part(host, name), name).not.toBeNull();
    }
  });

  it('renders the carousel region, slides, alt text and captions', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <ImageSlider ref={ref} images={IMAGES} label="Tour" aspectRatio="16 / 9" />,
    );
    const root = container.querySelector('.apui-image-slider') as HTMLElement;
    expect(ref.current).toBe(root);
    expect(root).toHaveAttribute('role', 'region');
    expect(root).toHaveAttribute('aria-roledescription', 'carousel');
    expect(root).toHaveAttribute('aria-label', 'Tour');
    expect(root.style.getPropertyValue('--apui-_image-slider-ratio')).toBe('16 / 9');
    const items = parts(root, 'item');
    expect(items).toHaveLength(3);
    expect(items[1]).toHaveAttribute('aria-roledescription', 'slide');
    expect(items[1]).toHaveAttribute('aria-label', '2 of 3');
    expect(part(items[0]!, 'image')).toHaveAttribute('alt', 'Lobby');
    expect(part(items[0]!, 'image')).not.toHaveAttribute('loading');
    expect(part(items[1]!, 'image')).toHaveAttribute('loading', 'lazy');
    expect(part(items[0]!, 'title')).toHaveTextContent('The lobby');
    expect(part(items[0]!, 'description')).toHaveTextContent('Ground floor');
    expect(part(items[2]!, 'caption')).toBeNull();
    expect(part(root, 'progress-text')).toHaveTextContent('1 / 3');
    expect(current('indicator')).toEqual(['true', null, null]);
    expect(part(root, 'thumbs')).toBeNull();
    expect(part(root, 'autoplay-trigger')).toBeNull();
  });

  // Moving between slides needs layout (the machine snaps to measured slide
  // positions), which jsdom lacks: the behavior package's Chromium tests drive
  // the same useCarousel hook through clicks, dots, thumbs and RTL arrow keys.
  it('wires the buttons, dots and thumbs to the track', () => {
    render(<ImageSlider images={IMAGES} thumbnails />);
    const track = part(document, 'item-group')!;
    const previous = screen.getByRole('button', { name: 'Previous photo' });
    const next = screen.getByRole('button', { name: 'Next photo' });
    expect(previous).toHaveClass('apui-button');
    expect(previous).toHaveAttribute('data-variant', 'soft');
    expect(previous).toHaveAttribute('data-part', 'prev-trigger');
    expect(previous).toHaveAttribute('aria-controls', track.id);
    expect(next).toHaveAttribute('data-part', 'next-trigger');
    expect(previous.querySelector('[data-mirror]')).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Photo 3' })).toHaveAttribute(
      'data-part',
      'indicator',
    );
    const thumbs = parts(document, 'thumb');
    expect(thumbs).toHaveLength(3);
    expect(thumbs[1]).toHaveAccessibleName('Roof');
    expect(current('thumb')).toEqual(['true', null, null]);
  });

  it('follows a controlled index', () => {
    const { rerender } = render(<ImageSlider images={IMAGES} index={2} />);
    expect(current('indicator')).toEqual([null, null, 'true']);
    rerender(<ImageSlider images={IMAGES} index={0} />);
    expect(current('indicator')).toEqual(['true', null, null]);
  });

  it('starts an uncontrolled slider at defaultIndex', () => {
    render(<ImageSlider images={IMAGES} defaultIndex={1} />);
    expect(current('indicator')).toEqual([null, 'true', null]);
    expect(part(document, 'progress-text')).toHaveTextContent('2 / 3');
  });

  it('takes its built-in labels as props, and shows a pause button with autoplay', () => {
    render(
      <ImageSlider
        images={IMAGES}
        autoplay
        previousLabel="Anterior"
        nextLabel="Siguiente"
        indicatorLabel="Foto {index}"
        slideLabel="{index} de {count}"
        counterLabel="{index} de {count}"
        playLabel="Reproducir"
        pauseLabel="Pausar"
      />,
    );
    expect(screen.getByRole('button', { name: 'Anterior' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Foto 2' })).toBeInTheDocument();
    expect(parts(document, 'item')[0]).toHaveAttribute('aria-label', '1 de 3');
    expect(part(document, 'progress-text')).toHaveTextContent('1 de 3');
    const autoplay = part(document, 'autoplay-trigger')!;
    expect(['Reproducir', 'Pausar']).toContain(autoplay.getAttribute('aria-label'));
    expect(autoplay.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});
